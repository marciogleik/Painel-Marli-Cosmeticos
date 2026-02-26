
-- ===================== APPOINTMENTS =====================
CREATE POLICY "Secretaria can view all appointments"
ON public.appointments FOR SELECT
USING (has_role(auth.uid(), 'secretaria'::app_role));

CREATE POLICY "Secretaria can create appointments"
ON public.appointments FOR INSERT
WITH CHECK (has_role(auth.uid(), 'secretaria'::app_role));

CREATE POLICY "Secretaria can update appointments"
ON public.appointments FOR UPDATE
USING (has_role(auth.uid(), 'secretaria'::app_role));

-- ===================== APPOINTMENT_SERVICES =====================
DROP POLICY IF EXISTS "Staff can insert appointment_services" ON public.appointment_services;
CREATE POLICY "Staff can insert appointment_services"
ON public.appointment_services FOR INSERT
WITH CHECK (has_role(auth.uid(), 'gestor'::app_role) OR has_role(auth.uid(), 'profissional'::app_role) OR has_role(auth.uid(), 'secretaria'::app_role));

DROP POLICY IF EXISTS "Staff can update appointment_services" ON public.appointment_services;
CREATE POLICY "Staff can update appointment_services"
ON public.appointment_services FOR UPDATE
USING (has_role(auth.uid(), 'gestor'::app_role) OR has_role(auth.uid(), 'profissional'::app_role) OR has_role(auth.uid(), 'secretaria'::app_role));

DROP POLICY IF EXISTS "Staff can delete appointment_services" ON public.appointment_services;
CREATE POLICY "Staff can delete appointment_services"
ON public.appointment_services FOR DELETE
USING (has_role(auth.uid(), 'gestor'::app_role) OR has_role(auth.uid(), 'profissional'::app_role) OR has_role(auth.uid(), 'secretaria'::app_role));

-- ===================== CLIENTS =====================
DROP POLICY IF EXISTS "Staff can view clients" ON public.clients;
CREATE POLICY "Staff can view clients"
ON public.clients FOR SELECT
USING (has_role(auth.uid(), 'gestor'::app_role) OR has_role(auth.uid(), 'profissional'::app_role) OR has_role(auth.uid(), 'secretaria'::app_role));

CREATE POLICY "Secretaria can insert clients"
ON public.clients FOR INSERT
WITH CHECK (has_role(auth.uid(), 'secretaria'::app_role));

CREATE POLICY "Secretaria can update clients"
ON public.clients FOR UPDATE
USING (has_role(auth.uid(), 'secretaria'::app_role));

-- ===================== FINANCE_RECORDS =====================
CREATE POLICY "Secretaria can view all finances"
ON public.finance_records FOR SELECT
USING (has_role(auth.uid(), 'secretaria'::app_role));

CREATE POLICY "Secretaria can insert finances"
ON public.finance_records FOR INSERT
WITH CHECK (has_role(auth.uid(), 'secretaria'::app_role));

CREATE POLICY "Secretaria can update finances"
ON public.finance_records FOR UPDATE
USING (has_role(auth.uid(), 'secretaria'::app_role));

-- ===================== BLOCKED_SLOTS =====================
CREATE POLICY "Secretaria can manage blocked_slots"
ON public.blocked_slots FOR ALL
USING (has_role(auth.uid(), 'secretaria'::app_role));

-- ===================== PATIENT_RECORDS =====================
CREATE POLICY "Secretaria can view all records"
ON public.patient_records FOR SELECT
USING (has_role(auth.uid(), 'secretaria'::app_role));

-- ===================== ANAMNESIS_TEMPLATES =====================
DROP POLICY IF EXISTS "Staff can view active templates" ON public.anamnesis_templates;
CREATE POLICY "Staff can view active templates"
ON public.anamnesis_templates FOR SELECT
USING (is_active = true AND (has_role(auth.uid(), 'gestor'::app_role) OR has_role(auth.uid(), 'profissional'::app_role) OR has_role(auth.uid(), 'secretaria'::app_role)));

-- ===================== CLIENT_ATTACHMENTS =====================
CREATE POLICY "Secretaria can view attachments"
ON public.client_attachments FOR SELECT
USING (has_role(auth.uid(), 'secretaria'::app_role));

DROP POLICY IF EXISTS "Staff can insert attachments" ON public.client_attachments;
CREATE POLICY "Staff can insert attachments"
ON public.client_attachments FOR INSERT
WITH CHECK (has_role(auth.uid(), 'gestor'::app_role) OR has_role(auth.uid(), 'profissional'::app_role) OR has_role(auth.uid(), 'secretaria'::app_role));
