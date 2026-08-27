alter table public.contact_social_links
  add column if not exists id uuid default gen_random_uuid();

update public.contact_social_links
set id = gen_random_uuid()
where id is null;

alter table public.contact_social_links
  alter column id set not null,
  drop constraint if exists contact_social_links_pkey,
  drop constraint if exists contact_social_links_platform_check,
  drop constraint if exists contact_social_links_sort_order_check;

alter table public.contact_social_links
  add primary key (id),
  add constraint contact_social_links_platform_check
    check (platform in ('Instagram', 'Facebook', 'TikTok', 'YouTube', 'X', 'Threads', 'Pinterest', 'WhatsApp')),
  add constraint contact_social_links_sort_order_check
    check (sort_order between 0 and 11);

create unique index if not exists contact_social_links_url_unique
  on public.contact_social_links (lower(url));

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
  if jsonb_array_length(coalesce(next_links, '[]'::jsonb)) > 12 then
    raise exception 'A maximum of 12 social media links is allowed';
  end if;

  delete from public.contact_social_links where id is not null;

  for link_item in select value from jsonb_array_elements(coalesce(next_links, '[]'::jsonb))
  loop
    clean_platform := trim(coalesce(link_item->>'label', ''));
    clean_url := trim(coalesce(link_item->>'href', ''));

    if clean_platform not in ('Instagram', 'Facebook', 'TikTok', 'YouTube', 'X', 'Threads', 'Pinterest', 'WhatsApp') then
      raise exception 'Choose an approved social media platform';
    end if;
    if char_length(clean_url) > 1000 then
      raise exception 'Social media links must be 1000 characters or fewer';
    end if;
    if (clean_platform = 'Instagram' and clean_url !~* '^https://([a-z0-9-]+[.])*instagram[.]com(/|$)')
      or (clean_platform = 'Facebook' and clean_url !~* '^https://([a-z0-9-]+[.])*facebook[.]com(/|$)')
      or (clean_platform = 'TikTok' and clean_url !~* '^https://([a-z0-9-]+[.])*tiktok[.]com(/|$)')
      or (clean_platform = 'YouTube' and clean_url !~* '^https://(([a-z0-9-]+[.])*youtube[.]com|youtu[.]be)(/|$)')
      or (clean_platform = 'X' and clean_url !~* '^https://(([a-z0-9-]+[.])*x[.]com|([a-z0-9-]+[.])*twitter[.]com)(/|$)')
      or (clean_platform = 'Threads' and clean_url !~* '^https://([a-z0-9-]+[.])*threads[.]net(/|$)')
      or (clean_platform = 'Pinterest' and clean_url !~* '^https://(([a-z0-9-]+[.])*pinterest[.]com|pin[.]it)(/|$)')
      or (clean_platform = 'WhatsApp' and clean_url !~* '^https://(wa[.]me|([a-z0-9-]+[.])*whatsapp[.]com)(/|$)') then
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
