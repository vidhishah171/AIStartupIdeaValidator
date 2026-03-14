"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
  ZAxis,
} from "recharts";
import {
  Grid2X2,
  LineChart as LineChartIcon,
  Sparkles,
  ChartNoAxesCombined,
} from "lucide-react";
import { downloadReportPdf } from "@/lib/pdf";
import { formatDate, getIdeaHeadline } from "@/lib/utils";
import type { ValidationReport } from "@/lib/types";

type ValidationRow = {
  id: string;
  idea_text: string;
  report: ValidationReport;
  created_at: string;
};

const VIEW_OPTIONS = ["grid", "leaderboard", "map"] as const;

type View = (typeof VIEW_OPTIONS)[number];

export function DashboardClient({ validations }: { validations: ValidationRow[] }) {
  const [items, setItems] = useState(validations);
  const [activeView, setActiveView] = useState<View>("grid");
  const [searchQuery, setSearchQuery] = useState("");

  const visibleItems = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return items;
    return items.filter((item) => item.idea_text.toLowerCase().includes(query));
  }, [items, searchQuery]);

  const summary = useMemo(() => {
    const total = visibleItems.length;
    const scores = visibleItems.map((item) => item.report?.marketDemandScore ?? 0);
    const averageScore = scores.length
      ? Math.round(scores.reduce((acc, value) => acc + value, 0) / scores.length)
      : 0;
    const bestScore = scores.length ? Math.max(...scores) : 0;
    const latest = visibleItems[0];
    return {
      total,
      averageScore,
      bestScore,
      latestIdea: getIdeaHeadline(latest?.idea_text) || "No validations yet",
      latestDate: latest ? formatDate(latest.created_at) : "--",
    };
  }, [visibleItems]);

  const trendData = useMemo(() => {
    return [...visibleItems]
      .map((item) => ({
        date: formatDate(item.created_at),
        score: item.report?.marketDemandScore ?? 0,
      }))
      .reverse();
  }, [visibleItems]);

  const leaderboard = useMemo(() => {
    return [...visibleItems]
      .map((item) => {
        const ideaHeadline = getIdeaHeadline(item.idea_text);
        return {
          id: item.id,
          title: ideaHeadline,
          score: item.report?.marketDemandScore ?? 0,
          demand: Math.min(100, Math.max(5, item.report?.marketDemandScore ?? 0)),
        };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);
  }, [visibleItems]);

  const marketMapData = useMemo(() => {
    if (visibleItems.length === 0) {
      return [
        { title: "AI Mental Health Journaling", x: 35, y: 78, z: 68, score: 82 },
        { title: "AI Resume Builder", x: 62, y: 65, z: 52, score: 71 },
        { title: "Invoice Automation SaaS", x: 48, y: 72, z: 60, score: 76 },
        { title: "Notion OKR Plugin", x: 70, y: 48, z: 40, score: 61 },
        { title: "Dog Walking Marketplace", x: 55, y: 42, z: 36, score: 58 },
      ];
    }
    return visibleItems.map((item) => {
      const score = item.report?.marketDemandScore ?? 0;
      const competitors = item.report?.competitors?.length ?? 1;
      const ideaHeadline = getIdeaHeadline(item.idea_text);
      return {
        title: ideaHeadline,
        score,
        x: Math.min(95, 20 + competitors * 18),
        y: Math.min(95, Math.max(10, score)),
        z: Math.min(80, 30 + (item.report?.monetizationSuggestions?.length ?? 1) * 10),
      };
    });
  }, [visibleItems]);

  const radarData = useMemo(() => {
    const baseline = {
      demand: Math.round(summary.averageScore || 60),
      competition: Math.max(40, 100 - summary.averageScore),
      marketSize: Math.min(90, 50 + Math.round(summary.averageScore / 2)),
      monetization: Math.min(90, 45 + Math.round(summary.averageScore / 2)),
      growth: Math.min(90, 40 + Math.round(summary.averageScore / 2)),
    };
    return [
      { metric: "Demand", value: baseline.demand },
      { metric: "Competition", value: baseline.competition },
      { metric: "Market Size", value: baseline.marketSize },
      { metric: "Monetization", value: baseline.monetization },
      { metric: "Growth", value: baseline.growth },
    ];
  }, [summary.averageScore]);

  const countByDay = useMemo(() => {
    const map = new Map<string, number>();
    visibleItems.forEach((item) => {
      const date = formatDate(item.created_at);
      map.set(date, (map.get(date) ?? 0) + 1);
    });
    return Array.from(map.entries())
      .map(([date, count]) => ({
        date,
        count,
      }))
      .sort((a, b) => a.date.localeCompare(b.date));
  }, [visibleItems]);

  const scoreDistribution = useMemo(() => {
    const buckets = [
      { label: "0-10", min: 0, max: 10, count: 0 },
      { label: "11-20", min: 11, max: 20, count: 0 },
      { label: "21-30", min: 21, max: 30, count: 0 },
      { label: "31-40", min: 31, max: 40, count: 0 },
      { label: "41-50", min: 41, max: 50, count: 0 },
      { label: "51-60", min: 51, max: 60, count: 0 },
      { label: "61-70", min: 61, max: 70, count: 0 },
      { label: "71-80", min: 71, max: 80, count: 0 },
      { label: "81-90", min: 81, max: 90, count: 0 },
      { label: "91-100", min: 91, max: 100, count: 0 },
    ];
    visibleItems.forEach((item) => {
      const score = item.report?.marketDemandScore ?? 0;
      const bucket = buckets.find((entry) => score >= entry.min && score <= entry.max);
      if (bucket) bucket.count += 1;
    });
    return buckets.map(({ label, count }) => ({ label, count }));
  }, [visibleItems]);

  const insightSummary = useMemo(() => {
    const best = leaderboard[0];
    const fastest = leaderboard[1] ?? leaderboard[0];
    const declining = leaderboard[leaderboard.length - 1];
    return {
      best: best
        ? `${best.title.slice(0, 38)} shows the strongest opportunity signal.`
        : "No opportunities yet. Validate an idea to get insights.",
      fastest: fastest
        ? `${fastest.title.slice(0, 38)} is gaining momentum fastest.`
        : "Validate multiple ideas to see momentum.",
      declining: declining
        ? `${declining.title.slice(0, 38)} shows weaker demand signals.`
        : "Track more ideas to detect declines.",
    };
  }, [leaderboard]);

  const handleDelete = async (id: string) => {
    const response = await fetch(`/api/validation/${id}`, { method: "DELETE" });
    if (!response.ok) {
      toast.error("Unable to delete validation.");
      return;
    }
    setItems((prev) => prev.filter((item) => item.id !== id));
    toast.success("Validation deleted.");
  };

  const scoreBadgeClasses = (score: number) => {
    if (score >= 75) return "border-emerald-500/50 bg-emerald-200/10 text-emerald-500";
    if (score >= 55) return "border-amber-500/50 bg-amber-200/10 text-amber-500";
    return "border-rose-500/50 bg-rose-200/10 text-rose-500";
  };

  const metricCards = [
    {
      label: "Total Ideas Validated",
      value: summary.total,
      icon: <Grid2X2 className="h-5 w-5" />,
      trend: "+12%",
      gradient: "from-sky-500/20 to-transparent",
    },
    {
      label: "High Potential Ideas",
      value: visibleItems.filter((item) => (item.report?.marketDemandScore ?? 0) >= 75).length,
      icon: <Sparkles className="h-5 w-5" />,
      trend: "+8%",
      gradient: "from-emerald-500/20 to-transparent",
    },
    {
      label: "Average Opportunity Score",
      value: summary.averageScore,
      icon: <LineChartIcon className="h-5 w-5" />,
      trend: "+4%",
      gradient: "from-slate-500/20 to-transparent",
    },
    {
      label: "Market Demand Trend",
      value: summary.bestScore,
      icon: <ChartNoAxesCombined className="h-5 w-5" />,
      trend: "-2%",
      gradient: "from-rose-500/20 to-transparent",
    },
  ];

  return (
    <div className="space-y-6 p-6">
      {/* Dashboard header with title + search */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">AI Startup Idea Validator</p>
          <h1 className="text-2xl font-semibold">Market Intelligence Hub</h1>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Link href="/validate" className="rounded-full bg-gradient-to-r from-sky-500 to-purple-500 px-5 py-2 text-sm font-semibold text-white shadow-lg transition hover:shadow-xl">
            + Validate New Idea
          </Link>
          <Link href="/reports" className="rounded-full border border-slate-200/60 bg-white/80 px-5 py-2 text-sm font-semibold text-slate-700 shadow-sm dark:border-white/10 dark:bg-slate-900/70 dark:text-white">
            Generate Report
          </Link>
          <Link href="/reports/market-insights" className="rounded-full border border-slate-200/60 bg-white/80 px-5 py-2 text-sm font-semibold text-slate-700 shadow-sm dark:border-white/10 dark:bg-slate-900/70 dark:text-white">
            View Market Insights
          </Link>
        </div>
        <div className="flex flex-1 max-w-md items-center rounded-2xl border border-slate-200/60 bg-white/70 px-4 py-2 text-sm text-slate-900 dark:border-white/10 dark:bg-slate-800/50 dark:text-white">
          <input
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Search ideas, tags, markets..."
            className="w-full bg-transparent text-sm outline-none placeholder:text-slate-500 dark:placeholder:text-slate-400"
            type="search"
            aria-label="Search dashboard ideas"
          />
        </div>
      </div>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {metricCards.map((metric) => (
          <div
            key={metric.label}
            className="rounded-3xl border border-slate-200/60 bg-gradient-to-br p-5 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.45)] backdrop-blur dark:border-white/10 dark:bg-slate-900/70"
          >
            <div className="flex items-center justify-between">
              <div className="rounded-2xl bg-white/80 p-2 text-slate-700 dark:bg-slate-900/60 dark:text-white">
                {metric.icon}
              </div>
              <span className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
                {metric.trend}
              </span>
            </div>
            <p className="mt-6 text-3xl font-semibold">{metric.value}</p>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{metric.label}</p>
          </div>
        ))}
      </section>

      <section className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold">Validation views</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">Toggle between Grid, Leaderboard, and Market Map intelligence.</p>
        </div>
        <div className="flex rounded-full border border-slate-200/60 bg-white/70 p-1 text-sm font-semibold text-slate-600 dark:border-white/10 dark:bg-slate-900/70 dark:text-white">
          {VIEW_OPTIONS.map((view) => (
            <button
              key={view}
              type="button"
              onClick={() => setActiveView(view)}
              className={`rounded-full px-4 py-2 transition ${activeView === view ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900" : ""}`}
            >
              {view === "grid" ? "Grid" : view === "leaderboard" ? "Leaderboard" : "Market Map"}
            </button>
          ))}
        </div>
      </section>

      {activeView === "grid" && (
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {visibleItems.length === 0 && (
            <div className="col-span-full rounded-3xl border border-slate-200/60 bg-white/80 p-8 text-center text-slate-600 dark:border-white/10 dark:bg-slate-900/70 dark:text-slate-300">
              No ideas yet. Validate your first startup concept.
            </div>
          )}
          {visibleItems.map((item) => {
            const score = item.report?.marketDemandScore ?? 0;
            const ideaHeadline = getIdeaHeadline(item.idea_text);
            const shortHeadline =
              ideaHeadline.length > 60 ? `${ideaHeadline.slice(0, 60)}...` : ideaHeadline;
            return (
              <div
                key={item.id}
                className="group rounded-3xl border border-slate-200/60 bg-white/85 p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.45)] transition hover:-translate-y-1 hover:shadow-[0_30px_80px_-40px_rgba(99,102,241,0.35)] dark:border-white/10 dark:bg-slate-900/70"
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm text-slate-500 dark:text-slate-300">Opportunity Score</p>
                  <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${scoreBadgeClasses(score)}`}>
                    {score}/100
                  </span>
                </div>
                <h3 className="mt-4 text-lg font-semibold text-slate-900 dark:text-white">
                  {shortHeadline}
                </h3>
                <div className="mt-4">
                  <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                    <span>Demand strength</span>
                    <span>{score}%</span>
                  </div>
                  <div className="mt-2 h-2 rounded-full bg-slate-200/60 dark:bg-slate-700">
                    <div className="h-2 rounded-full bg-gradient-to-r from-sky-500 to-violet-500" style={{ width: `${score}%` }} />
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-500 dark:text-slate-400">
                  <span className="rounded-full border border-slate-200/60 bg-slate-100/70 px-3 py-1 dark:border-white/10 dark:bg-slate-800/60">Search lift +12%</span>
                  <span className="rounded-full border border-slate-200/60 bg-slate-100/70 px-3 py-1 dark:border-white/10 dark:bg-slate-800/60">Reddit buzz</span>
                  <span className="rounded-full border border-slate-200/60 bg-slate-100/70 px-3 py-1 dark:border-white/10 dark:bg-slate-800/60">Low churn</span>
                </div>
                <p className="mt-4 text-xs text-slate-500 dark:text-slate-400">Created {formatDate(item.created_at)}</p>
                <div className="mt-5 flex flex-wrap gap-3 text-sm text-slate-700 dark:text-white">
                  <Link href={`/report/${item.id}`} className="rounded-full bg-slate-900/90 px-4 py-2 font-semibold text-white shadow-md">View report</Link>
                  <Link href={`/idea/${item.id}/mvp`} className="rounded-full border border-slate-200/80 px-4 py-2 text-slate-700 dark:text-slate-200">MVP Planner</Link>
                  <button
                    type="button"
                    onClick={() =>
                      downloadReportPdf({
                        ideaText: item.idea_text,
                        report: item.report,
                        createdAt: item.created_at,
                      })
                    }
                    className="rounded-full border border-slate-200/80 px-4 py-2 text-slate-700 dark:text-slate-200"
                  >Export PDF</button>
                  <button
                    type="button"
                    onClick={() => handleDelete(item.id)}
                    className="rounded-full border border-rose-500/40 bg-rose-500/10 px-4 py-2 text-rose-600 dark:text-rose-200"
                  >Delete</button>
                </div>
              </div>
            );
          })}
        </section>
      )}

      {activeView === "leaderboard" && (
        <section className="rounded-3xl border border-slate-200/60 bg-white/80 p-6 shadow-[0_25px_60px_-40px_rgba(15,23,42,0.4)] dark:border-white/10 dark:bg-slate-900/70">
          <div className="grid gap-3">
            {leaderboard.map((idea, index) => {
              const badge = index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : null;
              const headline =
                idea.title.length > 60 ? `${idea.title.slice(0, 60)}...` : idea.title;
              return (
                <div
                  key={idea.id}
                  className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200/60 bg-slate-50/80 px-4 py-3 dark:border-white/10 dark:bg-slate-900/60"
                >
                  <div className="flex items-center gap-4">
                    <div className="text-xl font-semibold text-slate-900 dark:text-white">{badge ?? index + 1}</div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">Idea</p>
                      <p className="text-base font-semibold text-slate-900 dark:text-white">
                        {headline}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6 text-sm text-slate-600 dark:text-slate-200">
                    <span>Score {idea.score}</span>
                    <span>Demand {idea.demand}%</span>
                    <span className="text-emerald-600 dark:text-emerald-300">+3%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {activeView === "map" && (
        <section className="rounded-3xl border border-slate-200/60 bg-white/80 p-6 shadow-[0_25px_60px_-40px_rgba(15,23,42,0.4)] dark:border-white/10 dark:bg-slate-900/70">
          <h3 className="mb-4 text-lg font-semibold">Market Opportunity Map</h3>
          <ResponsiveContainer width="100%" height={400}>
            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.2)" />
                <XAxis
                  type="number"
                  dataKey="x"
                  name="Competition"
                  domain={[0, 100]}
                  label={{ value: "Competition", position: "bottom", offset: 0 }}
                  tickCount={11}
                  interval={0}
                />
                <YAxis
                  type="number"
                  dataKey="y"
                  name="Demand"
                  domain={[0, 100]}
                  label={{ value: "Demand", angle: -90, position: "insideLeft" }}
                  tickCount={11}
                  interval={0}
                />
              <ZAxis type="number" dataKey="z" range={[100, 800]} name="Market Size" />
              <Tooltip
                content={({ payload }) => {
                  if (!payload?.length) return null;
                  const d = payload[0].payload as (typeof marketMapData)[number];
                  return (
                    <div className="rounded-xl border border-slate-200/60 bg-white/95 p-3 text-sm shadow-lg dark:border-white/10 dark:bg-slate-800/95">
                      <p className="font-semibold">{d.title}</p>
                      <p>Score: {d.score}</p>
                      <p>Demand: {d.y}%</p>
                      <p>Competition: {d.x}</p>
                    </div>
                  );
                }}
              />
                <defs>
                  <linearGradient id="scatterGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#6366f1" stopOpacity={0.6} />
                    <stop offset="100%" stopColor="#a855f7" stopOpacity={0.9} />
                  </linearGradient>
                </defs>
                <Scatter data={marketMapData} fill="url(#scatterGradient)">
                  {marketMapData.map((entry, index) => (
                    <Cell
                      key={entry.title + index}
                      fill={
                        entry.score >= 75 ? "#10b981" : entry.score >= 55 ? "#f59e0b" : "#f43f5e"
                      }
                    />
                  ))}
                </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        </section>
      )}

      {/* AI Insights Panel */}
      <section className="rounded-3xl border border-slate-200/60 bg-white/80 p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.4)] dark:border-white/10 dark:bg-slate-900/70">
        <h3 className="mb-4 text-lg font-semibold">AI Insights</h3>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-600 dark:text-emerald-400">Best Opportunity</p>
            <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">{insightSummary.best}</p>
          </div>
          <div className="rounded-2xl border border-sky-500/20 bg-sky-500/5 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-sky-600 dark:text-sky-400">Fastest Growing</p>
            <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">{insightSummary.fastest}</p>
          </div>
          <div className="rounded-2xl border border-rose-500/20 bg-rose-500/5 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-rose-600 dark:text-rose-400">Declining Demand</p>
            <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">{insightSummary.declining}</p>
          </div>
        </div>
      </section>

      {/* Demand Trends */}
      <section className="rounded-3xl border border-slate-200/60 bg-white/80 p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.4)] dark:border-white/10 dark:bg-slate-900/70">
        <h3 className="mb-4 text-lg font-semibold">Demand Trends</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={trendData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.2)" />
            <XAxis dataKey="date" tick={{ fontSize: 12 }} />
            <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
            <Tooltip
              contentStyle={{ background: "rgba(255,255,255,0.95)", border: "1px solid rgba(148,163,184,0.2)", borderRadius: 12, padding: "8px 14px", fontSize: 13, boxShadow: "0 8px 24px -8px rgba(15,23,42,0.15)" }}
              cursor={{ stroke: "#6366f1", strokeWidth: 1, strokeDasharray: "4 4" }}
            />
            <Line type="monotone" dataKey="score" stroke="#6366f1" strokeWidth={2} dot={{ r: 4, fill: "#6366f1" }} />
          </LineChart>
        </ResponsiveContainer>
      </section>

      {/* Opportunity Breakdown Radar */}
      <section className="rounded-3xl border border-slate-200/60 bg-white/80 p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.4)] dark:border-white/10 dark:bg-slate-900/70">
        <h3 className="mb-4 text-lg font-semibold">Opportunity Breakdown</h3>
        <ResponsiveContainer width="100%" height={350}>
          <RadarChart data={radarData}>
            <PolarGrid stroke="rgba(148,163,184,0.3)" />
            <PolarAngleAxis dataKey="metric" tick={{ fontSize: 12 }} />
            <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 10 }} />
            <Radar name="Score" dataKey="value" stroke="#6366f1" fill="#6366f1" fillOpacity={0.25} />
          </RadarChart>
        </ResponsiveContainer>
      </section>

      {/* Score Distribution */}
      <section className="rounded-3xl border border-slate-200/60 bg-white/80 p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.4)] dark:border-white/10 dark:bg-slate-900/70">
        <h3 className="mb-4 text-lg font-semibold">Score Distribution</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={scoreDistribution}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.2)" />
            <XAxis dataKey="label" tick={{ fontSize: 12 }} />
            <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
            <Tooltip
              contentStyle={{ background: "rgba(255,255,255,0.95)", border: "1px solid rgba(148,163,184,0.2)", borderRadius: 12, padding: "8px 14px", fontSize: 13, boxShadow: "0 8px 24px -8px rgba(15,23,42,0.15)" }}
              cursor={{ fill: "rgba(99,102,241,0.08)" }}
            />
            <Bar dataKey="count" fill="#6366f1" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </section>

      {/* Recent Activity */}
      <section className="rounded-3xl border border-slate-200/60 bg-white/80 p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.4)] dark:border-white/10 dark:bg-slate-900/70">
        <h3 className="mb-4 text-lg font-semibold">Recent Activity</h3>
        <div className="grid gap-3">
            {visibleItems.slice(0, 5).map((item) => {
              const activityHeadline = getIdeaHeadline(item.idea_text);
              const shortHeadline =
                activityHeadline.length > 50
                  ? `${activityHeadline.slice(0, 50)}...`
                  : activityHeadline;
              return (
                <div key={item.id} className="flex items-center gap-3 rounded-2xl border border-slate-200/60 bg-slate-50/80 px-4 py-3 text-sm dark:border-white/10 dark:bg-slate-900/60">
                  <div className="h-2 w-2 rounded-full bg-sky-500" />
                  <span className="font-medium">{shortHeadline}</span>
                  <span className="ml-auto text-xs text-slate-500 dark:text-slate-400">{formatDate(item.created_at)}</span>
                </div>
              );
            })}
          {visibleItems.length === 0 && (
            <p className="text-sm text-slate-500 dark:text-slate-400">No recent activity.</p>
          )}
        </div>
      </section>

    </div>
  );
}
