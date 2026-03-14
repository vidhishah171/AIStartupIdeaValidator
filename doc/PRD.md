AI Startup Idea Validator

Version: 1.2
Date: March 14, 2026
Hackathon: AI Mahakurukshetra 2026

1. Product Overview

Product Name: AI Startup Idea Validator
Tagline: Validate Your Startup Idea in Seconds
Category: AI Productivity Tools
Alternatives: IdeaBuddy, Lean Canvas, Strategyzer

AI Startup Idea Validator is a web-based SaaS application that enables founders, indie hackers, and students to submit startup ideas and receive structured AI-powered validation reports within seconds. The product also includes idea generation, comparison tools, PDF export, and shareable reports.

2. Problem Statement

Founders often build products without validating market demand. Traditional validation frameworks are manual and time-consuming. Early-stage teams need fast, structured signals to decide what to build next.

3. Product Vision

Deliver instant, credible market validation for new ideas with a polished SaaS experience that is demo-ready and presentation-friendly.

4. Goals & Success Metrics

Goal | Metric | Target
Fast validation | Report generation time | < 30 seconds
Engagement | Validations per session | >= 2
Retention | Returning users | >= 20%
Reliability | Successful validation requests | >= 95%
Demo readiness | Presentation-ready charts | 100%

5. Target Users

Personas | Description
Startup founders | Validate ideas before building
Indie hackers | Test multiple ideas rapidly
Students | Validate hackathon/project ideas
Product managers | Explore new product opportunities
Accelerators | Evaluate multiple cohorts

6. Core Features

6.1 Idea Input
- Textarea input with min/max validation
- Example placeholder text
- CTA: Validate My Idea

6.2 AI Validation Engine
- OpenAI-backed analysis
- Structured JSON response
- Market demand score (0-100)
- Competitors, target audience, monetization, risks, next steps
- MVP feature recommendations and roadmap tiers

6.3 Interactive Report UI
- Card-based report sections
- Drag-and-drop card ordering
- Market score visualization
- Expandable detail blocks

6.4 Dashboard (Validation History)
- Validation list with scores and dates
- Search + filter
- Delete validations
- Analytics charts (trend, distribution, map)

6.5 Market Opportunity Map
- Scatter chart with demand vs competition
- Bubble size indicates market size proxy
- 10-section axis grid (0-100)

6.6 Score Distribution
- 10 buckets (0-10 ... 91-100) for demo-friendly spread

6.7 Idea Generation
- Contextual idea generation (industry, customer, problem, tech)
- Cache results per user/context
- Click-only generation with loading state

6.8 Shareable Reports
- Public share links
- Public view of idea summary and report
- CTA to validate own idea

6.9 PDF Export
- Download full report as PDF
- Includes summary, score, competitors, strengths/risks

6.10 Authentication
- Supabase Auth (email + password)
- Guest validation (1 free)
- Secure server-side OpenAI calls

6.11 Plans & Usage Limits

Plan | Validations / month | Price
Free | 3 | $0
Pro | Unlimited | $12
Team | Unlimited + team workflows | Custom

Plan enforcement is server-side. Pro/Team are selectable in UI without real payments (simulated success).

6.12 Contact Sales
- Contact Sales modal for Team plan
- Form submission saved to Supabase (sales_leads table)

7. Technical Architecture

7.1 Stack
Layer | Technology
Frontend | Next.js 16 (App Router) + TypeScript
Backend | Next.js API routes
Database | Supabase PostgreSQL
Authentication | Supabase Auth
AI | OpenAI API
Styling | Tailwind CSS
Charts | Recharts
Animations | Framer Motion
Deployment | Vercel

7.2 Database Schema (Key Tables)

validations
- id UUID PRIMARY KEY DEFAULT gen_random_uuid()
- user_id UUID REFERENCES auth.users(id)
- idea_text TEXT NOT NULL
- report JSONB NOT NULL
- created_at TIMESTAMPTZ DEFAULT now()

usage_counts
- user_id UUID PRIMARY KEY REFERENCES auth.users(id)
- count INT DEFAULT 0
- reset_at TIMESTAMPTZ

shared_reports
- id UUID PRIMARY KEY DEFAULT gen_random_uuid()
- validation_id UUID REFERENCES validations(id)
- share_slug TEXT UNIQUE
- created_at TIMESTAMPTZ DEFAULT now()

idea_generation_cache
- context_hash TEXT
- user_id UUID
- ideas JSONB
- updated_at TIMESTAMPTZ

idea_generation_sessions / idea_generation_results
- Session + results tables for idea generation history

user_plans
- user_id UUID PRIMARY KEY
- plan ENUM ('free', 'pro', 'team')
- updated_at TIMESTAMPTZ

sales_leads
- id UUID PRIMARY KEY
- name, email, company, role, team_size, message
- created_at TIMESTAMPTZ

7.3 API Routes

Route | Method | Description
/api/validate | POST | Validate idea with OpenAI
/api/validations | GET | User validation history
/api/validation/[id] | DELETE | Delete validation
/api/share | POST | Create share link
/api/ideas/generate | POST | Idea generation
/api/billing/plan | GET/POST | Get/update user plan
/api/contact-sales | POST | Save sales lead

8. Pages & Navigation

Page | Route | Description
Landing | / | Marketing homepage
Validate | /validate | Idea input + report
Dashboard | /dashboard | History + analytics
Report | /report/[id] | Full report view
Share | /share/[slug] | Public report page
Idea Generator | /generate-ideas | Generate ideas
Pricing | /pricing | Plans + FAQ + contact sales
Login | /login | Auth

9. UX Requirements
- Fully responsive (mobile + desktop)
- Clean SaaS design, card-based layout
- Loading states and skeletons
- Modern charts with clear labels
- Onboarding-ready demo data

10. Seed / Demo Data

Seed scripts:
- scripts/seed.ts (demo users)
- scripts/seed-vidhi.cjs (presentation-ready account)

Presentation account:
- vidhi.shah@bacancy.com / vidhi123
- Pro plan enabled
- Diverse scores for charts

11. Non-Functional Requirements

Requirement | Detail
Security | API keys never exposed to client
Input validation | Reject short or empty input
Performance | Validation < 30 seconds
Auth protection | Dashboard requires session
Reliability | >= 95% successful validations

12. Out of Scope (Post-Hackathon)

- Stripe billing integration
- Team workspace collaboration features
- Public idea feed
- Mobile native app

13. Submission Checklist

- Repo created under Bacancy account
- README updated
- Supabase migrations applied
- Seed scripts run
- App deployed to Vercel
- Authentication works end-to-end
- Validation + idea generation tested
- Demo account ready for recording
