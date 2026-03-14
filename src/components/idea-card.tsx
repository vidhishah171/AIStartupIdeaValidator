"use client";

import Link from "next/link";
import { Sparkles } from "lucide-react";

export type IdeaCardProps = {
  idea: {
    id: string;
    title: string;
    description: string;
    potentialUsers: string;
  };
};

export function IdeaCard({ idea }: IdeaCardProps) {
  const ideaText = `${idea.title}\n\n${idea.description}\n\nPotential users: ${idea.potentialUsers}`;
  return (
    <div className="flex h-full flex-col justify-between rounded-3xl border border-slate-200/60 bg-white/90 p-5 shadow-[0_15px_40px_-30px_rgba(15,23,42,0.9)] transition hover:-translate-y-0.5 hover:shadow-[0_25px_60px_-30px_rgba(15,23,42,0.35)] dark:border-white/10 dark:bg-slate-900/70">
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-slate-500">
          <Sparkles className="h-4 w-4 text-indigo-500" />
          <span className="text-xs font-semibold uppercase tracking-[0.3em]">New idea</span>
        </div>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{idea.title}</h3>
        <p className="text-sm text-slate-600 dark:text-slate-300">{idea.description}</p>
      </div>
      <div className="mt-6 flex flex-col gap-3">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Potential users</p>
        <p className="text-sm font-medium text-slate-700 dark:text-slate-200">{idea.potentialUsers}</p>
        <Link
          href={`/validate?idea=${encodeURIComponent(ideaText)}`}
          className="inline-flex items-center justify-center rounded-2xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-500"
        >
          Validate this idea
        </Link>
      </div>
    </div>
  );
}
