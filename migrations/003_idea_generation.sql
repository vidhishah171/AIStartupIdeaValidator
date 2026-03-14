-- Tables for idea generation caching and history
create table if not exists public.idea_generation_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users,
  context_hash text not null,
  industry text not null,
  target_customer text not null,
  problem_space text not null,
  technology text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.idea_generation_results (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.idea_generation_sessions,
  idea_index integer not null,
  title text not null,
  description text not null,
  potential_users text,
  tags text[],
  created_at timestamptz not null default now()
);

create table if not exists public.idea_generation_cache (
  context_hash text primary key,
  user_id uuid not null references auth.users,
  industry text not null,
  target_customer text not null,
  problem_space text not null,
  technology text not null,
  ideas jsonb not null,
  updated_at timestamptz not null default now()
);

alter table public.idea_generation_sessions enable row level security;
alter table public.idea_generation_results enable row level security;
alter table public.idea_generation_cache enable row level security;

create policy "idea_sessions_owner" on public.idea_generation_sessions
  for select using (auth.uid() = user_id);
create policy "idea_sessions_insert" on public.idea_generation_sessions
  for insert with check (auth.uid() = user_id);
create policy "idea_sessions_update" on public.idea_generation_sessions
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "idea_results_owner" on public.idea_generation_results
  for select using (
    exists (
      select 1 from public.idea_generation_sessions
      where public.idea_generation_sessions.id = public.idea_generation_results.session_id
      and public.idea_generation_sessions.user_id = auth.uid()
    )
  );
create policy "idea_results_insert" on public.idea_generation_results
  for insert with check (
    exists (
      select 1 from public.idea_generation_sessions
      where public.idea_generation_sessions.id = public.idea_generation_results.session_id
      and public.idea_generation_sessions.user_id = auth.uid()
    )
  );

create policy "idea_cache_owner" on public.idea_generation_cache
  for select using (user_id = auth.uid());
create policy "idea_cache_insert" on public.idea_generation_cache
  for insert with check (user_id = auth.uid());
create policy "idea_cache_update" on public.idea_generation_cache
  for update using (user_id = auth.uid());
