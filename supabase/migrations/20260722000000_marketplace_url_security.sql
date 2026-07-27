begin;

-- CMS links are rendered as public anchors, so enforce safe HTTPS marketplace hosts in PostgreSQL too.
update public.products
set wolt_url = null
where wolt_url is not null
  and wolt_url !~* '^https://([a-z0-9-]+[.])*wolt[.]com(/|$)';

update public.products
set foody_url = null
where foody_url is not null
  and foody_url !~* '^https://([a-z0-9-]+[.])*foody[.]com[.]cy(/|$)';

alter table public.products
  drop constraint if exists products_wolt_url_security;
alter table public.products
  add constraint products_wolt_url_security
  check (wolt_url is null or wolt_url ~* '^https://([a-z0-9-]+[.])*wolt[.]com(/|$)');

alter table public.products
  drop constraint if exists products_foody_url_security;
alter table public.products
  add constraint products_foody_url_security
  check (foody_url is null or foody_url ~* '^https://([a-z0-9-]+[.])*foody[.]com[.]cy(/|$)');

commit;
