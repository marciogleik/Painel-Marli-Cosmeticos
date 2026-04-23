-- Migration: Setup Activity Logs
-- 20260410133000

CREATE TABLE IF NOT EXISTS public.activity_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    action TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id UUID NOT NULL,
    old_data JSONB,
    new_data JSONB,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    user_name TEXT
);

-- Ensure columns exist if table was already created with different names
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='activity_logs' AND column_name='entity_id') THEN
        ALTER TABLE public.activity_logs RENAME COLUMN record_id TO entity_id;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='activity_logs' AND column_name='entity_type') THEN
        ALTER TABLE public.activity_logs RENAME COLUMN table_name TO entity_type;
    END IF;
END $$;

-- Trigger Function
CREATE OR REPLACE FUNCTION public.log_appointment_changes()
RETURNS TRIGGER AS $$
DECLARE
    v_user_name TEXT;
BEGIN
    SELECT full_name INTO v_user_name FROM public.profiles WHERE user_id = auth.uid();
    
    IF (TG_OP = 'INSERT') THEN
        INSERT INTO public.activity_logs (action, entity_type, entity_id, new_data, user_id, user_name)
        VALUES (TG_OP, 'appointment', NEW.id, row_to_json(NEW)::jsonb, auth.uid(), v_user_name);
        RETURN NEW;
    ELSIF (TG_OP = 'UPDATE') THEN
        INSERT INTO public.activity_logs (action, entity_type, entity_id, old_data, new_data, user_id, user_name)
        VALUES (TG_OP, 'appointment', OLD.id, row_to_json(OLD)::jsonb, row_to_json(NEW)::jsonb, auth.uid(), v_user_name);
        RETURN NEW;
    ELSIF (TG_OP = 'DELETE') THEN
        INSERT INTO public.activity_logs (action, entity_type, entity_id, old_data, user_id, user_name)
        VALUES (TG_OP, 'appointment', OLD.id, row_to_json(OLD)::jsonb, auth.uid(), v_user_name);
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Attach Trigger to Appointments
DROP TRIGGER IF EXISTS tr_log_appointment_changes ON public.appointments;
CREATE TRIGGER tr_log_appointment_changes
AFTER INSERT OR UPDATE OR DELETE ON public.appointments
FOR EACH ROW EXECUTE FUNCTION public.log_appointment_changes();

-- RLS
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Gestores can view all logs" ON public.activity_logs;
CREATE POLICY "Gestores can view all logs" 
ON public.activity_logs FOR SELECT 
TO authenticated
USING (public.has_role(auth.uid(), 'gestor'::app_role));
