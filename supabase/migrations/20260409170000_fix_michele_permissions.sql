-- ========================================================
-- FIX PERMISSÕES MICHELE E STAFF (RLS)
-- Foco: Permitir que profissionais vejam todos os clientes e editem o próprio perfil.
-- ========================================================

-- 1. CLIENTES: Permitir que Profissionais e Secretaria vejam todos os clientes.
-- Removemos a restrição de ver apenas clientes com agendamentos vinculados.
DROP POLICY IF EXISTS "Professionals can view their patients" ON public.clients;
DROP POLICY IF EXISTS "Gestores can view all clients" ON public.clients;
DROP POLICY IF EXISTS "Staff can view clients" ON public.clients;

CREATE POLICY "Staff can view all clients" 
ON public.clients FOR SELECT 
TO authenticated
USING (
    public.has_role(auth.uid(), 'gestor'::app_role) OR 
    public.has_role(auth.uid(), 'profissional'::app_role) OR
    public.has_role(auth.uid(), 'secretaria'::app_role)
);

-- 2. PROFISSIONAIS: Permitir que o profissional altere seus próprios dados básicos.
DROP POLICY IF EXISTS "Professionals can update own record" ON public.professionals;

CREATE POLICY "Professionals can update own record" 
ON public.professionals FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- 3. AGENDAMENTOS: Garantir que Secretaria e Profissionais possam criar agendamentos para qualquer cliente.
-- (Já deve funcionar se eles conseguirem ver os clientes, mas vamos reforçar)
DROP POLICY IF EXISTS "Staff can create appointments" ON public.appointments;
CREATE POLICY "Staff can create appointments" 
ON public.appointments FOR INSERT 
TO authenticated 
WITH CHECK (
    public.has_role(auth.uid(), 'gestor'::app_role) OR 
    public.has_role(auth.uid(), 'profissional'::app_role) OR
    public.has_role(auth.uid(), 'secretaria'::app_role)
);

-- 4. PROFILE: Garantir que Secretaria consiga ver perfis para vincular avatares etc.
DROP POLICY IF EXISTS "Staff can view all profiles" ON public.profiles;
CREATE POLICY "Staff can view all profiles" 
ON public.profiles FOR SELECT 
TO authenticated
USING (
    public.has_role(auth.uid(), 'gestor'::app_role) OR 
    public.has_role(auth.uid(), 'secretaria'::app_role)
);
