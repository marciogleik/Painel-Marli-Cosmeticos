
-- =============================================
-- MARLI COSMÉTICOS PRIME ESTÉTICA - DATABASE
-- =============================================

-- 1. ENUM de roles
CREATE TYPE public.app_role AS ENUM ('gestor', 'profissional');

-- 2. Tabela de roles
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- 3. Helper: has_role
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$ SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role) $$;

-- 4. Profiles
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  phone TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 5. Profissionais
CREATE TABLE public.professionals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  role_description TEXT,
  avatar_initials TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.professionals ENABLE ROW LEVEL SECURITY;

-- 6. Helper: get_my_professional_id (DEPOIS da tabela professionals)
CREATE OR REPLACE FUNCTION public.get_my_professional_id()
RETURNS UUID LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$ SELECT id FROM public.professionals WHERE user_id = auth.uid() LIMIT 1 $$;

-- 7. Serviços
CREATE TABLE public.services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  duration_minutes INTEGER NOT NULL DEFAULT 30,
  base_price NUMERIC(10,2),
  price_note TEXT,
  category TEXT NOT NULL DEFAULT 'Geral',
  requires_evaluation BOOLEAN NOT NULL DEFAULT false,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

-- 8. Vínculo profissional-serviço
CREATE TABLE public.professional_services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  professional_id UUID REFERENCES public.professionals(id) ON DELETE CASCADE NOT NULL,
  service_id UUID REFERENCES public.services(id) ON DELETE CASCADE NOT NULL,
  custom_price NUMERIC(10,2),
  is_active BOOLEAN NOT NULL DEFAULT true,
  UNIQUE (professional_id, service_id)
);
ALTER TABLE public.professional_services ENABLE ROW LEVEL SECURITY;

-- 9. Clientes
CREATE TABLE public.clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  phone TEXT,
  phone2 TEXT,
  email TEXT,
  cpf TEXT,
  birth_date DATE,
  address TEXT,
  city TEXT,
  notes TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;

CREATE UNIQUE INDEX idx_clients_cpf ON public.clients (cpf) WHERE cpf IS NOT NULL AND cpf != '';
CREATE UNIQUE INDEX idx_clients_phone ON public.clients (phone) WHERE phone IS NOT NULL AND phone != '';

-- 10. Agendamentos
CREATE TABLE public.appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES public.clients(id) ON DELETE SET NULL,
  professional_id UUID REFERENCES public.professionals(id) ON DELETE SET NULL NOT NULL,
  date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  status TEXT NOT NULL DEFAULT 'agendado' CHECK (status IN ('agendado', 'confirmado', 'cancelado', 'atendido', 'espera')),
  notes TEXT,
  client_name TEXT,
  client_phone TEXT,
  executed_by TEXT,
  cancellation_reason TEXT,
  cancelled_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

CREATE INDEX idx_appointments_date ON public.appointments (date);
CREATE INDEX idx_appointments_professional ON public.appointments (professional_id, date);
CREATE INDEX idx_appointments_client ON public.appointments (client_id);

-- 11. Serviços do agendamento
CREATE TABLE public.appointment_services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  appointment_id UUID REFERENCES public.appointments(id) ON DELETE CASCADE NOT NULL,
  service_id UUID REFERENCES public.services(id) ON DELETE SET NULL,
  service_name TEXT NOT NULL,
  price NUMERIC(10,2),
  duration_minutes INTEGER NOT NULL DEFAULT 30
);
ALTER TABLE public.appointment_services ENABLE ROW LEVEL SECURITY;

-- 12. Prontuários
CREATE TABLE public.patient_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES public.clients(id) ON DELETE CASCADE NOT NULL,
  professional_id UUID REFERENCES public.professionals(id) ON DELETE SET NULL,
  appointment_id UUID REFERENCES public.appointments(id) ON DELETE SET NULL,
  record_type TEXT NOT NULL DEFAULT 'anamnese',
  title TEXT,
  content JSONB,
  signature_url TEXT,
  signed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.patient_records ENABLE ROW LEVEL SECURITY;

-- 13. Financeiro
CREATE TABLE public.finance_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  appointment_id UUID REFERENCES public.appointments(id) ON DELETE SET NULL,
  professional_id UUID REFERENCES public.professionals(id) ON DELETE SET NULL NOT NULL,
  client_id UUID REFERENCES public.clients(id) ON DELETE SET NULL,
  amount NUMERIC(10,2) NOT NULL DEFAULT 0,
  payment_method TEXT,
  payment_status TEXT NOT NULL DEFAULT 'pendente' CHECK (payment_status IN ('pendente', 'pago', 'cancelado')),
  description TEXT,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.finance_records ENABLE ROW LEVEL SECURITY;

