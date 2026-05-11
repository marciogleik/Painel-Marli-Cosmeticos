CREATE OR REPLACE FUNCTION public.bot_create_appointment(p_client_id uuid, p_professional_id uuid, p_service_id uuid, p_start_time timestamp with time zone)
 RETURNS json
 LANGUAGE plpgsql
 AS $$
DECLARE
  v_client_name text;
  v_client_phone text;
  v_service_name text;
  v_duration integer := 60;
  v_date date;
  v_time time;
  v_end_time time;
  v_appt_id uuid;
  v_conflicts integer;
  v_notifica1 boolean := false;
  v_notifica2 boolean := false;
  v_now_local timestamp := now() AT TIME ZONE 'America/Sao_Paulo';
BEGIN
  -- 1. VALIDAÇÃO DE VÍNCULO (NOVO): Garante que o profissional realiza o serviço
  IF NOT EXISTS (
    SELECT 1 FROM professional_services 
    WHERE professional_id = p_professional_id 
      AND service_id = p_service_id
  ) THEN
    RETURN json_build_object(
      'success', false, 
      'error', 'Vínculo Inválido: Este profissional não realiza o serviço selecionado. Por favor, verifique a disponibilidade correta.'
    );
  END IF;

  -- Busca dados do cliente (usando full_name)
  SELECT full_name, phone INTO v_client_name, v_client_phone
  FROM clients WHERE id = p_client_id;

  IF v_client_name IS NULL THEN
    RETURN json_build_object('success', false, 'error', 'Cliente não encontrado.');
  END IF;

  -- Busca dados do serviço
  SELECT name, COALESCE(duration_minutes, 60) INTO v_service_name, v_duration
  FROM services WHERE id = p_service_id;

  IF v_service_name IS NULL THEN
    RETURN json_build_object('success', false, 'error', 'Serviço não encontrado.');
  END IF;

  -- Extrai data e hora
  v_date := p_start_time::date;
  v_time := p_start_time::time;
  v_end_time := v_time + (v_duration || ' minutes')::interval;

  -- Lógica de notificações
  IF v_date = (v_now_local::date) THEN
    v_notifica1 := true;
    IF (v_now_local::time) > '08:00:00'::time THEN
      v_notifica2 := true;
    END IF;
  END IF;

  -- Verifica conflitos
  SELECT COUNT(*) INTO v_conflicts
  FROM appointments
  WHERE professional_id = p_professional_id
    AND date = v_date
    AND status NOT IN ('cancelado', 'removido')
    AND start_time < v_end_time
    AND end_time > v_time;

  IF v_conflicts > 0 THEN
    RETURN json_build_object('success', false, 'error', 'Horário ocupado. Existe conflito com outro agendamento nesse horário.');
  END IF;

  -- Insere o agendamento
  INSERT INTO appointments (
    client_id, professional_id, date, start_time, end_time,
    status, client_name, client_phone, notes
  ) VALUES (
    p_client_id, p_professional_id, v_date, v_time, v_end_time,
    'agendado', v_client_name, v_client_phone,
    'Agendado via IA (Marcia) — ' || v_service_name
  ) RETURNING id INTO v_appt_id;

  -- Insere o serviço do agendamento
  INSERT INTO appointment_services (appointment_id, service_id, service_name, duration_minutes)
  VALUES (v_appt_id, p_service_id, v_service_name, v_duration);

  -- Insere na fila de notificação
  INSERT INTO notifica_agendamento (
    appointment_id, nome_cliente, telefone_cliente, data_agendamento,
    notifica1, notifica2
  ) VALUES (
    v_appt_id, v_client_name, v_client_phone,
    ((v_date::text || ' ' || v_time::text) || ' America/Sao_Paulo')::timestamptz,
    v_notifica1, v_notifica2
  );

  RETURN json_build_object(
    'success', true,
    'appointment_id', v_appt_id,
    'date', v_date,
    'start_time', to_char(v_time, 'HH24:MI'),
    'end_time', to_char(v_end_time, 'HH24:MI'),
    'duration_minutes', v_duration,
    'service_name', v_service_name
  );
END;
$$;
