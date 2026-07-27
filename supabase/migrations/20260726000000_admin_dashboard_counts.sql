create or replace function public.get_admin_dashboard_counts()
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
begin
  if not public.is_admin() then
    raise exception 'Admin access required';
  end if;

  return jsonb_build_object(
    'gallery', (select count(*) from public.gallery_items where archived_at is null),
    'cases', (select count(*) from public.case_items where archived_at is null),
    'services', (select count(*) from public.services where archived_at is null),
    'products', (select count(*) from public.products where archived_at is null),
    'faqs', (select count(*) from public.faq_items where archived_at is null),
    'reviews', (select count(*) from public.testimonials where archived_at is null)
  );
end;
$$;

revoke all on function public.get_admin_dashboard_counts() from public;
grant execute on function public.get_admin_dashboard_counts() to authenticated;
