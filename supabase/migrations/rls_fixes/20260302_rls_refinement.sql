-- ========================================================
-- REFINAMENTO DE SEGURANÇA (RLS) - PAINEL MARLI
-- Foco: Restringir acesso de profissionais e proteger dados sensíveis.
-- ========================================================

-- 1. CLIENTES: Profissionais só veem clientes que já agendaram com elas.
-- Gestores continuam vendo todos.
DROP POLICY IF EXISTS "Staff can view clients" ON public.clients;
CREATE POLICY "Gestores can view all clients" 
ON public.clients FOR SELECT 
USING (public.has_role(auth.uid(), 'gestor'));

CREATE POLICY "Professionals can view their patients" 
ON public.clients FOR SELECT 
USING (
    public.has_role(auth.uid(), 'profissional') AND 
    EXISTS (
        SELECT 1 FROM public.appointments a 
        WHERE a.client_id = public.clients.id 
        AND a.professional_id = public.get_my_professional_id()
    )
);

-- 2. FINANCEIRO: Reforçar que Profissionais só veem faturamentos vinculados a elas.
DROP POLICY IF EXISTS "Professionals can view own finances" ON public.finance_records;
CREATE POLICY "Professionals can view own finances" 
ON public.finance_records FOR SELECT 
USING (
    public.has_role(auth.uid(), 'profissional') AND 
    professional_id = public.get_my_professional_id()
);

-- 3. AGENDAMENTOS: Impedir que profissionais alterem agendamentos de outros.
-- (Já existe uma política similar, mas vamos garantir a integridade)
DROP POLICY IF EXISTS "Staff can update appointments" ON public.appointments;
CREATE POLICY "Gestores can update all appointments" 
ON public.appointments FOR UPDATE 
USING (public.has_role(auth.uid(), 'gestor'));

CREATE POLICY "Professionals can update own appointments" 
ON public.appointments FOR UPDATE 
USING (
    public.has_role(auth.uid(), 'profissional') AND 
    professional_id = public.get_my_professional_id()
);

-- 4. DELETE: Apenas Gestores podem deletar registros sensíveis.
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Staff can delete appointments" ON public.appointments;
CREATE POLICY "Only Gestores can delete appointments" 
ON public.appointments FOR DELETE 
USING (public.has_role(auth.uid(), 'gestor'));

ALTER TABLE public.finance_records ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Only Gestores can delete finances" ON public.finance_records;
CREATE POLICY "Only Gestores can delete finances" 
ON public.finance_records FOR DELETE 
USING (public.has_role(auth.uid(), 'gestor'));

-- 5. VIEW DE CLIENTES: Como a View é SECURITY INVOKER por padrão, ele respeita as RLS acima.
-- Se profissionais buscarem na View, só verão os pacientes delas.
