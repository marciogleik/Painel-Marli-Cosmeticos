
-- 1. Tabela de Notificações
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  metadata JSONB DEFAULT '{}'::jsonb,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Políticas de RLS (Simplificadas para o contexto)
CREATE POLICY "Authenticated can select notifications" ON public.notifications FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated can update notifications" ON public.notifications FOR UPDATE TO authenticated USING (true);

-- 2. Função de Trigger para Novos Agendamentos
CREATE OR REPLACE FUNCTION public.handle_new_appointment_notification()
RETURNS TRIGGER AS $$
DECLARE
    v_prof_name TEXT;
BEGIN
    -- Busca o nome do profissional
    SELECT name INTO v_prof_name FROM public.professionals WHERE id = NEW.professional_id;
    
    INSERT INTO public.notifications (type, title, content, metadata)
    VALUES (
        'new_appointment',
        'Novo Agendamento Realizado',
        'Cliente: ' || COALESCE(NEW.client_name, 'Não identificado') || 
        ' | Profissional: ' || COALESCE(v_prof_name, 'Não identificado') || 
        ' | Por: ' || COALESCE(NEW.executed_by, 'Sistema'),
        jsonb_build_object(
            'appointment_id', NEW.id,
            'client_name', NEW.client_name,
            'professional_name', v_prof_name,
            'executed_by', NEW.executed_by,
            'date', NEW.date,
            'start_time', NEW.start_time
        )
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Trigger
DROP TRIGGER IF EXISTS on_appointment_created ON public.appointments;
CREATE TRIGGER on_appointment_created
AFTER INSERT ON public.appointments
FOR EACH ROW EXECUTE FUNCTION public.handle_new_appointment_notification();
