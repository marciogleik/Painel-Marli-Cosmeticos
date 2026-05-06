-- PREVIEW SQL: Service Price Updates (Finalized v2 - 100% Processed)
-- Generated: 2026-05-01T14:29:19.395803

BEGIN;

-- ==========================================
-- 1. UPDATES
-- ==========================================

-- Update Aplicação de Botox (Matched with CSV: Aplicação de Botox)
UPDATE services SET 
  base_price = NULL,
  duration_minutes = 90,
  price_note = 'consulta avaliação',
  requires_evaluation = true,
  updated_at = NOW()
WHERE id = '10000000-0000-0000-0000-000000000001';  -- expected: Aplicação de Botox

-- Update ATA CROSS (Matched with CSV: ATA CROSS)
UPDATE services SET 
  base_price = NULL,
  duration_minutes = 30,
  price_note = 'consulta avaliação',
  requires_evaluation = true,
  updated_at = NOW()
WHERE id = '10000000-0000-0000-0000-000000000002';  -- expected: ATA CROSS

-- Update Banco de Colágeno (Matched with CSV: Banco de Colágeno)
UPDATE services SET 
  base_price = NULL,
  duration_minutes = 90,
  price_note = 'consulta avaliação',
  requires_evaluation = true,
  updated_at = NOW()
WHERE id = '10000000-0000-0000-0000-000000000003';  -- expected: Banco de Colágeno

-- Update Bioestimulador com Elleva (Matched with CSV: Bioestimulador com Elleva)
UPDATE services SET 
  base_price = NULL,
  duration_minutes = 60,
  price_note = 'consulta avaliação',
  requires_evaluation = true,
  updated_at = NOW()
WHERE id = '10000000-0000-0000-0000-000000000004';  -- expected: Bioestimulador com Elleva

-- Update Bioestimulador com Harmonyca (Matched with CSV: Bioestimulador com Harmonyca)
UPDATE services SET 
  base_price = NULL,
  duration_minutes = 60,
  price_note = 'consulta avaliação',
  requires_evaluation = true,
  updated_at = NOW()
WHERE id = '10000000-0000-0000-0000-000000000005';  -- expected: Bioestimulador com Harmonyca

-- Update Bioestimulador com Radiesse (Matched with CSV: Bioestimulador com Radiesse)
UPDATE services SET 
  base_price = NULL,
  duration_minutes = 60,
  price_note = 'consulta avaliação',
  requires_evaluation = true,
  updated_at = NOW()
WHERE id = '10000000-0000-0000-0000-000000000006';  -- expected: Bioestimulador com Radiesse

-- Update Bioestimulador com Sculptra (Matched with CSV: Bioestimulador com Sculptra)
UPDATE services SET 
  base_price = NULL,
  duration_minutes = 60,
  price_note = 'consulta avaliação',
  requires_evaluation = true,
  updated_at = NOW()
WHERE id = '10000000-0000-0000-0000-000000000007';  -- expected: Bioestimulador com Sculptra

-- Update Bioestimulador de Gluteo (Matched with CSV: Bioestimulador de Gluteo)
UPDATE services SET 
  base_price = NULL,
  duration_minutes = 60,
  price_note = 'consulta avaliação',
  requires_evaluation = true,
  updated_at = NOW()
WHERE id = '10000000-0000-0000-0000-000000000008';  -- expected: Bioestimulador de Gluteo

-- Update Harmonização Facial (Matched with CSV: Harmonização Facial)
UPDATE services SET 
  base_price = NULL,
  duration_minutes = 120,
  price_note = 'consulta avaliação',
  requires_evaluation = true,
  updated_at = NOW()
WHERE id = '10000000-0000-0000-0000-000000000009';  -- expected: Harmonização Facial

-- Update Lavieen (Matched with CSV: Lavieen)
UPDATE services SET 
  base_price = NULL,
  duration_minutes = 60,
  price_note = 'consulta avaliação',
  requires_evaluation = true,
  updated_at = NOW()
WHERE id = '10000000-0000-0000-0000-000000000010';  -- expected: Lavieen

-- Update Lipo de Papada (Matched with CSV: Lipo de Papada)
UPDATE services SET 
  base_price = NULL,
  duration_minutes = 30,
  price_note = 'consulta avaliação',
  requires_evaluation = true,
  updated_at = NOW()
WHERE id = '10000000-0000-0000-0000-000000000011';  -- expected: Lipo de Papada

