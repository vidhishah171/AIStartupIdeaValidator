import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

process.env.DOTENV_CONFIG_QUIET = "true";
dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  throw new Error("Missing Supabase environment variables.");
}

const supabase = createClient(supabaseUrl, serviceRoleKey);

const TARGET_EMAIL = "vidhi.shah@bacancy.com";
const TARGET_PASSWORD = "vidhi123";

const ideas = [
  {
    idea: "AI onboarding concierge for HR teams that turns SOPs into step-by-step playbooks.",
    score: 88,
  },
  {
    idea: "Invoice automation for creative agencies with auto follow-ups and cashflow forecasts.",
    score: 76,
  },
  {
    idea: "Voice-first CRM notes for field sales reps that syncs to Salesforce.",
    score: 69,
  },
  {
    idea: "Smart meal planning with grocery bundling for busy professionals.",
    score: 58,
  },
  {
    idea: "AI resume and portfolio builder for early career professionals.",
    score: 81,
  },
  {
    idea: "Notion OKR plugin with progress intelligence and weekly check-ins.",
    score: 63,
  },
  {
    idea: "AI design critique assistant for product teams with iteration summaries.",
    score: 72,
  },
  {
    idea: "Personalized micro-learning for finance teams with compliance tracking.",
    score: 67,
  },
  {
    idea: "SMB pricing optimizer that recommends packaging based on churn signals.",
    score: 74,
  },
  {
    idea: "Community concierge that pairs experts with founders inside private groups.",
    score: 54,
  },
  {
    idea: "Zero-shot competitor intelligence dashboard for seed-stage startups.",
    score: 79,
  },
  {
    idea: "AI meeting follow-up assistant that generates next steps and owners.",
    score: 83,
  },
  {
    idea: "B2B renewal risk detector using product usage and NPS signals.",
    score: 71,
  },
  {
    idea: "Creator sponsorship marketplace with intent-based matching.",
    score: 47,
  },
  {
    idea: "AI workflow builder for operations teams with prebuilt templates.",
    score: 92,
  },
  {
    idea: "Localization QA copilot for mobile apps with regression alerts.",
    score: 61,
  },
  {
    idea: "Remote team ritual generator that automates culture check-ins.",
    score: 52,
  },
  {
    idea: "AI-powered legal doc summarizer for in-house counsels.",
    score: 77,
  },
  {
    idea: "Lead qualification copilot for inbound SaaS forms.",
    score: 66,
  },
  {
    idea: "Investor update generator that tracks milestones and metrics.",
    score: 59,
  },
];

