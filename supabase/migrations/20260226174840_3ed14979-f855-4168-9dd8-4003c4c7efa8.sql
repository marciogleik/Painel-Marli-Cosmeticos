
ALTER TABLE public.professionals
  ADD COLUMN IF NOT EXISTS agenda_order integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS can_receive_appointments boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS can_view_all_agendas boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS can_receive_email_appointments boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS can_switch_registers boolean NOT NULL DEFAULT false;
