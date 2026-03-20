
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
-- Create anamnesis templates table
CREATE TABLE public.anamnesis_templates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  fields JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.anamnesis_templates ENABLE ROW LEVEL SECURITY;

-- Gestores can manage templates
CREATE POLICY "Gestores can manage anamnesis_templates"
ON public.anamnesis_templates
FOR ALL
USING (has_role(auth.uid(), 'gestor'::app_role));

-- Staff can view active templates
CREATE POLICY "Staff can view active templates"
ON public.anamnesis_templates
FOR SELECT
USING (is_active = true AND (has_role(auth.uid(), 'gestor'::app_role) OR has_role(auth.uid(), 'profissional'::app_role)));

-- Add trigger for updated_at
CREATE TRIGGER update_anamnesis_templates_updated_at
BEFORE UPDATE ON public.anamnesis_templates
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
-- Allow staff to delete patient records
CREATE POLICY "Staff can delete records"
ON public.patient_records
FOR DELETE
USING (
  has_role(auth.uid(), 'gestor'::app_role)
  OR (professional_id = get_my_professional_id())
);DROP INDEX IF EXISTS idx_clients_cpf;
DROP INDEX IF EXISTS idx_clients_phone;
-- Table to store blocked time slots per professional
CREATE TABLE public.blocked_slots (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  professional_id UUID NOT NULL REFERENCES public.professionals(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  start_time TIME WITHOUT TIME ZONE NOT NULL,
  end_time TIME WITHOUT TIME ZONE NOT NULL,
  reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.blocked_slots ENABLE ROW LEVEL SECURITY;

-- Gestores can do everything
CREATE POLICY "Gestores can manage blocked_slots"
ON public.blocked_slots
FOR ALL
USING (has_role(auth.uid(), 'gestor'::app_role));

-- Professionals can view their own blocks
CREATE POLICY "Professionals can view own blocked_slots"
ON public.blocked_slots
FOR SELECT
USING (professional_id = get_my_professional_id());

-- Professionals can create their own blocks
CREATE POLICY "Professionals can create own blocked_slots"
ON public.blocked_slots
FOR INSERT
WITH CHECK (professional_id = get_my_professional_id());

-- Professionals can delete their own blocks
CREATE POLICY "Professionals can delete own blocked_slots"
ON public.blocked_slots
FOR DELETE
USING (professional_id = get_my_professional_id());

-- Index for fast lookups
CREATE INDEX idx_blocked_slots_prof_date ON public.blocked_slots(professional_id, date);

-- Create invitations table
CREATE TABLE public.invitations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  token text NOT NULL UNIQUE DEFAULT encode(gen_random_bytes(32), 'hex'),
  role app_role NOT NULL DEFAULT 'profissional',
  expires_at timestamp with time zone NOT NULL,
  used_at timestamp with time zone,
  used_by uuid,
  created_by uuid NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.invitations ENABLE ROW LEVEL SECURITY;

-- Gestores can manage invitations
CREATE POLICY "Gestores can manage invitations"
ON public.invitations
FOR ALL
USING (has_role(auth.uid(), 'gestor'::app_role));

-- Public can read valid (unused, not expired) invitations by token for registration
CREATE POLICY "Anyone can read valid invitation by token"
ON public.invitations
FOR SELECT
USING (used_at IS NULL AND expires_at > now());
CREATE INDEX idx_appointment_services_appointment ON public.appointment_services USING btree (appointment_id);
-- Table to store attachment metadata linked to clients and patient records
CREATE TABLE public.client_attachments (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id uuid REFERENCES public.clients(id),
  patient_record_id uuid REFERENCES public.patient_records(id),
  client_name text,
  professional_name text,
  professional_id uuid REFERENCES public.professionals(id),
  attachment_date timestamp with time zone NOT NULL DEFAULT now(),
  file_path text NOT NULL,
  file_type text,
  ficha_type text,
  ficha_code text,
  notes text,
  ip_address text,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.client_attachments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Gestores can manage attachments"
  ON public.client_attachments FOR ALL
  USING (has_role(auth.uid(), 'gestor'::app_role));

CREATE POLICY "Professionals can view own attachments"
  ON public.client_attachments FOR SELECT
  USING (professional_id = get_my_professional_id());

CREATE POLICY "Staff can insert attachments"
  ON public.client_attachments FOR INSERT
  WITH CHECK (has_role(auth.uid(), 'gestor'::app_role) OR has_role(auth.uid(), 'profissional'::app_role));

-- Index for quick lookups
CREATE INDEX idx_client_attachments_client ON public.client_attachments(client_id);
CREATE INDEX idx_client_attachments_record ON public.client_attachments(patient_record_id);

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

ALTER TABLE public.invitations ADD COLUMN professional_id uuid REFERENCES public.professionals(id);

-- Add avatar_url to profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS avatar_url text;

-- Create avatars bucket
INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Public read access for avatars
CREATE POLICY "Avatars are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'avatars');

-- Authenticated users can upload their own avatar
CREATE POLICY "Users can upload own avatar"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'avatars' AND auth.role() = 'authenticated');

-- Users can update their own avatar
CREATE POLICY "Users can update own avatar"
ON storage.objects FOR UPDATE
USING (bucket_id = 'avatars' AND auth.role() = 'authenticated');

-- Add missing storage policies for avatars bucket (some already exist)
DO $$
BEGIN
  -- Try creating select policy
  BEGIN
    CREATE POLICY "Anyone can view avatars"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'avatars');
  EXCEPTION WHEN duplicate_object THEN NULL;
  END;

  -- Try creating insert policy
  BEGIN
    CREATE POLICY "Authenticated users can upload own avatar"
    ON storage.objects FOR INSERT
    WITH CHECK (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);
  EXCEPTION WHEN duplicate_object THEN NULL;
  END;

  -- Try creating delete policy
  BEGIN
    CREATE POLICY "Users can delete own avatar"
    ON storage.objects FOR DELETE
    USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);
  EXCEPTION WHEN duplicate_object THEN NULL;
  END;
END $$;

ALTER TABLE public.professionals
  ADD COLUMN IF NOT EXISTS agenda_order integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS can_receive_appointments boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS can_view_all_agendas boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS can_receive_email_appointments boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS can_switch_registers boolean NOT NULL DEFAULT false;
CREATE OR REPLACE FUNCTION public.get_user_email(_user_id uuid)
RETURNS text
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT email FROM auth.users WHERE id = _user_id;
$$;-- Add email column to profiles
ALTER TABLE public.profiles ADD COLUMN email text;

-- Populate from auth.users
UPDATE public.profiles
SET email = u.email
FROM auth.users u
WHERE profiles.user_id = u.id;

-- Update trigger to include email on new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name, email)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email), NEW.email);
  RETURN NEW;
END;
$$;

-- Drop the get_user_email RPC since email is now on profiles
DROP FUNCTION IF EXISTS public.get_user_email(uuid);-- Add last_login_at to track actual login time
ALTER TABLE public.professionals ADD COLUMN last_login_at timestamp with time zone;
-- Step 1: Add 'secretaria' to the app_role enum
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'secretaria';

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

-- Table for professional working hours per day of week
CREATE TABLE public.professional_schedules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  professional_id uuid NOT NULL REFERENCES public.professionals(id) ON DELETE CASCADE,
  day_of_week integer NOT NULL CHECK (day_of_week BETWEEN 0 AND 6), -- 0=Sunday, 6=Saturday
  start_time time NOT NULL,
  end_time time NOT NULL,
  is_active boolean NOT NULL DEFAULT true,
  UNIQUE (professional_id, day_of_week)
);

ALTER TABLE public.professional_schedules ENABLE ROW LEVEL SECURITY;

-- Staff can view schedules
CREATE POLICY "Staff can view schedules"
ON public.professional_schedules
FOR SELECT
USING (
  has_role(auth.uid(), 'gestor'::app_role)
  OR has_role(auth.uid(), 'profissional'::app_role)
  OR has_role(auth.uid(), 'secretaria'::app_role)
);

