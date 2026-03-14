# AGENTS.md

Instruction file for AI agents working in this repository.

Agents must read this file before performing any task.

---

# Project Context

Before starting work, read the `/doc` folder to understand project state.

Files:

/doc/PRD.md
Product requirements and feature specifications.

/doc/TASKS.md
Master task list.

/doc/PROGRESS.md
Log of completed work.

/doc/BLOCKERS.md
Issues requiring human input.

/doc/CHANGELOG.md
Important code or schema changes.

/doc/DECISIONS.md
Architecture and design decisions.

/doc/SCHEMA.md
Database schema and migrations.

---

# Session Start

At the start of every new session:

1. Read `/doc/TASKS.md`
2. Read `/doc/PROGRESS.md`
3. Read `/doc/BLOCKERS.md`
4. Summarize current project state
5. Continue the next unfinished task

---

# Task Workflow

For every task:

1. Read requirements from `/doc/PRD.md`
2. Check `/doc/BLOCKERS.md`
3. Implement the feature
4. Verify code compiles and runs
5. Update documentation

Stop immediately if blocked.

---

# Task Completion

After finishing a task:

1. Mark `[x]` in `/doc/TASKS.md`
2. Add entry to `/doc/PROGRESS.md`

Example:

[2026-03-14 14:20] Implemented invite API endpoint

3. Update `/doc/CHANGELOG.md` if code changed
4. Update `/doc/SCHEMA.md` if database schema changed
5. Add major design decisions to `/doc/DECISIONS.md`

---

# Project Structure

/
app/ -> Next.js routes
components/ -> reusable UI components
lib/ -> utilities and integrations
hooks/ -> custom React hooks
types/ -> shared TypeScript types
supabase/migrations/ -> database migrations
doc/ -> project documentation

---

# Environment Rules

Environment variables must be stored in:

.env.local

Do not commit secrets to the repository.

Use `.env.example` for variable references.

---

# Blockers

If a task cannot continue, write an entry in:

/doc/BLOCKERS.md

Format:

[DATE] BLOCKER

Problem:
Describe the issue.

Needs:
What human input is required.

Stop work until the blocker is resolved.
