-- RPC: Marcar automaticamente como 'falta' agendamentos passados sem atualização
-- Chamada pelo workflow de notificação a cada minuto
CREATE OR REPLACE FUNCTION public.bot_mark_missed_appointments()
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_count integer;
BEGIN
  -- Marca como falta: agendamentos com status pendente cujo horário já passou há mais de 30 minutos
  -- Limita aos últimos 3 dias para não varrer histórico inteiro
  UPDATE appointments
  SET status = 'falta', updated_at = now()
  WHERE status IN ('agendado', 'confirmado')
    AND (date + start_time) < (now() AT TIME ZONE 'America/Sao_Paulo') - INTERVAL '30 minutes'
    AND (date + start_time) > (now() AT TIME ZONE 'America/Sao_Paulo') - INTERVAL '3 days';

  GET DIAGNOSTICS v_count = ROW_COUNT;
  RETURN v_count;
END;
$$;