-- Gestores can manage schedules
CREATE POLICY "Gestores can manage schedules"
ON public.professional_schedules
FOR ALL
USING (has_role(auth.uid(), 'gestor'::app_role));
-- Add 'removido' and other missing statuses to the appointments table constraint
ALTER TABLE appointments DROP CONSTRAINT IF EXISTS appointments_status_check;
ALTER TABLE appointments ADD CONSTRAINT appointments_status_check 
CHECK (status IN ('agendado', 'confirmado', 'cancelado', 'atendido', 'espera', 'atendendo', 'atrasado', 'falta', 'removido'));

-- 1. Update the status check constraint to include 'bloqueado'
ALTER TABLE public.appointments DROP CONSTRAINT IF EXISTS appointments_status_check;
ALTER TABLE public.appointments ADD CONSTRAINT appointments_status_check 
CHECK (status IN ('agendado', 'confirmado', 'cancelado', 'atendido', 'espera', 'atendendo', 'atrasado', 'falta', 'removido', 'bloqueado'));

-- 2. Migrate existing data from blocked_slots to appointments
INSERT INTO public.appointments (
  professional_id,
  date,
  start_time,
  end_time,
  notes,
  client_name,
  status,
  created_at
)
SELECT 
  professional_id,
  date,
  start_time,
  end_time,
  reason as notes,
  'BLOQUEIO' as client_name,
  'bloqueado' as status,
  created_at
FROM public.blocked_slots;

-- 3. Drop existing policies on blocked_slots (optional but cleaner before dropping table)
DROP POLICY IF EXISTS "Gestores can manage blocked_slots" ON public.blocked_slots;
DROP POLICY IF EXISTS "Professionals can view own blocked_slots" ON public.blocked_slots;
DROP POLICY IF EXISTS "Professionals can create own blocked_slots" ON public.blocked_slots;
DROP POLICY IF EXISTS "Professionals can delete own blocked_slots" ON public.blocked_slots;
DROP POLICY IF EXISTS "Secretaria can manage blocked_slots" ON public.blocked_slots;

-- 4. Drop the table
DROP TABLE IF EXISTS public.blocked_slots;

