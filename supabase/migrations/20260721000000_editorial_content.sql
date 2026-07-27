begin;

drop table if exists public.hero_settings;
drop table if exists public.site_text;

create table if not exists public.faq_items (
  id uuid primary key default gen_random_uuid(),
  question text not null check (char_length(trim(question)) between 5 and 180),
  answer text not null check (char_length(trim(answer)) between 5 and 1200),
  status public.content_status not null default 'published',
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  archived_at timestamptz
);

create table if not exists public.testimonials (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(trim(name)) between 2 and 100),
  rating smallint not null default 5 check (rating between 1 and 5),
  review_text text not null check (char_length(trim(review_text)) between 5 and 2000),
  status public.content_status not null default 'published',
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  archived_at timestamptz
);

create table if not exists public.about_settings (
  id boolean primary key default true check (id),
  label text not null check (char_length(trim(label)) between 2 and 40),
  heading text not null check (char_length(trim(heading)) between 5 and 180),
  paragraph_one text not null check (char_length(trim(paragraph_one)) between 5 and 1200),
  paragraph_two text not null default '' check (char_length(paragraph_two) <= 1200),
  years_experience integer check (years_experience between 0 and 100),
  completed_cases integer check (completed_cases between 0 and 1000000),
  updated_at timestamptz not null default now()
);

create or replace function public.touch_editorial_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create unique index if not exists faq_items_question_unique
on public.faq_items (lower(question));

create unique index if not exists testimonials_content_unique
on public.testimonials (md5(name || E'\x1f' || review_text));

drop trigger if exists faq_items_touch_updated_at on public.faq_items;
create trigger faq_items_touch_updated_at before update on public.faq_items
for each row execute function public.touch_editorial_updated_at();

drop trigger if exists testimonials_touch_updated_at on public.testimonials;
create trigger testimonials_touch_updated_at before update on public.testimonials
for each row execute function public.touch_editorial_updated_at();

drop trigger if exists about_settings_touch_updated_at on public.about_settings;
create trigger about_settings_touch_updated_at before update on public.about_settings
for each row execute function public.touch_editorial_updated_at();

alter table public.faq_items enable row level security;
alter table public.testimonials enable row level security;
alter table public.about_settings enable row level security;

drop policy if exists "Published FAQs are public" on public.faq_items;
drop policy if exists "Admins read all FAQs" on public.faq_items;
drop policy if exists "Admins create FAQs" on public.faq_items;
drop policy if exists "Admins update FAQs" on public.faq_items;
drop policy if exists "Admins delete archived FAQs" on public.faq_items;
create policy "Published FAQs are public" on public.faq_items
for select to anon, authenticated using (status = 'published' and archived_at is null);
create policy "Admins read all FAQs" on public.faq_items
for select to authenticated using (public.is_admin());
create policy "Admins create FAQs" on public.faq_items
for insert to authenticated with check (public.is_admin());
create policy "Admins update FAQs" on public.faq_items
for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "Admins delete archived FAQs" on public.faq_items
for delete to authenticated using (public.is_admin() and archived_at is not null);

drop policy if exists "Published testimonials are public" on public.testimonials;
drop policy if exists "Admins read all testimonials" on public.testimonials;
drop policy if exists "Admins create testimonials" on public.testimonials;
drop policy if exists "Admins update testimonials" on public.testimonials;
drop policy if exists "Admins delete archived testimonials" on public.testimonials;
create policy "Published testimonials are public" on public.testimonials
for select to anon, authenticated using (status = 'published' and archived_at is null);
create policy "Admins read all testimonials" on public.testimonials
for select to authenticated using (public.is_admin());
create policy "Admins create testimonials" on public.testimonials
for insert to authenticated with check (public.is_admin());
create policy "Admins update testimonials" on public.testimonials
for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "Admins delete archived testimonials" on public.testimonials
for delete to authenticated using (public.is_admin() and archived_at is not null);

drop policy if exists "About settings are public" on public.about_settings;
drop policy if exists "Admins create about settings" on public.about_settings;
drop policy if exists "Admins update about settings" on public.about_settings;
create policy "About settings are public" on public.about_settings
for select to anon, authenticated using (true);
create policy "Admins create about settings" on public.about_settings
for insert to authenticated with check (public.is_admin());
create policy "Admins update about settings" on public.about_settings
for update to authenticated using (public.is_admin()) with check (public.is_admin());

insert into public.about_settings (
  id, label, heading, paragraph_one, paragraph_two, years_experience, completed_cases
) values (
  true,
  'About Us',
  'Veterinary medicine and physiotherapy in one practice.',
  'Healthy Pet Veterinary Clinic was established by Dr. Avgoustinos Theodorou, who studied Veterinary Medicine and specialised in Veterinary Physiotherapy.',
  'Dr. Avgoustinos speaks Russian, Greek, and English, helping owners discuss their pet''s care clearly and comfortably.',
  20,
  1000
) on conflict (id) do nothing;

