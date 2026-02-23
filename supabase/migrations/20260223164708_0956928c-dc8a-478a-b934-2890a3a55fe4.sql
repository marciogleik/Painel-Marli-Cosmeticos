-- Allow staff to delete patient records
CREATE POLICY "Staff can delete records"
ON public.patient_records
FOR DELETE
USING (
  has_role(auth.uid(), 'gestor'::app_role)
  OR (professional_id = get_my_professional_id())
);