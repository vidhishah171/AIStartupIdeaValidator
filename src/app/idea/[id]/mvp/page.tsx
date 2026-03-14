import { redirect, notFound } from "next/navigation";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { MVPPlannerShell } from "@/components/mvp-planner-shell";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function MVPPlannerPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: validation } = await supabase
    .from("validations")
    .select("id, idea_text, report")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (!validation) {
    notFound();
  }

  return (
    <section className="min-h-screen w-full px-4 py-10 sm:px-6 lg:px-10">
      <MVPPlannerShell
        ideaId={validation.id}
        ideaText={validation.idea_text}
        report={validation.report}
      />
    </section>
  );
}
