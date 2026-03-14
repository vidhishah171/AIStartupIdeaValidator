"use client";

import { useMemo, useState } from "react";
import type { ValidationReport } from "@/lib/types";
import { getIdeaHeadline } from "@/lib/utils";
import { ComparisonTable } from "@/components/comparison-table";

type ComparisonShellProps = {
  validations: {
    id: string;
    idea_text: string;
    report: ValidationReport;
    created_at: string;
  }[];
};

export function ComparisonShell({ validations }: ComparisonShellProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const toggleSelection = (id: string) => {
    setSelectedIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((value) => value !== id);
      }
      if (prev.length >= 3) {
        return prev;
      }
      return [...prev, id];
    });
  };

  const selectedValidations = useMemo(
    () => validations.filter((validation) => selectedIds.includes(validation.id)),
    [validations, selectedIds]
  );

  const rows = selectedValidations.map((validation) => {
    const report = validation.report;
    const opportunityScore = Math.min(100, (report.marketDemandScore ?? 0) + 12);
    const marketDemand = Math.min(100, report.marketDemandScore ?? 0);
    const competition = Math.min(100, (report.competitors?.length ?? 0) * 18);
    const marketSize = Math.min(100, 60 + Math.floor(Math.random() * 20));
    const monetization = Math.min(100, (report.monetizationSuggestions?.length ?? 0) * 20);
    const headline = getIdeaHeadline(validation.idea_text);
    return {
      id: validation.id,
      name: headline,
      opportunityScore,
      marketDemand,
      competition,
      marketSize,
      monetization,
    };
  });

  return (
    <div className="space-y-6">
      <div className="rounded-[28px] border border-slate-200/70 bg-white/80 p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.35)] dark:border-white/10 dark:bg-slate-900/60">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.4em] text-slate-400">Idea selection</p>
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">Idea Comparison</h2>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Select up to three ideas from your validation history to compare core metrics.
            </p>
          </div>
          <div className="text-xs uppercase tracking-[0.3em] text-slate-500">
            {selectedIds.length}/3 selected
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-3">
          {validations.map((validation) => {
            const selected = selectedIds.includes(validation.id);
            const headline = getIdeaHeadline(validation.idea_text);
            return (
              <button
                key={validation.id}
                type="button"
                onClick={() => toggleSelection(validation.id)}
                className={`rounded-2xl border px-4 py-2 text-sm font-semibold transition ${
                  selected
                    ? "border-indigo-500 bg-indigo-50 text-indigo-700 dark:border-indigo-400 dark:bg-indigo-500/10"
                    : "border-slate-200/70 bg-white/70 text-slate-700 dark:border-white/10 dark:bg-slate-900/60 dark:text-slate-300"
                }`}
              >
                {headline.length > 32 ? `${headline.slice(0, 32)}...` : headline}
              </button>
            );
          })}
        </div>
      </div>

      {rows.length > 0 ? (
        <ComparisonTable rows={rows} />
      ) : (
        <div className="rounded-[28px] border border-dashed border-slate-200/70 bg-white/80 p-6 text-sm text-slate-600 dark:border-white/20 dark:bg-slate-900/60 dark:text-slate-300">
          Select at least one idea to render the comparison table.
        </div>
      )}
    </div>
  );
}
