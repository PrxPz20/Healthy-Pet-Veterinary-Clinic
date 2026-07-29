alter table public.case_media
  drop constraint if exists case_media_private_storage_path;

alter table public.case_media
  add constraint case_media_private_storage_path
  check (image_path not like 'static:case:%');
