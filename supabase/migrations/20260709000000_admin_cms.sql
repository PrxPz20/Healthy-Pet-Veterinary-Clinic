create extension if not exists "pgcrypto";

do $$ begin
  create type public.content_status as enum ('draft', 'published');
exception
  when duplicate_object then null;
end $$;

create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'owner' check (role in ('owner', 'editor')),
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.gallery_items (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null check (char_length(title) between 2 and 120),
  description text not null check (char_length(description) between 2 and 600),
  status public.content_status not null default 'draft',
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  archived_at timestamptz,
  created_by uuid references auth.users(id),
  updated_by uuid references auth.users(id)
);

create table if not exists public.gallery_media (
  id uuid primary key default gen_random_uuid(),
  gallery_item_id uuid not null references public.gallery_items(id) on delete cascade,
  image_path text not null,
  alt text not null check (char_length(alt) between 2 and 180),
  sort_order integer not null default 0,
  is_cover boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.case_items (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null check (char_length(title) between 2 and 120),
  description text not null check (char_length(description) between 2 and 700),
  category text,
  is_sensitive boolean not null default true,
  status public.content_status not null default 'draft',
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  archived_at timestamptz,
  created_by uuid references auth.users(id),
  updated_by uuid references auth.users(id)
);

create table if not exists public.case_media (
  id uuid primary key default gen_random_uuid(),
  case_item_id uuid not null references public.case_items(id) on delete cascade,
  image_path text not null,
  alt text not null check (char_length(alt) between 2 and 180),
  sort_order integer not null default 0,
  is_cover boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.services (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null check (char_length(title) between 2 and 120),
  short text not null check (char_length(short) between 2 and 280),
  detail text not null check (char_length(detail) between 2 and 3200),
  category text not null default 'General care',
  icon text not null default 'Stethoscope',
  image_path text,
  status public.content_status not null default 'draft',
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  archived_at timestamptz,
  created_by uuid references auth.users(id),
  updated_by uuid references auth.users(id)
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 2 and 140),
  category text not null check (char_length(category) between 2 and 80),
  description text not null check (char_length(description) between 2 and 500),
  image_path text,
  wolt_url text,
  foody_url text,
  status public.content_status not null default 'draft',
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  archived_at timestamptz,
  created_by uuid references auth.users(id),
  updated_by uuid references auth.users(id)
);

create table if not exists public.hero_settings (
  id boolean primary key default true check (id),
  title text not null,
  body text not null,
  video_url text not null,
  poster_path text,
  status public.content_status not null default 'draft',
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users(id)
);

create table if not exists public.site_text (
  id uuid primary key default gen_random_uuid(),
  content_key text not null unique,
  label text not null,
  value text not null,
  status public.content_status not null default 'draft',
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users(id),
  check (content_key in (
    'homepage_services_heading',
    'homepage_gallery_heading',
    'homepage_cases_heading',
    'homepage_products_heading',
    'homepage_faq_heading',
    'homepage_contact_heading',
    'homepage_final_cta_heading'
  ))
);

create table if not exists public.audit_log (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references auth.users(id),
  action text not null,
  table_name text not null,
  record_id uuid,
  created_at timestamptz not null default now()
);

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.admin_users
    where user_id = auth.uid()
      and is_active = true
  );
$$;

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  new.updated_by = auth.uid();
  return new;
end;
$$;

drop trigger if exists gallery_items_touch_updated_at on public.gallery_items;
create trigger gallery_items_touch_updated_at
before update on public.gallery_items
for each row execute function public.touch_updated_at();

drop trigger if exists case_items_touch_updated_at on public.case_items;
create trigger case_items_touch_updated_at
before update on public.case_items
for each row execute function public.touch_updated_at();

drop trigger if exists services_touch_updated_at on public.services;
create trigger services_touch_updated_at
before update on public.services
for each row execute function public.touch_updated_at();

drop trigger if exists products_touch_updated_at on public.products;
create trigger products_touch_updated_at
before update on public.products
for each row execute function public.touch_updated_at();

alter table public.admin_users enable row level security;
alter table public.gallery_items enable row level security;
alter table public.gallery_media enable row level security;
alter table public.case_items enable row level security;
alter table public.case_media enable row level security;
alter table public.services enable row level security;
alter table public.products enable row level security;
alter table public.hero_settings enable row level security;
alter table public.site_text enable row level security;
alter table public.audit_log enable row level security;

drop policy if exists "Admins can read admin users" on public.admin_users;
create policy "Admins can read admin users" on public.admin_users
for select to authenticated using (public.is_admin());

