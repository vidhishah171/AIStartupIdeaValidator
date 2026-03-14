"use client";

import Link from "next/link";
import { useState } from "react";
import { cn } from "@/lib/utils";

type BillingCycle = "monthly" | "yearly";

const plans = [
  {
    name: "Free",
    badge: "Get started",
    description: "Get started with core validation tools.",
    price: { monthly: "Free", yearly: "Free" },
    features: [
      "3 idea validations per month",
      "Basic market insights",
      "Startup validation report",
      "Opportunity score",
      "Limited access to features",
    ],
    action: { label: "Start for Free", tone: "outline" as const },
  },
  {
    name: "Pro",
    badge: "Most popular",
    description: "For founders validating ideas every week.",
    price: { monthly: "$12/m", yearly: "$120/yr" },
    features: [
      "Unlimited idea validations",
      "Advanced market insights",
      "AI startup analysis",
      "PDF report export",
      "Idea comparison tool",
      "MVP feature planner",
      "Validation experiments",
      "Go-to-market strategy playbooks",
    ],
    action: { label: "Upgrade to Pro", tone: "primary" as const },
  },
  {
    name: "Team / Accelerators",
    badge: "Custom",
    description: "Collaborative workflows for teams and cohorts.",
    price: { monthly: "Custom", yearly: "Custom" },
    features: [
      "Everything in Pro",
      "Team workspace",
      "Shared startup idea library",
      "Multiple user accounts",
      "Batch idea validation",
      "Reports for startup cohorts",
      "Priority support",
    ],
    action: { label: "Contact Sales", tone: "outline" as const },
  },
];

export function PricingPlans() {
  const [billingCycle, setBillingCycle] = useState<BillingCycle>("monthly");

  return (
    <section className="mx-auto w-full max-w-none px-6 py-16 dark:bg-slate-950/20">
      <div className="mx-auto mb-10 max-w-4xl text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.4em] text-slate-500">
          Pricing
        </p>
        <h2 className="mt-3 text-4xl font-semibold text-slate-900 dark:text-white">
          Plans for every stage of your idea journey
        </h2>
        <p className="mt-3 text-base text-muted-foreground dark:text-slate-300">
          Choose a plan that matches your validation cadence, whether you're
          just exploring ideas or running an accelerator-ready program.
        </p>
        <div className="mt-6 inline-flex rounded-full border border-border bg-card p-1 text-sm font-semibold text-slate-600 dark:border-white/30 dark:bg-slate-900/60 dark:text-slate-200">
          <button
            type="button"
            onClick={() => setBillingCycle("monthly")}
            className={cn(
              "w-24 rounded-full px-4 py-2 transition",
              billingCycle === "monthly"
                ? "bg-slate-900 text-white"
                : "text-slate-500"
            )}
          >
            Monthly
          </button>
          <button
            type="button"
            onClick={() => setBillingCycle("yearly")}
            className={cn(
              "w-24 rounded-full px-4 py-2 transition",
              billingCycle === "yearly"
                ? "bg-slate-900 text-white"
              : "text-slate-500"
            )}
          >
            Yearly
          </button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {plans.map((plan) => {
          const isHighlighted = plan.name === "Pro";
          const priceLabel = plan.price[billingCycle];
          return (
            <article
              key={plan.name}
          className={cn(
            "flex flex-col gap-6 rounded-3xl border p-6 shadow-[0_20px_70px_-30px_rgba(15,23,42,0.45)]",
            isHighlighted
              ? "border-indigo-100 bg-white/90 shadow-[0_30px_90px_-30px_rgba(99,102,241,0.3)] dark:border-indigo-600/30 dark:bg-slate-900/50"
              : "glass-card border-border/60 dark:border-white/10 dark:bg-slate-900/50"
          )}
        >
          <div className="flex items-center justify-between gap-4">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-500">
              {plan.badge}
            </p>
                {plan.name === "Pro" && (
                  <span className="rounded-full border border-slate-200/70 px-3 py-1 text-xs font-semibold text-slate-700">
                    Most popular
                  </span>
                )}
              </div>
              <div>
                <p className="text-2xl font-semibold text-slate-900">{plan.name}</p>
              <p className="mt-1 text-sm text-muted-foreground dark:text-slate-300">
                {plan.description}
              </p>
              <p className="mt-4 text-3xl font-semibold text-slate-900 dark:text-white">
                {priceLabel}
              </p>
            </div>
            <ul className="space-y-2 text-sm text-slate-600">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-indigo-500" />
                    {feature}
                  </li>
                ))}
              </ul>
                <Link
                  href="/login"
                  className={cn(
                    "w-full rounded-2xl px-4 py-3 text-base font-semibold transition",
                    plan.action.tone === "primary"
                      ? "bg-indigo-600 text-white hover:-translate-y-0.5"
                      : "border border-border bg-card text-foreground hover:-translate-y-0.5 dark:border-white/20 dark:bg-slate-900/50 dark:text-white"
                  )}
                >
                  {plan.action.label}
                </Link>
              </article>
            );
          })}
      </div>
    </section>
  );
}
