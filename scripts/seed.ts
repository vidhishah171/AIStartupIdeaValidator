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

const demoUsers = [
  "demo1@ideavalidator.com",
  "demo2@ideavalidator.com",
  "demo3@ideavalidator.com",
];

const demoIdeas = [
  "Uber for dog walking",
  "AI resume builder",
  "Invoice automation for agencies",
  "Notion OKR plugin",
  "AI mental health journaling app",
  "AI onboarding concierge for HR teams",
  "Voice-first CRM notes for field sales",
  "Smart meal planning with grocery bundling",
  "AI design critique assistant for product teams",
  "Personalized micro-learning for finance teams",
];

type SeedReport = {
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

const reportTemplates: SeedReport[] = [
  {
    ideaSummary:
      "A focused workflow assistant that replaces manual follow-ups with automated intelligence. It removes operational drag so teams can spend time on higher-value work.",
    valueProposition:
      "Automate repetitive back-office workflows, reduce cycle time, and increase visibility with minimal setup.",
    marketDemandScore: 82,
    marketDemandJustification:
      "Clear pain point with consistent spend. Buyers already allocate budgets to automation and ROI is tangible within weeks.",
    competitors: [
      {
        name: "Incumbent A",
        description: "Strong brand and broad integrations.",
      },
      {
        name: "Niche B",
        description: "Specialized in a single vertical workflow.",
      },
      {
        name: "Tool C",
        description: "Automation-first but lacks strategic guidance.",
      },
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
      core: [
        "Workflow builder",
        "Integration hub",
        "Real-time status dashboard",
      ],
      optional: [
        "Template library",
        "Role-based permissions",
        "Email notification rules",
      ],
      future: [
        "Advanced analytics & ROI tracker",
        "AI-suggested workflow improvements",
        "White-label embedding",
      ],
    },
  },
  {
    ideaSummary:
      "A workflow companion for knowledge workers that surfaces next steps automatically. It turns fragmented notes into clear, prioritized action plans.",
    valueProposition:
      "Cut planning time in half and make every workday intentional with AI-driven prioritization.",
    marketDemandScore: 74,
    marketDemandJustification:
      "Moderate demand with strong interest from early adopters, but differentiation is essential to avoid tool fatigue.",
    competitors: [
      {
        name: "Planner X",
        description: "Beautiful UI but limited automation.",
      },
      {
        name: "AI Notetaker Y",
        description: "Great transcription, weak execution layer.",
      },
    ],
    targetAudience: {
      role: "Founders and product managers",
      ageRange: "25-40",
      painPoint: "Context switching and unclear priorities",
      buyingPower: "Medium",
    },
    monetizationSuggestions: [
      {
        model: "Personal subscription",
        fit: "Individual power users",
        reason: "Low friction and clear monthly value.",
      },
      {
        model: "Team workspace plan",
        fit: "Shared workflows",
        reason: "Expands usage within teams for higher ARPU.",
      },
    ],
    differentiation:
      "Highlight actionability: transform notes into decisions with daily, role-based briefings.",
    goToMarketPlan: [
      "Build a waitlist with a weekly insight newsletter.",
      "Partner with creator communities to demo productivity wins.",
      "Offer a free concierge setup for the first 50 users.",
    ],
    risks: [
      "Retention if habits are not formed quickly.",
      "Heavy reliance on personal data trust.",
      "Longer sales cycles for teams.",
    ],
    nextSteps: [
      "Run a 2-week alpha with 10 power users.",
      "Measure time saved and perceived clarity.",
      "Test onboarding flow with and without templates.",
    ],
    strengths: ["Clear productivity story", "Strong habit-building potential"],
    weaknesses: ["Crowded productivity space", "Requires daily engagement"],
    pivotRecommendations: ["Target a single role", "Bundle with coaching"],
    mvpFeatures: [
      {
        name: "Smart capture",
        priority: "High",
        explanation:
          "Ingest notes from meetings, voice memos, and clipboard with automatic structuring.",
      },
      {
        name: "Daily briefing",
        priority: "High",
        explanation:
          "AI-generated morning summary of top priorities, deadlines, and suggested focus blocks.",
      },
      {
        name: "Action extraction engine",
        priority: "High",
        explanation:
          "Parse unstructured text into tagged action items with owners and due dates.",
      },
      {
        name: "Calendar integration",
        priority: "Medium",
        explanation:
          "Sync priorities with Google Calendar or Outlook to block focus time automatically.",
      },
      {
        name: "Weekly review dashboard",
        priority: "Medium",
        explanation:
          "Visual recap of completed vs. planned tasks with productivity trends.",
      },
      {
        name: "Team shared workspace",
        priority: "Low",
        explanation:
          "Collaborative space where teams can align on priorities and delegate actions.",
      },
    ],
    mvpScopeTiers: {
      core: ["Smart capture", "Daily briefing", "Action extraction engine"],
      optional: [
        "Calendar integration",
        "Weekly review dashboard",
        "Custom priority labels",
      ],
      future: [
        "Team shared workspace",
        "AI coaching nudges",
        "Third-party app plugins",
      ],
    },
  },
];

async function run() {
  const { data: existingUsers, error: listError } =
    await supabase.auth.admin.listUsers({ page: 1, perPage: 1000 });

  if (listError) {
    throw new Error(`Failed to list users: ${listError.message}`);
  }

  const demoEmailSet = new Set(demoUsers);
  const usersToDelete =
    existingUsers?.users.filter((user) => demoEmailSet.has(user.email ?? "")) ??
    [];

  for (const user of usersToDelete) {
    const { data: sessionRows, error: sessionListError } = await supabase
      .from("idea_generation_sessions")
      .select("id")
      .eq("user_id", user.id);

    if (sessionListError) {
      console.error(
        `Failed to list idea sessions for ${user.email ?? user.id}:`,
        sessionListError.message,
      );
    }

    const sessionIds = sessionRows?.map((row) => row.id) ?? [];

    if (sessionIds.length > 0) {
      const { error: resultsDeleteError } = await supabase
        .from("idea_generation_results")
        .delete()
        .in("session_id", sessionIds);

      if (resultsDeleteError) {
        console.error(
          `Failed to delete idea results for ${user.email ?? user.id}:`,
          resultsDeleteError.message,
        );
      }
    }

    const { error: cacheDeleteError } = await supabase
      .from("idea_generation_cache")
      .delete()
      .eq("user_id", user.id);

    if (cacheDeleteError) {
      console.error(
        `Failed to delete idea cache for ${user.email ?? user.id}:`,
        cacheDeleteError.message,
      );
    }

    const { error: sessionsDeleteError } = await supabase
      .from("idea_generation_sessions")
      .delete()
      .eq("user_id", user.id);

    if (sessionsDeleteError) {
      console.error(
        `Failed to delete idea sessions for ${user.email ?? user.id}:`,
        sessionsDeleteError.message,
      );
    }

    const { error: usageDeleteError } = await supabase
      .from("usage_counts")
      .delete()
      .eq("user_id", user.id);

    if (usageDeleteError) {
      console.error(
        `Failed to delete usage counts for ${user.email ?? user.id}:`,
        usageDeleteError.message,
      );
    }

    const { data: validationRows, error: validationListError } = await supabase
      .from("validations")
      .select("id")
      .eq("user_id", user.id);

    if (validationListError) {
      console.error(
        `Failed to list validations for ${user.email ?? user.id}:`,
        validationListError.message,
      );
    }

    const validationIds = validationRows?.map((row) => row.id) ?? [];

    if (validationIds.length > 0) {
      const { error: sharedDeleteError } = await supabase
        .from("shared_reports")
        .delete()
        .in("validation_id", validationIds);

      if (sharedDeleteError) {
        console.error(
          `Failed to delete shared reports for ${user.email ?? user.id}:`,
          sharedDeleteError.message,
        );
      }

      const { error: validationsDeleteError } = await supabase
        .from("validations")
        .delete()
        .eq("user_id", user.id);

      if (validationsDeleteError) {
        console.error(
          `Failed to delete validations for ${user.email ?? user.id}:`,
          validationsDeleteError.message,
        );
      }
    }

    const { error: deleteError } = await supabase.auth.admin.deleteUser(user.id);
    if (deleteError) {
      console.error(
        `Failed to delete user ${user.email ?? user.id}:`,
        deleteError.message,
      );
    }
  }

  const userIds: string[] = [];

  for (const email of demoUsers) {
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password: "Demo1234!",
      email_confirm: true,
    });

    if (error) {
      console.error(`Failed to create user ${email}:`, error.message);
      continue;
    }

    userIds.push(data.user.id);
  }

  for (const userId of userIds) {
    const now = new Date();
    for (let index = 0; index < demoIdeas.length; index += 1) {
      const idea = demoIdeas[index];
      const template = reportTemplates[index % reportTemplates.length];
      const dayOffset = index * 2;
      const createdAt = new Date(
        now.getTime() - dayOffset * 24 * 60 * 60 * 1000,
      ).toISOString();
      const scoreBump = (index % 5) * 3;
      await supabase.from("validations").insert({
        user_id: userId,
        idea_text: idea,
        report: {
          ...template,
          marketDemandScore: Math.min(
            95,
            template.marketDemandScore + scoreBump,
          ),
        },
        created_at: createdAt,
      });
    }
  }

  console.log("Seed complete.");
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
