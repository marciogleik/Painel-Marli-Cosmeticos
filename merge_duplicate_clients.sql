-- Script: merge_duplicate_clients.sql
-- Objetivo: Identificar clientes duplicados pelo mesmo DDD + últimos 8 dígitos + MESMO PRIMEIRO NOME,
-- transferir todos os dados (agendamentos, fichas, anexos) para a ficha "Master" e deletar a cópia.

BEGIN;

DO $$
DECLARE
    dup_record RECORD;
    primary_client_id UUID;
    duplicate_client_id UUID;
    merged_count INT := 0;
BEGIN
    FOR dup_record IN
        WITH normalized_clients AS (
            SELECT 
                id,
                full_name,
                -- 1. PROTEÇÃO DE NOME: Extrai apenas o primeiro nome em minúsculo para garantir que não estamos juntando pessoas diferentes
                LOWER(SPLIT_PART(TRIM(full_name), ' ', 1)) as first_name,
                created_at,
                -- 2. NORMALIZAÇÃO DE TELEFONE: Extrai DDD e últimos 8 dígitos, ignorando se tem o 9 a mais ou a menos
                SUBSTRING(REGEXP_REPLACE(phone, '\D', '', 'g') FROM LENGTH(REGEXP_REPLACE(phone, '\D', '', 'g')) - 9 FOR 2) AS ddd,
                RIGHT(REGEXP_REPLACE(phone, '\D', '', 'g'), 8) AS last8,
                -- 3. CRITÉRIO MASTER: Conta quantos agendamentos cada ficha tem
                (SELECT COUNT(*) FROM appointments a WHERE a.client_id = c.id) as appt_count
            FROM clients c
            WHERE phone IS NOT NULL AND phone != '' AND LENGTH(REGEXP_REPLACE(phone, '\D', '', 'g')) >= 10
        ),
        duplicate_groups AS (
            -- Agrupa apenas os que possuem mesmo telefone E mesmo primeiro nome
            SELECT ddd, last8, first_name
            FROM normalized_clients
            GROUP BY ddd, last8, first_name
            HAVING COUNT(*) > 1
        ),
        ranked_clients AS (
            SELECT 
                nc.id,
                nc.full_name,
                nc.ddd,
                nc.last8,
                nc.first_name,
                nc.appt_count,
                nc.created_at,
                -- 4. DEFINIÇÃO DE MASTER: O que tiver MAIS agendamentos ganha. Se der empate, o criado mais antigo ganha.
                ROW_NUMBER() OVER (
                    PARTITION BY nc.ddd, nc.last8, nc.first_name 
                    ORDER BY nc.appt_count DESC, nc.created_at ASC
                ) as rnk
            FROM normalized_clients nc
            JOIN duplicate_groups dg ON nc.ddd = dg.ddd AND nc.last8 = dg.last8 AND nc.first_name = dg.first_name
        )
        SELECT 
            rc1.id AS primary_id,
            rc1.full_name AS primary_name,
            rc1.appt_count AS primary_appt_count,
            rc2.id AS duplicate_id,
            rc2.full_name AS duplicate_name,
            rc2.appt_count AS duplicate_appt_count
        FROM ranked_clients rc1
        JOIN ranked_clients rc2 
          ON rc1.ddd = rc2.ddd 
         AND rc1.last8 = rc2.last8 
         AND rc1.first_name = rc2.first_name 
         AND rc2.rnk > 1
        WHERE rc1.rnk = 1
    LOOP
        primary_client_id := dup_record.primary_id;
        duplicate_client_id := dup_record.duplicate_id;

        -- Exibe no console exatamente quem está sendo mesclado em quem
        RAISE NOTICE 'MERGING: [%] (Master, % appts) <-- [%] (Duplicate, % appts)', 
                     dup_record.primary_name, dup_record.primary_appt_count, 
                     dup_record.duplicate_name, dup_record.duplicate_appt_count;

        -- 5. TRANSFERE ANTES DE DELETAR
        UPDATE appointments SET client_id = primary_client_id WHERE client_id = duplicate_client_id;
        UPDATE patient_records SET client_id = primary_client_id WHERE client_id = duplicate_client_id;
        UPDATE client_attachments SET client_id = primary_client_id WHERE client_id = duplicate_client_id;

        -- 6. DELETA CÓPIA
        DELETE FROM clients WHERE id = duplicate_client_id;
        
        merged_count := merged_count + 1;
    END LOOP;

    RAISE NOTICE 'TOTAL DE DUPLICATAS MESCLADAS: %', merged_count;
END $$;

-- 7. ROLLBACK DE SEGURANÇA:
-- Deixei o ROLLBACK ativado. Assim você pode rodar o script no console, ver a lista de quem ele mesclou nos "RAISE NOTICE" 
-- e ele vai DESFAZER tudo no final. Se você estiver de acordo com o resultado, troque ROLLBACK por COMMIT.
ROLLBACK;
-- COMMIT;