-- 5. Update RLS policies for appointments to ensure staff can manage 'bloqueado' status
-- The existing policies already cover gestor/secretaria/professional based on professional_id
-- but we might want to ensure 'bloqueado' follows same rules.
-- Existing "Staff can update appointments" covers it.
UPDATE anamnesis_templates
SET fields = '[
  { "id": "fcd3a8eb-8b01-4475-802c-7b7deae0fc6e", "type": "multiple_choice", "label": "Está em Tratamento Médico?", "options": ["Sim", "Não"], "sameLine": false, "isActive": true },
  { "id": "0df6e885-3e28-4ad0-b2cc-eeedb8a92ef6", "type": "short_text", "label": "Especifique", "sameLine": true, "isActive": true },
  { "id": "a90b8fbc-dfd3-48b0-8c29-87c2fb8b2a75", "type": "multiple_choice", "label": "Alergia?", "options": ["Sim", "Não"], "sameLine": false, "isActive": true },
  { "id": "3b2e5cc0-4be6-4074-a690-6ec9a65d7ff1", "type": "short_text", "label": "Especifique", "sameLine": true, "isActive": true },
  { "id": "ee5d57b5-22eb-4ba1-bda4-1a6bc11e6edc", "type": "multiple_choice", "label": "Cirurgia recente?", "options": ["Sim", "Não"], "sameLine": false, "isActive": true },
  { "id": "49ba20f4-5f16-41f2-add3-8c7c93e4d9e0", "type": "short_text", "label": "Especifique", "sameLine": true, "isActive": true },
  { "id": "4b6f1088-fe2c-491c-b63e-ea6d2035987d", "type": "multiple_choice", "label": "Problemas de Pele?", "options": ["Sim", "Não"], "sameLine": false, "isActive": true },
  { "id": "90b1bfed-910a-4fc0-ae1c-2c93d7c5edb3", "type": "short_text", "label": "Especifique", "sameLine": true, "isActive": true },
  { "id": "8b51d187-cbaf-42e8-b80c-03ebf2d057da", "type": "multiple_choice", "label": "É gestante?", "options": ["Sim", "Não"], "sameLine": false, "isActive": true },
  { "id": "67bc944d-5c02-4c2d-88b9-5095e0c968bc", "type": "short_text", "label": "De quantas semanas?", "sameLine": true, "isActive": true },
  { "id": "cfa3fcaa-bad4-47c3-a261-2bc723b7a544", "type": "multiple_choice", "label": "É fumante?", "options": ["Sim", "Não"], "sameLine": false, "isActive": true },
  { "id": "f5ed44da-6a12-4290-aab0-b472eec3cece", "type": "multiple_choice", "label": "Portador(a) de marca-passo?", "options": ["Sim", "Não"], "sameLine": false, "isActive": true },
  { "id": "8da85741-2b0e-4dd7-abf1-ea1c39050aa8", "type": "multiple_choice", "label": "Alterações Cardíacas?", "options": ["Sim", "Não"], "sameLine": false, "isActive": true },
  { "id": "61a525da-ce08-410a-bcc6-c0cfdbcd3963", "type": "multiple_choice", "label": "Distúrbio Circulatório?", "options": ["Sim", "Não"], "sameLine": false, "isActive": true },
  { "id": "49b49b99-cc27-4220-acf1-c0afad785a21", "type": "multiple_choice", "label": "Distúrbio Renal?", "options": ["Sim", "Não"], "sameLine": false, "isActive": true },
  { "id": "3be935f0-6a01-443b-a63e-f18c21a4f001", "type": "multiple_choice", "label": "Distúrbio Hormonal?", "options": ["Sim", "Não"], "sameLine": false, "isActive": true },
  { "id": "565017e8-b1bc-40b9-8fa9-2c7fb00bf0c5", "type": "multiple_choice", "label": "Problemas Ortopédicos?", "options": ["Sim", "Não"], "sameLine": false, "isActive": true },
  { "id": "da51f08e-8cf4-4b5c-a5b8-50bdad7b458c", "type": "short_text", "label": "Especifique", "sameLine": true, "isActive": true },
  { "id": "b0a6da9b-503d-4c3d-b4ef-59178ad8e6fb", "type": "multiple_choice", "label": "Diabetes?", "options": ["Sim", "Não"], "sameLine": false, "isActive": true },
  { "id": "4fccd54b-d7db-4e2a-bdd4-e1b0c95a02e7", "type": "short_text", "label": "Qual tipo?", "sameLine": true, "isActive": true },
  { "id": "713833d7-4632-421f-8255-70e60ec252d6", "type": "short_text", "label": "Diabete Controlada?", "sameLine": true, "isActive": true },
  { "id": "136d88bd-b118-472b-aedb-ffae3d99d3de", "type": "multiple_choice", "label": "É epilética(o) ?", "options": ["Sim", "Não"], "sameLine": false, "isActive": true },
  { "id": "ebfa6310-096d-4bb1-a60d-7dd6bfbad417", "type": "multiple_choice", "label": "Possui hipo/hipertensão arterial?", "options": ["Sim", "Não"], "sameLine": false, "isActive": true },
  { "id": "c1615f79-2c8c-4a37-b7dd-dd2c85e25281", "type": "multiple_choice", "label": "Possui tumor/lesão pré-cancerosa?", "options": ["Sim", "Não"], "sameLine": false, "isActive": true },
  { "id": "fc42d659-1e35-449d-a48a-64157bc26e6f", "type": "short_text", "label": "Especifique", "sameLine": true, "isActive": true },
  { "id": "ab7084eb-f076-48eb-b3c1-2f3b9bd608be", "type": "multiple_choice", "label": "Possui prótese facial/corporal?", "options": ["Sim", "Não"], "sameLine": false, "isActive": true },
  { "id": "b18b456d-e408-4e8c-a10c-3599965159fc", "type": "short_text", "label": "Especifique", "sameLine": true, "isActive": true },
  { "id": "efc80ceb-69bb-425b-ae0e-2d9d1506a599", "type": "multiple_choice", "label": "Está utilizando ácidos?", "options": ["Sim", "Não"], "sameLine": false, "isActive": true },
  { "id": "cb17d471-197e-4baf-aa2c-cdcc00c3b062", "type": "short_text", "label": "Especifique", "sameLine": true, "isActive": true },
  { "id": "dc9c55b6-6dbd-4351-a083-2fdb3ac44400", "type": "multiple_choice", "label": "Ciclo menstrual regular?", "options": ["Sim", "Não"], "sameLine": false, "isActive": true },
  { "id": "ab83c162-841f-4d4f-b630-f947baacaf1d", "type": "multiple_choice", "label": "Funcionamento intestinal regular?", "options": ["1-2 vezes / semana", "3 ou mais vezes / semana", "1-2 vezes / dia", "3 ou mais vezes / dia"], "sameLine": false, "isActive": true },
  { "id": "c2b5c0bd-f26e-42ab-ba37-ece10257e842", "type": "long_text", "label": "Informações Adicionais", "sameLine": false, "isActive": true }
]'::jsonb
WHERE id = 'b0fdc4fb-cce6-4b5a-988a-488e675245d3';
UPDATE anamnesis_templates
SET fields = '[
  { "id": "1ec883f3-93de-40db-9b0c-9f8ae06f5228", "type": "short_text", "label": "Data", "sameLine": false, "isActive": true },
  { "id": "430ad7fb-b8bb-4bc0-bb8e-a204e30099ad", "type": "multiple_choice", "label": "Tratamento estético anterior no local que deseja o tratamento:", "options": ["Sim", "Não"], "sameLine": false, "isActive": true },
  { "id": "e84126c8-acda-46aa-bf5b-c6b8478ffbb8", "type": "short_text", "label": "Especifique", "sameLine": true, "isActive": true },
  { "id": "f5e933e4-6c3f-4279-b1d3-35f111eeb805", "type": "multiple_choice", "label": "Usa lentes de contato?", "options": ["Sim", "Não"], "sameLine": false, "isActive": true },
  { "id": "e402fd6b-ad59-4de7-bec6-384c5a04bc69", "type": "multiple_choice", "label": "Exposição Solar", "options": ["Sim", "Não"], "sameLine": false, "isActive": true },
  { "id": "fbc3a1cd-ccbc-4fdd-badf-3958cc10cf4a", "type": "multiple_choice", "label": "Tabagismo", "options": ["Sim", "Não"], "sameLine": false, "isActive": true },
  { "id": "2d2dd583-0599-4d37-af3a-3453715d9183", "type": "multiple_choice", "label": "Faz uso de bebidas alcoolicas", "options": ["Sim", "Não"], "sameLine": false, "isActive": true },
  { "id": "03de7354-94e8-4228-a51f-506e75d710fa", "type": "multiple_choice", "label": "Intestino Regular?", "options": ["Sim", "Não"], "sameLine": false, "isActive": true },
  { "id": "0defbfe2-bfae-4a6c-9c71-f9257e841961", "type": "multiple_choice", "label": "Qualidade do Sono", "options": ["Boa", "Ruim"], "sameLine": false, "isActive": true },
  { "id": "4c042398-38bb-44ab-992a-60589a194917", "type": "multiple_choice", "label": "Gravida ou Amamentando?", "options": ["Sim", "Não"], "sameLine": false, "isActive": true },
  { "id": "a50c89ba-0720-41bf-ae85-ba34d619ed1d", "type": "multiple_choice", "label": "Está em período Pré-Mestrual ou Mestrual?", "options": ["Sim", "Não"], "sameLine": false, "isActive": true },
  { "id": "834710c5-e51c-4b5c-b17d-2b4afb8e23f9", "type": "multiple_choice", "label": "Alérgico?", "options": ["Sim", "Não"], "sameLine": false, "isActive": true },
  { "id": "9218d6e3-f613-41a4-9e32-a50d4fec0bb8", "type": "short_text", "label": "Especifique", "sameLine": true, "isActive": true },
  { "id": "5fae1d93-b677-4c3d-b5db-d975a5af2fcd", "type": "multiple_choice", "label": "Faz uso de Produtos para Rejuvenescimento/ Peeling ou Laser?", "options": ["Sim", "Nao"], "sameLine": false, "isActive": true },
  { "id": "a90da256-bd76-4dc4-bdef-740751e0ccf1", "type": "short_text", "label": "Especifique", "sameLine": true, "isActive": true },
  { "id": "45091a0c-da53-4b62-af1f-50798a7229a1", "type": "multiple_choice", "label": "Faz uso de medicamento Continuo ou temporário?", "options": ["Sim", "Não"], "sameLine": false, "isActive": true },
  { "id": "e00e0087-fc00-4b2a-8c90-e5bf2f4e3cd0", "type": "short_text", "label": "Especifique", "sameLine": true, "isActive": true },
  { "id": "6d9edda3-eebf-4f7f-87eb-0eb47e4fa121", "type": "multiple_choice", "label": "Possui problemas de cicatrização?", "options": ["Sim", "Não"], "sameLine": false, "isActive": true },
  { "id": "e6dd05b3-3aab-49e0-ade2-f1e164f1e9c2", "type": "multiple_choice", "label": "Já teve ocorrências com queloides", "options": ["Sim", "Não"], "sameLine": false, "isActive": true },
  { "id": "97b396e9-da9d-42ac-9da3-cf1db032d847", "type": "multiple_choice", "label": "Sofre de Epilepsia?", "options": ["Sim", "Não"], "sameLine": false, "isActive": true },
  { "id": "a4fa9fde-0cd4-4c4c-8367-efbf9dc23351", "type": "multiple_choice", "label": "Portador de Hepatite C?", "options": ["Sim", "Não"], "sameLine": false, "isActive": true },
  { "id": "2e68449c-edde-4a94-b15f-53cfa2a7e7a6", "type": "multiple_choice", "label": "Sofre Hemofilia", "options": ["Sim", "Não"], "sameLine": false, "isActive": true },
  { "id": "979e2760-b74a-4a25-9003-8889cd11099f", "type": "multiple_choice", "label": "Alguma Doença Cronica Infecciosa?", "options": ["Sim", "Não"], "sameLine": false, "isActive": true },
  { "id": "e305e5de-ba11-4770-b7de-846d1bf473c9", "type": "multiple_choice", "label": "É portador de Diabetes?", "options": ["Sim", "Não"], "sameLine": false, "isActive": true },
  { "id": "ec01c775-5ad2-4cc7-ab32-cbedec642672", "type": "multiple_choice", "label": "Se sim, esta controlada?", "options": ["Sim", "Não"], "sameLine": true, "isActive": true },
  { "id": "6e8b417c-be82-411a-bf41-7667d4cc06de", "type": "multiple_choice", "label": "Sofre de Pressão Alta ou baixa", "options": ["Sim", "Não"], "sameLine": false, "isActive": true },
  { "id": "dd1bbd1b-3652-4467-baaa-cd9bafad6585", "type": "multiple_choice", "label": "Faz Quimioterapia?", "options": ["Sim", "Não"], "sameLine": false, "isActive": true },
  { "id": "273a8798-e4b2-4d26-a0bf-b4036f0e4ccb", "type": "multiple_choice", "label": "Portador de Marcapasso?", "options": ["Sim", "Não"], "sameLine": false, "isActive": true },
  { "id": "0a1744b1-e28a-49eb-bb83-eff2c9ab114e", "type": "multiple_choice", "label": "Utiliza Anticoncepcional?", "options": ["Sim", "Não"], "sameLine": false, "isActive": true },
  { "id": "d059e0a2-230b-4bd0-835b-17937dae6fe7", "type": "multiple_choice", "label": "Tipo de Pele", "options": ["Alípica", "Lipidica", "Normal", "Seborreica"], "sameLine": false, "isActive": true },
  { "id": "be66ee0e-91d1-420a-8d1e-8e4eeaa8d08c", "type": "multiple_choice", "label": "Pele", "options": ["Acne", "Millium", "Comedão", "Queloide", "Nódulos", "Abcessos", "Foliculite", "Telangiesctasia"], "sameLine": false, "isActive": true },
  { "id": "1d8eb6d4-d5cf-4dfd-b4ef-5b9ad1782e0e", "type": "long_text", "label": "Data , e Procedimento Realizado", "sameLine": false, "isActive": true }
]'::jsonb
WHERE id = '388e3522-9a18-4618-8968-8dc70df0e636';
-- Create template first if it doesn't exist
INSERT INTO anamnesis_templates (id, name, is_active, created_at, updated_at)
SELECT '5c8a49c9-2f5a-4f51-a982-f5e55cd78201', 'Anamnese Micropigmentação', true, now(), now()
WHERE NOT EXISTS (
    SELECT 1 FROM anamnesis_templates WHERE name = 'Anamnese Micropigmentação'
);

