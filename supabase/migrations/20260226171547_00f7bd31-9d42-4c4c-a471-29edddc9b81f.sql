
ALTER TABLE public.invitations ADD COLUMN professional_id uuid REFERENCES public.professionals(id);