-- Update Peeling para Acne Cisteamine (Matched with CSV: Peeling para Acne Cisteamine)
UPDATE services SET 
  base_price = NULL,
  duration_minutes = 30,
  price_note = 'consulta avaliação',
  requires_evaluation = true,
  updated_at = NOW()
WHERE id = '10000000-0000-0000-0000-000000000012';  -- expected: Peeling para Acne Cisteamine

-- Update Peeling para Melasma (Matched with CSV: Peeling para melasma)
UPDATE services SET 
  base_price = NULL,
  duration_minutes = 30,
  price_note = 'consulta avaliação',
  requires_evaluation = true,
  updated_at = NOW()
WHERE id = '10000000-0000-0000-0000-000000000013';  -- expected: Peeling para Melasma

-- Update Peeling para Rejuvenescimento (Matched with CSV: Peeling para Rejuvenescimento)
UPDATE services SET 
  base_price = NULL,
  duration_minutes = 30,
  price_note = 'consulta avaliação',
  requires_evaluation = true,
  updated_at = NOW()
WHERE id = '10000000-0000-0000-0000-000000000014';  -- expected: Peeling para Rejuvenescimento

-- Update Preenchedor de Glúteo (Matched with CSV: Preenchedor de Glúteo)
UPDATE services SET 
  base_price = NULL,
  duration_minutes = 60,
  price_note = 'consulta avaliação',
  requires_evaluation = true,
  updated_at = NOW()
WHERE id = '10000000-0000-0000-0000-000000000015';  -- expected: Preenchedor de Glúteo

-- Update Preenchimento Bigodinho Chinês (Matched with CSV: Preenchimento Bigodinho Chines)
UPDATE services SET 
  base_price = NULL,
  duration_minutes = 60,
  price_note = 'consulta avaliação',
  requires_evaluation = true,
  updated_at = NOW()
WHERE id = '10000000-0000-0000-0000-000000000016';  -- expected: Preenchimento Bigodinho Chinês

-- Update Preenchimento de Mandíbula (Matched with CSV: Preenchimento de Mandibula)
UPDATE services SET 
  base_price = NULL,
  duration_minutes = 60,
  price_note = 'consulta avaliação',
  requires_evaluation = true,
  updated_at = NOW()
WHERE id = '10000000-0000-0000-0000-000000000017';  -- expected: Preenchimento de Mandíbula

-- Update Preenchimento de Mento (Matched with CSV: Preenchimento de Mento)
UPDATE services SET 
  base_price = NULL,
  duration_minutes = 60,
  price_note = 'consulta avaliação',
  requires_evaluation = true,
  updated_at = NOW()
WHERE id = '10000000-0000-0000-0000-000000000018';  -- expected: Preenchimento de Mento

-- Update Preenchimento de Olheiras (Matched with CSV: Preenchimento de Olheiras)
UPDATE services SET 
  base_price = NULL,
  duration_minutes = 60,
  price_note = 'consulta avaliação',
  requires_evaluation = true,
  updated_at = NOW()
WHERE id = '10000000-0000-0000-0000-000000000019';  -- expected: Preenchimento de Olheiras

-- Update Preenchimento de Têmporas (Matched with CSV: Preenchimento de Temporas)
UPDATE services SET 
  base_price = NULL,
  duration_minutes = 60,
  price_note = 'consulta avaliação',
  requires_evaluation = true,
  updated_at = NOW()
WHERE id = '10000000-0000-0000-0000-000000000020';  -- expected: Preenchimento de Têmporas

-- Update Preenchimento de Zigomático (Matched with CSV: Preenchimento de Zigomatico)
UPDATE services SET 
  base_price = NULL,
  duration_minutes = 60,
  price_note = 'consulta avaliação',
  requires_evaluation = true,
  updated_at = NOW()
WHERE id = '10000000-0000-0000-0000-000000000021';  -- expected: Preenchimento de Zigomático

-- Update Preenchimento Labial (Matched with CSV: Preenchimento Labial)
UPDATE services SET 
  base_price = NULL,
  duration_minutes = 60,
  price_note = 'consulta avaliação',
  requires_evaluation = true,
  updated_at = NOW()
WHERE id = '10000000-0000-0000-0000-000000000022';  -- expected: Preenchimento Labial

