
-- Table for professional working hours per day of week
CREATE TABLE public.professional_schedules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  professional_id uuid NOT NULL REFERENCES public.professionals(id) ON DELETE CASCADE,
  day_of_week integer NOT NULL CHECK (day_of_week BETWEEN 0 AND 6), -- 0=Sunday, 6=Saturday
  start_time time NOT NULL,
  end_time time NOT NULL,
  is_active boolean NOT NULL DEFAULT true,
  UNIQUE (professional_id, day_of_week)
);

ALTER TABLE public.professional_schedules ENABLE ROW LEVEL SECURITY;

-- Staff can view schedules
CREATE POLICY "Staff can view schedules"
ON public.professional_schedules
FOR SELECT
USING (
  has_role(auth.uid(), 'gestor'::app_role)
  OR has_role(auth.uid(), 'profissional'::app_role)
  OR has_role(auth.uid(), 'secretaria'::app_role)
);

-- Gestores can manage schedules
CREATE POLICY "Gestores can manage schedules"
ON public.professional_schedules
FOR ALL
USING (has_role(auth.uid(), 'gestor'::app_role));
