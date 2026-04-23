-- Migration for Clinic Settings
CREATE TABLE IF NOT EXISTS public.clinic_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL DEFAULT 'Marli Cosméticos',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Use a single row for configuration
-- We'll assume the first row with id '00000000-0000-0000-0000-000000000000' is the primary one
INSERT INTO public.clinic_settings (id, name)
VALUES ('00000000-0000-0000-0000-000000000000', 'Marli Cosméticos')
ON CONFLICT (id) DO NOTHING;

-- RLS
ALTER TABLE public.clinic_settings ENABLE ROW LEVEL SECURITY;

-- SELECT for all authenticated
CREATE POLICY "Clinic Settings SELECT" ON public.clinic_settings
  FOR SELECT TO authenticated
  USING (true);

-- ALL for gestor
CREATE POLICY "Clinic Settings GESTOR" ON public.clinic_settings
  FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'gestor'))
  WITH CHECK (has_role(auth.uid(), 'gestor'));