drop policy if exists "Published gallery is public" on public.gallery_items;
create policy "Published gallery is public" on public.gallery_items
for select to anon, authenticated using (status = 'published' and archived_at is null);
drop policy if exists "Admins manage gallery" on public.gallery_items;
create policy "Admins manage gallery" on public.gallery_items
for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Published gallery media is public" on public.gallery_media;
create policy "Published gallery media is public" on public.gallery_media
for select to anon, authenticated using (
  exists (
    select 1 from public.gallery_items gi
    where gi.id = gallery_media.gallery_item_id
      and gi.status = 'published'
      and gi.archived_at is null
  )
);
drop policy if exists "Admins manage gallery media" on public.gallery_media;
create policy "Admins manage gallery media" on public.gallery_media
for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Published cases are public" on public.case_items;
create policy "Published cases are public" on public.case_items
for select to anon, authenticated using (status = 'published' and archived_at is null);
drop policy if exists "Admins manage cases" on public.case_items;
create policy "Admins manage cases" on public.case_items
for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Published case media is public" on public.case_media;
create policy "Published case media is public" on public.case_media
for select to anon, authenticated using (
  exists (
    select 1 from public.case_items ci
    where ci.id = case_media.case_item_id
      and ci.status = 'published'
      and ci.archived_at is null
  )
);
drop policy if exists "Admins manage case media" on public.case_media;
create policy "Admins manage case media" on public.case_media
for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Published services are public" on public.services;
create policy "Published services are public" on public.services
for select to anon, authenticated using (status = 'published' and archived_at is null);
drop policy if exists "Admins manage services" on public.services;
create policy "Admins manage services" on public.services
for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Published products are public" on public.products;
create policy "Published products are public" on public.products
for select to anon, authenticated using (status = 'published' and archived_at is null);
drop policy if exists "Admins manage products" on public.products;
create policy "Admins manage products" on public.products
for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Published hero is public" on public.hero_settings;
create policy "Published hero is public" on public.hero_settings
for select to anon, authenticated using (status = 'published');
drop policy if exists "Admins manage hero" on public.hero_settings;
create policy "Admins manage hero" on public.hero_settings
for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Published text is public" on public.site_text;
create policy "Published text is public" on public.site_text
for select to anon, authenticated using (status = 'published');
drop policy if exists "Admins manage text" on public.site_text;
create policy "Admins manage text" on public.site_text
for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Admins read audit log" on public.audit_log;
create policy "Admins read audit log" on public.audit_log
for select to authenticated using (public.is_admin());
drop policy if exists "Admins add audit log" on public.audit_log;
create policy "Admins add audit log" on public.audit_log
for insert to authenticated with check (public.is_admin());

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('site-gallery', 'site-gallery', true, 10485760, array['image/jpeg', 'image/png', 'image/webp']),
  ('site-cases', 'site-cases', true, 10485760, array['image/jpeg', 'image/png', 'image/webp']),
  ('site-services', 'site-services', true, 10485760, array['image/jpeg', 'image/png', 'image/webp']),
  ('site-products', 'site-products', true, 10485760, array['image/jpeg', 'image/png', 'image/webp']),
  ('site-hero', 'site-hero', true, 10485760, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do nothing;

insert into public.site_text (content_key, label, value, status)
values
  ('homepage_services_heading', 'Homepage services heading', 'Veterinary services, delivered with patience.', 'draft'),
  ('homepage_gallery_heading', 'Homepage gallery heading', 'Real moments from the clinic.', 'draft'),
  ('homepage_cases_heading', 'Homepage cases heading', 'Documented veterinary cases.', 'draft'),
  ('homepage_products_heading', 'Homepage products heading', 'Pet food and everyday essentials.', 'draft'),
  ('homepage_faq_heading', 'Homepage FAQ heading', 'Direct answers before you call.', 'draft'),
  ('homepage_contact_heading', 'Homepage contact heading', 'Visit Healthy Pet', 'draft'),
  ('homepage_final_cta_heading', 'Homepage final CTA heading', 'Ready to speak with the clinic?', 'draft')
on conflict (content_key) do nothing;

drop policy if exists "Public reads site assets" on storage.objects;
create policy "Public reads site assets" on storage.objects
for select to anon, authenticated using (
  bucket_id in ('site-gallery', 'site-cases', 'site-services', 'site-products', 'site-hero')
);

drop policy if exists "Admins upload site assets" on storage.objects;
create policy "Admins upload site assets" on storage.objects
for insert to authenticated with check (
  public.is_admin()
  and bucket_id in ('site-gallery', 'site-cases', 'site-services', 'site-products', 'site-hero')
);

drop policy if exists "Admins update site assets" on storage.objects;
create policy "Admins update site assets" on storage.objects
for update to authenticated using (
  public.is_admin()
  and bucket_id in ('site-gallery', 'site-cases', 'site-services', 'site-products', 'site-hero')
) with check (
  public.is_admin()
  and bucket_id in ('site-gallery', 'site-cases', 'site-services', 'site-products', 'site-hero')
);
