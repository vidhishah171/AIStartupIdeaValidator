"use client";

import { FormEvent, useCallback, useState } from "react";
import { IdeaCard } from "@/components/idea-card";
import { cn } from "@/lib/utils";

type GeneratedIdea = {
  id: string;
  title: string;
  description: string;
  potentialUsers: string;
};

const fallbackIdeas: GeneratedIdea[] = [
  {
    id: "fallback-1",
    title: "AI Ops for remote teams",
    description: "Automates standups, triages async requests, and surfaces blockers from team chat streams.",
    potentialUsers: "Remote PMs, engineering leads, ops teams",
  },
  {
    id: "fallback-2",
    title: "Creative brief generator",
    description: "Guides marketing teams through brand voice, channels, and deliverable sequencing.",
    potentialUsers: "Marketing agencies, indie studios",
  },
  {
    id: "fallback-3",
    title: "Niche community concierge",
    description: "Matches curated experts to member questions inside premium Slack/Discord clubs.",
    potentialUsers: "Community builders, founders, coaches",
  },
  {
    id: "fallback-4",
    title: "Latent data assistant",
    description: "Surfaces trends across customer logs and flags anomalies with reasoning.",
    potentialUsers: "Data teams, product ops",
  },
  {
    id: "fallback-5",
    title: "No-code automation scout",
    description: "Saves templates for B2B workflows and generates downstream tasks automatically.",
    potentialUsers: "Ops teams, solopreneurs",
  },
  {
    id: "fallback-6",
    title: "AI pitch rehearsal",
    description: "Simulates investor Q&A and rates poise plus response insight.",
    potentialUsers: "Founders, accelerators, pitch coaches",
  },
];

export function GenerateIdeasShell() {
  const [industry, setIndustry] = useState("AI tools");
  const [targetCustomer, setTargetCustomer] = useState("Founders");
  const [problemSpace, setProblemSpace] = useState("Idea validation");
  const [technology, setTechnology] = useState("Large language models");
  const [ideas, setIdeas] = useState<GeneratedIdea[]>(fallbackIdeas);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchIdeas = useCallback(async () => {
    setIsGenerating(true);
    setError(null);

    try {
      const response = await fetch("/api/ideas/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ industry, targetCustomer, problemSpace, technology }),
      });
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.error ?? "Unable to generate ideas.");
      }

      const normalized = (payload.ideas ?? []).map((idea: any, index: number) => ({
        id: idea.title ? `${idea.title}-${index}` : `idea-${index}`,
        title: idea.title ?? `Idea ${index + 1}`,
        description: idea.description ?? "Idea description pending.",
        potentialUsers: idea.potentialUsers ?? "Early adopters",
      }));

      setIdeas(normalized.length ? normalized : fallbackIdeas);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to generate ideas at this time.");
      setIdeas(fallbackIdeas);
    } finally {
      setIsGenerating(false);
    }
  }, [industry, problemSpace, technology, targetCustomer]);

  const handleGenerate = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    fetchIdeas();
  };

  return (
    <div className="flex flex-col gap-10">
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.4em] text-slate-400">Idea generation</p>
        <h1 className="text-3xl font-semibold text-slate-900 dark:text-white">Startup Idea Generator</h1>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          Feed basic context and let AI suggest {fallbackIdeas.length.toLocaleString()} idea sparks tailored to your focus area.
        </p>
      </div>

      <form
        onSubmit={handleGenerate}
        className="grid gap-4 rounded-[28px] border border-slate-200/70 bg-white/80 p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.35)] dark:border-white/10 dark:bg-slate-900/60 lg:grid-cols-4"
      >
        <label className="space-y-1 text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
          Industry
          <input
            value={industry}
            onChange={(event) => setIndustry(event.target.value)}
            className="w-full rounded-2xl border border-border/60 bg-background/80 px-4 py-3 text-sm text-foreground transition focus:outline-none focus:ring-2 focus:ring-primary font-sans tracking-normal"
            placeholder="Industry"
          />
        </label>
        <label className="space-y-1 text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
          Target customer
          <input
            value={targetCustomer}
            onChange={(event) => setTargetCustomer(event.target.value)}
            className="w-full rounded-2xl border border-border/60 bg-background/80 px-4 py-3 text-sm text-foreground transition focus:outline-none focus:ring-2 focus:ring-primary font-sans tracking-normal"
            placeholder="Target customer"
          />
        </label>
        <label className="space-y-1 text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
          Problem space
          <input
            value={problemSpace}
            onChange={(event) => setProblemSpace(event.target.value)}
            className="w-full rounded-2xl border border-border/60 bg-background/80 px-4 py-3 text-sm text-foreground transition focus:outline-none focus:ring-2 focus:ring-primary font-sans tracking-normal"
            placeholder="Problem space"
          />
        </label>
        <label className="space-y-1 text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
          Technology
          <input
            value={technology}
            onChange={(event) => setTechnology(event.target.value)}
            className="w-full rounded-2xl border border-border/60 bg-background/80 px-4 py-3 text-sm text-foreground transition focus:outline-none focus:ring-2 focus:ring-primary font-sans tracking-normal"
            placeholder="Technology"
          />
        </label>
        <button
          type="submit"
          disabled={isGenerating}
          className={cn(
            "col-span-full rounded-2xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-indigo-500",
            isGenerating ? "cursor-wait opacity-80" : ""
          )}
        >
          {isGenerating ? "Generating ideas..." : "Generate Ideas"}
        </button>
      </form>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-slate-900 dark:text-white">
            Showing {ideas.length.toLocaleString()} generated ideas
          </p>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Card layout</p>
        </div>
        {ideas.length === 0 ? (
          <p className="text-sm text-slate-500">No ideas yet. Try changing the context.</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {ideas.map((idea) => (
              <IdeaCard key={idea.id} idea={idea} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
