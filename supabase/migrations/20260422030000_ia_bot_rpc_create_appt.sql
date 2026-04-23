-- RPC: Criar agendamento atomicamente (appointments + appointment_services + notifica_agendamento)
-- Verifica conflito, calcula duração real do serviço, e cria notificação automática
CREATE OR REPLACE FUNCTION public.bot_create_appointment(
  p_professional_id UUID,
  p_client_id UUID,
  p_client_name TEXT,
  p_client_phone TEXT,
  p_date DATE,
  p_start_time TIME,
  p_service_id UUID,
  p_service_name TEXT
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_duration integer := 60;
  v_end_time time;
  v_appt_id uuid;
  v_conflicts integer;
BEGIN
  -- Busca duração real do serviço
  SELECT COALESCE(s.duration_minutes, 60) INTO v_duration
  FROM services s WHERE s.id = p_service_id;

  v_end_time := p_start_time + (v_duration || ' minutes')::interval;

  -- Verifica conflito de horário com agendamentos existentes
  SELECT COUNT(*) INTO v_conflicts
  FROM appointments
  WHERE professional_id = p_professional_id
    AND date = p_date
    AND status NOT IN ('cancelado', 'removido')
    AND start_time < v_end_time
    AND end_time > p_start_time;

  IF v_conflicts > 0 THEN
    RETURN json_build_object(
      'success', false,
      'error', 'Horário ocupado. Existe conflito com outro agendamento nesse horário.'
    );
  END IF;

  -- Cria agendamento
  INSERT INTO appointments (
    client_id, professional_id, date, start_time, end_time,
    status, client_name, client_phone, notes
  ) VALUES (
    p_client_id, p_professional_id, p_date, p_start_time, v_end_time,
    'agendado', p_client_name, p_client_phone,
    'Agendado via IA (Marcia) — ' || p_service_name
  ) RETURNING id INTO v_appt_id;

  -- Registra serviço vinculado ao agendamento
  INSERT INTO appointment_services (
    appointment_id, service_id, service_name, duration_minutes
  ) VALUES (
    v_appt_id, p_service_id, p_service_name, v_duration
  );

  -- Cria registro de notificação automática (para lembretes WhatsApp)
  INSERT INTO notifica_agendamento (
    nome_cliente, telefone_cliente, data_agendamento
  ) VALUES (
    p_client_name, p_client_phone,
    (p_date::text || 'T' || p_start_time::text)::timestamptz
  );

  RETURN json_build_object(
    'success', true,
    'appointment_id', v_appt_id,
    'date', p_date,
    'start_time', to_char(p_start_time, 'HH24:MI'),
    'end_time', to_char(v_end_time, 'HH24:MI'),
    'duration_minutes', v_duration,
    'service_name', p_service_name
  );
END;
$$;
