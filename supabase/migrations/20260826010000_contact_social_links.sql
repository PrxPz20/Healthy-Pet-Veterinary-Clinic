create table if not exists public.contact_social_links (
  platform text primary key check (platform in ('Instagram', 'Facebook', 'TikTok', 'YouTube')),
  url text not null check (char_length(url) between 10 and 1000 and url ~ '^https://'),
  sort_order smallint not null check (sort_order between 0 and 3),
  unique (sort_order)
);

alter table public.contact_social_links enable row level security;

drop policy if exists "Public reads contact social links" on public.contact_social_links;
create policy "Public reads contact social links" on public.contact_social_links
for select to anon, authenticated using (true);

insert into public.contact_social_links (platform, url, sort_order)
values
  ('Instagram', 'https://www.instagram.com/healthypet_veterinaryclinic/', 0),
  ('Facebook', 'https://www.facebook.com/HealthyPetLimassol/', 1),
  ('TikTok', 'https://www.tiktok.com/@dr.vetmed7', 2),
  ('YouTube', 'https://www.youtube.com/@avgoustinostheodorou949', 3)
on conflict (platform) do nothing;

create or replace function public.save_contact_social_links(next_links jsonb)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  link_item jsonb;
  clean_platform text;
  clean_url text;
  position integer := 0;
begin
  if not public.is_admin() then raise exception 'Admin access required'; end if;
  if jsonb_typeof(coalesce(next_links, '[]'::jsonb)) <> 'array' then
    raise exception 'Social media links must be a list';
  end if;
  if jsonb_array_length(coalesce(next_links, '[]'::jsonb)) > 4 then
    raise exception 'A maximum of four social media links is allowed';
  end if;

  delete from public.contact_social_links where platform is not null;

  for link_item in select value from jsonb_array_elements(coalesce(next_links, '[]'::jsonb))
  loop
    clean_platform := trim(coalesce(link_item->>'label', ''));
    clean_url := trim(coalesce(link_item->>'href', ''));

    if clean_platform not in ('Instagram', 'Facebook', 'TikTok', 'YouTube') then
      raise exception 'Choose an approved social media platform';
    end if;
    if char_length(clean_url) > 1000 then
      raise exception 'Social media links must be 1000 characters or fewer';
    end if;
    if (clean_platform = 'Instagram' and clean_url !~* '^https://([^/@]+[.])?instagram[.]com(/|$)')
      or (clean_platform = 'Facebook' and clean_url !~* '^https://([^/@]+[.])?facebook[.]com(/|$)')
      or (clean_platform = 'TikTok' and clean_url !~* '^https://([^/@]+[.])?tiktok[.]com(/|$)')
      or (clean_platform = 'YouTube' and clean_url !~* '^https://(([^/@]+[.])?youtube[.]com|youtu[.]be)(/|$)') then
      raise exception 'Enter a valid HTTPS profile link for the selected platform';
    end if;

    insert into public.contact_social_links (platform, url, sort_order)
    values (clean_platform, clean_url, position);
    position := position + 1;
  end loop;

  insert into public.audit_log (actor_id, action, table_name)
  values (auth.uid(), 'update_social_links', 'contact_social_links');
end;
$$;

revoke all on function public.save_contact_social_links(jsonb) from public;
grant execute on function public.save_contact_social_links(jsonb) to authenticated;
