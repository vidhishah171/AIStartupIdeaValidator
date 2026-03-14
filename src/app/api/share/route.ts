import { NextResponse } from "next/server";
import { z } from "zod";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const inputSchema = z.object({
  validationId: z.string().uuid(),
});

function generateSlug() {
  return crypto.randomUUID().split("-")[0];
}

export async function POST(request: Request) {
  try {
    const payload = inputSchema.safeParse(await request.json());
    if (!payload.success) {
      return NextResponse.json({ error: "Invalid request." }, { status: 400 });
    }

    const supabase = await createSupabaseServerClient();
    const { data: userData } = await supabase.auth.getUser();

    if (!userData.user) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const { data: validation } = await supabase
      .from("validations")
      .select("id, user_id")
      .eq("id", payload.data.validationId)
      .single();

    if (!validation || validation.user_id !== userData.user.id) {
      return NextResponse.json({ error: "Not found." }, { status: 404 });
    }

    const { data: existing } = await supabase
      .from("shared_reports")
      .select("share_slug")
      .eq("validation_id", payload.data.validationId)
      .single();

    if (existing?.share_slug) {
      return NextResponse.json({ slug: existing.share_slug });
    }

    const slug = generateSlug();
    const { error } = await supabase.from("shared_reports").insert({
      validation_id: payload.data.validationId,
      share_slug: slug,
    });

    if (error) {
      return NextResponse.json(
        { error: "Unable to share report." },
        { status: 500 }
      );
    }

    return NextResponse.json({ slug });
  } catch {
    return NextResponse.json(
      { error: "Unexpected server error." },
      { status: 500 }
    );
  }
}
