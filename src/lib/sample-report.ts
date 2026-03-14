import { ValidationReport } from "@/lib/types";

export const sampleReport: ValidationReport = {
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
};