-- Then update its fields
UPDATE anamnesis_templates
SET fields = '[
  { "id": "4b68bb6e-7009-411a-bd2f-fca21147dbb1", "type": "multiple_choice", "label": "Grávida ou amamentando?", "options": ["Sim", "Não"], "sameLine": false, "isActive": true },
  { "id": "7dcfa1b7-a384-46c5-95ee-2358bc75c8ee", "type": "multiple_choice", "label": "Esta em periodo Pré Menstrual ou Menstrual?", "options": ["Sim", "Não"], "sameLine": false, "isActive": true },
  { "id": "bd05a769-cf77-4c42-aa81-422acabed76c", "type": "multiple_choice", "label": "Alérgico?", "options": ["Sim", "Não"], "sameLine": false, "isActive": true },
  { "id": "d0e1bba8-fc33-4df4-aca1-c1e1948addff", "type": "multiple_choice", "label": "Fumante?", "options": ["Sim", "Não"], "sameLine": false, "isActive": true },
  { "id": "dbf220f8-c923-455b-bce9-ee347edfa5cb", "type": "multiple_choice", "label": "Faz uso de Produtos para Rejuvenescimento?", "options": ["Sim", "Não"], "sameLine": false, "isActive": true },
  { "id": "7c13ac47-dd4b-4b13-aec0-0985da010db9", "type": "short_text", "label": "Especifique", "sameLine": true, "isActive": true },
  { "id": "c1f6d900-51b6-4fd4-accc-9954a761e0f0", "type": "short_text", "label": "Se sim, qual produto?", "sameLine": true, "isActive": true },
  { "id": "f516a8fa-7e61-4ed4-9e8c-5727b14d33eb", "type": "multiple_choice", "label": "Já teve reação alérgica a Luvas, Anestesicos, Niquel, Plástico, etc?", "options": ["Sim", "Não"], "sameLine": false, "isActive": true },
  { "id": "55df4bba-9aa2-45e0-bfea-74caebeaaa5e", "type": "multiple_choice", "label": "Utiliza medicação continua e/ou temporaria?", "options": ["Sim", "Não"], "sameLine": false, "isActive": true },
  { "id": "06b02660-f65f-4613-8b77-a8a29a6dc74e", "type": "short_text", "label": "Se sim, qual?", "sameLine": true, "isActive": true },
  { "id": "f56b7cd4-40da-4a8e-a22a-fecbfd918349", "type": "multiple_choice", "label": "Esta Aplicando Peelings Quimicos, ou realizando tratamento com laser?", "options": ["Sim", "Não"], "sameLine": false, "isActive": true },
  { "id": "812b1c41-2c06-4df7-bccd-a34237d6dd64", "type": "multiple_choice", "label": "Possui algum problema de cicatrização?", "options": ["Sim", "Não"], "sameLine": false, "isActive": true },
  { "id": "dc9c5cc3-f220-41ff-bb37-25e2293ac9e6", "type": "multiple_choice", "label": "Teve alguma ocorrencia com queloides?", "options": ["Sim", "Não"], "sameLine": false, "isActive": true },
  { "id": "0ae7b173-00f7-418f-a774-6ddc08c90ad7", "type": "multiple_choice", "label": "Sofre Epilepsia ou sofreu nos ultimos 2 anos?", "options": ["Sim", "Não"], "sameLine": false, "isActive": true },
  { "id": "bc1fc422-b5e0-4a6c-a29d-4731dbfc3fa3", "type": "multiple_choice", "label": "Sofre Hemofilia?", "options": ["Sim", "Não"], "sameLine": false, "isActive": true },
  { "id": "6a96f130-1c3f-42ae-9bc5-c800882e39db", "type": "multiple_choice", "label": "Sofre de alguma doença Crônica Infecciosa?", "options": ["Sim", "Não"], "sameLine": false, "isActive": true },
  { "id": "ecbad90f-9f79-450f-a492-de7eb3c563d7", "type": "multiple_choice", "label": "É portador de Hepatite C?", "options": ["Sim", "Não"], "sameLine": false, "isActive": true },
  { "id": "3beadcb9-5c49-4144-88aa-8d1912f718d7", "type": "multiple_choice", "label": "Tem ou teve Herpes simples ou Zooster?", "options": ["Sim", "Não"], "sameLine": false, "isActive": true },
  { "id": "e6dd05b3-3aab-49e0-ade2-f1e164f1e9c2", "type": "multiple_choice", "label": "Tem Dermatite Seborreica ou de contato?", "options": ["Sim", "Não"], "sameLine": false, "isActive": true },
  { "id": "e305e5de-ba11-4770-b7de-846d1bf473c9", "type": "multiple_choice", "label": "É portador de Diabetes?", "options": ["Sim", "Não"], "sameLine": false, "isActive": true },
  { "id": "ec01c775-5ad2-4cc7-ab32-cbedec642672", "type": "short_text", "label": "Se sim, esta controlada?", "sameLine": true, "isActive": true },
  { "id": "6e8b417c-be82-411a-bf41-7667d4cc06de", "type": "multiple_choice", "label": "Sofre de Pressão Alta ou baixa", "options": ["Sim", "Não"], "sameLine": false, "isActive": true },
  { "id": "d0ecaa0f-d477-4ae4-bd2d-411db1bdad59", "type": "multiple_choice", "label": "Sofre Glaucoma?", "options": ["Sim", "Não"], "sameLine": false, "isActive": true },
  { "id": "b303fe28-6623-40a2-aa90-b3e83b432924", "type": "multiple_choice", "label": "pressão", "options": ["alta", "baixa"], "sameLine": true, "isActive": true },
  { "id": "f5e933e4-6c3f-4279-b1d3-35f111eeb805", "type": "multiple_choice", "label": "Usa lentes de contato?", "options": ["Sim", "Não"], "sameLine": false, "isActive": true },
  { "id": "4b971a94-47cf-4a41-a3f7-ccb8c25732c5", "type": "multiple_choice", "label": "Esta em Tratamento de Quimioterapia? Se sim, anexar autorização médica", "options": ["Sim", "Não"], "sameLine": false, "isActive": true },
  { "id": "1c7b278f-ef54-46ac-bded-63b784ab75de", "type": "multiple_choice", "label": "Esta em pré/pós Tratamento Radioterapia? Se sim anexar autorização médica.", "options": ["Sim", "Não"], "sameLine": false, "isActive": true },
  { "id": "58667c46-7c6b-4ac3-a2eb-ed3825501ca1", "type": "multiple_choice", "label": "Sofre de Problemas Circulatórios?", "options": ["Sim", "Não"], "sameLine": false, "isActive": true },
  { "id": "1e6d9711-b0db-44a6-bcb7-c20ec5cf4dcc", "type": "multiple_choice", "label": "Concorda com a divulgação de imagens de antes e depois do procedimento?", "options": ["Sim", "Não"], "sameLine": false, "isActive": true },
  { "id": "e6741b1d-bb6f-479c-b26a-8b10cb6f43e3", "type": "modelo_padrao", "label": "Contrato Micropigmentação", "content": "Eu, @NomeCliente, portadora de CPF @CPF, endereço @Endereco, concordo que:\n\nA Micropigmentação é o implante de pigmento na pele com a finalidade de simular uma maquiagem permanente no rosto, corrigir ou disfarçar imperfeições, cicatrizes, hipercromias ou discromias. É um procedimento invasivo, que consiste na introdução intradérmica de substâncias corantes por meio de agulhas ou dispositivos que cumpram igual finalidade. A durabilidade do procedimento não dependerá apenas da expertise do profissional, dos produtos e/ou aparelhos utilizados, mas também de outros fatores, desde os cuidados pós-procedimento até os hábitos do cliente.\nCada pele e organismo reage de forma diferente à introdução de um pigmento. A região onde o cliente mora também influenciará na duração, uma vez que a exposição demasiada ao sol e calor ajudarão a desbotar o trabalho antes do tempo esperado, tendo uma durabilidade menor.\n\nQUESTÕES DE CONCORDÂNCIA\n1 - Entendo a importância de fornecer um histórico médico verdadeiro e que qualquer omissão relacionada à minha saúde pode comprometer o resultado do procedimento.\n2 - Não me enquadro na lista de clientes de risco, nem apresento doença infectocontagiosa, sintoma de debilidade imunológica e não estou sob efeito de álcool e/ou drogas.\n3- Estou ciente que alguns medicamentos podem afetar o tratamento, incluindo pequenos sangramentos e inchaços.\n4 - Recebi informações para os cuidados pós procedimento, em folha impressa e meio digital. Estou ciente que sou responsável pelo cuidado pós micropigmentação, e afirmo que seguirei as instruções de cuidados recebidas do profissional.\n5 - Estou de acordo com a simetria e cores de pigmentos que foram selecionadas.\n6 - Entendo que não há como precisar o período de durabilidade do procedimento, devido aos fatores que interferem na fixação do pigmento na pele (Ex: oleosidade, exposição ao sol, sistema imunológico, etc)\n7 - O profissional expos detalhadamente os itens acima e não tenho dúvidas sobre o procedimento. Estou ciente de minhas condições psicológicas e de saúde, isentando o profissional de responsabilidade quanto às reações adversas futuras ou insatisfação, uma vez que foi realizada uma avaliação prévia e nesta me foi apresentado o projeto e possíveis reações adversas.\nIMPORTANTE: Antes do procedimento será feito o registro da área a ser micropigmentada por meio de imagens (fotos)serão registradas fotos antes, projeto, resultado imediato e resultado após cicatrização. Autorizo o uso de minhas imagens para divulgação dos serviços prestados pelo estabelecimento e/ou profissional em congressos, meios virtuais e/ou mídia impressa\n\n@DataAtual", "sameLine": false, "isActive": true },
  { "id": "b05ce5ad-639a-4ae4-90a6-16cb03b6dc24", "type": "modelo_padrao", "label": "Observação Técnicas sobre o procedimento", "content": "Sessão\tTécnica Aplicada\tCor Aplicada\tAgulha\tSensibilidade\n\n\n\n", "sameLine": false, "isActive": true }
]'::jsonb
WHERE name = 'Anamnese Micropigmentação';
-- Create template first if it doesn't exist
INSERT INTO anamnesis_templates (id, name, is_active, created_at, updated_at)
SELECT 'a012a9c9-2f5a-4f51-a982-f5e55cd78202', 'Contrato Corporal', true, now(), now()
WHERE NOT EXISTS (
    SELECT 1 FROM anamnesis_templates WHERE name = 'Contrato Corporal'
);

