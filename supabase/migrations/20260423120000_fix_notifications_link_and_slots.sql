-- =============================================================================
-- FIX 1: Adiciona coluna appointment_id em notifica_agendamento
--         para vincular notificações ao agendamento e permitir sync em update/cancel
-- =============================================================================
ALTER TABLE notifica_agendamento
  ADD COLUMN IF NOT EXISTS appointment_id UUID REFERENCES appointments(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_notifica_agendamento_appointment_id
  ON notifica_agendamento(appointment_id);


-- =============================================================================
-- FIX 2: bot_create_appointment — timezone explícita (America/Cuiaba) +
--         armazena appointment_id na notificação
-- =============================================================================
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

  -- Cria notificação com timezone correta (America/Cuiaba) e vínculo ao agendamento
  INSERT INTO notifica_agendamento (
    appointment_id, nome_cliente, telefone_cliente, data_agendamento
  ) VALUES (
    v_appt_id,
    p_client_name,
    p_client_phone,
    (p_date::text || ' ' || p_start_time::text)::timestamp AT TIME ZONE 'America/Cuiaba'
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


-- =============================================================================
-- FIX 3: bot_update_appointment — sincroniza notifica_agendamento ao reagendar
--         (atualiza horário + reseta flags de envio)
-- =============================================================================
CREATE OR REPLACE FUNCTION public.bot_update_appointment(
  p_appointment_id UUID,
  p_new_date DATE,
  p_new_start_time TIME
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_professional_id uuid;
  v_duration integer := 60;
  v_new_end_time time;
  v_conflicts integer;
BEGIN
  -- Busca profissional e duração real dos serviços vinculados
  SELECT a.professional_id,
    COALESCE((
      SELECT SUM(aps.duration_minutes)
      FROM appointment_services aps
      WHERE aps.appointment_id = a.id
    ), 60)
  INTO v_professional_id, v_duration
  FROM appointments a
  WHERE a.id = p_appointment_id;

  IF v_professional_id IS NULL THEN
    RETURN json_build_object('success', false, 'error', 'Agendamento não encontrado.');
  END IF;

  v_new_end_time := p_new_start_time + (v_duration || ' minutes')::interval;

  -- Verifica conflito de horário
  SELECT COUNT(*) INTO v_conflicts
  FROM appointments
  WHERE professional_id = v_professional_id
    AND date = p_new_date
    AND id != p_appointment_id
    AND status NOT IN ('cancelado', 'removido')
    AND start_time < v_new_end_time
    AND end_time > p_new_start_time;

  IF v_conflicts > 0 THEN
    RETURN json_build_object(
      'success', false,
      'error', 'Horário ocupado. Existe conflito com outro agendamento nesse horário.'
    );
  END IF;

  -- Atualiza o agendamento
  UPDATE appointments
  SET date = p_new_date,
      start_time = p_new_start_time,
      end_time = v_new_end_time,
      updated_at = now()
  WHERE id = p_appointment_id;

  -- Sincroniza notifica_agendamento: novo horário + reseta flags de envio
  UPDATE notifica_agendamento
  SET data_agendamento = (p_new_date::text || ' ' || p_new_start_time::text)::timestamp AT TIME ZONE 'America/Cuiaba',
      notifica1 = false,
      notifica2 = false,
      notifica3 = false,
      encerrado = false
  WHERE appointment_id = p_appointment_id;

  RETURN json_build_object(
    'success', true,
    'appointment_id', p_appointment_id,
    'date', p_new_date,
    'start_time', to_char(p_new_start_time, 'HH24:MI'),
    'end_time', to_char(v_new_end_time, 'HH24:MI'),
    'duration_minutes', v_duration
  );
END;
$$;


-- =============================================================================
-- FIX 4: bot_cancel_appointment — marca notifica_agendamento como encerrado
--         para evitar lembretes de agendamentos cancelados
-- =============================================================================
CREATE OR REPLACE FUNCTION public.bot_cancel_appointment(
  p_appointment_id UUID
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_exists boolean;
BEGIN
  SELECT EXISTS(SELECT 1 FROM appointments WHERE id = p_appointment_id) INTO v_exists;

  IF NOT v_exists THEN
    RETURN json_build_object('success', false, 'error', 'Agendamento não encontrado.');
  END IF;

  UPDATE appointments
  SET status = 'cancelado', updated_at = now()
  WHERE id = p_appointment_id;

  -- Encerra notificação para evitar lembrete de agendamento cancelado
  UPDATE notifica_agendamento
  SET encerrado = true
  WHERE appointment_id = p_appointment_id;

  RETURN json_build_object('success', true, 'appointment_id', p_appointment_id);
END;
$$;


-- =============================================================================
-- FIX 5: find_available_slots — aumenta limite padrão de 6 para 12
-- =============================================================================
CREATE OR REPLACE FUNCTION public.find_available_slots(
  p_service_id UUID,
  p_date_from DATE,
  p_date_to DATE,
  p_professional_id UUID DEFAULT NULL,
  p_limit INTEGER DEFAULT 12
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_duration integer;
  v_result json;
BEGIN
  -- Busca duração do serviço
  SELECT COALESCE(s.duration_minutes, 60) INTO v_duration
  FROM services s WHERE s.id = p_service_id;

  IF v_duration IS NULL THEN
    v_duration := 60;
  END IF;

  SELECT json_agg(slot ORDER BY slot->>'date', slot->>'start_time')
  INTO v_result
  FROM (
    SELECT json_build_object(
      'professional_id', p.id,
      'professional_name', p.name,
      'date', d::text,
      'day_of_week', EXTRACT(DOW FROM d)::int,
      'start_time', to_char(candidate, 'HH24:MI'),
      'end_time', to_char(candidate + (v_duration || ' minutes')::interval, 'HH24:MI'),
      'duration_minutes', v_duration
    ) AS slot
    FROM professionals p
    -- Apenas profissionais ativos que atendem esse serviço
    JOIN professional_services ps ON ps.professional_id = p.id AND ps.service_id = p_service_id AND ps.is_active = true
    -- Gera as datas do range
    CROSS JOIN generate_series(p_date_from, p_date_to, '1 day'::interval) AS d
    -- Horário de trabalho para cada dia da semana
    JOIN professional_schedules sch ON sch.professional_id = p.id
      AND sch.day_of_week = EXTRACT(DOW FROM d)::int
      AND sch.is_active = true
    -- Gera candidatos a cada 30 minutos dentro do horário de trabalho
    CROSS JOIN LATERAL generate_series(
      sch.start_time,
      sch.end_time - (v_duration || ' minutes')::interval,
      '30 minutes'::interval
    ) AS candidate
    WHERE
      -- Filtro de profissional específico (opcional)
      (p_professional_id IS NULL OR p.id = p_professional_id)
      -- Apenas profissionais ativos e visíveis na agenda
      AND p.is_active = true
      AND p.can_receive_appointments = true
      -- Exclui slots no passado (para hoje, só mostra a partir de agora + 30min)
      AND (d::date > CURRENT_DATE OR candidate > (now() AT TIME ZONE 'America/Cuiaba')::time + INTERVAL '30 minutes')
      -- Sem conflito com agendamentos existentes
      AND NOT EXISTS (
        SELECT 1 FROM appointments a
        WHERE a.professional_id = p.id
          AND a.date = d::date
          AND a.status NOT IN ('cancelado', 'removido')
          AND a.start_time < candidate + (v_duration || ' minutes')::interval
          AND a.end_time > candidate
      )
      -- Sem conflito com bloqueios
      AND NOT EXISTS (
        SELECT 1 FROM appointments b
        WHERE b.professional_id = p.id
          AND b.date = d::date
          AND (b.status = 'bloqueado' OR b.client_name = 'BLOQUEIO')
          AND b.start_time < candidate + (v_duration || ' minutes')::interval
          AND b.end_time > candidate
      )
    LIMIT p_limit
  ) sub;

  RETURN COALESCE(v_result, '[]'::json);
END;
$$;
