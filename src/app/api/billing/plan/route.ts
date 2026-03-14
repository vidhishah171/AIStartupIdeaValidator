import { NextResponse } from "next/server";
import { z } from "zod";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const planSchema = z.enum(["free", "pro", "team"]);

export async function GET() {
  const supabase = await createSupabaseServerClient();
  const { data: userData } = await supabase.auth.getUser();

  if (!userData.user) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const userId = userData.user.id;
  const { data: planRow, error } = await supabase
    .from("user_plans")
    .select("plan")
    .eq("user_id", userId)
    .maybeSingle();

  if (error && error.code !== "PGRST116") {
    return NextResponse.json({ error: "Unable to load plan." }, { status: 500 });
  }

  if (!planRow) {
    const { error: insertError } = await supabase
      .from("user_plans")
      .insert({ user_id: userId, plan: "free" });
    if (insertError) {
      return NextResponse.json({ error: "Unable to create plan." }, { status: 500 });
    }
    return NextResponse.json({ plan: "free" });
  }

  return NextResponse.json({ plan: planRow.plan });
}

export async function POST(request: Request) {
  const supabase = await createSupabaseServerClient();
  const { data: userData } = await supabase.auth.getUser();

  if (!userData.user) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const payload = planSchema.safeParse(await request.json());
  if (!payload.success) {
    return NextResponse.json({ error: "Invalid plan." }, { status: 400 });
  }

  const userId = userData.user.id;
  const { error } = await supabase
    .from("user_plans")
    .upsert({ user_id: userId, plan: payload.data, updated_at: new Date().toISOString() });

  if (error) {
    return NextResponse.json({ error: "Unable to update plan." }, { status: 500 });
  }

  return NextResponse.json({ plan: payload.data });
}
