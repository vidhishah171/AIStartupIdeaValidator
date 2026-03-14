import { NextResponse } from "next/server";
import { z } from "zod";
// import OpenAI from "openai";
import { createHash } from "crypto";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const ideaRequestSchema = z.object({
  industry: z.string().trim().min(2),
  targetCustomer: z.string().trim().min(2),
  problemSpace: z.string().trim().min(2),
  technology: z.string().trim().min(2),
});

const ideaSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  potentialUsers: z.string().min(3),
  tags: z.array(z.string()).optional(),
});

const systemPrompt = `You are an idea generation engine that builds concise, original startup ideas. Return only valid JSON and nothing else. Each idea should include a title, a compelling description, the persons/potential users, and a short array of tags describing the industry, target, and technology. Provide at least six distinct ideas. Wrap the list in a JSON object with the shape: {"ideas": [ ... ]}.
- Schema = {
  title: string,
  description: string,
  potentialUsers: string,
  tags: string[],
};
- Do NOT include markdown, code blocks, or any extra text, or bold text. Only output raw JSON.
- the JSON must strictly follow the schema above, with all fields present and correctly typed and with the correct data types.`;

export async function POST(request: Request) {
  try {
    const payload = ideaRequestSchema.safeParse(await request.json());
    if (!payload.success) {
      return NextResponse.json(
        {
          error:
            "All fields (industry, customer, problem, technology) are required.",
        },
        { status: 400 },
      );
    }

    const supabase = await createSupabaseServerClient();
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) {
      return NextResponse.json(
        { error: "Authentication required to generate ideas." },
        { status: 401 },
      );
    }

    const normalized = {
      industry: payload.data.industry.trim(),
      targetCustomer: payload.data.targetCustomer.trim(),
      problemSpace: payload.data.problemSpace.trim(),
      technology: payload.data.technology.trim(),
    };
    const contextHash = createHash("sha256")
      .update(
        [
          normalized.industry.toLowerCase(),
          normalized.targetCustomer.toLowerCase(),
          normalized.problemSpace.toLowerCase(),
          normalized.technology.toLowerCase(),
        ].join("|"),
      )
      .digest("hex");
    const userId = userData.user.id;

    const { data: cached } = await supabase
      .from("idea_generation_cache")
      .select("ideas")
      .eq("context_hash", contextHash)
      .eq("user_id", userId)
      .maybeSingle();

    if (cached?.ideas) {
      return NextResponse.json({ ideas: cached.ideas, fromCache: true });
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "Gemini API key is not configured." },
        { status: 500 },
      );
    }

    const prompt = `Industry: ${normalized.industry}\nTarget Audience: ${normalized.targetCustomer}\nProblem: ${normalized.problemSpace}\nTechnology: ${normalized.technology}\n`;

    // Use Gemini 1.5 Flash model endpoint
    const geminiUrl = `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;
    const geminiBody = {
      contents: [{ parts: [{ text: `${systemPrompt}\n${prompt}` }] }],
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
    // Gemini's response is in geminiData.candidates[0].content.parts[0].text
    const message =
      geminiData?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ?? "{}";
    let ideas: z.infer<typeof ideaSchema>[] = [];
    try {
      const parsedJson = JSON.parse(message);
      const objectParse = z
        .object({ ideas: z.array(ideaSchema) })
        .safeParse(parsedJson);
      if (objectParse.success) {
        ideas = objectParse.data.ideas;
      } else {
        const arrayParse = z.array(ideaSchema).safeParse(parsedJson);
        if (!arrayParse.success) {
          console.error("Idea generation parse error:", {
            issues: objectParse.error.issues,
            raw: message,
          });
          return NextResponse.json(
            { error: "AI response was not in the expected format." },
            { status: 502 },
          );
        }
        ideas = arrayParse.data;
      }
    } catch {
      console.error("Idea generation parse error: invalid JSON", {
        raw: message,
      });
      return NextResponse.json(
        { error: "Unable to parse AI response." },
        { status: 502 },
      );
    }

    const { data: sessionRow, error: sessionError } = await supabase
      .from("idea_generation_sessions")
      .insert({
        user_id: userId,
        context_hash: contextHash,
        industry: normalized.industry,
        target_customer: normalized.targetCustomer,
        problem_space: normalized.problemSpace,
        technology: normalized.technology,
      })
      .select("id")
      .single();

    if (sessionError || !sessionRow) {
      return NextResponse.json(
        { error: "Unable to persist idea session." },
        { status: 500 },
      );
    }

    const resultRows = ideas.map((idea, index) => ({
      session_id: sessionRow.id,
      idea_index: index,
      title: idea.title,
      description: idea.description,
      potential_users: idea.potentialUsers,
      tags: idea.tags ?? [],
    }));

    await supabase.from("idea_generation_results").insert(resultRows);

    await supabase.from("idea_generation_cache").upsert(
      {
        context_hash: contextHash,
        user_id: userId,
        industry: normalized.industry,
        target_customer: normalized.targetCustomer,
        problem_space: normalized.problemSpace,
        technology: normalized.technology,
        ideas,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "context_hash" },
    );

    return NextResponse.json({ ideas });
  } catch (error) {
    console.error("Idea generation error:", error);
    return NextResponse.json(
      { error: "Unexpected server error while generating ideas." },
      { status: 500 },
    );
  }
}
