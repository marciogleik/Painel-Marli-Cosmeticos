-- RPC: Retorna contexto dinâmico para o bot de agendamento
-- Profissionais ativos com seus serviços e horários de trabalho
CREATE OR REPLACE FUNCTION public.get_ia_agenda_context()
RETURNS json
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT json_build_object(
    'professionals', (
      SELECT json_agg(prof ORDER BY prof->>'name')
      FROM (
        SELECT json_build_object(
          'id', p.id,
          'name', p.name,
          'role_description', p.role_description,
          'services', (
            SELECT COALESCE(json_agg(json_build_object(
              'id', s.id,
              'name', s.name,
              'duration_minutes', s.duration_minutes,
              'category', s.category
            ) ORDER BY s.name), '[]'::json)
            FROM professional_services ps
            JOIN services s ON s.id = ps.service_id
            WHERE ps.professional_id = p.id
              AND ps.is_active = true
              AND s.is_active = true
          ),
          'schedules', (
            SELECT COALESCE(json_agg(json_build_object(
              'day_of_week', sch.day_of_week,
              'start_time', to_char(sch.start_time, 'HH24:MI'),
              'end_time', to_char(sch.end_time, 'HH24:MI')
            ) ORDER BY sch.day_of_week), '[]'::json)
            FROM professional_schedules sch
            WHERE sch.professional_id = p.id
              AND sch.is_active = true
          )
        ) AS prof
        FROM professionals p
        WHERE p.is_active = true
          AND p.can_receive_appointments = true
      ) sub
    )
  );
$$;
