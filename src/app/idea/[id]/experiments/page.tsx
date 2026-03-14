import { redirect } from "next/navigation";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { ExperimentsPlannerShell } from "@/components/experiments-planner-shell";

type Props = {
  params: {
    id: string;
  };
};

export default async function ExperimentsPlannerPage({ params }: Props) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <section className="min-h-screen w-full px-4 py-10 sm:px-6 lg:px-10">
      <ExperimentsPlannerShell ideaId={params.id} />
    </section>
  );
}
