"use client";

import { useMemo, useState } from "react";
import { CompetitorCard } from "@/components/competitor-card";

const competitorCatalog = [
  {
    name: "SignalStack",
    description: "Idea validation platform for angel investors, pairing data signals with human analysis.",
    pricing: "Starter $49/mo · Pro $149/mo",
    website: "https://signalstack.com",
    strengths: ["Data-rich dashboards", "Pitch-ready narratives"],
    tags: ["SaaS", "Analytics"],
  },
  {
    name: "Freelancer Flow",
    description: "Workflow automation marketplace focused on gig economy founders.",
    pricing: "Usage-based · $0-$299",
    website: "https://freelancerflow.com",
    strengths: ["Marketplace integrations", "Community support"],
    tags: ["AI", "Marketplace"],
  },
  {
    name: "AutoPitch Studio",
    description: "Automates pitch deck creation with AI narrative guidance.",
    pricing: "$249/mo flat license",
    website: "https://autopitch.studio",
    strengths: ["Presentation-first UX", "Investor templates"],
    tags: ["AI", "SaaS"],
  },
  {
    name: "IdeaPulse",
    description: "Workspace for idea validation reports with collaborative notes.",
    pricing: "Free tier · Teams $99/mo",
    website: "https://ideapulse.co",
    strengths: ["Team collaboration", "Shareable reports"],
    tags: ["SaaS"],
  },
  {
    name: "Hypothesis Hub",
    description: "Centralizes experiments and validation notes alongside idea backlogs.",
    pricing: "Custom pricing",
    website: "https://hypothesishub.com",
    strengths: ["Experiment templates", "Custom dashboards"],
    tags: ["SaaS", "AI"],
  },
];

export function CompetitorExplorerShell() {
  const [query, setQuery] = useState("");

  const filteredCompetitors = useMemo(() => {
    if (!query) return competitorCatalog;
    const lower = query.toLowerCase();
    return competitorCatalog.filter((competitor) => {
      return (
        competitor.name.toLowerCase().includes(lower) ||
        competitor.description.toLowerCase().includes(lower) ||
        competitor.tags?.some((tag) => tag.toLowerCase().includes(lower))
      );
    });
  }, [query]);

  return (
    <div className="flex flex-col gap-8">
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.4em] text-slate-400">Explorer</p>
        <h1 className="text-3xl font-semibold text-slate-900 dark:text-white">Competitor Explorer</h1>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          Scan market players, pricing, and differentiators for your focus area.
        </p>
      </div>

      <div className="rounded-[28px] border border-slate-200/70 bg-white/80 p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.35)] dark:border-white/10 dark:bg-slate-900/60">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Search</p>
            <p className="text-sm text-slate-600 dark:text-slate-300">Lookup competitors by product name or industry.</p>
          </div>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by product, industry, or tag"
            className="w-full max-w-md rounded-2xl border border-border/60 bg-background/80 px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {filteredCompetitors.map((competitor) => (
          <CompetitorCard key={competitor.name} competitor={competitor} />
        ))}
      </div>
    </div>
  );
}
