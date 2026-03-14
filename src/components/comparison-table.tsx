"use client";

import { ChartBar } from "lucide-react";

export type ComparisonRow = {
  id: string;
  name: string;
  opportunityScore: number;
  marketDemand: number;
  competition: number;
  marketSize: number;
  monetization: number;
};

export type ComparisonTableProps = {
  rows: ComparisonRow[];
};

const barColor = (value: number) => {
  if (value >= 80) return "bg-emerald-500";
  if (value >= 60) return "bg-amber-500";
  return "bg-rose-500";
};

export function ComparisonTable({ rows }: ComparisonTableProps) {
  return (
    <div className="overflow-auto rounded-3xl border border-slate-200/70 bg-white/90 p-4 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.35)] dark:border-white/10 dark:bg-slate-900/70">
      <div className="flex items-center justify-between pb-4">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Idea comparison</h3>
        <div className="flex items-center gap-1 text-xs uppercase tracking-[0.3em] text-slate-500">
          <ChartBar className="h-4 w-4" />
          Scores out of 100
        </div>
      </div>
      <div className="grid min-w-[720px] gap-4 text-sm text-slate-600 dark:text-slate-300">
        <div className="grid grid-cols-[2fr_repeat(5,1fr)] gap-4 border-b border-slate-100 pb-2 text-xs font-semibold uppercase tracking-[0.3em] text-slate-500 dark:border-white/10">
          <span>Idea Name</span>
          <span>Opportunity</span>
          <span>Demand</span>
          <span>Competition</span>
          <span>Market Size</span>
          <span>Monetization</span>
        </div>
        {rows.map((row) => (
          <div key={row.id} className="grid grid-cols-[2fr_repeat(5,1fr)] gap-4 items-center rounded-2xl border border-slate-100 p-3 dark:border-white/10">
            <span className="text-slate-900 dark:text-white">{row.name}</span>
            {[row.opportunityScore, row.marketDemand, row.competition, row.marketSize, row.monetization].map((value, index) => (
              <div key={`${row.id}-${index}`} className="space-y-1">
                <div className="h-2 w-full rounded-full bg-slate-200/70 dark:bg-white/10">
                  <div className={`${barColor(value)} h-full rounded-full`} style={{ width: `${value}%` }} />
                </div>
                <span className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-slate-500">{value}%</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
