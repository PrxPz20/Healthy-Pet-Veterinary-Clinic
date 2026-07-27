alter table public.gallery_items
  drop constraint if exists gallery_items_description_check;

alter table public.gallery_items
  alter column description drop not null;

alter table public.gallery_items
  add constraint gallery_items_description_length
  check (description is null or char_length(description) <= 600);

alter table public.case_items
  drop constraint if exists case_items_description_check;

alter table public.case_items
  alter column description drop not null;

alter table public.case_items
  add constraint case_items_description_length
  check (description is null or char_length(description) <= 700);
