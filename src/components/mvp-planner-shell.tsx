"use client";

import { FeatureChecklist } from "@/components/feature-checklist";
import { getIdeaHeadline } from "@/lib/utils";
import type { ValidationReport } from "@/lib/types";

const fallbackFeatures = [
  {
    name: "Signal dashboard",
    priority: "High" as const,
    explanation: "Surface demand signals, search trends, and competitor moves in one view.",
  },
  {
    name: "Hero validation workflow",
    priority: "High" as const,
    explanation: "Guides aspiring founders through quick hypothesis drafting and scoring.",
  },
  {
    name: "Collaborative notes",
    priority: "Medium" as const,
    explanation: "Allow teams to annotate insights, share comments, and assign follow-ups.",
  },
  {
    name: "Investor summary card",
    priority: "Low" as const,
    explanation: "Auto-boil insights into a shareable investor-ready snapshot.",
  },
];

const fallbackScopeTiers = {
  core: ["Signal dashboard", "Hero validation workflow", "Basic analytics insights"],
  optional: ["Collaborative notes", "Idea scoring revisions", "Exportable slide deck"],
  future: ["Investor summary card", "Automated experiment design"],
};

type MVPPlannerShellProps = {
  ideaId?: string;
  ideaText?: string;
  report?: ValidationReport;
};

export function MVPPlannerShell({ ideaId, ideaText, report }: MVPPlannerShellProps) {
  const features = report?.mvpFeatures?.length ? report.mvpFeatures : fallbackFeatures;
  const scopeTiers = report?.mvpScopeTiers?.core?.length ? report.mvpScopeTiers : fallbackScopeTiers;
  const headline = getIdeaHeadline(ideaText);

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">{ideaId ? "MVP Planner" : "Planning"}</p>
        <h1 className="text-4xl font-semibold">{headline || "MVP Feature Planner"}</h1>
        <p className="text-sm text-muted-foreground">
          Recommended MVP features and scope tiers tailored to your idea.
        </p>
      </div>

      <div className="space-y-6 rounded-[32px] border border-slate-200/70 bg-white/90 p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.35)] dark:border-white/10 dark:bg-slate-900/60">
        <FeatureChecklist features={features} />
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {Object.entries(scopeTiers).map(([tier, items]) => (
          <article
            key={tier}
            className="flex flex-col gap-3 rounded-[32px] border border-slate-200/70 bg-white/80 p-5 text-sm text-slate-600 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.35)] dark:border-white/10 dark:bg-slate-900/50 dark:text-slate-300"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
              {tier === "core" ? "Core features" : tier === "optional" ? "Optional features" : "Future features"}
            </p>
            <ul className="space-y-2">
              {items.map((item) => (
                <li key={item} className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-200">
                  <span className="h-2 w-2 rounded-full bg-indigo-500" />
                  {item}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </div>
  );
}
