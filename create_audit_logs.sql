-- Create activity_logs table
CREATE TABLE IF NOT EXISTS public.activity_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT now(),
    user_id UUID REFERENCES auth.users(id),
    user_name TEXT,
    action TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id UUID NOT NULL,
    old_data JSONB,
    new_data JSONB
);

-- Enable RLS
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to read logs
CREATE POLICY "Allow authenticated users to read activity logs"
ON public.activity_logs FOR SELECT
TO authenticated
USING (true);

-- Function to audit appointment changes
CREATE OR REPLACE FUNCTION audit_appointment_changes()
RETURNS TRIGGER AS $$
DECLARE
    v_user_id UUID;
    v_user_name TEXT;
BEGIN
    -- Get current user context
    v_user_id := auth.uid();
    
    -- Try to get name from profiles
    SELECT full_name INTO v_user_name 
    FROM public.profiles 
    WHERE user_id = v_user_id;

    -- If not found or empty, try email from profiles
    IF v_user_name IS NULL OR v_user_name = '' THEN
        SELECT email INTO v_user_name 
        FROM public.profiles 
        WHERE user_id = v_user_id;
    END IF;

    -- Fallback to Sistema
    IF v_user_name IS NULL OR v_user_name = '' THEN
        v_user_name := 'Sistema';
    END IF;

    IF (TG_OP = 'INSERT') THEN
        INSERT INTO public.activity_logs (action, entity_type, entity_id, new_data, user_id, user_name)
        VALUES ('INSERT', 'appointment', NEW.id, row_to_json(NEW)::jsonb, v_user_id, v_user_name);
        RETURN NEW;
    ELSIF (TG_OP = 'UPDATE') THEN
        INSERT INTO public.activity_logs (action, entity_type, entity_id, old_data, new_data, user_id, user_name)
        VALUES ('UPDATE', 'appointment', NEW.id, row_to_json(OLD)::jsonb, row_to_json(NEW)::jsonb, v_user_id, v_user_name);
        RETURN NEW;
    ELSIF (TG_OP = 'DELETE') THEN
        INSERT INTO public.activity_logs (action, entity_type, entity_id, old_data, user_id, user_name)
        VALUES ('DELETE', 'appointment', OLD.id, row_to_json(OLD)::jsonb, v_user_id, v_user_name);
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for appointments
DROP TRIGGER IF EXISTS tr_audit_appointments ON public.appointments;
CREATE TRIGGER tr_audit_appointments
AFTER INSERT OR UPDATE OR DELETE ON public.appointments
FOR EACH ROW EXECUTE FUNCTION audit_appointment_changes();
