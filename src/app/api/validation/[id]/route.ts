import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type Context = {
  params: Promise<{ id: string }>;
};

export async function DELETE(_request: Request, context: Context) {
  const { id } = await context.params;
  const supabase = await createSupabaseServerClient();
  const { data: userData } = await supabase.auth.getUser();

  if (!userData.user) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { data: validation } = await supabase
    .from("validations")
    .select("id, user_id")
    .eq("id", id)
    .single();

  if (!validation || validation.user_id !== userData.user.id) {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }

  await supabase
    .from("shared_reports")
    .delete()
    .eq("validation_id", validation.id);
  const { error } = await supabase
    .from("validations")
    .delete()
    .eq("id", validation.id);

  if (error) {
    console.error("Delete validation error:", error);
    return NextResponse.json(
      { error: error.message || "Unable to delete validation." },
      { status: 500 },
    );
  }

  return NextResponse.json({ success: true });
}
