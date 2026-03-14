-- Allow public read of validations that have been explicitly shared
-- so /share/[slug] can load without authentication.
create policy "validations_read_shared" on public.validations
  for select using (
    exists (
      select 1 from public.shared_reports
      where public.shared_reports.validation_id = public.validations.id
    )
  );
