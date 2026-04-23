-- RPC: Reagendar agendamento com validação de conflito e recalculo de duração
-- Espelha bot_create_appointment em segurança
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

-- RPC: Cancelar agendamento via RPC (consistente com as outras operações)
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

  RETURN json_build_object('success', true, 'appointment_id', p_appointment_id);
END;
$$;
