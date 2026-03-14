# Database Schema

## Migrations
See `migrations/001_init.sql`.

## Tables
### validations
- `id` uuid primary key
- `user_id` uuid (auth.users)
- `idea_text` text
- `report` jsonb
- `created_at` timestamptz

### usage_counts
- `user_id` uuid primary key (auth.users)
- `count` integer
- `reset_at` timestamptz

### shared_reports
- `id` uuid primary key
- `validation_id` uuid (validations)
- `share_slug` text unique
- `created_at` timestamptz

## RLS
Policies are defined in `migrations/001_init.sql`.

Legacy note:
No schema changes recorded yet.
