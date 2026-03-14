"use client";

import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { downloadReportPdf } from "@/lib/pdf";
import type { ValidationReport } from "@/lib/types";

export function ReportActions({
  validationId,
  ideaText,
  report,
  createdAt,
}: {
  validationId: string;
  ideaText: string;
  report: ValidationReport;
  createdAt: string;
}) {
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleShare = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/share", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ validationId }),
      });
      if (!response.ok) throw new Error("Unable to share report.");
      const payload = (await response.json()) as { slug: string };
      const url = `${window.location.origin}/share/${payload.slug}`;
      setShareUrl(url);
      await navigator.clipboard.writeText(url);
      toast.success("Share link copied to clipboard.");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Share failed."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      <button
        type="button"
        onClick={() => downloadReportPdf({ ideaText, report, createdAt })}
        className="cursor-pointer rounded-full bg-primary px-4 py-2 text-base font-semibold text-primary-foreground transition hover:-translate-y-0.5"
      >
        Download PDF
      </button>
      <button
        type="button"
        onClick={handleShare}
        disabled={loading}
        className="cursor-pointer rounded-full border border-border px-4 py-2 text-base font-semibold text-foreground transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "Sharing..." : "Share report"}
      </button>
      <Link
        href={`/idea/${validationId}/mvp`}
        className="cursor-pointer rounded-full border border-border px-4 py-2 text-base font-semibold text-foreground transition hover:-translate-y-0.5"
      >
        MVP Planner
      </Link>
      <Link
        href="/validate"
        className="cursor-pointer rounded-full border border-border px-4 py-2 text-base font-semibold text-foreground transition hover:-translate-y-0.5"
      >
        Validate similar idea
      </Link>
      {shareUrl && (
        <p className="text-sm text-muted-foreground">
          Share link: {shareUrl}
        </p>
      )}
    </div>
  );
}