-- Update Preenchimento Linha Marionete (Matched with CSV: Preenchimento Linha Marionete)
UPDATE services SET 
  base_price = NULL,
  duration_minutes = 60,
  price_note = 'consulta avaliação',
  requires_evaluation = true,
  updated_at = NOW()
WHERE id = '10000000-0000-0000-0000-000000000023';  -- expected: Preenchimento Linha Marionete

-- Update Preenchimento Malar (Matched with CSV: Preenchimento Malar)
UPDATE services SET 
  base_price = NULL,
  duration_minutes = 60,
  price_note = 'consulta avaliação',
  requires_evaluation = true,
  updated_at = NOW()
WHERE id = '10000000-0000-0000-0000-000000000024';  -- expected: Preenchimento Malar

-- Update Rinomodelação (Matched with CSV: Rinomodelação)
UPDATE services SET 
  base_price = NULL,
  duration_minutes = 90,
  price_note = 'consulta avaliação',
  requires_evaluation = true,
  updated_at = NOW()
WHERE id = '10000000-0000-0000-0000-000000000025';  -- expected: Rinomodelação

-- Update Skinbooster (Matched with CSV: Skinbooster)
UPDATE services SET 
  base_price = NULL,
  duration_minutes = 45,
  price_note = 'consulta avaliação',
  requires_evaluation = true,
  updated_at = NOW()
WHERE id = '10000000-0000-0000-0000-000000000026';  -- expected: Skinbooster

-- Update Terapia Capilar (Matched with CSV: Terapia Capilar)
UPDATE services SET 
  base_price = NULL,
  duration_minutes = 30,
  price_note = 'consulta avaliação',
  requires_evaluation = true,
  updated_at = NOW()
WHERE id = '10000000-0000-0000-0000-000000000027';  -- expected: Terapia Capilar

-- Update Drenagem Linfática (Matched with CSV: Drenagem Linfática)
UPDATE services SET 
  base_price = 130.0,
  duration_minutes = 45,
  price_note = NULL,
  requires_evaluation = false,
  updated_at = NOW()
WHERE id = '10000000-0000-0000-0000-000000000036';  -- expected: Drenagem Linfática

-- Update Microagulhamento (Matched with CSV: Microagulhamento)
UPDATE services SET 
  base_price = NULL,
  duration_minutes = 60,
  price_note = 'consulta avaliação',
  requires_evaluation = true,
  updated_at = NOW()
WHERE id = '10000000-0000-0000-0000-000000000044';  -- expected: Microagulhamento

-- Update Carboxterapia (Matched with CSV: Carboxterapia)
UPDATE services SET 
  base_price = NULL,
  duration_minutes = 60,
  price_note = 'consulta avaliação',
  requires_evaluation = true,
  updated_at = NOW()
WHERE id = 'd19377b8-bf2d-4254-b2fd-fd78c51eaefd';  -- expected: Carboxterapia

-- Update Pós Operatório (Matched with CSV: Pós Operatorio)
UPDATE services SET 
  base_price = 150.0,
  duration_minutes = 30,
  price_note = NULL,
  requires_evaluation = false,
  updated_at = NOW()
WHERE id = '10000000-0000-0000-0000-000000000040';  -- expected: Pós Operatório

-- Update Depilação Axila (Matched with CSV: Depilação Axila)
UPDATE services SET 
  base_price = 40.0,
  duration_minutes = 15,
  price_note = NULL,
  requires_evaluation = false,
  updated_at = NOW()
WHERE id = '10000000-0000-0000-0000-000000000045';  -- expected: Depilação Axila

-- Update Depilação Completa (Matched with CSV: Depilação Completa)
UPDATE services SET 
  base_price = NULL,
  duration_minutes = 60,
  price_note = 'valor varia por região - confirmar com atendente',
  requires_evaluation = true,
  updated_at = NOW()
WHERE id = '10000000-0000-0000-0000-000000000046';  -- expected: Depilação Completa

-- Update Depilação Costas (Matched with CSV: Depilaçao de Costas)
UPDATE services SET 
  base_price = 90.0,
  duration_minutes = 20,
  price_note = NULL,
  requires_evaluation = false,
  updated_at = NOW()
WHERE id = '10000000-0000-0000-0000-000000000047';  -- expected: Depilação Costas

-- Update Depilação Nariz (Matched with CSV: Depilação de Nariz)
UPDATE services SET 
  base_price = 35.0,
  duration_minutes = 15,
  price_note = NULL,
  requires_evaluation = false,
  updated_at = NOW()
