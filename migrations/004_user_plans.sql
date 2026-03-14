-- UP
begin;

create table if not exists public.user_plans (
  user_id uuid primary key references auth.users on delete cascade,
  plan text not null default 'free' check (plan in ('free', 'pro', 'team')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.user_plans enable row level security;

create policy "user_plans_read_own" on public.user_plans
  for select using (auth.uid() = user_id);

create policy "user_plans_insert_own" on public.user_plans
  for insert with check (auth.uid() = user_id);

create policy "user_plans_update_own" on public.user_plans
  for update using (auth.uid() = user_id);

insert into public.user_plans (user_id, plan)
select id, 'free'
from auth.users
on conflict (user_id) do nothing;

commit;
