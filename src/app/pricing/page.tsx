"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Check, Sparkles, Users, Rocket, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

type BillingCycle = "monthly" | "yearly";
type PlanName = "free" | "pro" | "team";

const plans = [
  {
    id: "free",
    name: "Free",
    price: { monthly: "Free", yearly: "Free" },
    description: "Get started with core validation tools.",
    features: [
      "3 idea validations per month",
      "Basic market insights",
      "Startup validation report",
      "Opportunity score",
      "Limited access to features",
    ],
    cta: "Start for Free",
    highlight: false,
    icon: Rocket,
  },
  {
    id: "pro",
    name: "Pro",
    price: { monthly: "$12", yearly: "$120" },
    description: "For founders validating ideas every week.",
    features: [
      "Unlimited idea validations",
      "Advanced market insights",
      "AI startup analysis",
      "PDF report export",
      "Idea comparison tool",
      "MVP feature planner",
      "Validation experiments",
      "Go-to-market strategy",
    ],
    cta: "Upgrade to Pro",
    badge: "Most Popular",
    highlight: true,
    icon: Sparkles,
  },
  {
    id: "team",
    name: "Team / Accelerators",
    price: { monthly: "Custom", yearly: "Custom" },
    description: "Collaborative workflows for teams and cohorts.",
    features: [
      "Everything in Pro",
      "Team workspace",
      "Shared startup idea library",
      "Multiple user accounts",
      "Batch idea validation",
      "Reports for startup cohorts",
      "Priority support",
    ],
    cta: "Contact Sales",
    highlight: false,
    icon: Users,
  },
];