WHERE id = '10000000-0000-0000-0000-000000000048';  -- expected: Depilação Nariz

-- Update Depilação Orelha (Matched with CSV: Depilação de Orelha)
UPDATE services SET 
  base_price = 35.0,
  duration_minutes = 15,
  price_note = NULL,
  requires_evaluation = false,
  updated_at = NOW()
WHERE id = '10000000-0000-0000-0000-000000000049';  -- expected: Depilação Orelha

-- Update Depilação Facial (Matched with CSV: Depilação Facial)
UPDATE services SET 
  base_price = 60.0,
  duration_minutes = 15,
  price_note = NULL,
  requires_evaluation = false,
  updated_at = NOW()
WHERE id = '10000000-0000-0000-0000-000000000051';  -- expected: Depilação Facial

-- Update Depilação Meia Perna (Matched with CSV: Depilação Meia Perna)
UPDATE services SET 
  base_price = 80.0,
  duration_minutes = 30,
  price_note = NULL,
  requires_evaluation = false,
  updated_at = NOW()
WHERE id = '10000000-0000-0000-0000-000000000053';  -- expected: Depilação Meia Perna

-- Update Depilação Perna (Matched with CSV: Depilação Perna)
UPDATE services SET 
  base_price = 65.0,
  duration_minutes = 30,
  price_note = NULL,
  requires_evaluation = false,
  updated_at = NOW()
WHERE id = '10000000-0000-0000-0000-000000000054';  -- expected: Depilação Perna

-- Update Depilação Virilha (Matched with CSV: Depilação Virilha)
UPDATE services SET 
  base_price = 60.0,
  duration_minutes = 30,
  price_note = NULL,
  requires_evaluation = false,
  updated_at = NOW()
WHERE id = '10000000-0000-0000-0000-000000000055';  -- expected: Depilação Virilha

-- Update Dermaplaning (Matched with CSV: Dermaplaming)
UPDATE services SET 
  base_price = 100.0,
  duration_minutes = 30,
  price_note = NULL,
  requires_evaluation = false,
  updated_at = NOW()
WHERE id = '10000000-0000-0000-0000-000000000056';  -- expected: Dermaplaning

-- Update Depilação Buço (Matched with CSV: Depilação Buço)
UPDATE services SET 
  base_price = 35.0,
  duration_minutes = 15,
  price_note = NULL,
  requires_evaluation = false,
  updated_at = NOW()
WHERE id = '10000000-0000-0000-0000-000000000057';  -- expected: Depilação Buço

-- Update Manutenção de Sobrancelhas Menos de um ano (Matched with CSV: Manutenção de Sobrancelhas Menos de um ano)
UPDATE services SET 
  base_price = NULL,
  duration_minutes = 60,
  price_note = 'consulta avaliação',
  requires_evaluation = true,
  updated_at = NOW()
WHERE id = '3a5a303b-f637-4020-adb0-0404f604335b';  -- expected: Manutenção de Sobrancelhas Menos de um ano

-- Update Manutenção Labios menos de um ano (Matched with CSV: Manutenção Labios menos de um ano)
UPDATE services SET 
  base_price = NULL,
  duration_minutes = 90,
  price_note = 'consulta avaliação',
  requires_evaluation = true,
  updated_at = NOW()
WHERE id = 'a157c8d4-1f9a-40df-b4e3-74ecf1da71b6';  -- expected: Manutenção Labios menos de um ano

-- Update manutenção olho menos de um ano (Matched with CSV: manutenção olho menos de um ano)
UPDATE services SET 
  base_price = NULL,
  duration_minutes = 75,
  price_note = 'consulta avaliação',
  requires_evaluation = true,
  updated_at = NOW()
WHERE id = '50edd1ab-2045-4a0f-a2f3-260068ce1035';  -- expected: manutenção olho menos de um ano

-- Update Retorno de Olhos (Matched with CSV: Retorno de Olhos)
UPDATE services SET 
  base_price = 0.0,
  duration_minutes = 30,
  price_note = 'cortesia - incluído no procedimento',
  requires_evaluation = false,
  updated_at = NOW()
WHERE id = '10000000-0000-0000-0000-000000000070';  -- expected: Retorno de Olhos

-- Update Retorno Labial (Matched with CSV: Retorno Labial)
UPDATE services SET 
  base_price = 0.0,
  duration_minutes = 60,
  price_note = 'cortesia - incluído no procedimento',
  requires_evaluation = false,
  updated_at = NOW()
