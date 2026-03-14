# AI Startup Idea Validator

A modern SaaS platform that validates startup ideas in seconds with AI. Users can submit ideas, receive structured reports, compare opportunities, export PDFs, share results, and explore market insights.

## Tech Stack
- Next.js 16+ (App Router) + TypeScript
- Supabase (Auth + PostgreSQL + RLS)
- Tailwind CSS
- OpenAI API (server-side only)
- Recharts, Framer Motion, dnd-kit, Lucide React
- jsPDF for PDF export

## Key Features
- AI idea validation with structured reports
- Market Opportunity Map + score distribution charts
- Idea generation with caching
- PDF report export and shareable links
- Freemium/Pro/Team plans with plan-aware limits
- Contact Sales form (saved to Supabase)

## Setup
1. Install dependencies:
```bash
npm install
```

2. Configure environment variables in `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
OPENAI_API_KEY=
```

3. Run the dev server:
```bash
npm run dev
```

## Database & Migrations
Run SQL migrations in Supabase in order:
```
migrations/001_init.sql
migrations/002_shared_reports_public_read.sql
migrations/003_idea_generation.sql
migrations/004_user_plans.sql
migrations/005_sales_leads.sql
```

## Seeds
Seed demo users + sample validations:
```bash
npm run seed
```

Seed a polished demo account for presentations:
```bash
node scripts/seed-vidhi.cjs
```

## Plans
- `free`: 3 validations/month (default for new users)
- `pro`: unlimited validations
- `team`: unlimited validations + team workflows (currently managed via Contact Sales)

## Deployment (Vercel)
1. Push the repo to GitHub.
2. Import into Vercel.
3. Set environment variables in Vercel project settings.
4. Deploy.

## Notes
- All OpenAI calls run in `/api/validate` and `/api/ideas/generate`.
- `OPENAI_API_KEY` is never exposed to client code.
- Plan limits are enforced in `src/app/api/validate/route.ts`.
