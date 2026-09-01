update public.services
set image_path = case lower(title)
  when 'pathology' then 'static:service:pathology'
  when 'full laboratory blood tests' then 'static:service:laboratory-blood-tests'
  when 'ultrasound' then 'static:service:ultrasound'
  when 'endoscopy' then 'static:service:endoscopy'
  when 'digital x-ray' then 'static:service:digital-x-ray'
  when 'orthopedic surgery' then 'static:service:orthopedic-surgery'
  when 'soft tissue surgery' then 'static:service:soft-tissue-surgery'
  when 'pet physiotherapy & acupuncture' then 'static:service:physiotherapy-acupuncture'
  when 'dermatology' then 'static:service:dermatology'
  when 'pet shop' then 'static:service:pet-shop'
end
where lower(title) in (
  'pathology',
  'full laboratory blood tests',
  'ultrasound',
  'endoscopy',
  'digital x-ray',
  'orthopedic surgery',
  'soft tissue surgery',
  'pet physiotherapy & acupuncture',
  'dermatology',
  'pet shop'
)
and image_path ~* '\.png$';
