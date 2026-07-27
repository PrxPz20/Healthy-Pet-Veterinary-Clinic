create table if not exists public.contact_settings (
  id boolean primary key default true check (id),
  street text not null check (char_length(trim(street)) between 2 and 160),
  city text not null check (char_length(trim(city)) between 2 and 80),
  region text not null default '' check (char_length(region) <= 80),
  postal_code text not null check (char_length(trim(postal_code)) between 2 and 20),
  country text not null check (char_length(trim(country)) between 2 and 80),
  map_url text not null default '' check (char_length(map_url) <= 1000),
  email text not null default '' check (char_length(email) <= 254),
  whatsapp text not null default '' check (char_length(whatsapp) <= 24),
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users(id)
);

create table if not exists public.contact_phones (
  id uuid primary key default gen_random_uuid(),
  label text not null check (char_length(trim(label)) between 2 and 40),
  phone text not null check (phone ~ '^[+][1-9][0-9]{7,14}$'),
  sort_order smallint not null check (sort_order between 0 and 2),
  unique (sort_order)
);

create table if not exists public.opening_hours (
  day_index smallint primary key check (day_index between 0 and 6),
  day_name text not null,
  is_closed boolean not null default false,
  opens_1 time,
  closes_1 time,
  opens_2 time,
  closes_2 time,
  check (
    (is_closed and opens_1 is null and closes_1 is null and opens_2 is null and closes_2 is null)
    or
    (
      not is_closed
      and opens_1 is not null and closes_1 is not null and opens_1 < closes_1
      and (
        (opens_2 is null and closes_2 is null)
        or
        (opens_2 is not null and closes_2 is not null and opens_2 < closes_2 and closes_1 <= opens_2)
      )
    )
  )
);

alter table public.contact_settings enable row level security;
alter table public.contact_phones enable row level security;
alter table public.opening_hours enable row level security;

drop policy if exists "Public reads contact settings" on public.contact_settings;
create policy "Public reads contact settings" on public.contact_settings
for select to anon, authenticated using (true);

drop policy if exists "Public reads contact phones" on public.contact_phones;
create policy "Public reads contact phones" on public.contact_phones
for select to anon, authenticated using (true);

drop policy if exists "Public reads opening hours" on public.opening_hours;
create policy "Public reads opening hours" on public.opening_hours
for select to anon, authenticated using (true);

insert into public.contact_settings (
  id, street, city, region, postal_code, country, map_url, email, whatsapp
) values (
  true,
  'Katinas Paxinou 66, Agios Athanasios',
  'Limassol',
  'Limassol',
  '4105',
  'Cyprus',
  'https://maps.app.goo.gl/A6khHFn8mRUFN6qd9',
  'vetdr2000cy@gmail.com',
  '+35795952663'
) on conflict (id) do nothing;

insert into public.contact_phones (label, phone, sort_order)
values
  ('Clinic Phone', '+35725101352', 0),
  ('Vet Phone', '+35795952663', 1)
on conflict (sort_order) do nothing;

insert into public.opening_hours (day_index, day_name, is_closed, opens_1, closes_1, opens_2, closes_2)
values
  (0, 'Monday', false, '09:00', '13:00', '15:00', '19:00'),
  (1, 'Tuesday', false, '09:00', '13:00', '15:00', '19:00'),
  (2, 'Wednesday', false, '09:00', '14:00', null, null),
  (3, 'Thursday', false, '09:00', '13:00', '15:00', '19:00'),
  (4, 'Friday', false, '09:00', '13:00', '15:00', '19:00'),
  (5, 'Saturday', false, '09:00', '14:00', null, null),
  (6, 'Sunday', true, null, null, null, null)
on conflict (day_index) do nothing;

create or replace function public.save_contact_address(
  next_street text,
  next_city text,
  next_region text,
  next_postal_code text,
  next_country text,
  next_map_url text
) returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_admin() then raise exception 'Admin access required'; end if;
  if char_length(trim(next_street)) not between 2 and 160
    or char_length(trim(next_city)) not between 2 and 80
    or char_length(trim(next_postal_code)) not between 2 and 20
    or char_length(trim(next_country)) not between 2 and 80 then
    raise exception 'Complete all required address fields';
  end if;
  if coalesce(next_map_url, '') <> '' and next_map_url !~ '^https://(www[.])?(google[.][a-z.]+/maps|maps[.]app[.]goo[.]gl)/' then
    raise exception 'Enter a valid Google Maps link';
  end if;

  update public.contact_settings set
    street = trim(next_street), city = trim(next_city), region = trim(coalesce(next_region, '')),
    postal_code = trim(next_postal_code), country = trim(next_country),
    map_url = trim(coalesce(next_map_url, '')), updated_at = now(), updated_by = auth.uid()
  where id = true;
  insert into public.audit_log (actor_id, action, table_name)
  values (auth.uid(), 'update_address', 'contact_settings');
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

  delete from public.contact_phones;
  for phone_item in select value from jsonb_array_elements(coalesce(next_phones, '[]'::jsonb))
  loop
    if trim(coalesce(phone_item->>'label', '')) = ''
      or regexp_replace(coalesce(phone_item->>'number', ''), '[^0-9+]', '', 'g') !~ '^[+][1-9][0-9]{7,14}$' then
      raise exception 'Each phone needs a label and an international-format number';
    end if;
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

  delete from public.opening_hours;
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
    insert into public.opening_hours (
      day_index, day_name, is_closed, opens_1, closes_1, opens_2, closes_2
    ) values (
      (hour_item->>'dayIndex')::smallint,
      case (hour_item->>'dayIndex')::smallint
        when 0 then 'Monday'
        when 1 then 'Tuesday'
        when 2 then 'Wednesday'
        when 3 then 'Thursday'
        when 4 then 'Friday'
        when 5 then 'Saturday'
        when 6 then 'Sunday'
      end,
      closed,
      case when closed then null else first_open end,
      case when closed then null else first_close end,
      case when closed then null else second_open end,
      case when closed then null else second_close end
    );
  end loop;
  if open_days = 0 then raise exception 'At least one day must be open'; end if;

  update public.contact_settings set updated_at = now(), updated_by = auth.uid() where id = true;
  insert into public.audit_log (actor_id, action, table_name)
  values (auth.uid(), 'update_opening_hours', 'opening_hours');
end;
$$;

revoke all on function public.save_contact_address(text, text, text, text, text, text) from public;
revoke all on function public.save_contact_methods(jsonb, text, text) from public;
revoke all on function public.save_opening_hours(jsonb) from public;
grant execute on function public.save_contact_address(text, text, text, text, text, text) to authenticated;
grant execute on function public.save_contact_methods(jsonb, text, text) to authenticated;
grant execute on function public.save_opening_hours(jsonb) to authenticated;
