-- RPC: Lookup ou criar cliente pelo telefone (usado pelo bot de agendamento)
-- Retorna histórico de visitas, faltas, aniversário para personalizar a conversa
-- Match de telefone: últimos 11 dígitos (DDD+número), aceita apenas match unívoco
CREATE OR REPLACE FUNCTION public.bot_upsert_client(
  p_phone TEXT,
  p_name TEXT
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_client json;
  v_phone_digits TEXT;
  v_phone_suffix TEXT;
  v_match_count integer;
  v_matched_id uuid;
BEGIN
  -- Normaliza: remove tudo que não é número
  v_phone_digits := regexp_replace(p_phone, '[^0-9]', '', 'g');

  -- Extrai os últimos 11 dígitos (DDD + 9XXXX-XXXX)
  -- Cobre: +55 66 9XXXX-XXXX, 55 66 9XXXX-XXXX, 66 9XXXX-XXXX, etc.
  v_phone_suffix := RIGHT(v_phone_digits, 11);

  -- 1) Tenta match EXATO primeiro (telefone normalizado completo)
  SELECT json_build_object(
    'id', c.id,
    'full_name', c.full_name,
    'phone', c.phone,
    'birth_date', c.birth_date,
    'notes', c.notes,
    'visit_count', (
      SELECT COUNT(*) FROM appointments a
      WHERE a.client_id = c.id AND a.status IN ('atendido', 'confirmado')
    ),
    'last_visit', (
      SELECT MAX(a.date) FROM appointments a
      WHERE a.client_id = c.id AND a.status = 'atendido'
    ),
    'falta_count', (
      SELECT COUNT(*) FROM appointments a
      WHERE a.client_id = c.id AND a.status = 'falta'
    ),
    'is_birthday_month', (
      EXTRACT(MONTH FROM c.birth_date) = EXTRACT(MONTH FROM CURRENT_DATE)
    )
  ) INTO v_client
  FROM clients c
  WHERE c.phone IS NOT NULL
    AND regexp_replace(c.phone, '[^0-9]', '', 'g') = v_phone_digits
    AND c.is_active = true
  LIMIT 1;

  -- 2) Se não achou exato, tenta fuzzy pelos últimos 11 dígitos (UNÍVOCO)
  IF v_client IS NULL AND LENGTH(v_phone_suffix) = 11 THEN
    SELECT COUNT(*)
    INTO v_match_count
    FROM clients c
    WHERE c.phone IS NOT NULL
      AND c.is_active = true
      AND RIGHT(regexp_replace(c.phone, '[^0-9]', '', 'g'), 11) = v_phone_suffix;


    -- Se unívoco (1 match), busca o ID e monta o JSON
    IF v_match_count = 1 THEN
      SELECT c.id INTO v_matched_id
      FROM clients c
      WHERE c.phone IS NOT NULL
        AND c.is_active = true
        AND RIGHT(regexp_replace(c.phone, '[^0-9]', '', 'g'), 11) = v_phone_suffix
      LIMIT 1;

      SELECT json_build_object(
        'id', c.id,
        'full_name', c.full_name,
        'phone', c.phone,
        'birth_date', c.birth_date,
        'notes', c.notes,
        'visit_count', (
          SELECT COUNT(*) FROM appointments a
          WHERE a.client_id = c.id AND a.status IN ('atendido', 'confirmado')
        ),
        'last_visit', (
          SELECT MAX(a.date) FROM appointments a
          WHERE a.client_id = c.id AND a.status = 'atendido'
        ),
        'falta_count', (
          SELECT COUNT(*) FROM appointments a
          WHERE a.client_id = c.id AND a.status = 'falta'
        ),
        'is_birthday_month', (
          EXTRACT(MONTH FROM c.birth_date) = EXTRACT(MONTH FROM CURRENT_DATE)
        )
      ) INTO v_client
      FROM clients c
      WHERE c.id = v_matched_id;
    END IF;
    -- Se match_count >= 2: ambíguo → cai pro INSERT abaixo (cria novo, sem risco de merge errado)
  END IF;

  -- 3) Se não achou por nenhum caminho, cria cliente básico
  IF v_client IS NULL THEN
    INSERT INTO clients (full_name, phone)
    VALUES (p_name, v_phone_digits)
    ON CONFLICT DO NOTHING;

    -- Busca o recém-criado (ou o que já existia por race condition)
    SELECT json_build_object(
      'id', c.id,
      'full_name', c.full_name,
      'phone', c.phone,
      'birth_date', c.birth_date,
      'notes', c.notes,
      'visit_count', 0,
      'last_visit', null,
      'falta_count', 0,
      'is_birthday_month', false
    ) INTO v_client
    FROM clients c
    WHERE c.phone = v_phone_digits AND c.is_active = true
    LIMIT 1;
  END IF;

  RETURN v_client;
END;
$$;
