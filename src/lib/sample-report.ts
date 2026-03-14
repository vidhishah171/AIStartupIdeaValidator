import { ValidationReport } from "@/lib/types";

export const sampleReport: ValidationReport = {
  ideaSummary:
    "An AI-driven platform that helps founders turn raw startup experiments into validated stories with measurable decision support.",
  valueProposition:
    "Automate evidence collection, provide contextual insights, and present a single source of truth for investors and teams.",
  marketDemandScore: 82,
  marketDemandJustification:
    "Strong demand exists among job seekers and recruiters seeking faster, better-personalized resumes. Differentiation should focus on ATS optimization and role-specific storytelling.",
  competitors: [
    {
      name: "Resume.io",
      description: "Template-driven resume builder with premium upsells.",
    },
    {
      name: "Teal",
      description: "Job tracking + resume improvements for active applicants.",
    },
  ],
  targetAudience: {
    role: "Early-career professionals and career switchers",
    ageRange: "21-35",
    painPoint: "Struggling to stand out in competitive hiring pipelines",
    buyingPower: "Moderate; willing to pay for outcomes",
  },
  monetizationSuggestions: [
    {
      model: "Subscription SaaS",
      fit: "Recurring resume iterations during job hunt",
      reason: "Encourages ongoing optimization and upsell to interview prep.",
    },
    {
      model: "Pay-per-export",
      fit: "Low-commitment buyers",
      reason: "Captures casual users without subscription friction.",
    },
  ],
  strengths: [
    "Clear pain point and measurable outcome",
    "AI personalization can be a strong moat",
    "High search intent in the market",
  ],
  weaknesses: [
    "Highly competitive space with low switching cost",
    "Risk of being perceived as generic or low quality",
  ],
  pivotRecommendations: [
    "Focus on a niche vertical (e.g., data science resumes)",
    "Bundle with interview coaching or portfolio reviews",
  ],
  differentiation:
    "Differentiates by providing narrative-centric insights alongside live benchmarking and personalized next steps.",
  goToMarketPlan: [
    "Launch with targeted programs inside startup communities.",
    "Partner with productivity platforms to embed insights.",
    "Publish POV content on workflow improvements.",
  ],
  risks: [
    "Market skepticism about AI-generated guidance.",
    "Need for continuous data refresh to stay accurate.",
  ],
  nextSteps: [
    "Pilot with three founder cohorts to test insight clarity.",
    "Instrument ROI tracking for each validation cycle.",
  ],
  mvpFeatures: [
    {
      name: "Insight dashboard",
      priority: "High",
      explanation:
        "Surfaces key validation metrics, demand signals, and next-step recommendations in one view.",
    },
    {
      name: "Experiment template library",
      priority: "Medium",
      explanation:
        "Provides starter templates for common idea types to speed up validation.",
    },
    {
      name: "Report export & sharing",
      priority: "High",
      explanation:
        "Generates polished summaries for investors, partners, and teammates.",
    },
    {
      name: "Contextual guidance notes",
      priority: "Low",
      explanation:
        "AI suggests follow-ups and learning resources based on responses.",
    },
  ],
  mvpScopeTiers: {
    core: ["Insight dashboard", "Report export & sharing"],
    optional: ["Experiment template library", "Contextual guidance notes"],
    future: ["Automation connectors", "Workflow orchestration"],
  },
};
