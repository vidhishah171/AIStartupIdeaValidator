# DECISIONS

- Use Next.js App Router for all pages and API routes.
- Use Supabase Auth + Postgres with RLS enforcing per-user access.
- Store validation reports as JSONB for flexible schema evolution.
- Use server-side OpenAI calls only in `/api/validate`.
- Use jsPDF for client-side PDF export.

Legacy note:
- [2026-03-14] Expanded the validation report schema to include executive summary, value proposition, differentiation, go-to-market plan, risks, and next-step experiments to produce richer reports and PDFs.
