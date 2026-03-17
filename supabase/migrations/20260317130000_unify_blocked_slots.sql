
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