-- Then update its fields
UPDATE anamnesis_templates
SET fields = '[
  {
    "id": "e6741b1e-bb6f-479c-b26a-8b10cb6f43e4",
    "type": "modelo_padrao",
    "label": "Corporal",
    "content": "CONTRATO DE PRESTAÇÃO DE SERVIÇOS ESTÉTICOS\n\nCOCONTRATADA: Marli Cosméticos Prime Estética, registrada pelo CNPJ nº 03.917.220/0001/72\n\nCOCONTRATANTE: @NomeCliente, portador (a) do RG @RG e CPF @CPF , residente e domiciliado(a) no endereço:  @Endereco, @Numero @Bairro,  @Cidade, @Estado\n\nAs As partes acima acordam o presente contrato de prestação de serviços, regido pelas cláusulas e condições descritas a seguir.\n\nDDO OBJETO DO CONTRATO\n\nCLÁUSULA 1ª - É objeto do contrato a prestação de serviços estendida, neste caso sendo chamada de PACOTES DE PROCEDIMENTOS ESTÉTICOS, a serem realizados pela CONTRATADA.\n\nCLÁUSULA 2ª - O referido contrato se refere ao @ItensVenda _________¬¬____________, sendo realizado em _______ sessão(ões)\n\nCLÁUSULA 3ª - As sessões serão marcadas de acordo com a compatibilidade de agenda das duas partes, sendo necessário a observação das obrigações a seguir. C\n\nDAS OBRIGAÇÕES\n\nCLÁUSULA 4ª - O não comparecimento nos dias marcados, sem aviso prévio, dará liberdade a CONTRATADA em cancelar o contrato ou mantê-lo, devendo apenas comunicar a CONTRATANTE sobre o cancelamento.\n\nCLÁUSULA 5ª - Em caso de cancelamento do contrato por não comparecimento da CONTRATANTE, o valor pago não será ressarcido.\n\nParágrafo único: A CONTRATADA poderá solicitar pagamento integral ou parcial antes do procedimento de acordo com a necessidade, considerando que aparelhos locados ou produtos que devem ser preparados com antecedência podem trazer prejuízos à parte CONTRATADA, devendo a parte CONTRATANTE se atentar a esta cláusula e comparecendo aos dias e horas marcadas.\n\nCLÁUSULA 6ª - O plano de tratamento não pode ser transferido sem comunicação previa para a contratada e deve ser concluído no prazo máximo de 1 ano.\n\nCLÁUSULA 7ª - Caso a CONTRATANTE opte pela desistência do tratamento após iniciado, o contrato será cancelado e não haverá devolução do valor do pago, podendo ser cobrada multa de 50% do valor do tratamento quando for identificado prejuízo para a contratada, considerando sempre equipamentos, materiais e substâncias que podem ser preparadas para o procedimento.\n\nParágrafo único: Em caso de desmarcação de procedimentos por 3 vezes, ainda que observando o disposto na cláusula 9ª, poderá a CONTRATADA rescindir este instrumento de contrato nos moldes da cláusula 7ª.\n\nCLÁUSULA 8ª -   O objeto do contrato deve ser consumido em até 180 dias após a assinatura desse contrato, salvo em pacotes maiores, em que o prazo será definido ao fim deste contrato.\n\nCLÁUSULA 9ª - Em caso de necessidade em desmarcar o atendimento, a CONTRATANTE terá que comunicar a CONTRATADA em até 12 horas antes do horário marcado.\n\nCLÁUSULA 10ª - Não serão realizados atendimentos após 10 minutos de atraso do horário agendado. O pagamento referente a sessão não será devolvido. Em caso de interesse em fazer a sessão, o CONTRATANTE deverá agendar novo atendimento e por ele será cobrado o valor normal da sessão, sem descontos.\n\nCLÁUSULA 11ª - A CONTRATANTE deve sempre entrar em contato quando houver risco de atraso e verificar qual horário ou dia de atendimento a sessão poderá ser realizada.\n\nDOS VALORES E PAGAMENTOS\n\nCLÁUSULA 12ª -   O valor do tratamento estará disponível em tabela ao fim deste instrumento de contrato, devendo a contratante aceitar as opções de pagamento ofertadas pela parte contratada, bem como as condições de parcelamento ou pagamento único.\n\nCLÁUSULA 13ª - As partes estabelecem que havendo atraso no pagamento, serão cobrados juros de mora na proporção de 1% ao mês, acrescido de multa de 2%.\n\nCLÁUSULA 14ª - O CONTRATANTE se declara ciente que o presente contrato é de meio, na via judicial, podendo ser executado em caso de não pagamento ou cumprimento das obrigações.\n\nCLÁUSULA 15ª - Em caso de parcelamento do pagamento, havendo vencimento de parcelas não pagas, a CONTRATADA poderá suspender o tratamento até efetiva regularização do contrato.\n\nCLÁUSULA 16ª - Em caso de cancelamento do tratamento contratado antes da data prevista de término, fica expressamente estabelecida a obrigação da Contratante em efetuar o pagamento de todas as sessões realizadas, caso não o tenha feito, além de multa equivalente à 20% do valor do tratamento.\n\nCLÁUSULA 17ª - Após o prazo mencionado na cláusula 8ª, caso o tratamento não tenha sido concluído, o contrato perderá a validade e o tratamento objeto deste contrato se dará por encerrado automaticamente.\n\nDO DIREITO A INFORMAÇÃO\n\nCLÁUSULA 18ª - O tratamento realizado inclui procedimentos específicos para a recuperação e manutenção do cliente, fica o cliente ciente das obrigações e orientações passadas pelo profissional.\n\nCLÁUSULA 19ª - O CONTRATANTE fica ciente que a ASSINATURA NO TERMO DE RESPONSABILIDADE PÓS PROCEDIMENTO implica na obrigação em seguir todas as recomendações, não tendo direito em discordar do resultado em caso de não cumprimento das responsabilidades solicitadas pela CONTRATADA.\n\nCLÁUSULA 20ª - As orientações pós procedimentos podem, em alguns casos, ser encaminhadas por conversa entre as partes, caracterizando automaticamente o aceite da contratante em cumprir de forma integral todas as orientações e mantendo a perda de direito mencionada na cláusula anterior.\n\nCLÁUSULA 21ª - As partes concordam em buscar o melhor atendimento e resultado mutuamente, e acordam que os termos apresentados neste contrato e nos demais documentos vinculados à relação de consumo serão de extrema valia e sinônimo de cuidado e respeito entre as partes.\n\nCLÁUSULA 22ª - Fica o CONTRATANTE ciente de que o não esclarecimento e a omissão de antecedentes de qualquer tipo, tanto na ficha de anamnese quanto em perguntas realizadas pelo profissional, deixam o profissional isento de qualquer responsabilidade.\n\nCLÁUSULA 23ª - O CONTRATANTE se declara ciente de todos os riscos apresentados pelo profissional, quanto ao procedimento que será realizado.\n\nCLÁUSULA 24ª - O CONTRATANTE fica ciente que terá que seguir as orientações do profissional, ficando assim o profissional livre de quaisquer danos decorrentes ao mau uso dos produtos e o não cumprimento das orientações.\n\nDO PÓS PROCEDIMENTO\n\nCLÁUSULA 25ª - Caberá ao profissional responsável entregar as orientações necessárias sobre a realização do procedimento, bem como as orientações relacionadas a continuidade do tratamento de forma clara e compreensível ao paciente contratante.\n\nCLÁUSULA 26ª - Em caso de intercorrências decorrentes do procedimento, fica obrigado o profissional responsável em dar o devido suporte ao contratante, incluindo acompanhamento em atendimento médico e medicamentos, caso haja necessidade.\n\nParágrafo único: Caso o surgimento da intercorrência se tratar de desobediência as orientações ou culpa exclusiva do paciente, não será atribuída responsabilidade alguma à contratada.\n\nCLÁUSULA 27ª - O contratante fica vedado de realizar procedimentos na área tratada com outros profissionais, em razão de possível intercorrência por incompatibilidade dos produtos e equipamentos utilizados, devendo ser atribuída total responsabilidade ao contratante caso esta cláusula não seja obedecida.\n\nParágrafo único: O paciente estará livre para realizar quaisquer procedimentos com outros profissionais na área tratada somente após a finalização do tratamento ou após a completa absorção do produto aplicado pelo organismo, quando houver.\n\nDO FORO\n\nCLÁUSULA 28ª - As partes elegem o foro central da comarca de _______________ para dirimir quaisquer questões decorrentes da execução do presente contrato, com exclusão de qualquer outro, por mais privilegiado que seja.\n\nDA ISENÇÃO DE RESPONSABILIDADE DA CONTRATADA\n\nCLÁUSULA 29ª - Em caso de descumprimento de quaisquer clausulas acima descritas, será o presente instrumento rescindo, estando a CONTRATADA isenta de qualquer indenização pessoal, material ou moral ou ainda a devolução de pagamento já efetuado, tendo em vista a realização do tratamento conforme contratado.\n\nDA POSSIBILIDADE DE EXECUÇÃO JUDICIAL DO CONTRATO\n\nCLÁUSULA 30ª - Ficam as partes cientes que tal documento é meio judicial, podendo ser executado a qualquer tempo.\n\nDA PROTEÇÃO DE DADOS\n\nCLÁUSULA 31º - Em razão da LEI DE PROTEÇÃO DE DADOS, os seguintes pontos deverão ser respeitados:\n\n- Caso seja necessário o compartilhamento de dados, processamento e uso do dado, deveram as partes solicitar expressamente autorização, apresentando a finalidade de forma clara e objetiva constando quais dados serão entregues.\n\n- A forma de obtenção e registro do consentimento para tratamento de dados deverá ser feita de forma física, coletando-se da assinatura relativa ao consentimento;\n\n- Cada parte terá a responsabilidade para a coleta e armazenamento correto dos dados;\n\n- Após o consentimento, o acesso ao dado coletado armazenado, bem com o os procedimentos para correção e exclusão por pedido do interessado ou por limite de tempo poderão ser realizados de forma livre;\n\n- As partes deverão ser informadas sobre qualquer auditoria dos dados armazenados, bem como receber informações sobre os responsáveis pelo uso, acesso e tratamento dos dados;\n\n- Aquele que receber consentimento expresso do uso, compartilhamento e processamento dos dados, deverá adotar medidas de proteção e segurança dos dados e realizar procedimento necessário em caso de vazamento.\n\n- Em caso de vazamento de dados, a parte que teve ciência do fato deverá comunicar a outra.\n\nDA SITUAÇÃO DE CASO FORTUITO OU FORÇA MAIOR\n\nCLÁUSULA 32ª - Em caso de situação que envolva caso fortuito ou força maior que impeçam o funcionamento do local de atendimento, o contrato fica temporariamente suspenso, sendo retomado quando o local de atendimento possuir liberdade de funcionamento.\n\nParágrafo único - Nos casos em que sejam exigidos retornos ou acompanhamento pelos profissionais, as partes deverão manter contato para identificar necessidade de atendimento urgente ou para obter o resultado esperado ou evitar intercorrências.\n\nSendo de livre vontade das partes, encerra-se o presente termo com as devidas assinaturas.\n\n___________________, ________ de ______________________ de 20____\n\n______________________________________________\nCONTRATANTE\n\n______________________________________________\nCONTRATADA",
    "sameLine": false,
    "isActive": true
  }
]'::jsonb
WHERE name = 'Contrato Corporal';
-- Create template first if it doesn't exist
INSERT INTO anamnesis_templates (id, name, is_active, created_at, updated_at)
SELECT 'b123b9c9-2f5a-4f51-a982-f5e55cd78203', 'Evolução Corporal', true, now(), now()
WHERE NOT EXISTS (
    SELECT 1 FROM anamnesis_templates WHERE name = 'Evolução Corporal'
);

