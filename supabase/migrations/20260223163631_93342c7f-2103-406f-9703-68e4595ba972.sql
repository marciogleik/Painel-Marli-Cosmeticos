
-- Create anamnesis templates table
CREATE TABLE public.anamnesis_templates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  fields JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.anamnesis_templates ENABLE ROW LEVEL SECURITY;

-- Gestores can manage templates
CREATE POLICY "Gestores can manage anamnesis_templates"
ON public.anamnesis_templates
FOR ALL
USING (has_role(auth.uid(), 'gestor'::app_role));

-- Staff can view active templates
CREATE POLICY "Staff can view active templates"
ON public.anamnesis_templates
FOR SELECT
USING (is_active = true AND (has_role(auth.uid(), 'gestor'::app_role) OR has_role(auth.uid(), 'profissional'::app_role)));

-- Add trigger for updated_at
CREATE TRIGGER update_anamnesis_templates_updated_at
BEFORE UPDATE ON public.anamnesis_templates
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
