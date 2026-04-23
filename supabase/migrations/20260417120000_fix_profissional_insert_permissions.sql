-- ========================================================
-- FIX PERMISSÕES PROFISSIONAL: INSERT em clients e UPDATE em appointments
-- ========================================================

-- 1. CLIENTS INSERT: Permitir que Profissionais criem novos clientes durante o agendamento.
DROP POLICY IF EXISTS "Gestores can insert clients" ON public.clients;
DROP POLICY IF EXISTS "Secretaria can insert clients" ON public.clients;

CREATE POLICY "Staff can insert clients"
ON public.clients FOR INSERT
TO authenticated
WITH CHECK (
    public.has_role(auth.uid(), 'gestor'::app_role) OR
    public.has_role(auth.uid(), 'profissional'::app_role) OR
    public.has_role(auth.uid(), 'secretaria'::app_role)
);

-- 2. CLIENTS UPDATE: Permitir que Profissionais atualizem dados de clientes.
DROP POLICY IF EXISTS "Gestores can update clients" ON public.clients;
DROP POLICY IF EXISTS "Secretaria can update clients" ON public.clients;

CREATE POLICY "Staff can update clients"
ON public.clients FOR UPDATE
TO authenticated
USING (
    public.has_role(auth.uid(), 'gestor'::app_role) OR
    public.has_role(auth.uid(), 'profissional'::app_role) OR
    public.has_role(auth.uid(), 'secretaria'::app_role)
)
WITH CHECK (
    public.has_role(auth.uid(), 'gestor'::app_role) OR
    public.has_role(auth.uid(), 'profissional'::app_role) OR
    public.has_role(auth.uid(), 'secretaria'::app_role)
);

-- 3. APPOINTMENTS UPDATE: Corrigir conflito de políticas para que profissional possa atualizar agendamentos.
DROP POLICY IF EXISTS "Staff can update appointments" ON public.appointments;
DROP POLICY IF EXISTS "Gestores can manage appointments" ON public.appointments;

-- Recriação unificada com todas as roles
CREATE POLICY "Staff can manage appointments"
ON public.appointments FOR ALL
TO authenticated
USING (
    public.has_role(auth.uid(), 'gestor'::app_role) OR
    public.has_role(auth.uid(), 'secretaria'::app_role) OR
    professional_id = public.get_my_professional_id()
)
WITH CHECK (
    public.has_role(auth.uid(), 'gestor'::app_role) OR
    public.has_role(auth.uid(), 'secretaria'::app_role) OR
    public.has_role(auth.uid(), 'profissional'::app_role)
);