-- Then update its fields
UPDATE anamnesis_templates
SET fields = '[
  {
    "id": "f7852c2e-cc7a-48ad-a3fa-9c21dc7f54f5",
    "type": "modelo_padrao",
    "label": "Acompanhamento",
    "content": "Acompanhamento:\n\nsessão | data | observação\n---|---|---\n | | \n | | \n | | \n | | \n | | \n | | \n | | \n | | \n",
    "sameLine": false,
    "isActive": true
  }
]'::jsonb
WHERE name = 'Evolução Corporal';
-- Create template first if it doesn't exist
INSERT INTO anamnesis_templates (id, name, is_active, created_at, updated_at)
SELECT 'c234a9c9-2f5a-4f51-a982-f5e55cd78204', 'Exame Físico', true, now(), now()
WHERE NOT EXISTS (
    SELECT 1 FROM anamnesis_templates WHERE name = 'Exame Físico'
);

-- Then update its fields
UPDATE anamnesis_templates
SET fields = '[
  { "id": "f1a1b1c1-1111-411a-bd2f-fca21147dbb1", "type": "number", "label": "Altura ( cm )", "sameLine": true, "isActive": true },
  { "id": "f2a2b2c2-2222-422a-bd2f-fca21147dbb2", "type": "number", "label": "Busto ( Cm )", "sameLine": false, "isActive": true },
  { "id": "f3a3b3c3-3333-433a-bd2f-fca21147dbb3", "type": "number", "label": "Braço Esquerdo ( )", "sameLine": true, "isActive": true },
  { "id": "f4a4b4c4-4444-444a-bd2f-fca21147dbb4", "type": "number", "label": "Braço Direito ( cm )", "sameLine": false, "isActive": true },
  { "id": "f5a5b5c5-5555-455a-bd2f-fca21147dbb5", "type": "number", "label": "Abdomem ( cm )", "sameLine": true, "isActive": true },
  { "id": "f6a6b6c6-6666-466a-bd2f-fca21147dbb6", "type": "number", "label": "Cintura ( cm )", "sameLine": true, "isActive": true },
  { "id": "f7a7b7c7-7777-477a-bd2f-fca21147dbb7", "type": "number", "label": "Quadril ( cm )", "sameLine": false, "isActive": true },
  { "id": "f8a8b8c8-8888-488a-bd2f-fca21147dbb8", "type": "number", "label": "culote ( cm )", "sameLine": false, "isActive": true },
  { "id": "f9a9b9c9-9999-499a-bd2f-fca21147dbb9", "type": "number", "label": "Coxa Esquerda ( cm )", "sameLine": false, "isActive": true },
  { "id": "f0a0b0c0-0000-400a-bd2f-fca21147dbb0", "type": "number", "label": "Panturilha Direita ( cm )", "sameLine": false, "isActive": true },
  { "id": "f1b1c1d1-1111-411b-bd2f-fca21147dbb1", "type": "number", "label": "Panturilha Esquerda ( cm )", "sameLine": false, "isActive": true },
  { "id": "f2b2c2d2-2222-422b-bd2f-fca21147dbb2", "type": "number", "label": "Peso ( kg )", "sameLine": false, "isActive": true },
  { "id": "f3b3c3d3-3333-433b-bd2f-fca21147dbb3", "type": "number", "label": "Coxa Direita ( cm )", "sameLine": false, "isActive": true },
  {
    "id": "f4b4c4d4-4444-444b-bd2f-fca21147dbb4",
    "type": "modelo_padrao",
    "label": "Bio",
    "content": "data | | | | | | | |\n---|---|---|---|---|---|---|---\nIMC | | | | | | | |\nGordura Corporal | | | | | | | |\nTaxa Muscular | | | | | | | |\nMassa Livre de Gordura | | | | | | | |\nGordura Subcutanea | | | | | | | |\nGordura Visceral | | | | | | | |\nAgua | | | | | | | |\nIdade Metabolica | | | | | | | |\n",
    "sameLine": false,
    "isActive": true
  }
]'::jsonb
WHERE name = 'Exame Físico';
-- Create template first if it doesn't exist
INSERT INTO anamnesis_templates (id, name, is_active, created_at, updated_at)
SELECT 'd345b9c9-2f5a-4f51-a982-f5e55cd78205', 'Laser', true, now(), now()
WHERE NOT EXISTS (
    SELECT 1 FROM anamnesis_templates WHERE name = 'Laser'
);

