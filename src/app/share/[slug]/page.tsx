import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { ReportCards } from "@/components/report-cards";
import { sampleReport } from "@/lib/sample-report";
import { getIdeaHeadline } from "@/lib/utils";
import type { ValidationReport } from "@/lib/types";

type PageProps = {
  params: { slug: string };
};

export default async function SharePage({ params }: PageProps) {
  const { slug } = await params;
  if (slug === "example") {
    return (
      <div className="mx-auto w-full max-w-none px-6 py-12">
        <div className="glass-card mb-8 rounded-3xl p-6">
          <h1 className="text-4xl font-semibold">Shared Example Report</h1>
          <p className="mt-3 text-base text-muted-foreground">
            A public sample of what your validation report looks like.
          </p>
        </div>
        <ReportCards report={sampleReport} />
        <div className="mt-10 text-center">
          <Link
            href="/validate"
            className="rounded-full bg-primary px-6 py-3 text-base font-semibold text-primary-foreground"
          >
            Validate your own idea
          </Link>
        </div>
      </div>
    );
  }

  const supabase = await createSupabaseServerClient();
  const { data: shared } = await supabase
    .from("shared_reports")
    .select("share_slug, validation:validations(id, idea_text, report, created_at)")
    .eq("share_slug", slug)
    .single();

  const validation = shared?.validation as
    | {
        id: string;
        idea_text: string;
        report: ValidationReport;
        created_at: string;
      }
    | undefined;

  if (!validation) {
    return (
      <div className="mx-auto w-full max-w-none px-6 py-16 text-center">
        <h1 className="text-4xl font-semibold">Report not found</h1>
        <p className="mt-4 text-base text-muted-foreground">
          This share link may have expired or is invalid.
        </p>
        <Link
          href="/validate"
          className="mt-6 inline-flex rounded-full bg-primary px-6 py-3 text-base font-semibold text-primary-foreground"
        >
          Validate your own idea
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-none px-6 py-12">
      <div className="glass-card mb-8 rounded-3xl p-6">
        <h1 className="text-4xl font-semibold">Shared validation report</h1>
        <p className="mt-3 text-base text-muted-foreground">
          {getIdeaHeadline(validation.idea_text)}
        </p>
      </div>
      <ReportCards report={validation.report} />
      <div className="mt-10 text-center">
        <Link
          href="/validate"
          className="rounded-full bg-primary px-6 py-3 text-base font-semibold text-primary-foreground"
        >
          Validate your own idea
        </Link>
      </div>
    </div>
  );
}
