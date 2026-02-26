
-- Table to store attachment metadata linked to clients and patient records
CREATE TABLE public.client_attachments (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id uuid REFERENCES public.clients(id),
  patient_record_id uuid REFERENCES public.patient_records(id),
  client_name text,
  professional_name text,
  professional_id uuid REFERENCES public.professionals(id),
  attachment_date timestamp with time zone NOT NULL DEFAULT now(),
  file_path text NOT NULL,
  file_type text,
  ficha_type text,
  ficha_code text,
  notes text,
  ip_address text,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.client_attachments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Gestores can manage attachments"
  ON public.client_attachments FOR ALL
  USING (has_role(auth.uid(), 'gestor'::app_role));

CREATE POLICY "Professionals can view own attachments"
  ON public.client_attachments FOR SELECT
  USING (professional_id = get_my_professional_id());

CREATE POLICY "Staff can insert attachments"
  ON public.client_attachments FOR INSERT
  WITH CHECK (has_role(auth.uid(), 'gestor'::app_role) OR has_role(auth.uid(), 'profissional'::app_role));

-- Index for quick lookups
CREATE INDEX idx_client_attachments_client ON public.client_attachments(client_id);
CREATE INDEX idx_client_attachments_record ON public.client_attachments(patient_record_id);
