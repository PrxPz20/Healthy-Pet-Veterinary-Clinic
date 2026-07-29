do $$
begin
  if exists (
    select 1
    from public.admin_users
    where role <> 'owner'
  ) then
    raise exception 'Cannot enable owner-only access while non-owner admin rows exist';
  end if;
end
$$;

alter table public.admin_users
  drop constraint if exists admin_users_role_check;

alter table public.admin_users
  drop constraint if exists admin_users_owner_role_check;

alter table public.admin_users
  alter column role set default 'owner';

alter table public.admin_users
  add constraint admin_users_owner_role_check
  check (role = 'owner');

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
      and role = 'owner'
      and is_active = true
  );
$$;