insert into public.faq_items (question, answer, sort_order) values
  ('How can I contact the clinic before visiting?', 'Call +357 25 101352 or send a WhatsApp message to +357 95 952663 during working hours to ask about visit timing.', 0),
  ('What veterinary services are available in Limassol?', 'The clinic supports pathology, full laboratory blood tests, orthopedic and soft tissue surgery, dermatology, ultrasound, digital X-ray, hydrotherapy, physiotherapy, acupuncture, endoscopy, grooming, and pet shop products.', 1),
  ('Can I ask about pet food before buying?', 'Yes. Contact the clinic to ask about current product availability and options suited to your pet''s age and needs.', 2),
  ('What should I bring to a first visit?', 'Bring vaccination records, medication details, recent test results if available, and a short note of symptoms or behavior changes you have noticed.', 3),
  ('What if my pet seems stressed at the vet?', 'Tell the clinic before arrival. Dr. Avgoustinos can suggest calmer timing, safe handling tips, and simple steps that make the visit less stressful.', 4)
on conflict do nothing;

insert into public.testimonials (name, rating, review_text, sort_order) values
  ('Andonis', 5, 'Very experienced vet, great approach, very friendly and smooth with the dog, made it feel very calm and comfortable. Generally very happy and if you care about your pet to take it to a good vet, I recommend him.', 0),
  ('Yiannis', 5, 'A small clinic but very helpful! My dog was not eating at the time, and I had no idea what the reason could be. I took him to the clinic and they were very patient with him and tried different things to determine why he had lost his appetite. They were very attentive and I could tell they have a lot of love for animals and that made me trust them. I would recommend them!', 1),
  ('Дмитрий', 5, 'I think the Russian storyteller Chukovsky could take the example of Dr. Abolit from Dr. Avgustinos. A very attentive and helpful doctor, always surrounded by cats. Speaks Russian well. My highest recommendations. We have sterilized our cat and regularly carry out the necessary vaccinations with him.', 2),
  ('Anna', 5, 'Fantastic service, open and informative communication about my cats condition, his diagnosis and prognosis and professional approach to future treatment. He saved our little baby Lucy for a certain death! It was a miracle! Dr. Augoustinos is very knowledgeable and offers detail explanations and practical advice. I was surprised how much he loves his job and animals. His experience shows and instills confidence!', 3),
  ('Dia', 5, 'The service at this clinic is exceptional! Dr Avgoustinos is a very knowledgeable, experienced and caring vet. He has treated my dog with great care and genuine concern. He is open to questions and explains everything you need to know in detail. Highly recommended!', 4),
  ('Alisa', 5, 'Great doctor, very empathetic and helped us with our adopted kitten!', 5),
  ('Yulia', 5, 'Thanks a lot for your care and attention to our dog Shibi!!', 6)
on conflict do nothing;

create or replace function public.bulk_content_action(
  target_table text, target_ids uuid[], target_action text
) returns integer
language plpgsql security definer set search_path = public
as $$
declare changed_count integer := 0; invalid_count integer := 0;
begin
  if not public.is_admin() then raise exception 'Admin access required'; end if;
  if target_table not in ('gallery_items', 'case_items', 'services', 'products', 'faq_items', 'testimonials') then
    raise exception 'Unsupported content type';
  end if;
  if target_action not in ('publish', 'unpublish', 'archive', 'permanent_delete') then
    raise exception 'Unsupported bulk action';
  end if;
  if coalesce(cardinality(target_ids), 0) = 0 then raise exception 'Select at least one item'; end if;

  if target_action = 'publish' and target_table = 'gallery_items' then
    select count(*) into invalid_count from public.gallery_items item
    where item.id = any(target_ids) and not exists (
      select 1 from public.gallery_media media where media.gallery_item_id = item.id
    );
  elsif target_action = 'publish' and target_table in ('services', 'products') then
    execute format('select count(*) from public.%I where id = any($1) and image_path is null', target_table)
      into invalid_count using target_ids;
  end if;
  if invalid_count > 0 then raise exception 'Selected items are missing required media'; end if;

  if target_action = 'permanent_delete' then
    execute format('select count(*) from public.%I where id = any($1) and archived_at is null', target_table)
      into invalid_count using target_ids;
    if invalid_count > 0 then raise exception 'Only archived items can be permanently deleted'; end if;
    execute format('delete from public.%I where id = any($1)', target_table) using target_ids;
  elsif target_action = 'archive' then
    execute format('update public.%I set archived_at = now() where id = any($1) and archived_at is null', target_table)
      using target_ids;
  else
    execute format('update public.%I set status = $2 where id = any($1) and archived_at is null', target_table)
      using target_ids, case when target_action = 'publish' then 'published'::public.content_status else 'draft'::public.content_status end;
  end if;
  get diagnostics changed_count = row_count;
  insert into public.audit_log (actor_id, action, table_name, record_id)
  select auth.uid(), target_action, target_table, selected.selected_id
  from unnest(target_ids) as selected(selected_id);
  return changed_count;
end;
$$;

revoke all on function public.bulk_content_action(text, uuid[], text) from public;
grant execute on function public.bulk_content_action(text, uuid[], text) to authenticated;

commit;
