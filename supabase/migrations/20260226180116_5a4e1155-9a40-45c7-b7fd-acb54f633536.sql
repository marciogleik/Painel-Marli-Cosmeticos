-- Add email column to profiles
ALTER TABLE public.profiles ADD COLUMN email text;

-- Populate from auth.users
UPDATE public.profiles
SET email = u.email
FROM auth.users u
WHERE profiles.user_id = u.id;

-- Update trigger to include email on new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name, email)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email), NEW.email);
  RETURN NEW;
END;
$$;

-- Drop the get_user_email RPC since email is now on profiles
DROP FUNCTION IF EXISTS public.get_user_email(uuid);