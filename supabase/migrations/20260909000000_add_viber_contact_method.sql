alter table public.contact_settings
  add column if not exists viber text not null default '';

alter table public.contact_settings
  drop constraint if exists contact_settings_viber_check;

alter table public.contact_settings
  add constraint contact_settings_viber_check
  check (viber = '' or viber ~ '^[+][1-9][0-9]{7,14}$');

drop function if exists public.save_contact_methods(jsonb, text, text);

create or replace function public.save_contact_methods(
  next_phones jsonb,
  next_whatsapp text,
  next_viber text,
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
  clean_viber text := regexp_replace(coalesce(next_viber, ''), '[^0-9+]', '', 'g');
  position integer := 0;
begin
  if not public.is_admin() then raise exception 'Admin access required'; end if;
  if phone_count > 3 then raise exception 'A maximum of three phone numbers is allowed'; end if;
  if phone_count = 0 and clean_whatsapp = '' and clean_viber = '' and clean_email = '' then
    raise exception 'Add at least one phone number, WhatsApp number, Viber number, or email';
  end if;
  if clean_email <> '' and clean_email !~* '^[A-Z0-9._%+-]+@[A-Z0-9.-]+[.][A-Z]{2,}$' then
    raise exception 'Enter a valid email address';
  end if;
  if clean_whatsapp <> '' and clean_whatsapp !~ '^[+][1-9][0-9]{7,14}$' then
    raise exception 'Use international format for WhatsApp, for example +35795952663';
  end if;
  if clean_viber <> '' and clean_viber !~ '^[+][1-9][0-9]{7,14}$' then
    raise exception 'Use international format for Viber, for example +35795952663';
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
    whatsapp = clean_whatsapp,
    viber = clean_viber,
    email = clean_email,
    updated_at = now(),
    updated_by = auth.uid()
  where id = true;

  insert into public.audit_log (actor_id, action, table_name)
  values (auth.uid(), 'update_contact_methods', 'contact_settings');
end;
$$;

revoke all on function public.save_contact_methods(jsonb, text, text, text) from public;
grant execute on function public.save_contact_methods(jsonb, text, text, text) to authenticated;
