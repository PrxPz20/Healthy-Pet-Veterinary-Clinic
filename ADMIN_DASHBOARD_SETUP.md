# Admin Dashboard Setup

This project now includes a secure admin dashboard foundation at `/admin`.

## What The Customer Can Edit

- Gallery items with multiple images per item.
- Case items with multiple images per case.
- Services.
- Products and external Wolt/Foody links.
- FAQs.
- About Us copy and verified counters.
- Approved Google reviews.
- Contact address, map, phone numbers, WhatsApp, email, and weekly opening hours.

The customer cannot edit layout, colors, fonts, raw HTML, arbitrary JSON, scripts, or design settings.

## Supabase Setup

1. Create a Supabase project.
2. Run the SQL migration in:
   - `supabase/migrations/20260709000000_admin_cms.sql`
   - `supabase/migrations/20260710000000_optional_gallery_case_descriptions.sql`
   - `supabase/migrations/20260713000000_admin_categories.sql`
   - `supabase/migrations/20260717000000_contact_settings.sql`
   - `supabase/migrations/20260720000000_admin_bulk_actions.sql`
   - `supabase/migrations/20260721000000_editorial_content.sql`
   - `supabase/migrations/20260722000000_marketplace_url_security.sql`
   - `supabase/migrations/20260723000000_fix_admin_acceptance.sql`
   - `supabase/migrations/20260724000000_bulk_restore.sql`
   - `supabase/migrations/20260725000000_editorial_limits.sql`
   - `supabase/migrations/20260726000000_admin_dashboard_counts.sql`
   - `supabase/migrations/20260729000000_private_case_media.sql`
   - `supabase/migrations/20260730000000_disallow_static_case_media.sql`
   - `supabase/migrations/20260731000000_owner_only_admins.sql`
3. Keep local credentials in `.env.local`. Do not put real credentials in `.env.example`.
4. Add these environment variables to the hosting provider:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
5. Create the first user in Supabase Auth.
6. Add that user to `public.admin_users`:

```sql
insert into public.admin_users (user_id, role, is_active)
values ('USER_ID_FROM_AUTH_USERS', 'owner', true);
```

7. Verify the database is ready:

```bash
npm run test:cms
```

If the checker says a table is missing, the SQL migration has not been applied yet.

Use `ADMIN_ACCEPTANCE_TESTS.md` for the complete localhost and production sign-off workflow.

## Security Notes

- The dashboard uses an owner-only admin model. `admin_users.role` must be `owner`; editor
  accounts are not supported.

- Supabase RLS must stay enabled on every CMS table.
- The service-role key must never be placed in frontend code or committed to git.
- Public users can only read published, non-archived content.
- Admin users can create, publish, archive, and restore content.
- Archive is used instead of hard delete so customer mistakes can be recovered.
- Archived content can be restored for seven days, then is permanently removed on the next admin dashboard load.
- Contact writes use admin-only database functions; public users have read-only access.
- Supabase-uploaded Case images use a private `site-cases` bucket. Public visitors receive
  short-lived signed URLs only for published, non-archived Cases; active admins may also preview
  draft and archived Case media.
- Case image blur remains a user-experience warning. A published image can still be downloaded
  while its signed URL is valid.
- Case media must use private `site-cases` Storage paths. `static:case:*` paths are rejected.

## Media Rules

- Images only for gallery, cases, products, and service images in v1.
- Allowed formats: JPG, PNG, WebP.
- Max file size: 10MB.

## Future Migration

Supabase code is isolated in the admin repository and Supabase client files. If the backend later moves to Railway or Hostinger, replace the repository/provider layer instead of rewriting the public website components.