-- =============================================
-- TRIGGERS
-- =============================================
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$ BEGIN NEW.updated_at = now(); RETURN NEW; END; $$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_professionals_updated_at BEFORE UPDATE ON public.professionals FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON public.services FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_clients_updated_at BEFORE UPDATE ON public.clients FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_appointments_updated_at BEFORE UPDATE ON public.appointments FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_patient_records_updated_at BEFORE UPDATE ON public.patient_records FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =============================================
-- RLS POLICIES
-- =============================================

-- user_roles
CREATE POLICY "Users can read own roles" ON public.user_roles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Gestores can read all roles" ON public.user_roles FOR SELECT USING (public.has_role(auth.uid(), 'gestor'));
CREATE POLICY "Gestores can manage roles" ON public.user_roles FOR ALL USING (public.has_role(auth.uid(), 'gestor'));

-- profiles
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Gestores can view all profiles" ON public.profiles FOR SELECT USING (public.has_role(auth.uid(), 'gestor'));
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);

-- professionals
CREATE POLICY "Authenticated can view active professionals" ON public.professionals FOR SELECT TO authenticated USING (is_active = true);
CREATE POLICY "Gestores can manage professionals" ON public.professionals FOR ALL USING (public.has_role(auth.uid(), 'gestor'));

-- services
CREATE POLICY "Authenticated can view active services" ON public.services FOR SELECT TO authenticated USING (is_active = true);
CREATE POLICY "Gestores can manage services" ON public.services FOR ALL USING (public.has_role(auth.uid(), 'gestor'));

-- professional_services
CREATE POLICY "Authenticated can view professional_services" ON public.professional_services FOR SELECT TO authenticated USING (is_active = true);
CREATE POLICY "Gestores can manage professional_services" ON public.professional_services FOR ALL USING (public.has_role(auth.uid(), 'gestor'));

-- clients
CREATE POLICY "Staff can view clients" ON public.clients FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'gestor') OR public.has_role(auth.uid(), 'profissional'));
CREATE POLICY "Gestores can insert clients" ON public.clients FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'gestor'));
CREATE POLICY "Gestores can update clients" ON public.clients FOR UPDATE USING (public.has_role(auth.uid(), 'gestor'));

-- appointments
CREATE POLICY "Gestores can view all appointments" ON public.appointments FOR SELECT USING (public.has_role(auth.uid(), 'gestor'));
CREATE POLICY "Professionals can view own appointments" ON public.appointments FOR SELECT USING (professional_id = public.get_my_professional_id());
CREATE POLICY "Staff can create appointments" ON public.appointments FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'gestor') OR public.has_role(auth.uid(), 'profissional'));
CREATE POLICY "Staff can update appointments" ON public.appointments FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'gestor') OR professional_id = public.get_my_professional_id());

-- appointment_services
CREATE POLICY "View appointment_services" ON public.appointment_services FOR SELECT TO authenticated USING (true);
CREATE POLICY "Staff can insert appointment_services" ON public.appointment_services FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'gestor') OR public.has_role(auth.uid(), 'profissional'));

-- patient_records
CREATE POLICY "Gestores can view all records" ON public.patient_records FOR SELECT USING (public.has_role(auth.uid(), 'gestor'));
CREATE POLICY "Professionals can view own records" ON public.patient_records FOR SELECT USING (professional_id = public.get_my_professional_id());
CREATE POLICY "Staff can create records" ON public.patient_records FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'gestor') OR public.has_role(auth.uid(), 'profissional'));
CREATE POLICY "Staff can update records" ON public.patient_records FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'gestor') OR professional_id = public.get_my_professional_id());

-- finance_records
CREATE POLICY "Gestores can view all finances" ON public.finance_records FOR SELECT USING (public.has_role(auth.uid(), 'gestor'));
CREATE POLICY "Professionals can view own finances" ON public.finance_records FOR SELECT USING (professional_id = public.get_my_professional_id());
CREATE POLICY "Gestores can insert finances" ON public.finance_records FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'gestor'));
CREATE POLICY "Gestores can update finances" ON public.finance_records FOR UPDATE USING (public.has_role(auth.uid(), 'gestor'));
