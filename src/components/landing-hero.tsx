"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";

export function LandingHero() {
  return (
    <section className="mx-auto w-full max-w-8xl px-6 pt-16 md:pt-24 lg:px-40">
      <div className="grid gap-10 md:grid-cols-[1.15fr_0.85fr] md:items-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1 text-sm font-semibold uppercase tracking-[0.3em] text-muted-foreground">
            <Sparkles className="h-3.5 w-3.5" />
            AI-Ready Validation
          </div>
          <h1 className="mt-5 text-5xl font-semibold leading-tight md:text-6xl">
            Validate Your Startup Idea in Seconds
          </h1>
          <p className="mt-4 text-xl text-muted-foreground">
            Instantly analyze market demand, competitors, and monetization using
            AI.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              href="/validate"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-base font-semibold text-primary-foreground shadow-lg shadow-primary/30 transition hover:-translate-y-0.5"
            >
              Validate My Idea
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/share/example"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-6 py-3 text-base font-semibold text-foreground transition hover:-translate-y-0.5"
            >
              See Example Report
            </Link>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="glass-card rounded-3xl p-6 shadow-xl shadow-black/5"
        >
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-muted-foreground">
            Example Snapshot
          </p>
          <h3 className="mt-3 text-2xl font-semibold">AI Resume Builder</h3>
          <div className="mt-4 grid gap-3">
            <div className="glass-muted rounded-2xl p-4">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-muted-foreground">
                Market Demand
              </p>
              <p className="mt-2 text-4xl font-semibold text-primary">82</p>
            </div>
            <div className="glass-muted rounded-2xl p-4 text-base text-muted-foreground">
              Strong demand from job seekers + recruiters. Differentiation needed
              on personalization and ATS optimization.
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
