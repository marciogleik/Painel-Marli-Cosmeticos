-- Fix RLS for patient_records
DROP POLICY IF EXISTS "Staff can insert records" ON public.patient_records;
CREATE POLICY "Staff can insert records"
ON public.patient_records FOR INSERT
TO authenticated
WITH CHECK (
  public.has_role(auth.uid(), 'gestor'::app_role) OR 
  public.has_role(auth.uid(), 'profissional'::app_role) OR
  public.has_role(auth.uid(), 'secretaria'::app_role)
);

DROP POLICY IF EXISTS "Staff can update records" ON public.patient_records;
CREATE POLICY "Staff can update records"
ON public.patient_records FOR UPDATE
TO authenticated
USING (
  public.has_role(auth.uid(), 'gestor'::app_role) OR 
  public.has_role(auth.uid(), 'secretaria'::app_role) OR
  professional_id = public.get_my_professional_id()
);

DROP POLICY IF EXISTS "Staff can delete records" ON public.patient_records;
CREATE POLICY "Staff can delete records"
ON public.patient_records FOR DELETE
TO authenticated
USING (
  public.has_role(auth.uid(), 'gestor'::app_role) OR 
  public.has_role(auth.uid(), 'secretaria'::app_role) OR
  professional_id = public.get_my_professional_id()
);

-- Fix RLS for client_attachments
DROP POLICY IF EXISTS "Staff can update attachments" ON public.client_attachments;
CREATE POLICY "Staff can update attachments"
ON public.client_attachments FOR UPDATE
TO authenticated
USING (
  public.has_role(auth.uid(), 'gestor'::app_role) OR 
  public.has_role(auth.uid(), 'secretaria'::app_role) OR
  professional_id = public.get_my_professional_id()
);

DROP POLICY IF EXISTS "Staff can delete attachments" ON public.client_attachments;
CREATE POLICY "Staff can delete attachments"
ON public.client_attachments FOR DELETE
TO authenticated
USING (
  public.has_role(auth.uid(), 'gestor'::app_role) OR 
  public.has_role(auth.uid(), 'secretaria'::app_role) OR
  professional_id = public.get_my_professional_id()
);

-- Fix RLS for finance_records (Secretaria can already view/insert/update)
DROP POLICY IF EXISTS "Gestores can delete finances" ON public.finance_records;
CREATE POLICY "Staff can delete finances"
ON public.finance_records FOR DELETE
TO authenticated
USING (
  public.has_role(auth.uid(), 'gestor'::app_role) OR 
  public.has_role(auth.uid(), 'secretaria'::app_role)
);

-- Ensure Gestores and Secretaria can update appointments in case it was restricted
DROP POLICY IF EXISTS "Gestores can manage appointments" ON public.appointments;
CREATE POLICY "Gestores can manage appointments"
ON public.appointments FOR ALL
USING (public.has_role(auth.uid(), 'gestor'::app_role) OR public.has_role(auth.uid(), 'secretaria'::app_role));
