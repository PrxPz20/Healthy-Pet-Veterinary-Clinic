alter table public.about_settings
  add column if not exists image_path text;

alter table public.about_settings
  drop constraint if exists about_settings_image_path_check;

alter table public.about_settings
  add constraint about_settings_image_path_check
  check (
    image_path is null
    or (
      char_length(image_path) between 1 and 500
      and image_path !~ '(^/|\\.\\.)'
    )
  );

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'site-about',
  'site-about',
  true,
  10485760,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Public reads site assets" on storage.objects;
create policy "Public reads site assets" on storage.objects
for select to anon, authenticated using (
  bucket_id in ('site-gallery', 'site-services', 'site-products', 'site-hero', 'site-about')
);

drop policy if exists "Admins upload site assets" on storage.objects;
create policy "Admins upload site assets" on storage.objects
for insert to authenticated with check (
  public.is_admin()
  and bucket_id in (
    'site-gallery', 'site-cases', 'site-services', 'site-products', 'site-hero', 'site-about'
  )
);

drop policy if exists "Admins update site assets" on storage.objects;
create policy "Admins update site assets" on storage.objects
for update to authenticated using (
  public.is_admin()
  and bucket_id in (
    'site-gallery', 'site-cases', 'site-services', 'site-products', 'site-hero', 'site-about'
  )
) with check (
  public.is_admin()
  and bucket_id in (
    'site-gallery', 'site-cases', 'site-services', 'site-products', 'site-hero', 'site-about'
  )
);

drop policy if exists "Admins delete site assets" on storage.objects;
create policy "Admins delete site assets" on storage.objects
for delete to authenticated using (
  public.is_admin()
  and bucket_id in (
    'site-gallery', 'site-cases', 'site-services', 'site-products', 'site-hero', 'site-about'
  )
);
