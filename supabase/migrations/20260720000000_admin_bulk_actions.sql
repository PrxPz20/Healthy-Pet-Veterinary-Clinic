create or replace function public.bulk_content_action(
  target_table text,
  target_ids uuid[],
  target_action text
) returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  changed_count integer := 0;
  invalid_count integer := 0;
begin
  if not public.is_admin() then
    raise exception 'Admin access required';
  end if;
  if target_table not in ('gallery_items', 'case_items', 'services', 'products') then
    raise exception 'Unsupported content type';
  end if;
  if target_action not in ('publish', 'unpublish', 'archive', 'permanent_delete') then
    raise exception 'Unsupported bulk action';
  end if;
  if coalesce(cardinality(target_ids), 0) = 0 then
    raise exception 'Select at least one item';
  end if;

  if target_action = 'publish' and target_table = 'gallery_items' then
    select count(*) into invalid_count
    from public.gallery_items item
    where item.id = any(target_ids)
      and not exists (
        select 1 from public.gallery_media media where media.gallery_item_id = item.id
      );
    if invalid_count > 0 then
      raise exception 'Every selected gallery item needs an image before publishing';
    end if;
  elsif target_action = 'publish' and target_table = 'services' then
    select count(*) into invalid_count
    from public.services
    where id = any(target_ids) and image_path is null;
    if invalid_count > 0 then
      raise exception 'Every selected service needs an image before publishing';
    end if;
  elsif target_action = 'publish' and target_table = 'products' then
    select count(*) into invalid_count
    from public.products
    where id = any(target_ids) and image_path is null;
    if invalid_count > 0 then
      raise exception 'Every selected product needs an image before publishing';
    end if;
  end if;

  if target_action = 'permanent_delete' then
    execute format(
      'select count(*) from public.%I where id = any($1) and archived_at is null',
      target_table
    ) into invalid_count using target_ids;
    if invalid_count > 0 then
      raise exception 'Only archived items can be permanently deleted';
    end if;
    execute format('delete from public.%I where id = any($1)', target_table)
      using target_ids;
  elsif target_action = 'archive' then
    execute format(
      'update public.%I set archived_at = now() where id = any($1) and archived_at is null',
      target_table
    ) using target_ids;
  else
    execute format(
      'update public.%I set status = $2 where id = any($1) and archived_at is null',
      target_table
    ) using target_ids, case when target_action = 'publish' then 'published'::public.content_status else 'draft'::public.content_status end;
  end if;

  get diagnostics changed_count = row_count;

  insert into public.audit_log (actor_id, action, table_name, record_id)
  select auth.uid(), target_action, target_table, selected.selected_id
  from unnest(target_ids) as selected(selected_id);

  return changed_count;
end;
$$;

revoke all on function public.bulk_content_action(text, uuid[], text) from public;
grant execute on function public.bulk_content_action(text, uuid[], text) to authenticated;

drop policy if exists "Admins delete site assets" on storage.objects;
create policy "Admins delete site assets" on storage.objects
for delete to authenticated using (
  public.is_admin()
  and bucket_id in ('site-gallery', 'site-cases', 'site-services', 'site-products', 'site-hero')
);

drop policy if exists "Admins manage gallery" on public.gallery_items;
drop policy if exists "Admins select gallery" on public.gallery_items;
create policy "Admins select gallery" on public.gallery_items
for select to authenticated using (public.is_admin());
drop policy if exists "Admins insert gallery" on public.gallery_items;
create policy "Admins insert gallery" on public.gallery_items
for insert to authenticated with check (public.is_admin());
drop policy if exists "Admins update gallery" on public.gallery_items;
create policy "Admins update gallery" on public.gallery_items
for update to authenticated using (public.is_admin()) with check (public.is_admin());
drop policy if exists "Admins delete archived gallery" on public.gallery_items;
create policy "Admins delete archived gallery" on public.gallery_items
for delete to authenticated using (public.is_admin() and archived_at is not null);

drop policy if exists "Admins manage cases" on public.case_items;
drop policy if exists "Admins select cases" on public.case_items;
create policy "Admins select cases" on public.case_items
for select to authenticated using (public.is_admin());
drop policy if exists "Admins insert cases" on public.case_items;
create policy "Admins insert cases" on public.case_items
for insert to authenticated with check (public.is_admin());
drop policy if exists "Admins update cases" on public.case_items;
create policy "Admins update cases" on public.case_items
for update to authenticated using (public.is_admin()) with check (public.is_admin());
drop policy if exists "Admins delete archived cases" on public.case_items;
create policy "Admins delete archived cases" on public.case_items
for delete to authenticated using (public.is_admin() and archived_at is not null);

drop policy if exists "Admins manage services" on public.services;
drop policy if exists "Admins select services" on public.services;
create policy "Admins select services" on public.services
for select to authenticated using (public.is_admin());
drop policy if exists "Admins insert services" on public.services;
create policy "Admins insert services" on public.services
for insert to authenticated with check (public.is_admin());
drop policy if exists "Admins update services" on public.services;
create policy "Admins update services" on public.services
for update to authenticated using (public.is_admin()) with check (public.is_admin());
drop policy if exists "Admins delete archived services" on public.services;
create policy "Admins delete archived services" on public.services
for delete to authenticated using (public.is_admin() and archived_at is not null);

drop policy if exists "Admins manage products" on public.products;
drop policy if exists "Admins select products" on public.products;
create policy "Admins select products" on public.products
for select to authenticated using (public.is_admin());
drop policy if exists "Admins insert products" on public.products;
create policy "Admins insert products" on public.products
for insert to authenticated with check (public.is_admin());
drop policy if exists "Admins update products" on public.products;
create policy "Admins update products" on public.products
for update to authenticated using (public.is_admin()) with check (public.is_admin());
drop policy if exists "Admins delete archived products" on public.products;
create policy "Admins delete archived products" on public.products
for delete to authenticated using (public.is_admin() and archived_at is not null);
