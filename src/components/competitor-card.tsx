"use client";

import Link from "next/link";
import { BadgeCheck, Globe } from "lucide-react";

export type CompetitorCardProps = {
  competitor: {
    name: string;
    description: string;
    pricing: string;
    website: string;
    strengths: string[];
    tags?: string[];
  };
};

export function CompetitorCard({ competitor }: CompetitorCardProps) {
  return (
    <div className="flex h-full flex-col justify-between rounded-3xl border border-slate-200/60 bg-white/90 p-5 shadow-[0_20px_50px_-40px_rgba(15,23,42,0.35)] dark:border-white/10 dark:bg-slate-900/70">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{competitor.name}</h3>
          <Link href={competitor.website} target="_blank" rel="noreferrer" className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
            <div className="flex items-center gap-1">
              <Globe className="h-4 w-4" />
              <span>Website</span>
            </div>
          </Link>
        </div>
        <p className="text-sm text-slate-600 dark:text-slate-300">{competitor.description}</p>
      </div>
      <div className="mt-4 space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Pricing</p>
        <p className="text-sm text-slate-700 dark:text-slate-200">{competitor.pricing}</p>
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Strengths</p>
        <ul className="space-y-1 text-sm text-slate-600 dark:text-slate-300">
          {competitor.strengths.map((strength) => (
            <li key={strength} className="flex items-center gap-2">
              <BadgeCheck className="h-4 w-4 text-emerald-500" />
              {strength}
            </li>
          ))}
        </ul>
        <div className="flex flex-wrap gap-2">
          {competitor.tags?.map((tag) => (
            <span key={tag} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
