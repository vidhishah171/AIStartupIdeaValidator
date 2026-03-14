"use client";

import { motion } from "framer-motion";

const features = [
  {
    title: "Market demand signal",
    description:
      "Instantly score how strong the market pull is for your idea.",
  },
  {
    title: "Competitor radar",
    description:
      "Identify direct and indirect competitors with positioning notes.",
  },
  {
    title: "Monetization map",
    description: "Get clear revenue models matched to your idea.",
  },
  {
    title: "Pivot insights",
    description: "See weaknesses fast and explore higher-leverage pivots.",
  },
];

export function LandingFeatures() {
  return (
    <section className="mx-auto mt-20 w-full max-w-8xl px-6 lg:px-40">
      <div className="flex flex-col gap-3">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-muted-foreground">
          Features
        </p>
        <h2 className="text-4xl font-semibold">Built for speed and clarity</h2>
      </div>
      <div className="mt-8 grid gap-6 md:grid-cols-2">
        {features.map((feature, index) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.05 }}
            viewport={{ once: true }}
            className="glass-card rounded-3xl p-6 shadow-sm transition hover:-translate-y-1"
          >
            <h3 className="text-xl font-semibold">{feature.title}</h3>
            <p className="mt-2 text-base text-muted-foreground">
              {feature.description}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
