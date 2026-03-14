import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { ReportsModule } from "@/components/reports-module";

export default async function ReportsPage() {
  const supabase = await createSupabaseServerClient();
  const { data: userData } = await supabase.auth.getUser();

  if (!userData.user) {
    redirect("/login");
  }

  const { data: validations } = await supabase
    .from("validations")
    .select("id, idea_text, report, created_at")
    .order("created_at", { ascending: false });

  return (
    <div className="mx-auto w-full max-w-none px-6 py-10">
      <ReportsModule validations={validations ?? []} />
    </div>
  );
}