const faqs = [
  {
    question: "What is a startup validation?",
    answer:
      "It is a structured analysis of your idea, including market demand, competition, and risk factors to help you decide what to build next.",
  },
  {
    question: "How many ideas can I validate?",
    answer:
      "Free plans include 3 validations per month. Pro plans have unlimited validations and advanced analysis tools.",
  },
  {
    question: "Can teams collaborate?",
    answer:
      "Yes. The Team plan adds shared workspaces, multiple accounts, and cohort reporting for accelerators.",
  },
  {
    question: "Do you offer discounts for accelerators?",
    answer:
      "We provide custom pricing for accelerators and startup programs. Contact sales to tailor a plan.",
  },
];

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<BillingCycle>("monthly");
  const [currentPlan, setCurrentPlan] = useState<PlanName>("free");
  const [isAuthed, setIsAuthed] = useState(false);
  const [isLoadingPlan, setIsLoadingPlan] = useState(true);
  const [processingPlan, setProcessingPlan] = useState<PlanName | null>(null);
  const [showContact, setShowContact] = useState(false);
  const [isSendingContact, setIsSendingContact] = useState(false);
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    company: "",
    role: "",
    teamSize: "",
    message: "",
  });
  const router = useRouter();

  const yearLabel = useMemo(
    () => (billingCycle === "yearly" ? "year" : "month"),
    [billingCycle]
  );

  useEffect(() => {
    const supabase = createSupabaseBrowserClient();
    supabase.auth.getSession().then(({ data }) => {
      const authed = Boolean(data.session);
      setIsAuthed(authed);
      if (!authed) {
        setIsLoadingPlan(false);
        setCurrentPlan("free");
        return;
      }
      fetch("/api/billing/plan")
        .then(async (res) => {
          const payload = await res.json();
          if (res.ok && payload.plan) {
            setCurrentPlan(payload.plan);
          }
        })
        .finally(() => setIsLoadingPlan(false));
    });
  }, []);

  const handlePlanAction = async (plan: PlanName) => {
    if (!isAuthed) {
      router.push("/login");
      return;
    }

    if (plan === "team") {
      setShowContact(true);
      return;
    }

    if (currentPlan === plan) {
      toast.message("You are already on this plan.");
      return;
    }

    setProcessingPlan(plan);
    try {
      await new Promise((resolve) => setTimeout(resolve, 900));
      const response = await fetch("/api/billing/plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(plan),
      });
      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.error ?? "Unable to update plan.");
      }
      setCurrentPlan(plan);
      toast.success(
        plan === "pro"
          ? "Payment successful. You're now on Pro."
          : "Plan updated successfully."
      );
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Unable to update plan."
      );
    } finally {
      setProcessingPlan(null);
    }
  };

  const handleContactSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSendingContact(true);
    try {
      const response = await fetch("/api/contact-sales", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(contactForm),
      });
      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.error ?? "Unable to send request.");
      }
      toast.success("Thanks! Our team will reach out shortly.");
      setShowContact(false);
      setContactForm({
        name: "",
        email: "",
        company: "",
        role: "",
        teamSize: "",
        message: "",
      });
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Unable to send request."
      );
    } finally {
      setIsSendingContact(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-none px-6 py-16">
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.4em] text-slate-400">
          Pricing
        </p>
        <h1 className="mt-3 text-4xl font-semibold text-slate-900 dark:text-white">
          Freemium for founders. Pro for momentum. Team for accelerators.
        </h1>
        <p className="mt-4 text-base text-muted-foreground">
          Freemium (3 validations/month free) | Pro plan ($12/month) for unlimited
          validations | Team plan for accelerators and incubators
        </p>
      </div>

      <div className="mt-8 flex items-center justify-center gap-3">
        <span
          className={cn(
            "text-sm font-medium",
            billingCycle === "monthly" ? "text-slate-900 dark:text-white" : "text-muted-foreground"
          )}
        >
          Monthly
        </span>
        <button
          type="button"
          role="switch"
          aria-checked={billingCycle === "yearly"}
          onClick={() =>
            setBillingCycle((prev) => (prev === "monthly" ? "yearly" : "monthly"))
          }
          className={cn(
            "relative inline-flex h-7 w-12 items-center rounded-full border border-border/70 transition",
            billingCycle === "yearly" ? "bg-indigo-600" : "bg-slate-200/80"
          )}
        >
          <span
            className={cn(
              "inline-block h-5 w-5 transform rounded-full bg-white shadow transition",
              billingCycle === "yearly" ? "translate-x-6" : "translate-x-1"
            )}
          />
        </button>
        <span
          className={cn(
            "text-sm font-medium",
            billingCycle === "yearly" ? "text-slate-900 dark:text-white" : "text-muted-foreground"
          )}
        >
          Yearly
        </span>
        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-200">
          Save 2 months
        </span>
      </div>

      <div className="mt-12 grid gap-6 lg:grid-cols-3">
        {plans.map((plan) => {
          const Icon = plan.icon;
          const price = plan.price[billingCycle];
          return (
            <div
              key={plan.name}
              className={cn(
                "relative flex h-full flex-col gap-6 rounded-3xl border border-slate-200/70 bg-white/80 p-6 shadow-[0_25px_70px_-50px_rgba(15,23,42,0.6)] transition dark:border-white/10 dark:bg-slate-900/60",
                plan.highlight
                  ? "border-indigo-500/60 bg-gradient-to-br from-indigo-600/10 via-white/80 to-white/90 shadow-[0_35px_80px_-45px_rgba(79,70,229,0.5)] dark:from-indigo-500/20 dark:via-slate-900/80 dark:to-slate-900/60"
                  : "hover:-translate-y-1"
              )}
            >
              {plan.badge && (
                <span className="absolute right-6 top-6 rounded-full bg-indigo-600 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-white">
                  {plan.badge}
                </span>
              )}
              <div className="flex items-center gap-3">
                <span
                  className={cn(
                    "flex h-11 w-11 items-center justify-center rounded-2xl",
                    plan.highlight ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-700"
                  )}
                >
                  <Icon className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">
                    {plan.name}
                  </p>
                  <p className="text-sm text-muted-foreground">{plan.description}</p>
                </div>
              </div>

              <div>
                <p className="text-4xl font-semibold text-slate-900 dark:text-white">
                  {price}
                  {price !== "Free" && price !== "Custom" && (
                    <span className="text-base font-medium text-muted-foreground">
                      {" "}
                      / {yearLabel}
                    </span>
                  )}
                </p>
                {price !== "Free" && price !== "Custom" && billingCycle === "yearly" && (
                  <p className="mt-1 text-xs text-slate-500">Billed annually</p>
                )}
              </div>

              <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-200">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2">
                    <Check className="mt-0.5 h-4 w-4 text-indigo-500" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-auto space-y-3">
                {currentPlan === plan.id && !isLoadingPlan && (
                  <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-200">
                    Current plan
                  </div>
                )}
                <button
                  type="button"
                  disabled={
                    processingPlan === plan.id ||
                    (currentPlan === plan.id && !isLoadingPlan)
                  }
                  onClick={() => handlePlanAction(plan.id as PlanName)}
                  className={cn(
                    "flex w-full items-center justify-center gap-2 rounded-2xl px-6 py-3 text-sm font-semibold transition",
                    plan.highlight
                      ? "bg-indigo-600 text-white hover:bg-indigo-500"
                      : "border border-slate-200 bg-white text-slate-900 hover:-translate-y-0.5 dark:border-white/10 dark:bg-slate-900 dark:text-white",
                    processingPlan === plan.id ? "opacity-80" : ""
                  )}
                >
                  {processingPlan === plan.id && (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  )}
                  {processingPlan === plan.id
                    ? "Processing..."
                    : plan.cta}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-16">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-slate-400">
            FAQs
          </p>
          <h2 className="mt-3 text-3xl font-semibold text-slate-900 dark:text-white">
            Questions, answered
          </h2>
        </div>
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {faqs.map((faq) => (
            <div
              key={faq.question}
              className="rounded-3xl border border-slate-200/70 bg-white/80 p-6 shadow-[0_20px_60px_-45px_rgba(15,23,42,0.4)] dark:border-white/10 dark:bg-slate-900/60"
            >
              <p className="text-base font-semibold text-slate-900 dark:text-white">
                {faq.question}
              </p>
              <p className="mt-2 text-sm text-muted-foreground">{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>

      {showContact && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 px-6">
          <div className="w-full max-w-lg rounded-3xl border border-white/10 bg-slate-900/95 p-6 text-white shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-semibold">Contact Sales</h3>
              <button
                type="button"
                onClick={() => setShowContact(false)}
                className="text-sm text-white/70 transition hover:text-white"
              >
                Close
              </button>
            </div>
            <p className="mt-2 text-sm text-white/70">
              Tell us about your accelerator or team and we will follow up with
              tailored pricing.
            </p>
            <form onSubmit={handleContactSubmit} className="mt-6 grid gap-4">
              <input
                value={contactForm.name}
                onChange={(event) =>
                  setContactForm((prev) => ({ ...prev, name: event.target.value }))
                }
                className="w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Full name"
                required
              />
              <input
                value={contactForm.email}
                onChange={(event) =>
                  setContactForm((prev) => ({ ...prev, email: event.target.value }))
                }
                className="w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Work email"
                type="email"
                required
              />
              <div className="grid gap-4 md:grid-cols-2">
                <input
                  value={contactForm.company}
                  onChange={(event) =>
                    setContactForm((prev) => ({
                      ...prev,
                      company: event.target.value,
                    }))
                  }
                  className="w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Company"
                  required
                />
                <input
                  value={contactForm.role}
                  onChange={(event) =>
                    setContactForm((prev) => ({ ...prev, role: event.target.value }))
                  }
                  className="w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Role"
                  required
                />
              </div>
              <input
                value={contactForm.teamSize}
                onChange={(event) =>
                  setContactForm((prev) => ({
                    ...prev,
                    teamSize: event.target.value,
                  }))
                }
                className="w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Team size or cohort size"
                required
              />
              <textarea
                value={contactForm.message}
                onChange={(event) =>
                  setContactForm((prev) => ({
                    ...prev,
                    message: event.target.value,
                  }))
                }
                className="min-h-[120px] w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Tell us about your validation needs"
                required
              />
              <button
                type="submit"
                disabled={isSendingContact}
                className="flex items-center justify-center gap-2 rounded-2xl bg-indigo-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-indigo-400 disabled:cursor-wait disabled:opacity-80"
              >
                {isSendingContact && <Loader2 className="h-4 w-4 animate-spin" />}
                {isSendingContact ? "Sending..." : "Submit request"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