-- Then update its fields
UPDATE anamnesis_templates
SET fields = '[
  { "id": "l1a1b1c1-1111-411a-bd2f-fca21147dbb1", "type": "multiple_choice", "label": "Já fez outro tipo de tratamento com Laser?", "options": ["Sim", "Não"], "sameLine": false, "isActive": true },
  { "id": "l2a2b2c2-2222-422a-bd2f-fca21147dbb2", "type": "short_text", "label": "se sim, qual?", "sameLine": true, "isActive": true },
  { "id": "l3a3b3c3-3333-433a-bd2f-fca21147dbb3", "type": "multiple_choice", "label": "Fumante", "options": ["Sim", "Não"], "sameLine": false, "isActive": true },
  { "id": "l4a4b4c4-4444-444a-bd2f-fca21147dbb4", "type": "multiple_choice", "label": "Alguma Alergia?", "options": ["Sim", "Não"], "sameLine": false, "isActive": true },
  { "id": "l5a5b5c5-5555-455a-bd2f-fca21147dbb5", "type": "short_text", "label": "Se sim, qual?", "sameLine": false, "isActive": true },
  { "id": "l6a6b6c6-6666-466a-bd2f-fca21147dbb6", "type": "multiple_choice", "label": "Já apresentou infecções por herpes virus em alguma parte do corpo?", "options": ["Sim", "Não"], "sameLine": false, "isActive": true },
  { "id": "l7a7b7c7-7777-477a-bd2f-fca21147dbb7", "type": "multiple_choice", "label": "Algum historico de cancer de Pele?", "options": ["Sim", "Não"], "sameLine": false, "isActive": true },
  { "id": "l8a8b8c8-8888-488a-bd2f-fca21147dbb8", "type": "multiple_choice", "label": "Tendencia a Queloides?", "options": ["Sim", "Não"], "sameLine": false, "isActive": true },
  {
    "id": "l9b9c9d9-9999-499b-bd2f-fca21147dbb9",
    "type": "modelo_padrao",
    "label": "Laser",
    "content": "Área do Corpo: | Tamanho: | Tempo:\n---|---|---\nMotivo da Remoção: | Cores: | Houve Retoque: ( )sim ( ) não\n\n\nSessão | Data | Parâmetros | Disparos | Observação | Valor\n---|---|---|---|---|---\n | | | | | \n | | | | | \n | | | | | \n | | | | | \n | | | | | \n | | | | | \n | | | | | \n | | | | | \n",
    "sameLine": false,
    "isActive": true
  }
]'::jsonb
WHERE name = 'Laser';
-- Create template first if it doesn't exist
INSERT INTO anamnesis_templates (id, name, is_active, created_at, updated_at)
SELECT 'e456b9c9-2f5a-4f51-a982-f5e55cd78206', 'Prontuário de Enfermagem', true, now(), now()
WHERE NOT EXISTS (
    SELECT 1 FROM anamnesis_templates WHERE name = 'Prontuário de Enfermagem'
);

