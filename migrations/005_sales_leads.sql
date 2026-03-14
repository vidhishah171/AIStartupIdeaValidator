-- UP
begin;

create table if not exists public.sales_leads (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  company text not null,
  role text not null,
  team_size text not null,
  message text not null,
  created_at timestamptz default now()
);

alter table public.sales_leads enable row level security;

create policy "sales_leads_insert_public" on public.sales_leads
  for insert with check (true);

commit;

-- DOWN
begin;

drop policy if exists "sales_leads_insert_public" on public.sales_leads;
drop table if exists public.sales_leads;

commit;
