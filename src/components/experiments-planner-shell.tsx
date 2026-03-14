"use client";

import { ExperimentCard } from "@/components/experiment-card";

const experimentIdeas = [
  {
    name: "Landing page test",
    description: "Simple single-page narrative to gauge interest via CTAs.",
    goal: "Measure click-through and email capture rate.",
    effort: "Low" as const,
    signal: "High conversion on CTA indicates market curiosity.",
  },
  {
    name: "User interviews",
    description: "Half-hour sessions with five target customers.",
    goal: "Understand pain points and willingness to pay.",
    effort: "Medium" as const,
    signal: "Consistent pain language and feature requests.",
  },
  {
    name: "Pre-order test",
    description: "Lightweight form with CTA to pre-order a pilot version.",
    goal: "Prove demand with financial commitment.",
    effort: "High" as const,
    signal: "Paid commitments or deposit expresses strong signal.",
  },
  {
    name: "Waitlist campaign",
    description: "Collect emails via referral program plus shareable link.",
    goal: "Validate virality and organic interest.",
    effort: "Low" as const,
    signal: "Consistent growth in waitlist without paid ads.",
  },
];

type ExperimentsPlannerShellProps = {
  ideaId: string;
};

export function ExperimentsPlannerShell({ ideaId }: ExperimentsPlannerShellProps) {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.4em] text-slate-400">Idea {ideaId}</p>
        <h1 className="text-3xl font-semibold text-slate-900 dark:text-white">Validation Experiments Planner</h1>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          Quick experiments that surface signals without building a full product.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {experimentIdeas.map((experiment) => (
          <ExperimentCard key={experiment.name} experiment={experiment} />
        ))}
      </div>
    </div>
  );
}
