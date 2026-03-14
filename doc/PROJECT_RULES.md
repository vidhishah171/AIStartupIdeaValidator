# PROJECT_RULES.md

Technical standards and architecture rules for this project.

Agents must follow these rules when writing or modifying code.

---

# Tech Stack (Do Not Change)

Framework: Next.js (App Router)
Language: TypeScript (strict mode)
Database: Supabase
Styling: Tailwind CSS
UI Components: shadcn/ui
Forms: React Hook Form + Zod
Server State: TanStack Query
URL State: nuqs
Package Manager: pnpm
Deployment: Vercel

---

# TypeScript Standards

TypeScript must run in strict mode.

Rules:
- Do not use `any`
- Prefer `unknown` and validate data
- Avoid non-null assertions `!`
- Use Zod schemas for validation

Example:

type User = z.infer<typeof UserSchema>

Use path alias:

@/

---

# Next.js Conventions

Default to **Server Components**.

Use `"use client"` only when required.

Guidelines:
- Fetch data in Server Components
- Use Server Actions or API routes for mutations
- Export metadata from pages
- Use `next/image` for images
- Use dynamic imports for heavy components

---

# Supabase Rules

Server usage:
lib/supabase/server.ts

Client usage:
lib/supabase/client.ts

Rules:
- Never expose the service role key to the client
- Enable Row Level Security (RLS) on all tables
- All schema changes must use migrations

Migration format:
supabase/migrations/YYYYMMDDHHMMSS_name.sql

All schema changes must also be documented in:
/doc/SCHEMA.md

---

# UI Rules

- Use Tailwind CSS only
- Prefer shadcn/ui components
- Follow mobile-first styling
- Always show loading states
- Always show error states
- Keep components small and reusable

---

# Security Rules

- Never commit secrets
- Validate all inputs with Zod
- Never trust client data
- Avoid `dangerouslySetInnerHTML`

---

# Code Quality

Guidelines:
- Write readable code
- Use descriptive variable names
- Avoid large components
- Extract reusable logic into utilities or hooks

---

# Anti-Patterns

Never:
- Use `any`
- Commit `.env.local`
- Skip database migrations
- Hardcode secrets
- Ignore blockers
