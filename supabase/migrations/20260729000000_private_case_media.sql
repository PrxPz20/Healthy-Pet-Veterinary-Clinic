update storage.buckets
set public = false
where id = 'site-cases';

drop policy if exists "Public reads site assets" on storage.objects;
create policy "Public reads site assets" on storage.objects
for select to anon, authenticated using (
  bucket_id in ('site-gallery', 'site-services', 'site-products', 'site-hero')
);

create index if not exists case_media_image_path_idx
on public.case_media (image_path);

drop policy if exists "Published case assets can be signed" on storage.objects;
create policy "Published case assets can be signed" on storage.objects
for select to anon, authenticated using (
  bucket_id = 'site-cases'
  and exists (
    select 1
    from public.case_media media
    join public.case_items item on item.id = media.case_item_id
    where media.image_path = storage.objects.name
      and item.status = 'published'
      and item.archived_at is null
  )
);

drop policy if exists "Active admins read case assets" on storage.objects;
create policy "Active admins read case assets" on storage.objects
for select to authenticated using (
  bucket_id = 'site-cases'
  and public.is_admin()
);
