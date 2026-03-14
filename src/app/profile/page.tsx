import { redirect } from "next/navigation";
import Link from "next/link";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  Zap,
  FileText,
  ArrowRight,
  Lightbulb,
  BarChart3,
  Clock,
  Shield,
  CreditCard,
  Mail,
  CalendarDays,
} from "lucide-react";

type PlanEntry = {
  name: string;
  status: "active" | "past_due" | "canceled" | "trialing";
  startedAt: string;
  renewsAt?: string;
};

export default async function ProfilePage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const metadata = user.user_metadata ?? {};

  // Read plan from DB
  const { data: planRow } = await supabase
    .from("user_plans")
    .select("plan, updated_at")
    .eq("user_id", user.id)
    .maybeSingle();

  const currentPlan = planRow?.plan
    ? planRow.plan.charAt(0).toUpperCase() + planRow.plan.slice(1)
    : "Free";

  const purchasedPlans: PlanEntry[] = [
    {
      name: currentPlan,
      status: "active",
      startedAt: planRow?.updated_at
        ? new Date(planRow.updated_at).toLocaleDateString("en-US", {
          month: "short",
          day: "2-digit",
          year: "numeric",
        })
        : new Date(user.created_at).toLocaleDateString("en-US", {
          month: "short",
          day: "2-digit",
          year: "numeric",
        }),
      renewsAt: "Renews monthly",
    },
  ];

  // Fetch usage stats
  const { data: usageRow } = await supabase
    .from("usage_counts")
    .select("count, reset_at")
    .eq("user_id", user.id)
    .maybeSingle();

  const monthlyUsed = usageRow?.count ?? 8;
  const monthlyLimit = currentPlan === "Pro" ? "Unlimited" : "3";
  const resetDate = usageRow?.reset_at
    ? new Date(usageRow.reset_at).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    })
    : "—";

  // Fetch total validations + recent 5
  const { count: totalValidations } = await supabase
    .from("validations")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id);

  const { data: recentValidations } = await supabase
    .from("validations")
    .select("id, idea_text, report, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(5);

  const displayName = metadata.full_name ?? "Individual";
  const initials = displayName
    .split(" ")
    .map((w: string) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const isPro = currentPlan === "Pro";

  return (
    <section className="min-h-screen w-full px-4 py-10 sm:px-6 lg:px-10">
      <div className="mx-auto flex max-w-5xl flex-col gap-10">
        {/* Profile Hero */}
        <div className="flex flex-col items-center text-center sm:flex-row sm:items-start sm:text-left sm:gap-6">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-indigo-500 to-violet-600 text-2xl font-bold text-white shadow-lg">
            {initials}
          </div>
          <div className="mt-4 sm:mt-0">
            <div className="flex flex-wrap items-center justify-center gap-3 sm:justify-start">
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                {displayName}
              </h1>
              <span className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider ${isPro ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300" : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"}`}>
                {currentPlan}
              </span>
            </div>
            <p className="mt-1 text-sm text-slate-500">{user.email}</p>
            <p className="mt-0.5 text-xs text-slate-400">
              Joined {new Date(user.created_at).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
            </p>
          </div>
        </div>

        {/* Stats Strip */}
        <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-slate-200/70 bg-slate-200/70 shadow-sm dark:border-white/10 dark:bg-white/5 sm:grid-cols-4">
          {[
            { label: "This month", value: isPro ? `${monthlyUsed}` : `${monthlyUsed}/${monthlyLimit}` },
            { label: "All time", value: `${totalValidations ?? 0}` },
            { label: "Plan", value: currentPlan },
            { label: "Resets", value: resetDate },
          ].map((s) => (
            <div key={s.label} className="bg-white/90 px-5 py-4 dark:bg-slate-900/80">
              <p className="text-xs font-medium uppercase tracking-wider text-slate-400">{s.label}</p>
              <p className="mt-1 text-xl font-bold text-slate-900 dark:text-white">{s.value}</p>
            </div>
          ))}
        </div>

        {/* Main Grid */}
        <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
          {/* Left — Recent Validations */}
          <div>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Recent validations</h2>
              <Link href="/reports" className="text-xs font-semibold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400">
                View all →
              </Link>
            </div>

            {recentValidations && recentValidations.length > 0 ? (
              <div className="mt-4 space-y-2">
                {recentValidations.map((v: { id: string; idea_text: string; report: { marketDemandScore?: number }; created_at: string }) => {
                  const vScore = v.report?.marketDemandScore ?? 0;
                  const scoreColor =
                    vScore >= 75
                      ? "text-emerald-700 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-950/40"
                      : vScore >= 50
                        ? "text-amber-700 bg-amber-50 dark:text-amber-400 dark:bg-amber-950/40"
                        : "text-rose-700 bg-rose-50 dark:text-rose-400 dark:bg-rose-950/40";
                  return (
                    <Link
                      key={v.id}
                      href={`/report/${v.id}`}
                      className="group flex items-center gap-3 rounded-xl border border-slate-100 bg-white/80 px-4 py-3 transition hover:border-indigo-200 hover:bg-white dark:border-white/5 dark:bg-slate-900/50 dark:hover:border-indigo-500/30"
                    >
                      <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-xs font-bold ${scoreColor}`}>
                        {vScore}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-slate-800 dark:text-white">
                          {v.idea_text.length > 70 ? `${v.idea_text.slice(0, 70)}…` : v.idea_text}
                        </p>
                        <p className="mt-0.5 flex items-center gap-1 text-xs text-slate-400">
                          <Clock className="h-3 w-3" />
                          {new Date(v.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                        </p>
                      </div>
                      <ArrowRight className="h-4 w-4 shrink-0 text-slate-300 transition group-hover:text-indigo-500 group-hover:translate-x-0.5" />
                    </Link>
                  );
                })}
              </div>
            ) : (
              <div className="mt-4 flex flex-col items-center rounded-xl border border-dashed border-slate-200 py-10 dark:border-white/10">
                <Lightbulb className="h-8 w-8 text-slate-300 dark:text-slate-600" />
                <p className="mt-2 text-sm text-slate-500">No validations yet</p>
                <Link href="/validate" className="mt-3 text-xs font-semibold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400">
                  Validate your first idea →
                </Link>
              </div>
            )}

            {/* Quick Actions */}
            <h2 className="mt-10 text-lg font-semibold text-slate-900 dark:text-white">Quick actions</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {[
                { icon: Lightbulb, title: "Validate", href: "/validate", color: "text-indigo-600 bg-indigo-50 dark:text-indigo-400 dark:bg-indigo-950/40" },
                { icon: FileText, title: "Reports", href: "/reports", color: "text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-950/40" },
                { icon: BarChart3, title: "Dashboard", href: "/dashboard", color: "text-violet-600 bg-violet-50 dark:text-violet-400 dark:bg-violet-950/40" },
              ].map((a) => (
                <Link
                  key={a.title}
                  href={a.href}
                  className="group flex flex-col items-center rounded-xl border border-slate-100 bg-white/80 py-5 transition hover:border-indigo-200 hover:shadow-md dark:border-white/5 dark:bg-slate-900/50 dark:hover:border-indigo-500/30"
                >
                  <div className={`rounded-xl p-2.5 ${a.color}`}>
                    <a.icon className="h-5 w-5" />
                  </div>
                  <p className="mt-2 text-sm font-semibold text-slate-700 dark:text-slate-200">{a.title}</p>
                </Link>
              ))}
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="flex flex-col gap-6">
            {/* Account Details */}
            <div className="rounded-2xl border border-slate-200/70 bg-white/90 p-5 dark:border-white/10 dark:bg-slate-900/70">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Account</h3>
              <div className="mt-4 space-y-3">
                {[
                  { icon: Mail, label: "Email", value: user.email ?? "—" },
                  { icon: Shield, label: "Verified", value: user.email_confirmed_at ? "Yes" : "Pending" },
                  { icon: CalendarDays, label: "Joined", value: new Date(user.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) },
                ].map((row) => (
                  <div key={row.label} className="flex items-center gap-3">
                    <row.icon className="h-4 w-4 shrink-0 text-slate-400" />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs text-slate-400">{row.label}</p>
                      <p className="truncate text-sm text-slate-700 dark:text-slate-200">{row.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Plan Card */}
            <div className={`rounded-2xl border p-5 ${isPro ? "border-indigo-200 bg-indigo-50/60 dark:border-indigo-500/20 dark:bg-indigo-950/20" : "border-slate-200/70 bg-white/90 dark:border-white/10 dark:bg-slate-900/70"}`}>
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                  <CreditCard className="mr-1.5 inline h-4 w-4 text-slate-400" />
                  Plan
                </h3>
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${isPro ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300" : "bg-emerald-100 text-emerald-700"}`}>
                  {purchasedPlans[0].status}
                </span>
              </div>
              <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">{currentPlan}</p>
              <div className="mt-3 space-y-1 text-xs text-slate-500">
                <p>Started: {purchasedPlans[0].startedAt}</p>
                {purchasedPlans[0].renewsAt && <p>{purchasedPlans[0].renewsAt}</p>}
                <p>{isPro ? "Unlimited validations" : `${monthlyUsed} of 3 used this month`}</p>
              </div>
              {!isPro && (
                <Link
                  href="/pricing"
                  className="mt-4 flex w-full items-center justify-center rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-500"
                >
                  Upgrade to Pro
                </Link>
              )}
            </div>

            {/* Usage Meter */}
            <div className="flex-1 rounded-2xl border border-slate-200/70 bg-white/90 p-5 dark:border-white/10 dark:bg-slate-900/70">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                <Zap className="mr-1.5 inline h-4 w-4 text-amber-500" />
                Usage
              </h3>
              <div className="mt-auto pt-6">
                <div className="flex items-end justify-between text-xs text-slate-500">
                  <span>{monthlyUsed} validation{monthlyUsed !== 1 ? "s" : ""} used</span>
                  <span>{isPro ? "∞" : monthlyLimit}</span>
                </div>
                <div className="mt-4 h-2 rounded-full bg-slate-100 dark:bg-slate-800">
                  <div
                    className="h-2 rounded-full bg-linear-to-r from-indigo-500 to-violet-500 transition-all"
                    style={{ width: isPro ? "30%" : `${Math.min((monthlyUsed / 3) * 100, 100)}%` }}
                  />
                </div>
                <p className="mt-2 text-xs text-slate-400">Resets {resetDate}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
