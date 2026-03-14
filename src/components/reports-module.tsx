"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Download, Pin, PinOff } from "lucide-react";
import { downloadReportPdf } from "@/lib/pdf";
import { formatDate, getIdeaHeadline } from "@/lib/utils";
import { ReportCards } from "@/components/report-cards";
import { DatePicker } from "@/components/date-picker";
import type { ValidationReport } from "@/lib/types";

type ValidationRow = {
  id: string;
  idea_text: string;
  report: ValidationReport;
  created_at: string;
};

type SortOption = "newest" | "oldest" | "highest" | "lowest";

const PIN_KEY = "pinnedReports";

export function ReportsModule({ validations }: { validations: ValidationRow[] }) {
  const [selectedId, setSelectedId] = useState<string | null>(
    validations[0]?.id ?? null
  );
  const [search, setSearch] = useState("");
  const [minScore, setMinScore] = useState("");
  const [maxScore, setMaxScore] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [pinnedOnly, setPinnedOnly] = useState(false);
  const [pinned, setPinned] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = window.localStorage.getItem(PIN_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as Record<string, boolean>;
        setPinned(parsed);
      } catch {
        setPinned({});
      }
    }
  }, []);

  const savePinned = (next: Record<string, boolean>) => {
    setPinned(next);
    if (typeof window === "undefined") return;
    window.localStorage.setItem(PIN_KEY, JSON.stringify(next));
  };

  const filtered = useMemo(() => {
    const min = minScore ? Number(minScore) : null;
    const max = maxScore ? Number(maxScore) : null;
    const base = validations
      .filter((item) => {
        if (pinnedOnly && !pinned[item.id]) return false;
        if (
          search &&
          !item.idea_text.toLowerCase().includes(search.toLowerCase())
        ) {
          return false;
        }
        const score = item.report?.marketDemandScore ?? 0;
        if (min !== null && score < min) return false;
        if (max !== null && score > max) return false;
        const date = formatDate(item.created_at);
        if (fromDate && date < fromDate) return false;
        if (toDate && date > toDate) return false;
        return true;
      })
      .sort((a, b) => {
        if (sortBy === "newest") return b.created_at.localeCompare(a.created_at);
        if (sortBy === "oldest") return a.created_at.localeCompare(b.created_at);
        if (sortBy === "highest") {
          return (b.report?.marketDemandScore ?? 0) - (a.report?.marketDemandScore ?? 0);
        }
        return (a.report?.marketDemandScore ?? 0) - (b.report?.marketDemandScore ?? 0);
      });
    return base.sort((a, b) => {
      const pinnedA = pinned[a.id] ? 1 : 0;
      const pinnedB = pinned[b.id] ? 1 : 0;
      return pinnedB - pinnedA;
    });
  }, [
    validations,
    search,
    minScore,
    maxScore,
    fromDate,
    toDate,
    sortBy,
    pinnedOnly,
    pinned,
  ]);

  const selected =
    filtered.find((item) => item.id === selectedId) ??
    filtered[0] ??
    null;

  useEffect(() => {
    if (!selected && filtered[0]) {
      setSelectedId(filtered[0].id);
    }
  }, [filtered, selected]);

  const togglePin = (id: string) => {
    const next = { ...pinned, [id]: !pinned[id] };
    if (!next[id]) {
      delete next[id];
    }
    savePinned(next);
  };

  const selectedIdeaTitle = getIdeaHeadline(selected?.idea_text);

  return (
    <div className="grid gap-6">
      <div className="glass-card relative z-20 rounded-3xl p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-muted-foreground">
              Reports Module
            </p>
            <h1 className="mt-3 text-4xl font-semibold">View & Filter Reports</h1>
            <p className="mt-3 text-base text-muted-foreground">
              Search, filter, and pin the reports you revisit most.
            </p>
          </div>
          <div className="flex flex-col items-end gap-3">
            <div className="glass-muted rounded-full px-3 py-2 text-sm font-semibold uppercase tracking-[0.3em] text-muted-foreground">
              {filtered.length} shown
            </div>
            <Link
              href="/reports/market-insights"
              className="inline-flex items-center gap-1 rounded-full bg-primary px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-primary-foreground transition hover:-translate-y-0.5 hover:shadow-sm"
            >
              View Market Insights
            </Link>
          </div>
        </div>

        <div className="mt-6 grid gap-3 lg:grid-cols-[2fr_repeat(4,1fr)]">
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search idea text..."
            className="rounded-2xl border border-border/60 bg-background/80 px-4 py-3 text-base text-foreground shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <input
            type="number"
            min={0}
            max={100}
            value={minScore}
            onChange={(event) => setMinScore(event.target.value)}
            placeholder="Min score"
            className="rounded-2xl border border-border/60 bg-background/80 px-4 py-3 text-base text-foreground shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <input
            type="number"
            min={0}
            max={100}
            value={maxScore}
            onChange={(event) => setMaxScore(event.target.value)}
            placeholder="Max score"
            className="rounded-2xl border border-border/60 bg-background/80 px-4 py-3 text-base text-foreground shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <DatePicker value={fromDate} onChange={setFromDate} placeholder="From date" />
          <DatePicker value={toDate} onChange={setToDate} placeholder="To date" />
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <select
            value={sortBy}
            onChange={(event) => setSortBy(event.target.value as SortOption)}
            className="rounded-full border border-border/60 bg-background/80 px-4 py-2 text-base text-foreground shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
            <option value="highest">Highest score</option>
            <option value="lowest">Lowest score</option>
          </select>
          <button
            type="button"
            onClick={() => setPinnedOnly((prev) => !prev)}
            className="rounded-full border border-border/60 bg-background/80 px-4 py-2 text-base font-semibold text-foreground"
          >
            {pinnedOnly ? "Showing pinned" : "Filter pinned"}
          </button>
        </div>
      </div>

      <div className="grid gap-6 lg:flex lg:items-stretch">
        <div className="glass-card rounded-3xl p-5 lg:w-[360px] lg:min-w-[280px] lg:max-w-[520px] lg:resize-x lg:overflow-auto">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold">Report list</h2>
            <span className="text-sm text-muted-foreground">
              {filtered.length} results
            </span>
          </div>
          <div className="grid gap-3">
            {filtered.length === 0 && (
              <p className="text-base text-muted-foreground">
                No reports match your filters.
              </p>
            )}
            {filtered.map((item) => {
              const isSelected = item.id === selected?.id;
              const isPinned = Boolean(pinned[item.id]);
              const headline = getIdeaHeadline(item.idea_text);
              const truncatedHeadline =
                headline.length > 48 ? `${headline.slice(0, 48)}...` : headline;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSelectedId(item.id)}
                  className={`glass-muted flex w-full items-center justify-between gap-3 rounded-2xl px-4 py-3 text-left transition ${isSelected ? "ring-2 ring-primary/60" : ""
                    }`}
                >
                  <div>
                    <p className="text-base font-semibold text-foreground">
                      {truncatedHeadline}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(item.created_at)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="rounded-full border border-border/60 bg-background/80 px-3 py-1 text-sm font-semibold text-primary">
                      {item.report?.marketDemandScore ?? 0}
                    </span>
                    <span
                      className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border/60 bg-background/80 text-foreground"
                      onClick={(event) => {
                        event.stopPropagation();
                        togglePin(item.id);
                      }}
                      role="button"
                    >
                      {isPinned ? (
                        <Pin className="h-4 w-4" />
                      ) : (
                        <PinOff className="h-4 w-4" />
                      )}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="glass-card rounded-3xl p-6 lg:flex-1">
          {!selected && (
            <p className="text-base text-muted-foreground">
              Select a report to view details.
            </p>
          )}
          {selected && (
            <div className="grid gap-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.3em] text-muted-foreground">
                    Selected report
                  </p>
                  <h2 className="mt-2 text-3xl font-semibold">
                    {selectedIdeaTitle || selected.idea_text}
                  </h2>
                  <p className="mt-2 text-base text-muted-foreground">
                    Created {formatDate(selected.created_at)}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={() =>
                      downloadReportPdf({
                        ideaText: selected.idea_text,
                        report: selected.report,
                        createdAt: selected.created_at,
                      })
                    }
                    className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-base font-semibold text-primary-foreground"
                  >
                    <Download className="h-4 w-4" />
                    Download PDF
                  </button>
                  <Link
                    href={`/report/${selected.id}`}
                    className="rounded-full border border-border/60 bg-background/80 px-4 py-2 text-base font-semibold text-foreground"
                  >
                    Open full report
                  </Link>
                  <Link
                    href={`/idea/${selected.id}/mvp`}
                    className="rounded-full border border-border/60 bg-background/80 px-4 py-2 text-base font-semibold text-foreground"
                  >
                    MVP Planner
                  </Link>
                </div>
              </div>

              <ReportCards report={selected.report} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
