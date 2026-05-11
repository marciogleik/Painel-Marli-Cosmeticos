CREATE OR REPLACE FUNCTION verificar_horario_funcionamento()
RETURNS json
LANGUAGE plpgsql
AS $$
DECLARE
  v_now         TIMESTAMPTZ := NOW() AT TIME ZONE 'America/Sao_Paulo';
  v_weekday     INT := EXTRACT(DOW FROM v_now); -- 0=dom, 1=seg, ..., 6=sab
  v_time_min    INT := EXTRACT(HOUR FROM v_now) * 60 + EXTRACT(MINUTE FROM v_now);
  v_is_open     BOOLEAN := FALSE;
  v_next_open   TIMESTAMPTZ;
  v_days_ahead  INT;
BEGIN
  -- Verificar se está aberto agora
  IF v_weekday BETWEEN 1 AND 5 THEN
    -- Segunda a sexta
    IF (v_time_min >= 480 AND v_time_min < 690) OR  -- 8h00 a 11h30
       (v_time_min >= 810 AND v_time_min < 1080) THEN -- 13h30 a 18h00
      v_is_open := TRUE;
    END IF;
  ELSIF v_weekday = 6 THEN
    -- Sábado
    IF v_time_min >= 480 AND v_time_min < 720 THEN -- 8h00 a 12h00
      v_is_open := TRUE;
    END IF;
  END IF;

  -- Se fechado, calcular próxima abertura
  IF NOT v_is_open THEN
    -- Está no intervalo do almoço (seg-sex entre 11h30 e 13h30)?
    IF v_weekday BETWEEN 1 AND 5 AND v_time_min >= 690 AND v_time_min < 810 THEN
      v_next_open := DATE_TRUNC('day', v_now) + INTERVAL '13 hours 30 minutes';

    -- Ainda antes das 8h (seg-sex ou sab)?
    ELSIF (v_weekday BETWEEN 1 AND 5 OR v_weekday = 6) AND v_time_min < 480 THEN
      v_next_open := DATE_TRUNC('day', v_now) + INTERVAL '8 hours';

    -- Depois do fechamento do dia (ou domingo)
    ELSE
      -- Próximo dia útil (pula domingo)
      v_days_ahead := 1;
      LOOP
        v_next_open := DATE_TRUNC('day', v_now) 
                       + (v_days_ahead || ' days')::INTERVAL 
                       + INTERVAL '8 hours';
        -- Sai do loop se próximo dia não for domingo (DOW=0)
        IF EXTRACT(DOW FROM v_next_open AT TIME ZONE 'America/Sao_Paulo') != 0 THEN
          EXIT;
        END IF;
        v_days_ahead := v_days_ahead + 1;
      END LOOP;
    END IF;
  END IF;

  RETURN json_build_object(
    'is_open', v_is_open,
    'next_open', v_next_open,
    'next_open_br', TO_CHAR(v_next_open AT TIME ZONE 'America/Sao_Paulo', 'DD/MM às HH24h')
  );
END;
$$;
