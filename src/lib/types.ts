export type ValidationReport = {
  ideaSummary: string;
  valueProposition: string;
  marketDemandScore: number;
  marketDemandJustification: string;
  competitors: { name: string; description: string }[];
  targetAudience: {
    role: string;
    ageRange: string;
    painPoint: string;
    buyingPower: string;
  };
  monetizationSuggestions: {
    model: string;
    fit: string;
    reason: string;
  }[];
  differentiation: string;
  goToMarketPlan: string[];
  risks: string[];
  nextSteps: string[];
  strengths: string[];
  weaknesses: string[];
  pivotRecommendations: string[];
  mvpFeatures: {
    name: string;
    priority: "High" | "Medium" | "Low";
    explanation: string;
  }[];
  mvpScopeTiers: {
    core: string[];
    optional: string[];
    future: string[];
  };
};
