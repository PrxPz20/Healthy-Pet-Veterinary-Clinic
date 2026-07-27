create table if not exists public.content_categories (
  id uuid primary key default gen_random_uuid(),
  section text not null check (section in ('cases', 'services', 'products')),
  name text not null check (char_length(trim(name)) between 2 and 80),
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  created_by uuid references auth.users(id)
);

create unique index if not exists content_categories_section_name_unique
on public.content_categories (section, lower(name));

alter table public.content_categories enable row level security;

drop policy if exists "Admins manage content categories" on public.content_categories;
create policy "Admins manage content categories" on public.content_categories
for all to authenticated using (public.is_admin()) with check (public.is_admin());

insert into public.content_categories (section, name)
select seed.section, seed.name
from (
  values
    ('services', 'General care'),
    ('products', 'Food'),
    ('products', 'Accessories')
) as seed(section, name)
where not exists (
  select 1 from public.content_categories category
  where category.section = seed.section
    and lower(category.name) = lower(seed.name)
);

insert into public.content_categories (section, name)
select 'services', source.category
from (
  select distinct on (lower(trim(category))) trim(category) as category
  from public.services
  order by lower(trim(category))
) source
where source.category <> ''
  and not exists (
    select 1 from public.content_categories category
    where category.section = 'services'
      and lower(category.name) = lower(source.category)
  );

insert into public.content_categories (section, name)
select 'products', source.category
from (
  select distinct on (lower(trim(category))) trim(category) as category
  from public.products
  order by lower(trim(category))
) source
where source.category <> ''
  and not exists (
    select 1 from public.content_categories category
    where category.section = 'products'
      and lower(category.name) = lower(source.category)
  );

insert into public.content_categories (section, name)
select 'cases', source.category
from (
  select distinct on (lower(trim(category))) trim(category) as category
  from public.case_items
  where category is not null
  order by lower(trim(category))
) source
where source.category <> ''
  and not exists (
    select 1 from public.content_categories category
    where category.section = 'cases'
      and lower(category.name) = lower(source.category)
  );

create or replace function public.rename_content_category(category_id uuid, new_name text)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  current_section text;
  current_name text;
  clean_name text := trim(new_name);
begin
  if not public.is_admin() then
    raise exception 'Admin access required';
  end if;

  if char_length(clean_name) not between 2 and 80 then
    raise exception 'Category names must be between 2 and 80 characters';
  end if;

  select section, name into current_section, current_name
  from public.content_categories
  where id = category_id;

  if not found then
    raise exception 'Category not found';
  end if;

  if current_section = 'services' then
    update public.services set category = clean_name where lower(category) = lower(current_name);
  elsif current_section = 'products' then
    update public.products set category = clean_name where lower(category) = lower(current_name);
  else
    update public.case_items set category = clean_name where lower(category) = lower(current_name);
  end if;

  update public.content_categories set name = clean_name where id = category_id;
end;
$$;

create or replace function public.delete_content_category(category_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  current_section text;
  current_name text;
  item_count integer;
begin
  if not public.is_admin() then
    raise exception 'Admin access required';
  end if;

  select section, name into current_section, current_name
  from public.content_categories
  where id = category_id;

  if not found then
    raise exception 'Category not found';
  end if;

  if current_section = 'services' then
    select count(*) into item_count from public.services where lower(category) = lower(current_name);
  elsif current_section = 'products' then
    select count(*) into item_count from public.products where lower(category) = lower(current_name);
  else
    select count(*) into item_count from public.case_items where lower(category) = lower(current_name);
  end if;

  if item_count > 0 then
    raise exception 'Move or delete the category items first';
  end if;

  delete from public.content_categories where id = category_id;
end;
$$;

revoke all on function public.rename_content_category(uuid, text) from public;
revoke all on function public.delete_content_category(uuid) from public;
grant execute on function public.rename_content_category(uuid, text) to authenticated;
grant execute on function public.delete_content_category(uuid) to authenticated;

alter table public.products
  drop constraint if exists products_description_check;

alter table public.products
  drop constraint if exists products_description_length;

alter table public.products
  alter column description set default '';

alter table public.products
  add constraint products_description_length
  check (char_length(description) <= 500);
