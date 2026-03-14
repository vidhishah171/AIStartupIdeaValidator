import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { LandingHero } from "@/components/landing-hero";
import { LandingFeatures } from "@/components/landing-features";
import { PricingPlans } from "@/components/pricing-plans";

export default function HomePage() {
  return (
    <div className="pb-16">
      <LandingHero />
      <LandingFeatures />
      <PricingPlans />

      <section className="mx-auto mt-20 w-full max-w-6xl px-6 lg:px-0">
        <div className="glass-card rounded-3xl p-10 text-center">
          <h2 className="text-4xl font-semibold">
            Ready to stress-test your next idea?
          </h2>
          <p className="mt-4 text-base text-muted-foreground">
            Run a validation in under 30 seconds and move forward with
            confidence.
          </p>
          <Link
            href="/validate"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-base font-semibold text-primary-foreground shadow-lg shadow-primary/30 transition hover:-translate-y-0.5"
          >
            Start Validation
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
