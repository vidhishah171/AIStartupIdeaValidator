import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { z } from "zod";
// import OpenAI from "openai";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { VALIDATION_SYSTEM_PROMPT } from "@/lib/prompts";
import type { ValidationReport } from "@/lib/types";

const inputSchema = z.object({
  ideaText: z.string().trim().min(50).max(1000),
});

const reportSchema = z.object({
  ideaSummary: z.string(),
  valueProposition: z.string(),
  marketDemandScore: z.number(),
  marketDemandJustification: z.string(),
  competitors: z.array(z.object({ name: z.string(), description: z.string() })),
  targetAudience: z.object({
    role: z.string(),
    ageRange: z.string(),
    painPoint: z.string(),
    buyingPower: z.string(),
  }),
  monetizationSuggestions: z.array(
    z.object({
      model: z.string(),
      fit: z.string(),
      reason: z.string(),
    }),
  ),
  differentiation: z.string(),
  goToMarketPlan: z.array(z.string()),
  risks: z.array(z.string()),
  nextSteps: z.array(z.string()),
  strengths: z.array(z.string()),
  weaknesses: z.array(z.string()),
  pivotRecommendations: z.array(z.string()),
  mvpFeatures: z.array(
    z.object({
      name: z.string(),
      priority: z.enum(["High", "Medium", "Low"]),
      explanation: z.string(),
    }),
  ),
  mvpScopeTiers: z.object({
    core: z.array(z.string()),
    optional: z.array(z.string()),
    future: z.array(z.string()),
  }),
});

const USAGE_LIMIT = 3;
const GUEST_USAGE_LIMIT = 1;
const GUEST_COUNT_COOKIE = "guest_validation_count";
const GUEST_RESET_COOKIE = "guest_validation_reset";

function getNextResetDate(from: Date) {
  return new Date(from.getFullYear(), from.getMonth() + 1, 1);
}

