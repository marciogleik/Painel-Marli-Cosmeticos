-- Allow staff to delete appointment_services (needed for editing appointments)
CREATE POLICY "Staff can delete appointment_services"
ON public.appointment_services
FOR DELETE
USING (
  has_role(auth.uid(), 'gestor'::app_role)
  OR has_role(auth.uid(), 'profissional'::app_role)
);

-- Allow staff to update appointment_services
CREATE POLICY "Staff can update appointment_services"
ON public.appointment_services
FOR UPDATE
USING (
  has_role(auth.uid(), 'gestor'::app_role)
  OR has_role(auth.uid(), 'profissional'::app_role)
);