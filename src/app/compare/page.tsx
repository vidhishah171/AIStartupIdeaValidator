import { redirect } from "next/navigation";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { ComparisonShell } from "@/components/comparison-shell";

export default async function IdeaComparisonPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: validations } = await supabase
    .from("validations")
    .select("id, idea_text, report, created_at")
    .order("created_at", { ascending: false })
    .limit(12);

  return (
    <section className="min-h-screen w-full px-4 py-10 sm:px-6 lg:px-10">
      <ComparisonShell validations={validations ?? []} />
    </section>
  );
}