-- Then update its fields
UPDATE anamnesis_templates
SET fields = '[
  { "id": "p1a1b1c1-1111-411a-bd2f-fca21147dbb1", "type": "short_text", "label": "Data", "sameLine": true, "isActive": true },
  { "id": "p2a2b2c2-2222-422a-bd2f-fca21147dbb2", "type": "multiple_choice", "label": "Sexo", "options": ["M", "F"], "sameLine": false, "isActive": true },
  {
    "id": "p3a3b3c3-3333-433a-bd2f-fca21147dbb3",
    "type": "modelo_padrao",
    "label": "Dados Pessoais",
    "content": "**Dados Pessoais:** @NomeCliente\n\n**Data de Nascimento:** @DataNascimento | **CPF:** @CPF\n\n**Endereço:** @Endereco | **Número:** @Numero\n\n**Telefone:** @Telefone1\n",
    "sameLine": false,
    "isActive": true
  },
  { "id": "p4a4b4c4-4444-444a-bd2f-fca21147dbb4", "type": "short_text", "label": "Ocupação:", "sameLine": false, "isActive": true },
  { "id": "p5a5b5c5-5555-455a-bd2f-fca21147dbb5", "type": "short_text", "label": "Médico do Paciente: (Se houver)", "sameLine": false, "isActive": true },
  { "id": "p6a6b6c6-6666-466a-bd2f-fca21147dbb6", "type": "multiple_choice", "label": "Limitações:", "options": ["Cognitiva", "Locomoção", "Visão", "Audição"], "sameLine": false, "isActive": true },
  { "id": "p7a7b7c7-7777-477a-bd2f-fca21147dbb7", "type": "short_text", "label": "OUtras:", "sameLine": false, "isActive": true },
  { "id": "p8a8b8c8-8888-488a-bd2f-fca21147dbb8", "type": "multiple_choice", "label": "Esta em uso de alguma Medicação?", "options": ["Sim", "Não"], "sameLine": false, "isActive": true },
  { "id": "p9a9b9c9-9999-499a-bd2f-fca21147dbb9", "type": "short_text", "label": "se sim, quais?", "sameLine": false, "isActive": true },
  { "id": "p0a0b0c0-0000-400a-bd2f-fca21147dbb0", "type": "multiple_choice", "label": "Realiza Atividades Físicas?", "options": ["Sim", "Não"], "sameLine": false, "isActive": true },
  { "id": "p1b1c1d1-1111-411b-bd2f-fca21147dbb1", "type": "short_text", "label": "Com que Fequência?", "sameLine": false, "isActive": true },
  { "id": "p2b2c2d2-2222-422b-bd2f-fca21147dbb2", "type": "multiple_choice", "label": "É portador(a) de Alguma Doença?", "options": ["Sim", "Não"], "sameLine": false, "isActive": true },
  { "id": "p3b3c3d3-3333-433b-bd2f-fca21147dbb3", "type": "short_text", "label": "Qual?", "sameLine": false, "isActive": true },
  { "id": "p4b4c4d4-4444-444b-bd2f-fca21147dbb4", "type": "short_text", "label": "Queixa Principal:", "sameLine": false, "isActive": true },
  { "id": "p5b5c5d5-5555-455b-bd2f-fca21147dbb5", "type": "short_text", "label": "P.A", "sameLine": false, "isActive": true },
  { "id": "p6b6c6d6-6666-466b-bd2f-fca21147dbb6", "type": "short_text", "label": "Peso:", "sameLine": true, "isActive": true },
  { "id": "p7b7c7d7-7777-477b-bd2f-fca21147dbb7", "type": "short_text", "label": "Altura:", "sameLine": true, "isActive": true },
  { "id": "p8b8c8d8-8888-488b-bd2f-fca21147dbb8", "type": "short_text", "label": "IMC:", "sameLine": false, "isActive": true },
  { "id": "p9b9c9d9-9999-499b-bd2f-fca21147dbb9", "type": "multiple_choice", "label": "Alergia a alguma medicação?", "options": ["Sim", "Não"], "sameLine": false, "isActive": true },
  { "id": "p0b0c0d0-0000-400b-bd2f-fca21147dbb0", "type": "short_text", "label": "Se sim, qual?", "sameLine": false, "isActive": true },
  { "id": "p1c1d1e1-1111-411c-bd2f-fca21147dbb1", "type": "multiple_choice", "label": "Administrar Medicação Conforme Prescrição Médica", "options": ["Curcumina", "Coenzima Q10", "Metilcobalamina-B12", "Vitamina D600,000UI", "Biotina", "Picolinato de Cromo", "Morosil", "Magnésio", "Vitamina A", "Zinco", "Selenio", "ADEK", "Vit. K2 MK7130mcg+ D3 600.000UI", "Carnitina", "Colageno", "Fenilalnina", "Tripofano", "Inositol + Taurina", "PQQ", "Outras"], "sameLine": false, "isActive": true },
  { "id": "p2c2d2e2-2222-422c-bd2f-fca21147dbb2", "type": "short_text", "label": "Outras Medicações", "sameLine": false, "isActive": true },
  { "id": "p3c3d3e3-3333-433c-bd2f-fca21147dbb3", "type": "multiple_choice", "label": "Prescrição de Enfermagem:", "options": ["Aumentar Ingestão hidrica", "Realizar Atividade Física", "Compressa local com água natural"], "sameLine": false, "isActive": true },
  { "id": "p4c4d4e4-4444-444c-bd2f-fca21147dbb4", "type": "short_text", "label": "outras:", "sameLine": true, "isActive": true },
  {
    "id": "p5c5d5e5-5555-455c-bd2f-fca21147dbb5",
    "type": "modelo_padrao",
    "label": "Acompanhamento",
    "content": "Evolução:\n",
    "sameLine": false,
    "isActive": true
  }
]'::jsonb
WHERE name = 'Prontuário de Enfermagem';
-- Create template first if it doesn't exist
INSERT INTO anamnesis_templates (id, name, is_active, created_at, updated_at)
SELECT 'f567b9c9-2f5a-4f51-a982-f5e55cd78207', 'Termo Laser', true, now(), now()
WHERE NOT EXISTS (
    SELECT 1 FROM anamnesis_templates WHERE name = 'Termo Laser'
);

-- Then update its fields
UPDATE anamnesis_templates
SET fields = '[
  {
    "id": "t1a1b1c1-1111-411a-bd2f-fca21147dbb1",
    "type": "modelo_padrao",
    "label": "Termo Laser",
    "content": "TERMO DE ESCLARECIMENTO, CIÊNCIA E CONSENTIMENTO.\n\nO LASER possui uma energia de alta intensidade descarregada em forma de pulsos extremamente curtos de luz, que passam através da pele e \"quebram\" as partículas dos pigmentos de uma tatuagem ou micropigmentação. Tais particulas são então removidas pelo organismo através dos macrófagos e pelo sistema linfático, podendo clarear significativamente ou remover o pigmento. Para melhores resultados e na dependência da resposta imunológica de cada indivíduo, tratamentos múltiplos podem ser necessários com pelo menos um mês de intervalo entre as sessões. O laser é utilizado para atingir somente a camada da pele que contém o pigmento. Utilizamos um LASER que possui duplos comprimentos de onda (1064nm & 532nm). que pode atender a maioria das colorações (com limitações às tonalidades amarelas e alaranjadas, verdes, azuis e suas variantes), portanto, dependendo da cor do pigmento, outros tipos de LASER, com outros comprimentos de onda, poderão ser necessários para a remoção completa.\nEu, @NomeCliente, portadora de CPF @CPF , Declaro ter sido informado (a) e estou ciente que:\n\n* Multiplas sessões podem ser necessárias;\n* A utilização de óculos de segurança é necessária durante a sessão, a fim de proteger os olhos da luz do laser;\n* Há métodos alternativos de remoção de tatuagem;\n* Os possíveis riscos e complicações, embora raros, podem incluir queimaduras e/ou bolhas, dor, insatisfação com resultados imediatos, vermelhidão e inchaços localizados, e alteração na cor do pigmento (em decorrência da química da mesma); Cicatrizes hipertróficas ou quelóides, embora raros. podem resultar caso o paciente não siga as orientações do pós-laser, e/ou se exponha ao Sol, e/ou já tenha tendência a este tipo de manifestação\n* Alguns pigmentos possuem Dióxido de Titânio em sua composição, com finalidade de promover tons claros à determinadas cores. Em alguns casos, é possível que ocorra um fenômeno fotoquímico provocado pela ação do LASER sobre o pigmento, transformando o dióxido de titânio em Oxido de Titânio. Como resultado, pode ocorrer um escurecimento do mesmo. Tal escurecimento, ainda assim poderá ser clareado ou removido com o uso do LASER, embora necessite de mais sessões para tal.\n\n* Não é possível dar garantias de resultados e números de sessões necessárias, tendo em vista que tais resultados podem variar em decorrência de vários fatores que não dependem da atuação do laser e de seu operador. São eles:\n\n- Tipo de tinta usada por aquele que fez a micropigmentação anterior ou tatuagem, visto que de acordo com a qualidade, algumas tintas podem ou não conter elementos químicos difíceis na remoção a curto prazo;\n- Tipo de material usado na feitura da micropigmentação ou tatuagem (agulhas, máquina profissional ou caseira);\n- Nível de performance técnica do profissional que é determinante na equalização da introdução dos pigmentos (tintas) nas camadas da pele;\n- Tempo da micropigmentação ou da tatuagem;\n- Características das cores e se houve retocagem posterior;\n- Local do corpo e tamanho e densidade da tatuagem (ou micropigmentação);\n- Resposta do sistema imunológico de cada indivíduo (em especial ao empenho de macrófagos e sistema linfático).\n* Ao fim do tratamento, é comum ocorrer hipocromia da pele no local da tatuagem (a área fica mais clara do que ao redor). Com o passar de alguns meses, presume-se que a própria melanina volte a \"repovoar\" a pele. Sugere-se o uso adequado de protetor solar para que com o tempo a área em que foi removida a tatuagem volte a ficar numa tonalidade mais próxima do normal. Dependendo do fototipo de pele, este processo pode ser mais prolongado;\n\n* Certas precauções são necessárias como: evitar exposição solar, utilizar corretamente o filtro solar e não arrancar as casquinhas (caso ocorra formação das mesmas);\n* O paciente deve informar sobre o uso atual de medicamentos e se já apresentou alguma doença dermatológica.\nDeclaro também que minhas dúvidas em relação à remoção de tatuagens e/ou Micropigmentação com LASER foram esclarecidas e que eu compreendo e aceito as recomendações e riscos inerentes à técnica.\n\n@DataAtual",
    "sameLine": false,
    "isActive": true
  }
]'::jsonb
WHERE name = 'Termo Laser';
CREATE OR REPLACE VIEW public.client_details_view AS SELECT c.*, (SELECT MAX(date) FROM public.appointments WHERE client_id = c.id AND status = 'atendido') as last_visit, (SELECT COUNT(*) FROM public.appointments WHERE client_id = c.id AND status = 'atendido') as total_visits FROM public.clients c;
