import { NextResponse } from "next/server";
import { z } from "zod";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const contactSchema = z.object({
  name: z.string().trim().min(2),
  email: z.string().trim().email(),
  company: z.string().trim().min(2),
  role: z.string().trim().min(2),
  teamSize: z.string().trim().min(1),
  message: z.string().trim().min(5),
});

export async function POST(request: Request) {
  try {
    const payload = contactSchema.safeParse(await request.json());
    if (!payload.success) {
      return NextResponse.json(
        { error: "Please complete all fields." },
        { status: 400 }
      );
    }

    const { name, email, company, role, teamSize, message } = payload.data;
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.from("sales_leads").insert({
      name,
      email,
      company,
      role,
      team_size: teamSize,
      message,
    });

    if (error) {
      return NextResponse.json(
        { error: "Unable to save your request." },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact sales error:", error);
    return NextResponse.json(
      { error: "Unexpected server error." },
      { status: 500 }
    );
  }
}