export async function POST(request: Request) {
  try {
    const payload = inputSchema.safeParse(await request.json());
    if (!payload.success) {
      return NextResponse.json(
        { error: "Idea must be between 50 and 1000 characters." },
        { status: 400 },
      );
    }

    const supabase = await createSupabaseServerClient();
    const { data: userData } = await supabase.auth.getUser();
    const now = new Date();
    const nextReset = getNextResetDate(now);

    if (!userData.user) {
      const cookieStore = await cookies();
      const guestCount = Number(
        cookieStore.get(GUEST_COUNT_COOKIE)?.value ?? 0,
      );
      const guestResetRaw = cookieStore.get(GUEST_RESET_COOKIE)?.value;
      let guestResetAt = guestResetRaw ? new Date(guestResetRaw) : nextReset;
      let adjustedGuestCount = guestCount;

      if (guestResetAt < now) {
        adjustedGuestCount = 0;
        guestResetAt = nextReset;
      }

      if (adjustedGuestCount >= GUEST_USAGE_LIMIT) {
        return NextResponse.json(
          { error: "Guest limit reached. Please log in to continue." },
          { status: 401 },
        );
      }

      if (!process.env.GEMINI_API_KEY) {
        return NextResponse.json(
          { error: "Gemini API key not configured." },
          { status: 500 },
        );
      }

      // Gemini API call
      const geminiUrl = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;
      const geminiBody = {
        contents: [
          {
            parts: [
              { text: `${VALIDATION_SYSTEM_PROMPT}\n${payload.data.ideaText}` },
            ],
          },
        ],
      };

      const geminiRes = await fetch(geminiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(geminiBody),
      });
      if (!geminiRes.ok) {
        const err = await geminiRes.text();
        return NextResponse.json(
          { error: `Gemini API error: ${err}` },
          { status: 502 },
        );
      }
      const geminiData = await geminiRes.json();
      let message =
        geminiData?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ?? "{}";
      // Remove markdown code block if present
      if (message.startsWith("```json")) {
        message = message
          .replace(/^```json/, "")
          .replace(/```$/, "")
          .trim();
      } else if (message.startsWith("```")) {
        message = message.replace(/^```/, "").replace(/```$/, "").trim();
      }
      console.log("Gemini raw response for idea:", payload.data.ideaText);
      console.log(message);

      const parsed = reportSchema.safeParse(JSON.parse(message));

      if (!parsed.success) {
        return NextResponse.json(
          { error: "AI response was not in the expected format." },
          { status: 502 },
        );
      }

      const report: ValidationReport = parsed.data;

      const response = NextResponse.json({
        report,
        validationId: null,
        guest: true,
      });

      response.cookies.set(GUEST_COUNT_COOKIE, String(adjustedGuestCount + 1), {
        httpOnly: true,
        sameSite: "lax",
        expires: guestResetAt,
        path: "/",
      });
      response.cookies.set(GUEST_RESET_COOKIE, guestResetAt.toISOString(), {
        httpOnly: true,
        sameSite: "lax",
        expires: guestResetAt,
        path: "/",
      });

      return response;
    }

    const userId = userData.user.id;

    const { data: planRow, error: planError } = await supabase
      .from("user_plans")
      .select("plan")
      .eq("user_id", userId)
      .maybeSingle();

    if (planError && planError.code !== "PGRST116") {
      return NextResponse.json(
        { error: "Unable to check plan." },
        { status: 500 },
      );
    }

    const activePlan = planRow?.plan ?? "free";
    if (!planRow) {
      await supabase
        .from("user_plans")
        .insert({ user_id: userId, plan: "free" });
    }

    const isUnlimited = activePlan === "pro" || activePlan === "team";
    let usageRow: { count: number; reset_at: string } | null = null;
    let usageCount = 0;
    let resetAt = nextReset;

    if (!isUnlimited) {
      const { data, error: usageError } = await supabase
        .from("usage_counts")
        .select("count, reset_at")
        .eq("user_id", userId)
        .single();

      if (usageError && usageError.code !== "PGRST116") {
        return NextResponse.json(
          { error: "Unable to check usage limits." },
          { status: 500 },
        );
      }

      usageRow = data;
      usageCount = usageRow?.count ?? 0;
      resetAt = usageRow?.reset_at ? new Date(usageRow.reset_at) : nextReset;

      if (resetAt < now) {
        usageCount = 0;
        resetAt = nextReset;
      }

      if (usageCount >= USAGE_LIMIT) {
        return NextResponse.json(
          { error: "Monthly limit reached. Upgrade to continue." },
          { status: 429 },
        );
      }
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "Gemini API key not configured." },
        { status: 500 },
      );
    }

    // Gemini API call
    const geminiUrl = `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;
    const geminiBody = {
      contents: [
        {
          parts: [
            { text: `${VALIDATION_SYSTEM_PROMPT}\n${payload.data.ideaText}` },
          ],
        },
      ],
    };

    const geminiRes = await fetch(geminiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(geminiBody),
    });
    if (!geminiRes.ok) {
      const err = await geminiRes.text();
      return NextResponse.json(
        { error: `Gemini API error: ${err}` },
        { status: 502 },
      );
    }
    const geminiData = await geminiRes.json();
    let message =
      geminiData?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ?? "{}";
    // Remove markdown code block if present
    if (message.startsWith("```json")) {
      message = message
        .replace(/^```json/, "")
        .replace(/```$/, "")
        .trim();
    } else if (message.startsWith("```")) {
      message = message.replace(/^```/, "").replace(/```$/, "").trim();
    }
    console.log("Gemini raw response for idea:", payload.data.ideaText);
    console.log(message);
    const parsed = reportSchema.safeParse(JSON.parse(message));

    if (!parsed.success) {
      return NextResponse.json(
        { error: "AI response was not in the expected format." },
        { status: 502 },
      );
    }

    const report: ValidationReport = parsed.data;

    const { data: validationRow, error: insertError } = await supabase
      .from("validations")
      .insert({
        user_id: userId,
        idea_text: payload.data.ideaText,
        report,
      })
      .select("id")
      .single();

    if (insertError || !validationRow) {
      return NextResponse.json(
        { error: "Unable to save validation." },
        { status: 500 },
      );
    }

    if (!isUnlimited) {
      if (usageRow) {
        await supabase
          .from("usage_counts")
          .update({ count: usageCount + 1, reset_at: resetAt.toISOString() })
          .eq("user_id", userId);
      } else {
        await supabase.from("usage_counts").insert({
          user_id: userId,
          count: 1,
          reset_at: resetAt.toISOString(),
        });
      }
    }

    return NextResponse.json({
      report,
      validationId: validationRow.id,
    });
  } catch (error) {
    console.error("Validate API error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : String(error) },
      { status: 500 },
    );
  }
}