const reportTemplate = {
  ideaSummary:
    "A focused workflow assistant that replaces manual follow-ups with automated intelligence. It removes operational drag so teams can spend time on higher-value work.",
  valueProposition:
    "Automate repetitive workflows, reduce cycle time, and increase visibility with minimal setup.",
  marketDemandScore: 75,
  marketDemandJustification:
    "Clear pain point with consistent spend. Buyers already allocate budgets to automation and ROI is tangible within weeks.",
  competitors: [
    { name: "Incumbent A", description: "Strong brand and broad integrations." },
    { name: "Niche B", description: "Specialized in a single vertical workflow." },
    { name: "Tool C", description: "Automation-first but lacks strategic guidance." },
  ],
  targetAudience: {
    role: "Ops and revenue leaders",
    ageRange: "28-45",
    painPoint: "Manual handoffs and inconsistent reporting",
    buyingPower: "Medium to high",
  },
  monetizationSuggestions: [
    {
      model: "Subscription per seat",
      fit: "Usage grows with team size",
      reason: "Predictable revenue tied to clear value outcomes.",
    },
    {
      model: "Usage-based automation credits",
      fit: "Aligns with workflow volume",
      reason: "Scales revenue with ROI delivered.",
    },
  ],
  differentiation:
    "Position as the fastest time-to-value automation layer with prebuilt playbooks and concierge onboarding.",
  goToMarketPlan: [
    "Launch with a niche industry playbook and targeted outbound.",
    "Partner with agencies and consultants to bundle automation services.",
    "Publish ROI case studies with before/after metrics.",
  ],
  risks: [
    "Highly competitive category with entrenched incumbents.",
    "Buyers may expect deep integrations from day one.",
    "Retention risk if ROI is not measured early.",
  ],
  nextSteps: [
    "Interview 10 target operators to validate top workflow pain points.",
    "Prototype a single workflow and measure time saved.",
    "Run a landing page test with two pricing models.",
  ],
  strengths: ["Clear ROI story", "Strong automation narrative"],
  weaknesses: ["Crowded market", "Integration complexity"],
  pivotRecommendations: ["Focus on one vertical", "Offer white-glove setup"],
  mvpFeatures: [
    {
      name: "Workflow builder",
      priority: "High",
      explanation:
        "Visual drag-and-drop editor for creating automated follow-up sequences without code.",
    },
    {
      name: "Integration hub",
      priority: "High",
      explanation:
        "Pre-built connectors to Slack, email, and CRM to pull context into workflows.",
    },
    {
      name: "Real-time status dashboard",
      priority: "High",
      explanation:
        "Live view of active workflows, pending actions, and bottleneck alerts.",
    },
    {
      name: "Template library",
      priority: "Medium",
      explanation:
        "Industry-specific workflow templates to accelerate onboarding and time-to-value.",
    },
    {
      name: "Role-based permissions",
      priority: "Medium",
      explanation:
        "Control who can create, edit, or approve workflows across teams.",
    },
    {
      name: "Advanced analytics & ROI tracker",
      priority: "Low",
      explanation:
        "Measure time saved, cycle reduction, and cost impact per workflow.",
    },
  ],
  mvpScopeTiers: {
    core: ["Workflow builder", "Integration hub", "Real-time status dashboard"],
    optional: ["Template library", "Role-based permissions", "Email notification rules"],
    future: ["Advanced analytics & ROI tracker", "AI-suggested workflow improvements", "White-label embedding"],
  },
};

async function run() {
  const { data: existingUser } = await supabase
    .from("auth.users")
    .select("id")
    .eq("email", TARGET_EMAIL)
    .maybeSingle();

  let userId = existingUser?.id ?? null;

  if (!userId) {
    const { data, error } = await supabase.auth.admin.createUser({
      email: TARGET_EMAIL,
      password: TARGET_PASSWORD,
      email_confirm: true,
    });

    if (error || !data.user) {
      throw new Error(error?.message ?? "Failed to create user.");
    }

    userId = data.user.id;
  } else {
    await supabase.auth.admin.updateUserById(userId, {
      password: TARGET_PASSWORD,
    });
  }

  await supabase
    .from("user_plans")
    .upsert({ user_id: userId, plan: "pro", updated_at: new Date().toISOString() });

  await supabase.from("shared_reports").delete().in(
    "validation_id",
    (
      await supabase
        .from("validations")
        .select("id")
        .eq("user_id", userId)
    ).data?.map((row) => row.id) ?? []
  );

  await supabase.from("validations").delete().eq("user_id", userId);

  const now = new Date();
  const validationRows = ideas.map((entry, index) => {
    const createdAt = new Date(
      now.getTime() - index * 24 * 60 * 60 * 1000
    ).toISOString();
    return {
      user_id: userId,
      idea_text: entry.idea,
      report: {
        ...reportTemplate,
        marketDemandScore: entry.score,
        marketDemandJustification: `Score ${entry.score}/100 based on ${entry.idea.toLowerCase()}`,
      },
      created_at: createdAt,
    };
  });

  const { error: insertError } = await supabase
    .from("validations")
    .insert(validationRows);

  if (insertError) {
    throw new Error(insertError.message);
  }

  console.log("Seeded Vidhi user with Pro plan and sample data.");
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
