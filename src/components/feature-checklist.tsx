"use client";

import { CheckCircle2 } from "lucide-react";

export type FeatureChecklistProps = {
  features: {
    name: string;
    priority: "High" | "Medium" | "Low";
    explanation: string;
  }[];
};

export function FeatureChecklist({ features }: FeatureChecklistProps) {
  return (
    <div className="space-y-4">
      {features.map((feature) => (
        <div key={feature.name} className="flex flex-col gap-2 rounded-3xl border border-slate-200/70 bg-slate-50/80 p-4 dark:border-white/10 dark:bg-slate-900/50">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold text-slate-900 dark:text-white">{feature.name}</h3>
            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                feature.priority === "High"
                  ? "bg-rose-100 text-rose-700"
                  : feature.priority === "Medium"
                  ? "bg-amber-100 text-amber-700"
                  : "bg-emerald-100 text-emerald-700"
              }`}
            >
              {feature.priority}
            </span>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-300">{feature.explanation}</p>
        </div>
      ))}
    </div>
  );
}
