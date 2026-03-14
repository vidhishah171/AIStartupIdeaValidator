"use client";

import { CircleDot, SignalHigh } from "lucide-react";

export type ExperimentCardProps = {
  experiment: {
    name: string;
    description: string;
    goal: string;
    effort: "Low" | "Medium" | "High";
    signal: string;
  };
};

export function ExperimentCard({ experiment }: ExperimentCardProps) {
  const effortStyles = {
    Low: "bg-emerald-100 text-emerald-700",
    Medium: "bg-amber-100 text-amber-700",
    High: "bg-rose-100 text-rose-700",
  };

  return (
    <div className="flex h-full flex-col justify-between rounded-3xl border border-slate-200/70 bg-white/90 p-5 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.35)] dark:border-white/10 dark:bg-slate-900/70">
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-slate-500">
          <CircleDot className="h-4 w-4 text-indigo-500" />
          <span className="text-xs font-semibold uppercase tracking-[0.3em]">Experiment</span>
        </div>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{experiment.name}</h3>
        <p className="text-sm text-slate-600 dark:text-slate-300">{experiment.description}</p>
      </div>
      <div className="mt-4 space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Goal</p>
          <span className={`rounded-full px-3 py-1 text-xs font-semibold ${effortStyles[experiment.effort]}`}>
            {experiment.effort} effort
          </span>
        </div>
        <p className="text-sm text-slate-700 dark:text-slate-200">{experiment.goal}</p>
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <SignalHigh className="h-4 w-4" />
          <span>{experiment.signal}</span>
        </div>
      </div>
    </div>
  );
}
