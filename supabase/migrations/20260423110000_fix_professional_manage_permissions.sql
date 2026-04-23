-- ========================================================
-- FIX PERMISSÕES: GESTÃO DE AGENDAMENTOS POR PROFISSIONAIS COM VISÃO TOTAL
-- Objetivo: Permitir que profissionais com a flag 'can_view_all_agendas'
-- possam gerenciar (UPDATE/DELETE/ALL) agendamentos de qualquer profissional.
-- ========================================================

DROP POLICY IF EXISTS "Staff can manage appointments" ON public.appointments;

CREATE POLICY "Staff can manage appointments"
ON public.appointments FOR ALL
TO authenticated
USING (
    public.has_role(auth.uid(), 'gestor'::app_role) OR
    public.has_role(auth.uid(), 'secretaria'::app_role) OR
    professional_id = public.get_my_professional_id() OR
    EXISTS (
        SELECT 1 FROM public.professionals 
        WHERE user_id = auth.uid() 
        AND can_view_all_agendas = true
    )
)
WITH CHECK (
    public.has_role(auth.uid(), 'gestor'::app_role) OR
    public.has_role(auth.uid(), 'secretaria'::app_role) OR
    public.has_role(auth.uid(), 'profissional'::app_role)
);

-- Nota: A política de 'appointment_services' já é permissiva o suficiente para
-- quem tem o papel de 'profissional', então não deve bloquear a edição de serviços.
