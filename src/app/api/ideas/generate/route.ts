import { NextResponse } from "next/server";
import { z } from "zod";
import OpenAI from "openai";
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

const systemPrompt = `You are an idea generation engine that builds concise, original startup ideas. Return only valid JSON and nothing else. Each idea should include a title, a compelling description, the persons/potential users, and a short array of tags describing the industry, target, and technology. Provide at least six distinct ideas. Wrap the list in a JSON object with the shape: {"ideas": [ ... ]}.`;

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

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "OpenAI API key is not configured." },
        { status: 500 },
      );
    }

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const prompt = `Industry: ${normalized.industry}\nTarget Audience: ${normalized.targetCustomer}\nProblem: ${normalized.problemSpace}\nTechnology: ${normalized.technology}\n`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: prompt },
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "idea_list",
          strict: true,
          schema: {
            type: "object",
            additionalProperties: false,
            properties: {
              ideas: {
                type: "array",
                minItems: 6,
                items: {
                  type: "object",
                  additionalProperties: false,
                  properties: {
                    title: { type: "string" },
                    description: { type: "string" },
                    potentialUsers: { type: "string" },
                    tags: { type: "array", items: { type: "string" } },
                  },
                  required: ["title", "description", "potentialUsers", "tags"],
                },
              },
            },
            required: ["ideas"],
          },
        },
      },
      temperature: 0.7,
    });

    const message = completion.choices[0]?.message?.content?.trim() ?? "{}";
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
