"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { ValidationSkeleton } from "@/components/validation-skeleton";
import { ReportCards } from "@/components/report-cards";
import type { ValidationReport } from "@/lib/types";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

const MIN_CHARS = 50;
const MAX_CHARS = 1000;

function ValidatePageInner() {
  const [ideaText, setIdeaText] = useState("");
  const [prefilled, setPrefilled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [report, setReport] = useState<ValidationReport | null>(null);
  const [validationId, setValidationId] = useState<string | null>(null);
  const searchParams = useSearchParams();

  useEffect(() => {
    const ideaParam = searchParams.get("idea");
    if (ideaParam && !prefilled) {
      setIdeaText(ideaParam);
      setPrefilled(true);
    }
  }, [searchParams, prefilled]);

  const remaining = MAX_CHARS - ideaText.length;
  const isValid = ideaText.length >= MIN_CHARS && ideaText.length <= MAX_CHARS;

  const canSubmit = isValid && !isLoading;

  const helperText = useMemo(() => {
    if (ideaText.length === 0) return "Minimum 50 characters to validate.";
    if (ideaText.length < MIN_CHARS)
      return `Add ${MIN_CHARS - ideaText.length} more characters.`;
    if (ideaText.length > MAX_CHARS)
      return "Please keep the idea under 1000 characters.";
    return "Ready to validate.";
  }, [ideaText.length]);

  const handleValidate = async () => {
    if (!canSubmit) return;
    setIsLoading(true);
    setReport(null);
    setValidationId(null);

    try {
      const response = await fetch("/api/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ideaText }),
      });

      if (!response.ok) {
        if (response.status === 401) {
          toast.error("Please log in to validate ideas.");
          window.location.href = "/login";
          return;
        }
        const payload = await response.json().catch(() => null);
        throw new Error(payload?.error ?? "Validation failed.");
      }

      const payload = (await response.json()) as {
        report: ValidationReport;
        validationId: string | null;
        guest?: boolean;
      };
      setReport(payload.report);
      setValidationId(payload.validationId);
      toast.success("Validation complete. Review your report below.");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Unable to validate idea."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-none px-6 py-10">
      <div className="glass-card rounded-3xl p-8 shadow-[0_18px_40px_-26px_rgba(15,23,42,0.55)]">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-muted-foreground">
          Validate
        </p>
        <h1 className="mt-3 text-4xl font-semibold">Validate your idea</h1>
        <p className="mt-3 text-base text-muted-foreground">
          Share your startup idea and receive a structured validation report in
          under 30 seconds.
        </p>

        <div className="mt-6">
          <textarea
            value={ideaText}
            onChange={(event) => setIdeaText(event.target.value)}
            placeholder="An AI tool that helps freelancers automatically generate invoices and follow up on late payments"
            className="min-h-[200px] w-full rounded-2xl border border-border/60 bg-background/80 p-4 text-base text-foreground shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
            maxLength={MAX_CHARS}
          />
          <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-sm text-muted-foreground">
            <span>{helperText}</span>
            <span>{remaining} characters left</span>
          </div>
          <div className="mt-6 flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={handleValidate}
              disabled={!canSubmit}
              className="cursor-pointer rounded-full bg-primary px-6 py-3 text-base font-semibold text-primary-foreground transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoading ? "Validating..." : "Validate My Idea"}
            </button>
            {validationId && (
              <Link
                href={`/report/${validationId}`}
                className="cursor-pointer text-base font-semibold text-primary"
              >
                View full report
              </Link>
            )}
          </div>
        </div>
      </div>

      <div className="mt-10">
        {isLoading && <ValidationSkeleton />}
        {report && !isLoading && <ReportCards report={report} />}
      </div>
    </div>
  );
}

export default function ValidatePage() {
  return (
    <Suspense fallback={null}>
      <ValidatePageInner />
    </Suspense>
  );
}
