create or replace function public.normalize_archived_content()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  if new.archived_at is not null then
    new.status = 'draft';
  end if;
  return new;
end;
$$;

do $$
declare table_name text;
begin
  foreach table_name in array array[
    'gallery_items', 'case_items', 'services', 'products', 'faq_items', 'testimonials'
  ] loop
    execute format('drop trigger if exists normalize_archived_content on public.%I', table_name);
    execute format(
      'create trigger normalize_archived_content before insert or update on public.%I for each row execute function public.normalize_archived_content()',
      table_name
    );
    execute format(
      'update public.%I set status = ''draft'' where archived_at is not null and status <> ''draft''',
      table_name
    );
  end loop;
end;
$$;

create or replace function public.save_contact_methods(
  next_phones jsonb,
  next_whatsapp text,
  next_email text
) returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  phone_item jsonb;
  phone_count integer := jsonb_array_length(coalesce(next_phones, '[]'::jsonb));
  clean_email text := trim(coalesce(next_email, ''));
  clean_whatsapp text := regexp_replace(coalesce(next_whatsapp, ''), '[^0-9+]', '', 'g');
  position integer := 0;
begin
  if not public.is_admin() then raise exception 'Admin access required'; end if;
  if phone_count > 3 then raise exception 'A maximum of three phone numbers is allowed'; end if;
  if phone_count = 0 and clean_whatsapp = '' and clean_email = '' then
    raise exception 'Add at least one phone number, WhatsApp number, or email';
  end if;
  if clean_email <> '' and clean_email !~* '^[A-Z0-9._%+-]+@[A-Z0-9.-]+[.][A-Z]{2,}$' then
    raise exception 'Enter a valid email address';
  end if;
  if clean_whatsapp <> '' and clean_whatsapp !~ '^[+][1-9][0-9]{7,14}$' then
    raise exception 'Use international format for WhatsApp, for example +35795952663';
  end if;

  for phone_item in select value from jsonb_array_elements(coalesce(next_phones, '[]'::jsonb))
  loop
    if trim(coalesce(phone_item->>'label', '')) = ''
      or regexp_replace(coalesce(phone_item->>'number', ''), '[^0-9+]', '', 'g') !~ '^[+][1-9][0-9]{7,14}$' then
      raise exception 'Each phone needs a label and an international-format number';
    end if;
  end loop;

  delete from public.contact_phones where id is not null;
  for phone_item in select value from jsonb_array_elements(coalesce(next_phones, '[]'::jsonb))
  loop
    insert into public.contact_phones (label, phone, sort_order)
    values (
      trim(phone_item->>'label'),
      regexp_replace(phone_item->>'number', '[^0-9+]', '', 'g'),
      position
    );
    position := position + 1;
  end loop;

  update public.contact_settings set
    whatsapp = clean_whatsapp, email = clean_email, updated_at = now(), updated_by = auth.uid()
  where id = true;
  insert into public.audit_log (actor_id, action, table_name)
  values (auth.uid(), 'update_contact_methods', 'contact_settings');
end;
$$;

create or replace function public.save_opening_hours(next_hours jsonb)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  hour_item jsonb;
  open_days integer := 0;
  first_open time;
  first_close time;
  second_open time;
  second_close time;
  closed boolean;
begin
  if not public.is_admin() then raise exception 'Admin access required'; end if;
  if jsonb_array_length(coalesce(next_hours, '[]'::jsonb)) <> 7 then
    raise exception 'Opening hours must include all seven days';
  end if;

  for hour_item in select value from jsonb_array_elements(next_hours)
  loop
    closed := coalesce((hour_item->>'isClosed')::boolean, false);
    first_open := nullif(hour_item->>'opens1', '')::time;
    first_close := nullif(hour_item->>'closes1', '')::time;
    second_open := nullif(hour_item->>'opens2', '')::time;
    second_close := nullif(hour_item->>'closes2', '')::time;
    if not closed then
      open_days := open_days + 1;
      if first_open is null or first_close is null or first_open >= first_close then
        raise exception 'Each open day needs a valid opening and closing time';
      end if;
      if (second_open is null) <> (second_close is null)
        or (second_open is not null and (second_open >= second_close or first_close > second_open)) then
        raise exception 'Second opening period must be complete and cannot overlap';
      end if;
    end if;
  end loop;
  if open_days = 0 then raise exception 'At least one day must be open'; end if;

  delete from public.opening_hours where day_index between 0 and 6;
  for hour_item in select value from jsonb_array_elements(next_hours)
  loop
    closed := coalesce((hour_item->>'isClosed')::boolean, false);
    first_open := nullif(hour_item->>'opens1', '')::time;
    first_close := nullif(hour_item->>'closes1', '')::time;
    second_open := nullif(hour_item->>'opens2', '')::time;
    second_close := nullif(hour_item->>'closes2', '')::time;
    insert into public.opening_hours (
      day_index, day_name, is_closed, opens_1, closes_1, opens_2, closes_2
    ) values (
      (hour_item->>'dayIndex')::smallint,
      case (hour_item->>'dayIndex')::smallint
        when 0 then 'Monday' when 1 then 'Tuesday' when 2 then 'Wednesday'
        when 3 then 'Thursday' when 4 then 'Friday' when 5 then 'Saturday'
        when 6 then 'Sunday'
      end,
      closed,
      case when closed then null else first_open end,
      case when closed then null else first_close end,
      case when closed then null else second_open end,
      case when closed then null else second_close end
    );
  end loop;

  update public.contact_settings set updated_at = now(), updated_by = auth.uid() where id = true;
  insert into public.audit_log (actor_id, action, table_name)
  values (auth.uid(), 'update_opening_hours', 'opening_hours');
end;
$$;

revoke all on function public.save_contact_methods(jsonb, text, text) from public;
revoke all on function public.save_opening_hours(jsonb) from public;
grant execute on function public.save_contact_methods(jsonb, text, text) to authenticated;
grant execute on function public.save_opening_hours(jsonb) to authenticated;

create or replace function public.bulk_content_action(
  target_table text, target_ids uuid[], target_action text
) returns integer
language plpgsql security definer set search_path = public
as $$
declare changed_count integer := 0; invalid_count integer := 0;
begin
  if not public.is_admin() then raise exception 'Admin access required'; end if;
  if target_table not in ('gallery_items', 'case_items', 'services', 'products', 'faq_items', 'testimonials') then
    raise exception 'Unsupported content type';
  end if;
  if target_action not in ('publish', 'unpublish', 'archive', 'permanent_delete') then
    raise exception 'Unsupported bulk action';
  end if;
  if coalesce(cardinality(target_ids), 0) = 0 then raise exception 'Select at least one item'; end if;

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
