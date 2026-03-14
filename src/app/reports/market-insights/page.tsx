import { redirect } from "next/navigation";
import { ComponentType, type SVGProps } from "react";
import {
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  Compass,
  Layers,
  MapPin,
  Shield,
  Signal,
  Sparkles,
  TrendingUp,
  Users,
} from "lucide-react";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { MarketTrendSparkline, type TrendDatum } from "@/components/market-trend-sparkline";

const demandTrend: TrendDatum[] = [
  { period: "Oct", demand: 52 },
  { period: "Nov", demand: 61 },
  { period: "Dec", demand: 68 },
  { period: "Jan", demand: 73 },
  { period: "Feb", demand: 76 },
  { period: "Mar", demand: 78 },
  { period: "Apr", demand: 82 },
];

const competitors = [
  {
    name: "AutoPitch Studio",
    positioning: "AI-assisted pitch builder for agencies, highlighting go-to-market narratives.",
    strength: "Strong presentation layer, limited integrations.",
  },
  {
    name: "Freelancer Flow",
    positioning: "Workflow automation marketplace for gig workers and solo founders.",
    strength: "High brand recognition, premium pricing (~$249/mo).",
  },
  {
    name: "SignalStack",
    positioning: "Data-backed idea validation for angel investors and small studios.",
    strength: "Robust analytics, slower pace for early-stage validation.",
  },
];

const customerInsights = [
  "Independent consultants who need automated positioning briefs; they pay for monthly seats ($149–$199) and value rapid personalization.",
  "Product leads at niche SaaS firms seeking quick heat checks; they prefer self-serve plans with transparent usage caps and are comfortable testing $299 pilot credits.",
  "Agency owners delivering research to clients; they expect collaboration features and justify multi-user seats if ROI can be shown within two weeks.",
];

const riskIndicators = [
  "High density of automation tools copying similar validation prompts, making differentiation harder.",
  "Market saturation among freelancer-facing dashboards where user attention is stretched thin.",
  "Regulatory scrutiny around AI claims in finance/health verticals can slow onboarding.",
  "Dependency on search engine trends; a sudden algorithm change would compress early signal visibility.",
];

const trendSignals = [
  {
    text: "Google Trends shows a 44% uplift in “AI idea validation” searches over the last quarter.",
    direction: "up",
  },
  {
    text: "Reddit freelance and indie hacker threads now mention “automation validation” daily.",
    direction: "up",
  },
  {
    text: "Three new competitor launches focused on pitch-first workflows in February.",
    direction: "down",
  },
];

type SectionHeaderProps = {
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  title: string;
  subtitle?: string;
};

function SectionHeader({ icon: Icon, title, subtitle }: SectionHeaderProps) {
  return (
    <div className="flex items-center gap-2">
      <Icon className="h-5 w-5 text-slate-500" />
      <div>
        <p className="text-base font-semibold text-slate-900 dark:text-white">{title}</p>
        {subtitle && <p className="text-xs font-medium text-slate-500">{subtitle}</p>}
      </div>
    </div>
  );
}

