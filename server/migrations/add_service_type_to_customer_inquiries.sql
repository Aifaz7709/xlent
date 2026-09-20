alter table public.customer_inquiries
add column if not exists service_type text
check (service_type in ('with_driver', 'self_drive', 'not_selected'));