WHERE id = '10000000-0000-0000-0000-000000000071';  -- expected: Retorno Labial

-- Update Retorno Sobrancelhas (Matched with CSV: Retorno Sobrancelhas)
UPDATE services SET 
  base_price = 0.0,
  duration_minutes = 45,
  price_note = 'cortesia - incluído no procedimento',
  requires_evaluation = false,
  updated_at = NOW()
WHERE id = '10000000-0000-0000-0000-000000000072';  -- expected: Retorno Sobrancelhas

-- Update Consulta de Enfermagem (Matched with CSV: Consulta de Enfermagem)
UPDATE services SET 
  base_price = 0.0,
  duration_minutes = 60,
  price_note = NULL,
  requires_evaluation = false,
  updated_at = NOW()
WHERE id = '10000000-0000-0000-0000-000000000082';  -- expected: Consulta de Enfermagem

-- Update Alongamento de Unha Fibra (Matched with CSV: Alongamento de  Unha Fibra)
UPDATE services SET 
  base_price = 190.0,
  duration_minutes = 140,
  price_note = NULL,
  requires_evaluation = false,
  updated_at = NOW()
WHERE id = '10000000-0000-0000-0000-000000000085';  -- expected: Alongamento de Unha Fibra

-- Update Banho de Gel (Matched with CSV: Banho de Gel)
UPDATE services SET 
  base_price = 160.0,
  duration_minutes = 105,
  price_note = NULL,
  requires_evaluation = false,
  updated_at = NOW()
WHERE id = '10000000-0000-0000-0000-000000000086';  -- expected: Banho de Gel

-- Update Esmaltação em Gel (Matched with CSV: Esmaltação em gel)
UPDATE services SET 
  base_price = 90.0,
  duration_minutes = 90,
  price_note = NULL,
  requires_evaluation = false,
  updated_at = NOW()
WHERE id = '10000000-0000-0000-0000-000000000087';  -- expected: Esmaltação em Gel

-- Update Esmaltação em Gel Pé (Matched with CSV: Esmaltação em gel pé)
UPDATE services SET 
  base_price = 90.0,
  duration_minutes = 90,
  price_note = NULL,
  requires_evaluation = false,
  updated_at = NOW()
WHERE id = '10000000-0000-0000-0000-000000000088';  -- expected: Esmaltação em Gel Pé

-- Update Manutenção de Fibra (Matched with CSV: Manutenção de Fibra)
UPDATE services SET 
  base_price = 160.0,
  duration_minutes = 120,
  price_note = NULL,
  requires_evaluation = false,
  updated_at = NOW()
WHERE id = '10000000-0000-0000-0000-000000000090';  -- expected: Manutenção de Fibra

-- Update Peeling Químico (Matched with CSV: Peeling Quimico)
UPDATE services SET 
  base_price = NULL,
  duration_minutes = 60,
  price_note = 'consulta avaliação',
  requires_evaluation = true,
  updated_at = NOW()
WHERE id = '10000000-0000-0000-0000-000000000094';  -- expected: Peeling Químico

-- Update Avaliação (Matched with CSV: Avaliação)
UPDATE services SET 
  base_price = 0.0,
  duration_minutes = 30,
  price_note = NULL,
  requires_evaluation = false,
  updated_at = NOW()
WHERE id = '10000000-0000-0000-0000-000000000095';  -- expected: Avaliação

-- Update Consulta Avaliação (Matched with CSV: Consulta Avaliação)
UPDATE services SET 
  base_price = 0.0,
  duration_minutes = 60,
  price_note = NULL,
  requires_evaluation = false,
  updated_at = NOW()
WHERE id = '10000000-0000-0000-0000-000000000096';  -- expected: Consulta Avaliação

-- ==========================================
-- 2. INSERTS
-- ==========================================



-- ==========================================
-- 3. VALIDATION & COMMIT
-- ==========================================

-- Validate expected row count
DO $$
DECLARE
  affected_count INT;
BEGIN
  SELECT count(*) INTO affected_count 
  FROM services 
  WHERE updated_at > NOW() - INTERVAL '1 minute';
  
  IF affected_count != 57 THEN
    RAISE EXCEPTION 'Expected 57 updates, got %', affected_count;
  END IF;
END $$;

COMMIT;