export default async function MarketInsightsPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <section className="min-h-screen w-full px-4 py-10 sm:px-6 lg:px-10 text-base">
      <div className="mx-auto flex max-w-[1400px] flex-col gap-8">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">Report snapshot</p>
          <h1 className="text-4xl font-semibold">Market Insights</h1>
          <p className="max-w-3xl text-sm text-muted-foreground">
            An at-a-glance summary of demand, emerging trends, competition, and the risk profile within the AI startup idea validation market.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-[28px] border border-slate-200/70 bg-white/80 p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.9)] dark:border-white/10 dark:bg-slate-900/70">
            <SectionHeader icon={Signal} title="Market Demand Overview" subtitle="Demand strength · 78%" />
            <div className="mt-4 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-full rounded-full bg-slate-200/70 dark:bg-white/10">
                  <div className="h-3 rounded-full bg-emerald-500" style={{ width: "78%" }} />
                </div>
                <span className="text-sm font-semibold text-emerald-600">78%</span>
                <span className="rounded-full bg-emerald-50 px-3 py-0.5 text-xs font-semibold text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">
                  Strong signal
                </span>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                The freelance economy is expanding rapidly, boosting demand for automation tools that reduce manual ideation work and accelerate go-to-market analysis.
              </p>
              <ul className="space-y-1 text-sm text-slate-600 dark:text-slate-300">
                <li>70% of recent validations originate from consultants and indie teams.</li>
                <li>Founders cite faster evidence-based positioning as a top motivator.</li>
              </ul>
            </div>
          </div>

          <div className="rounded-[28px] border border-slate-200/70 bg-white/80 p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.9)] dark:border-white/10 dark:bg-slate-900/70">
            <SectionHeader icon={TrendingUp} title="Market Trends" subtitle="Rolling 7-month momentum" />
            <div className="mt-4 space-y-4">
              <MarketTrendSparkline data={demandTrend} />
              <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-200">
                {trendSignals.map((signal) => {
                  const Icon = signal.direction === "up" ? ArrowUpRight : ArrowDownRight;
                  const iconClassName =
                    signal.direction === "up"
                      ? "mt-0.5 h-4 w-4 text-emerald-500 dark:text-emerald-400"
                      : "mt-0.5 h-4 w-4 text-rose-500 dark:text-rose-300";
                  return (
                    <li key={signal.text} className="flex items-start gap-2">
                      <Icon className={iconClassName} />
                      <span>{signal.text}</span>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {competitors.map((competitor) => (
            <article
              key={competitor.name}
              className="flex flex-col gap-3 rounded-[28px] border border-slate-200/70 bg-white/80 p-5 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.9)] dark:border-white/10 dark:bg-slate-900/70"
            >
              <SectionHeader icon={Layers} title={competitor.name} subtitle="Competitive positioning" />
              <p className="text-sm text-slate-600 dark:text-slate-300">{competitor.positioning}</p>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-300">{competitor.strength}</p>
            </article>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-[28px] border border-slate-200/70 bg-white/80 p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.9)] dark:border-white/10 dark:bg-slate-900/70">
            <SectionHeader icon={Users} title="Target Customer Insights" subtitle="Segments & buying behavior" />
            <ul className="mt-4 space-y-3 text-sm text-slate-600 dark:text-slate-300">
              {customerInsights.map((insight) => (
                <li key={insight} className="flex gap-2">
                  <MapPin className="mt-0.5 h-4 w-4 text-slate-400" />
                  <p>{insight}</p>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-[28px] border border-slate-200/70 bg-white/80 p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.9)] dark:border-white/10 dark:bg-slate-900/70">
            <SectionHeader icon={Sparkles} title="Opportunity Gaps" subtitle="Unmet needs" />
            <p className="mt-4 text-sm text-slate-600 dark:text-slate-300">
              Founders still struggle with stitching together real-time market signals, analyst notes, and investor expectations in one narrative.
            </p>
            <div className="mt-4 rounded-2xl border border-amber-300 bg-amber-50/80 p-4 text-sm text-amber-900 dark:border-amber-400/60 dark:bg-amber-500/10">
              <p className="font-semibold">Callout</p>
              <p className="mt-1 text-xs">
                Build a workflow that auto-generates a competitive moat map plus suggested pricing tiers. Early testers want a “confidence score” they can point to investors.
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-[28px] border border-slate-200/70 bg-white/80 p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.9)] dark:border-white/10 dark:bg-slate-900/70">
          <SectionHeader icon={Shield} title="Risk Indicators" subtitle="Key watch items" />
          <ul className="mt-4 grid gap-2 text-sm text-slate-600 dark:text-slate-300">
            {riskIndicators.map((risk) => (
              <li key={risk} className="flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 text-rose-500" />
                <p>{risk}</p>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-wrap items-center justify-between rounded-[28px] border border-slate-200/70 bg-slate-50/80 p-4 text-xs text-slate-500 dark:border-white/10 dark:bg-slate-900/50">
          <div className="flex items-center gap-1">
            <Compass className="h-4 w-4" />
            <span>Next signal refresh: March 21, 2026</span>
          </div>
          <span className="text-right">Source: Internal signal engine · Automated weekly sync</span>
        </div>
      </div>
    </section>
  );
}
