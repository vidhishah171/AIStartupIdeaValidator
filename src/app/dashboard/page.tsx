import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { DashboardClient } from "@/components/dashboard-client";

export default async function DashboardPage() {
  const supabase = await createSupabaseServerClient();
  const { data: userData } = await supabase.auth.getUser();

  if (!userData.user) {
    redirect("/login");
  }

  const { data: validations } = await supabase
    .from("validations")
    .select("id, idea_text, report, created_at")
    .order("created_at", { ascending: false });

  return <DashboardClient validations={validations ?? []} />;
}
