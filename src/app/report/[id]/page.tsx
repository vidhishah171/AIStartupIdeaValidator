import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { ReportCards } from "@/components/report-cards";
import { ReportActions } from "@/components/report-actions";
import { formatDate, getIdeaHeadline } from "@/lib/utils";

type ReportPageProps = {
  params: { id: string };
};

export default async function ReportPage({ params }: ReportPageProps) {
  const { id } = await params;
  const supabase = await createSupabaseServerClient();
  const { data: userData } = await supabase.auth.getUser();

  if (!userData.user) {
    redirect("/login");
  }

  const { data: validation } = await supabase
    .from("validations")
    .select("id, idea_text, report, created_at")
    .eq("id", id)
    .single();

  if (!validation) {
    redirect("/dashboard");
  }

  return (
    <div className="mx-auto w-full max-w-none px-6 py-10">
      <div className="glass-card rounded-3xl p-8 shadow-[0_18px_40px_-26px_rgba(15,23,42,0.55)]">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-muted-foreground">
          Full Report
        </p>
        <h1 className="mt-3 text-4xl font-semibold leading-tight">
          {getIdeaHeadline(validation.idea_text)}
        </h1>
        <p className="mt-3 text-base text-muted-foreground">
          Created on {formatDate(validation.created_at)}
        </p>
        <div className="mt-6">
          <ReportActions
            validationId={validation.id}
            ideaText={validation.idea_text}
            report={validation.report}
            createdAt={validation.created_at}
          />
        </div>
      </div>

      <div className="mt-10">
        <ReportCards report={validation.report} />
      </div>
    </div>
  );
}
