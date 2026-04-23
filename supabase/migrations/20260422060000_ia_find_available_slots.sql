-- RPC: Encontra slots disponíveis considerando agenda, bloqueios, horário de trabalho e duração do serviço
-- Retorna slots LIVRES prontos para apresentar ao cliente (zero matemática no LLM)
CREATE OR REPLACE FUNCTION public.find_available_slots(
  p_service_id UUID,
  p_date_from DATE,
  p_date_to DATE,
  p_professional_id UUID DEFAULT NULL,
  p_limit INTEGER DEFAULT 6
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
      AND (d::date > CURRENT_DATE OR candidate > (now() AT TIME ZONE 'America/Sao_Paulo')::time + INTERVAL '30 minutes')
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
