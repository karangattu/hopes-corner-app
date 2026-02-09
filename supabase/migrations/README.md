# Supabase Database Migrations

This directory contains database migration files managed by the Supabase CLI.

## Creating Migrations

### 1. Install Supabase CLI (if not already installed)

```bash
npm install -g supabase
```

### 2. Login to Supabase

```bash
supabase login
```

### 3. Link your project (first time only)

```bash
supabase link --project-ref <your-project-ref>
```

### 4. Create a new migration

```bash
supabase migration new add_daily_notes_table
```

This creates a file like: `supabase/migrations/20240209120000_add_daily_notes_table.sql`

### 5. Edit the migration file

Add your SQL changes to the generated file:

```sql
-- Migration: add_daily_notes_table
-- Created at: 2024-02-09 12:00:00

CREATE TABLE IF NOT EXISTS public.daily_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  note_date DATE NOT NULL,
  service_type TEXT NOT NULL,
  note_text TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

### 6. Test locally

```bash
# Reset local database and apply all migrations
supabase db reset

# Or apply migrations to a running local database
supabase db push
```

### 7. Commit and push

```bash
git add supabase/migrations/
git commit -m "feat: add daily_notes table"
git push
```

## Migration Naming Convention

Files follow the pattern: `YYYYMMDDHHMMSS_description.sql`

- **Timestamp**: When the migration was created (UTC)
- **Description**: Brief, snake_case description of the change
- **Extension**: Always `.sql`

Examples:
- `20240209120000_add_daily_notes_table.sql`
- `20240210153000_add_guest_location_index.sql`

## Best Practices

### Idempotent SQL

Always write idempotent SQL that can be run multiple times safely:

```sql
-- ✅ Good: Won't fail if table already exists
CREATE TABLE IF NOT EXISTS public.users (...);

-- ✅ Good: Won't fail if function already exists
CREATE OR REPLACE FUNCTION public.touch_updated_at() ...;

-- ✅ Good: Safe index creation
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);

-- ❌ Bad: Will fail if table exists
CREATE TABLE public.users (...);
```

### One Change Per Migration

Keep migrations focused on a single logical change:

```sql
-- ✅ Good: One table per migration
-- migration: add_guests_table.sql
CREATE TABLE public.guests (...);

-- ✅ Good: Separate migration for related index
-- migration: add_guests_name_index.sql
CREATE INDEX idx_guests_name ON public.guests(name);
```

### Never Modify Existing Migrations

Once a migration has been pushed to the remote database:
- ❌ Do NOT modify the SQL file
- ✅ Create a new migration to fix/correct the change

### Include Rollback Instructions

For complex migrations, document how to rollback:

```sql
-- Migration: rename_column.sql
-- Rollback: ALTER TABLE public.users RENAME COLUMN new_name TO old_name;

ALTER TABLE public.users RENAME COLUMN old_name TO new_name;
```

## CI/CD Integration

Migrations are automatically applied when:
1. Code is pushed to the `main` branch
2. Files in `supabase/migrations/` have changed
3. All tests pass

The CI workflow:
1. Runs tests and lint
2. Checks for migration changes
3. Runs `supabase db push` to apply new migrations
4. Deploys the application

## Troubleshooting

### Migration Failed

If a migration fails in CI:
1. Check the GitHub Actions logs
2. Fix the migration file locally
3. Test with `supabase db push`
4. Commit and push the fix

### Conflicting Migrations

If two developers create migrations simultaneously:
1. Pull the latest changes
2. Renumber your migration with a later timestamp
3. Test that migrations apply in order
4. Push the updated migration

### Database Drift

If the remote database differs from migrations:
1. Create a new migration to bring them in sync
2. NEVER manually modify the production database
3. Always go through the migration process

## Resources

- [Supabase Database Migrations Documentation](https://supabase.com/docs/guides/deployment/database-migrations)
- [Supabase CLI Reference](https://supabase.com/docs/reference/cli/supabase-migration)
- [Database Schema](../database/schema.sql) - Full schema reference
