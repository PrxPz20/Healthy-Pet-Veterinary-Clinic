begin;

create or replace function public.enforce_editorial_item_limit()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  active_count integer;
  item_label text;
begin
  if tg_table_name not in ('faq_items', 'testimonials') then
    raise exception 'Unsupported editorial table';
  end if;

  if new.archived_at is not null then
    return new;
  end if;

  if tg_op = 'UPDATE' and old.archived_at is null then
    return new;
  end if;

  perform pg_advisory_xact_lock(hashtext('editorial-limit:' || tg_table_name));
  execute format(
    'select count(*) from public.%I where archived_at is null',
    tg_table_name
  ) into active_count;

  if active_count >= 12 then
    item_label := case when tg_table_name = 'faq_items' then 'FAQs' else 'Google reviews' end;
    raise exception using
      errcode = 'P0001',
      message = format('A maximum of 12 active %s is allowed. Archive an item before adding or restoring another.', item_label);
  end if;

  return new;
end;
$$;

drop trigger if exists faq_items_enforce_limit on public.faq_items;
create trigger faq_items_enforce_limit
before insert or update of archived_at on public.faq_items
for each row execute function public.enforce_editorial_item_limit();

drop trigger if exists testimonials_enforce_limit on public.testimonials;
create trigger testimonials_enforce_limit
before insert or update of archived_at on public.testimonials
for each row execute function public.enforce_editorial_item_limit();

revoke all on function public.enforce_editorial_item_limit() from public;

commit;
