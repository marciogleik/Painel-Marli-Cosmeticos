CREATE TABLE IF NOT EXISTS fila_mensagens (
  id              BIGSERIAL PRIMARY KEY,
  telefone        TEXT NOT NULL,
  nome_cliente    TEXT,
  session_id      TEXT,
  mensagem        TEXT NOT NULL,
  tipo_mensagem   TEXT DEFAULT 'conversation',
  id_mensagem     TEXT,
  recebida_em     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  processada      BOOLEAN NOT NULL DEFAULT FALSE,
  processada_em   TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_fila_mensagens_processada 
  ON fila_mensagens(processada, recebida_em);

CREATE INDEX IF NOT EXISTS idx_fila_mensagens_telefone 
  ON fila_mensagens(telefone, processada);
