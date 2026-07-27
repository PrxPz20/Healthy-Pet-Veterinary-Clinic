create or replace function public.bulk_content_action(
  target_table text, target_ids uuid[], target_action text
) returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  changed_count integer := 0;
  invalid_count integer := 0;
begin
  if not public.is_admin() then raise exception 'Admin access required'; end if;
  if target_table not in ('gallery_items', 'case_items', 'services', 'products', 'faq_items', 'testimonials') then
    raise exception 'Unsupported content type';
  end if;
  if target_action not in ('publish', 'unpublish', 'archive', 'restore', 'permanent_delete') then
    raise exception 'Unsupported bulk action';
  end if;
  if coalesce(cardinality(target_ids), 0) = 0 then raise exception 'Select at least one item'; end if;
  if cardinality(target_ids) > 100 then raise exception 'A maximum of 100 items can be changed at once'; end if;

  if target_action = 'publish' and target_table = 'gallery_items' then
    select count(*) into invalid_count from public.gallery_items item
    where item.id = any(target_ids) and not exists (
      select 1 from public.gallery_media media where media.gallery_item_id = item.id
    );
  elsif target_action = 'publish' and target_table in ('services', 'products') then
    execute format('select count(*) from public.%I where id = any($1) and image_path is null', target_table)
      into invalid_count using target_ids;
  end if;
  if invalid_count > 0 then raise exception 'Selected items are missing required media'; end if;

  if target_action = 'permanent_delete' then
    execute format('select count(*) from public.%I where id = any($1) and archived_at is null', target_table)
      into invalid_count using target_ids;
    if invalid_count > 0 then raise exception 'Only archived items can be permanently deleted'; end if;
    execute format('delete from public.%I where id = any($1)', target_table) using target_ids;
  elsif target_action = 'archive' then
    execute format(
      'update public.%I set status = ''draft'', archived_at = now() where id = any($1) and archived_at is null',
      target_table
    ) using target_ids;
  elsif target_action = 'restore' then
    execute format(
      'update public.%I set status = ''draft'', archived_at = null where id = any($1) and archived_at is not null',
      target_table
    ) using target_ids;
  else
    execute format('update public.%I set status = $2 where id = any($1) and archived_at is null', target_table)
      using target_ids, case when target_action = 'publish' then 'published'::public.content_status else 'draft'::public.content_status end;
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
