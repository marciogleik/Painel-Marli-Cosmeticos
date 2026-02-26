-- Add last_login_at to track actual login time
ALTER TABLE public.professionals ADD COLUMN last_login_at timestamp with time zone;