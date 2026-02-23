
-- Table to store blocked time slots per professional
CREATE TABLE public.blocked_slots (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  professional_id UUID NOT NULL REFERENCES public.professionals(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  start_time TIME WITHOUT TIME ZONE NOT NULL,
  end_time TIME WITHOUT TIME ZONE NOT NULL,
  reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.blocked_slots ENABLE ROW LEVEL SECURITY;

-- Gestores can do everything
CREATE POLICY "Gestores can manage blocked_slots"
ON public.blocked_slots
FOR ALL
USING (has_role(auth.uid(), 'gestor'::app_role));

-- Professionals can view their own blocks
CREATE POLICY "Professionals can view own blocked_slots"
ON public.blocked_slots
FOR SELECT
USING (professional_id = get_my_professional_id());

-- Professionals can create their own blocks
CREATE POLICY "Professionals can create own blocked_slots"
ON public.blocked_slots
FOR INSERT
WITH CHECK (professional_id = get_my_professional_id());

-- Professionals can delete their own blocks
CREATE POLICY "Professionals can delete own blocked_slots"
ON public.blocked_slots
FOR DELETE
USING (professional_id = get_my_professional_id());

-- Index for fast lookups
CREATE INDEX idx_blocked_slots_prof_date ON public.blocked_slots(professional_id, date);
