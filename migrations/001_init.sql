-- Enable required extensions
create extension if not exists "pgcrypto";

-- Tables
create table if not exists public.validations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null,
  idea_text text not null,
  report jsonb not null,
  created_at timestamptz default now()
);

create table if not exists public.usage_counts (
  user_id uuid primary key references auth.users not null,
  count integer not null default 0,
  reset_at timestamptz not null
);

create table if not exists public.shared_reports (
  id uuid primary key default gen_random_uuid(),
  validation_id uuid references public.validations not null,
  share_slug text unique not null,
  created_at timestamptz default now()
);

-- RLS
alter table public.validations enable row level security;
alter table public.usage_counts enable row level security;
alter table public.shared_reports enable row level security;

-- Policies: validations
create policy "validations_read_own" on public.validations
  for select using (auth.uid() = user_id);

create policy "validations_insert_own" on public.validations
  for insert with check (auth.uid() = user_id);

create policy "validations_delete_own" on public.validations
  for delete using (auth.uid() = user_id);

-- Policies: usage_counts
create policy "usage_read_own" on public.usage_counts
  for select using (auth.uid() = user_id);

create policy "usage_insert_own" on public.usage_counts
  for insert with check (auth.uid() = user_id);

create policy "usage_update_own" on public.usage_counts
  for update using (auth.uid() = user_id);

-- Policies: shared_reports
create policy "shared_reports_insert_own" on public.shared_reports
  for insert with check (
    exists (
      select 1 from public.validations
      where public.validations.id = public.shared_reports.validation_id
      and public.validations.user_id = auth.uid()
    )
  );

create policy "shared_reports_read_public" on public.shared_reports
  for select using (true);
