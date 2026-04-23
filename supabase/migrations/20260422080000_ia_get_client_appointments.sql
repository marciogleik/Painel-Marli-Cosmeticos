-- RPC: Retorna agendamentos ativos de um cliente (para cancelar/reagendar)
-- Inclui apenas futuros e do dia atual, exclui cancelados/removidos
CREATE OR REPLACE FUNCTION public.bot_get_client_appointments(
  p_client_id UUID,
  p_include_past BOOLEAN DEFAULT FALSE
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_result json;
BEGIN
  SELECT COALESCE(json_agg(appt ORDER BY appt->>'date', appt->>'start_time'), '[]'::json)
  INTO v_result
  FROM (
    SELECT json_build_object(
      'id', a.id,
      'date', a.date::text,
      'start_time', to_char(a.start_time, 'HH24:MI'),
      'end_time', to_char(a.end_time, 'HH24:MI'),
      'status', a.status,
      'professional_name', p.name,
      'professional_id', p.id,
      'services', (
        SELECT COALESCE(json_agg(json_build_object(
          'name', aps.service_name,
          'duration_minutes', aps.duration_minutes
        )), '[]'::json)
        FROM appointment_services aps
        WHERE aps.appointment_id = a.id
      ),
      'notes', a.notes
    ) AS appt
    FROM appointments a
    JOIN professionals p ON p.id = a.professional_id
    WHERE a.client_id = p_client_id
      AND a.status NOT IN ('cancelado', 'removido', 'falta')
      AND (
        p_include_past = TRUE
        OR a.date >= CURRENT_DATE
      )
    ORDER BY a.date, a.start_time
    LIMIT 10
  ) sub;

  RETURN v_result;
END;
$$;
