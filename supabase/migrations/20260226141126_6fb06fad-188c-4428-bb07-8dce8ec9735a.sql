
-- Create storage bucket for client attachments
INSERT INTO storage.buckets (id, name, public) VALUES ('client-attachments', 'client-attachments', false);

-- RLS policies for the bucket
CREATE POLICY "Gestores can manage attachments files"
ON storage.objects FOR ALL
USING (bucket_id = 'client-attachments' AND public.has_role(auth.uid(), 'gestor'::public.app_role));

CREATE POLICY "Professionals can view attachments files"
ON storage.objects FOR SELECT
USING (bucket_id = 'client-attachments' AND public.has_role(auth.uid(), 'profissional'::public.app_role));

CREATE POLICY "Staff can upload attachments files"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'client-attachments' AND (public.has_role(auth.uid(), 'gestor'::public.app_role) OR public.has_role(auth.uid(), 'profissional'::public.app_role)));
