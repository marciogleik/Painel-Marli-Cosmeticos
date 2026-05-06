-- PREVIEW SQL: Service Price Updates (Finalized v4 - SWAP Bugfix)
-- Generated: 2026-05-04T08:01:57.119878

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
WHERE id = '10000000-0000-0000-0000-000000000001';

-- Update ATA CROSS (Matched with CSV: ATA CROSS)
UPDATE services SET 
  base_price = NULL,
  duration_minutes = 30,
  price_note = 'consulta avaliação',
  requires_evaluation = true,
  updated_at = NOW()
WHERE id = '10000000-0000-0000-0000-000000000002';

-- Update Banco de Colágeno (Matched with CSV: Banco de Colágeno)
UPDATE services SET 
  base_price = NULL,
  duration_minutes = 90,
  price_note = 'consulta avaliação',
  requires_evaluation = true,
  updated_at = NOW()
WHERE id = '10000000-0000-0000-0000-000000000003';

-- Update Bioestimulador com Elleva (Matched with CSV: Bioestimulador com Elleva)
UPDATE services SET 
  base_price = NULL,
  duration_minutes = 60,
  price_note = 'consulta avaliação',
  requires_evaluation = true,
  updated_at = NOW()
WHERE id = '10000000-0000-0000-0000-000000000004';

-- Update Bioestimulador com Harmonyca (Matched with CSV: Bioestimulador com Harmonyca)
UPDATE services SET 
  base_price = NULL,
  duration_minutes = 60,
  price_note = 'consulta avaliação',
  requires_evaluation = true,
  updated_at = NOW()
WHERE id = '10000000-0000-0000-0000-000000000005';

-- Update Bioestimulador com Radiesse (Matched with CSV: Bioestimulador com Radiesse)
UPDATE services SET 
  base_price = NULL,
  duration_minutes = 60,
  price_note = 'consulta avaliação',
  requires_evaluation = true,
  updated_at = NOW()
WHERE id = '10000000-0000-0000-0000-000000000006';

-- Update Bioestimulador com Sculptra (Matched with CSV: Bioestimulador com Sculptra)
UPDATE services SET 
  base_price = NULL,
  duration_minutes = 60,
  price_note = 'consulta avaliação',
  requires_evaluation = true,
  updated_at = NOW()
WHERE id = '10000000-0000-0000-0000-000000000007';

-- Update Bioestimulador de Gluteo (Matched with CSV: Bioestimulador de Gluteo)
UPDATE services SET 
  base_price = NULL,
  duration_minutes = 60,
  price_note = 'consulta avaliação',
  requires_evaluation = true,
  updated_at = NOW()
WHERE id = '10000000-0000-0000-0000-000000000008';

-- Update Harmonização Facial (Matched with CSV: Harmonização Facial)
UPDATE services SET 
  base_price = NULL,
  duration_minutes = 120,
  price_note = 'consulta avaliação',
  requires_evaluation = true,
  updated_at = NOW()
WHERE id = '10000000-0000-0000-0000-000000000009';

-- Update Lavieen (Matched with CSV: Lavieen)
UPDATE services SET 
  base_price = NULL,
  duration_minutes = 60,
  price_note = 'consulta avaliação',
  requires_evaluation = true,
  updated_at = NOW()
WHERE id = '10000000-0000-0000-0000-000000000010';

-- Update Lipo de Papada (Matched with CSV: Lipo de Papada)
UPDATE services SET 
  base_price = NULL,
  duration_minutes = 30,
  price_note = 'consulta avaliação',
  requires_evaluation = true,
  updated_at = NOW()
WHERE id = '10000000-0000-0000-0000-000000000011';

-- Update Peeling para Acne Cisteamine (Matched with CSV: Peeling para Acne Cisteamine)
UPDATE services SET 
  base_price = NULL,
  duration_minutes = 30,
  price_note = 'consulta avaliação',
  requires_evaluation = true,
  updated_at = NOW()
WHERE id = '10000000-0000-0000-0000-000000000012';

-- Update Peeling para Melasma (Matched with CSV: Peeling para melasma)
UPDATE services SET 
  base_price = NULL,
  duration_minutes = 30,
  price_note = 'consulta avaliação',
  requires_evaluation = true,
  updated_at = NOW()
WHERE id = '10000000-0000-0000-0000-000000000013';

-- Update Peeling para Rejuvenescimento (Matched with CSV: Peeling para Rejuvenescimento)
UPDATE services SET 
  base_price = NULL,
  duration_minutes = 30,
  price_note = 'consulta avaliação',
  requires_evaluation = true,
  updated_at = NOW()
WHERE id = '10000000-0000-0000-0000-000000000014';

-- Update Preenchedor de Glúteo (Matched with CSV: Preenchedor de Glúteo)
UPDATE services SET 
  base_price = NULL,
  duration_minutes = 60,
  price_note = 'consulta avaliação',
  requires_evaluation = true,
  updated_at = NOW()
WHERE id = '10000000-0000-0000-0000-000000000015';

-- Update Preenchimento Bigodinho Chinês (Matched with CSV: Preenchimento Bigodinho Chines)
UPDATE services SET 
  base_price = NULL,
  duration_minutes = 60,
  price_note = 'consulta avaliação',
  requires_evaluation = true,
  updated_at = NOW()
WHERE id = '10000000-0000-0000-0000-000000000016';

-- Update Preenchimento de Mandíbula (Matched with CSV: Preenchimento de Mandibula)
UPDATE services SET 
  base_price = NULL,
  duration_minutes = 60,
  price_note = 'consulta avaliação',
  requires_evaluation = true,
  updated_at = NOW()
WHERE id = '10000000-0000-0000-0000-000000000017';

-- Update Preenchimento de Mento (Matched with CSV: Preenchimento de Mento)
UPDATE services SET 
  base_price = NULL,
  duration_minutes = 60,
  price_note = 'consulta avaliação',
  requires_evaluation = true,
  updated_at = NOW()
WHERE id = '10000000-0000-0000-0000-000000000018';

-- Update Preenchimento de Olheiras (Matched with CSV: Preenchimento de Olheiras)
UPDATE services SET 
  base_price = NULL,
  duration_minutes = 60,
  price_note = 'consulta avaliação',
  requires_evaluation = true,
  updated_at = NOW()
WHERE id = '10000000-0000-0000-0000-000000000019';

-- Update Preenchimento de Têmporas (Matched with CSV: Preenchimento de Temporas)
UPDATE services SET 
  base_price = NULL,
  duration_minutes = 60,
  price_note = 'consulta avaliação',
  requires_evaluation = true,
  updated_at = NOW()
WHERE id = '10000000-0000-0000-0000-000000000020';

-- Update Preenchimento de Zigomático (Matched with CSV: Preenchimento de Zigomatico)
UPDATE services SET 
  base_price = NULL,
  duration_minutes = 60,
  price_note = 'consulta avaliação',
  requires_evaluation = true,
  updated_at = NOW()
WHERE id = '10000000-0000-0000-0000-000000000021';

-- Update Preenchimento Labial (Matched with CSV: Preenchimento Labial)
UPDATE services SET 
  base_price = NULL,
  duration_minutes = 60,
  price_note = 'consulta avaliação',
  requires_evaluation = true,
  updated_at = NOW()
WHERE id = '10000000-0000-0000-0000-000000000022';

-- Update Preenchimento Linha Marionete (Matched with CSV: Preenchimento Linha Marionete)
UPDATE services SET 
  base_price = NULL,
  duration_minutes = 60,
  price_note = 'consulta avaliação',
  requires_evaluation = true,
  updated_at = NOW()
WHERE id = '10000000-0000-0000-0000-000000000023';

-- Update Preenchimento Malar (Matched with CSV: Preenchimento Malar)
UPDATE services SET 
  base_price = NULL,
  duration_minutes = 60,
  price_note = 'consulta avaliação',
  requires_evaluation = true,
  updated_at = NOW()
WHERE id = '10000000-0000-0000-0000-000000000024';

-- Update Rinomodelação (Matched with CSV: Rinomodelação)
UPDATE services SET 
  base_price = NULL,
  duration_minutes = 90,
  price_note = 'consulta avaliação',
  requires_evaluation = true,
  updated_at = NOW()
WHERE id = '10000000-0000-0000-0000-000000000025';

-- Update Skinbooster (Matched with CSV: Skinbooster)
UPDATE services SET 
  base_price = NULL,
  duration_minutes = 45,
  price_note = 'consulta avaliação',
  requires_evaluation = true,
  updated_at = NOW()
WHERE id = '10000000-0000-0000-0000-000000000026';

-- Update Terapia Capilar (Matched with CSV: Terapia Capilar)
UPDATE services SET 
  base_price = NULL,
  duration_minutes = 30,
  price_note = 'consulta avaliação',
  requires_evaluation = true,
  updated_at = NOW()
WHERE id = '10000000-0000-0000-0000-000000000027';

-- Update Ultraformer (Matched with CSV: Ultraformer)
UPDATE services SET 
  base_price = NULL,
  duration_minutes = 120,
  price_note = 'consulta avaliação',
  requires_evaluation = true,
  updated_at = NOW()
WHERE id = '10000000-0000-0000-0000-000000000028';

-- Update Massagem (Matched with CSV: Massagem)
UPDATE services SET 
  base_price = NULL,
  duration_minutes = 60,
  price_note = 'consulta avaliação',
  requires_evaluation = true,
  updated_at = NOW()
WHERE id = '10000000-0000-0000-0000-000000000029';

-- Update Tratamento Celulite (Matched with CSV: Tratamento Celulite)
UPDATE services SET 
  base_price = NULL,
  duration_minutes = 60,
  price_note = 'consulta avaliação',
  requires_evaluation = true,
  updated_at = NOW()
WHERE id = '10000000-0000-0000-0000-000000000030';

-- Update Tratamento Corporal (Matched with CSV: Tratamento corporal)
UPDATE services SET 
  base_price = NULL,
  duration_minutes = 60,
  price_note = 'consulta avaliação',
  requires_evaluation = true,
  updated_at = NOW()
WHERE id = '10000000-0000-0000-0000-000000000031';

-- Update Tratamento Laser (Matched with CSV: Tratamento Laser)
UPDATE services SET 
  base_price = NULL,
  duration_minutes = 30,
  price_note = 'consulta avaliação',
  requires_evaluation = true,
  updated_at = NOW()
WHERE id = '10000000-0000-0000-0000-000000000032';

-- Update Tratamento Luz Pulsada (Matched with CSV: Tratamento Luz Pulsada)
UPDATE services SET 
  base_price = NULL,
  duration_minutes = 30,
  price_note = 'consulta avaliação',
  requires_evaluation = true,
  updated_at = NOW()
WHERE id = '10000000-0000-0000-0000-000000000033';

-- Update Tratamento Estrias (Matched with CSV: TRatamento Strias) [SWAP TARGET]
UPDATE services SET 
  base_price = NULL,
  duration_minutes = 60,
  price_note = 'consulta avaliação',
  requires_evaluation = true,
  updated_at = NOW()
WHERE id = '08eebba7-65bd-45c2-ab3b-c9d86ac5c1be';

-- Update Ventosaterapia (Matched with CSV: Ventosaterapia)
UPDATE services SET 
  base_price = 130.0,
  duration_minutes = 60,
  price_note = NULL,
  requires_evaluation = false,
  updated_at = NOW()
WHERE id = '10000000-0000-0000-0000-000000000035';

-- Update Drenagem Linfática (Matched with CSV: Drenagem Linfática)
UPDATE services SET 
  base_price = 130.0,
  duration_minutes = 45,
  price_note = NULL,
  requires_evaluation = false,
  updated_at = NOW()
WHERE id = '10000000-0000-0000-0000-000000000036';

-- Update Prime Bumbum (Matched with CSV: Prime Bumbum)
UPDATE services SET 
  base_price = NULL,
  duration_minutes = 60,
  price_note = 'consulta avaliação',
  requires_evaluation = true,
  updated_at = NOW()
WHERE id = '10000000-0000-0000-0000-000000000037';

-- Update Limpeza de Pele (Matched with CSV: Limpeza De Pele)
UPDATE services SET 
  base_price = 180.0,
  duration_minutes = 60,
  price_note = NULL,
  requires_evaluation = false,
  updated_at = NOW()
WHERE id = '10000000-0000-0000-0000-000000000041';

-- Update Retorno Limpeza de Pele (Matched with CSV: Retorno limpeza de pele)
UPDATE services SET 
  base_price = 0.0,
  duration_minutes = 30,
  price_note = 'sem custo',
  requires_evaluation = false,
  updated_at = NOW()
WHERE id = '10000000-0000-0000-0000-000000000042';

-- Update Microagulhamento (Matched with CSV: Microagulhamento)
UPDATE services SET 
  base_price = NULL,
  duration_minutes = 60,
  price_note = 'consulta avaliação',
  requires_evaluation = true,
  updated_at = NOW()
WHERE id = '10000000-0000-0000-0000-000000000044';

-- Update Carboxterapia (Matched with CSV: Carboxterapia)
UPDATE services SET 
  base_price = NULL,
  duration_minutes = 60,
  price_note = 'consulta avaliação',
  requires_evaluation = true,
  updated_at = NOW()
WHERE id = 'd19377b8-bf2d-4254-b2fd-fd78c51eaefd';

-- Update Jato de Plasma (Matched with CSV: Jato de Plasma)
UPDATE services SET 
  base_price = NULL,
  duration_minutes = 60,
  price_note = 'consulta avaliação',
  requires_evaluation = true,
  updated_at = NOW()
WHERE id = '10000000-0000-0000-0000-000000000039';

-- Update Pós Operatório (Matched with CSV: Pós Operatorio)
UPDATE services SET 
  base_price = 150.0,
  duration_minutes = 30,
  price_note = NULL,
  requires_evaluation = false,
  updated_at = NOW()
WHERE id = '10000000-0000-0000-0000-000000000040';

-- Update Depilação Axila (Matched with CSV: Depilação Axila)
UPDATE services SET 
  base_price = 40.0,
  duration_minutes = 15,
  price_note = NULL,
  requires_evaluation = false,
  updated_at = NOW()
WHERE id = '10000000-0000-0000-0000-000000000045';

-- Update Depilação Completa (Matched with CSV: Depilação Completa)
UPDATE services SET 
  base_price = NULL,
  duration_minutes = 60,
  price_note = 'valor varia por região - confirmar com atendente',
  requires_evaluation = true,
  updated_at = NOW()
WHERE id = '10000000-0000-0000-0000-000000000046';

-- Update Depilação Costas (Matched with CSV: Depilaçao de Costas)
UPDATE services SET 
  base_price = 90.0,
  duration_minutes = 20,
  price_note = NULL,
  requires_evaluation = false,
  updated_at = NOW()
WHERE id = '10000000-0000-0000-0000-000000000047';

-- Update Depilação Nariz (Matched with CSV: Depilação de Nariz)
UPDATE services SET 
  base_price = 35.0,
  duration_minutes = 15,
  price_note = NULL,
  requires_evaluation = false,
  updated_at = NOW()
WHERE id = '10000000-0000-0000-0000-000000000048';

-- Update Depilação Orelha (Matched with CSV: Depilação de Orelha)
UPDATE services SET 
  base_price = 35.0,
  duration_minutes = 15,
  price_note = NULL,
  requires_evaluation = false,
  updated_at = NOW()
WHERE id = '10000000-0000-0000-0000-000000000049';

-- Update Depilação Definitiva (Matched with CSV: Depilação Definitiva)
UPDATE services SET 
  base_price = NULL,
  duration_minutes = 30,
  price_note = 'consulta avaliação',
  requires_evaluation = true,
  updated_at = NOW()
WHERE id = '10000000-0000-0000-0000-000000000050';

-- Update Depilação Facial (Matched with CSV: Depilação Facial)
UPDATE services SET 
  base_price = 60.0,
  duration_minutes = 15,
  price_note = NULL,
  requires_evaluation = false,
  updated_at = NOW()
WHERE id = '10000000-0000-0000-0000-000000000051';

-- Update Depilação Luz Pulsada (Matched with CSV: Depilação Luz Pulsada)
UPDATE services SET 
  base_price = NULL,
  duration_minutes = 30,
  price_note = 'consulta avaliação',
  requires_evaluation = true,
  updated_at = NOW()
WHERE id = '10000000-0000-0000-0000-000000000052';

-- Update Depilação Meia Perna (Matched with CSV: Depilação Meia Perna)
UPDATE services SET 
  base_price = 80.0,
  duration_minutes = 30,
  price_note = NULL,
  requires_evaluation = false,
  updated_at = NOW()
WHERE id = '10000000-0000-0000-0000-000000000053';

-- Update Depilação Perna (Matched with CSV: Depilação Perna)
UPDATE services SET 
  base_price = 65.0,
  duration_minutes = 30,
  price_note = NULL,
  requires_evaluation = false,
  updated_at = NOW()
WHERE id = '10000000-0000-0000-0000-000000000054';

-- Update Depilação Virilha (Matched with CSV: Depilação Virilha)
UPDATE services SET 
  base_price = 60.0,
  duration_minutes = 30,
  price_note = NULL,
  requires_evaluation = false,
  updated_at = NOW()
WHERE id = '10000000-0000-0000-0000-000000000055';

-- Update Dermaplaning (Matched with CSV: Dermaplaming) [SWAP TARGET]
UPDATE services SET 
  base_price = 100.0,
  duration_minutes = 30,
  price_note = NULL,
  requires_evaluation = false,
  updated_at = NOW()
WHERE id = 'e651c272-fb95-43a4-b69e-9ff17ca58760';

-- Update Depilação Buço (Matched with CSV: Depilação Buço)
UPDATE services SET 
  base_price = 35.0,
  duration_minutes = 15,
  price_note = NULL,
  requires_evaluation = false,
  updated_at = NOW()
WHERE id = '10000000-0000-0000-0000-000000000057';

-- Update Revitalização Facial (Matched with CSV: Revitalização Facial)
UPDATE services SET 
  base_price = 60.0,
  duration_minutes = 30,
  price_note = NULL,
  requires_evaluation = false,
  updated_at = NOW()
WHERE id = '10000000-0000-0000-0000-000000000043';

-- Update Despigmentação (Matched with CSV: Despigmentação)
UPDATE services SET 
  base_price = NULL,
  duration_minutes = 30,
  price_note = 'consulta avaliação',
  requires_evaluation = true,
  updated_at = NOW()
WHERE id = '10000000-0000-0000-0000-000000000058';

-- Update Manutenção Anual de Sobrancelhas (Matched with CSV: Manutenção Anual de Sobrancelhas)
UPDATE services SET 
  base_price = NULL,
  duration_minutes = 75,
  price_note = 'consulta avaliação',
  requires_evaluation = true,
  updated_at = NOW()
WHERE id = '10000000-0000-0000-0000-000000000059';

-- Update Manutenção de Sobrancelhas Menos de um ano (Matched with CSV: Manutenção de Sobrancelhas Menos de um ano)
UPDATE services SET 
  base_price = NULL,
  duration_minutes = 60,
  price_note = 'consulta avaliação',
  requires_evaluation = true,
  updated_at = NOW()
WHERE id = '3a5a303b-f637-4020-adb0-0404f604335b';

-- Update Manutenção Labial (Matched with CSV: Manutenção Labial)
UPDATE services SET 
  base_price = NULL,
  duration_minutes = 90,
  price_note = 'consulta avaliação',
  requires_evaluation = true,
  updated_at = NOW()
WHERE id = '10000000-0000-0000-0000-000000000061';

-- Update Manutenção Labios menos de um ano (Matched with CSV: Manutenção Labios menos de um ano)
UPDATE services SET 
  base_price = NULL,
  duration_minutes = 90,
  price_note = 'consulta avaliação',
  requires_evaluation = true,
  updated_at = NOW()
WHERE id = 'a157c8d4-1f9a-40df-b4e3-74ecf1da71b6';

-- Update Manutenção Olho (Matched with CSV: Manutenção olho)
UPDATE services SET 
  base_price = NULL,
  duration_minutes = 60,
  price_note = 'consulta avaliação',
  requires_evaluation = true,
  updated_at = NOW()
WHERE id = '10000000-0000-0000-0000-000000000063';

-- Update manutenção olho menos de um ano (Matched with CSV: manutenção olho menos de um ano)
UPDATE services SET 
  base_price = NULL,
  duration_minutes = 75,
  price_note = 'consulta avaliação',
  requires_evaluation = true,
  updated_at = NOW()
WHERE id = '50edd1ab-2045-4a0f-a2f3-260068ce1035';

-- Update Micropigmentação Contorno de Olhos (Matched with CSV: Micropigmentação Contorno de Olhos)
UPDATE services SET 
  base_price = 700.0,
  duration_minutes = 45,
  price_note = NULL,
  requires_evaluation = false,
  updated_at = NOW()
WHERE id = '10000000-0000-0000-0000-000000000065';

-- Update Micropigmentação de Sobrancelhas (Matched with CSV: Micropigmentação de Sobrancelhas)
UPDATE services SET 
  base_price = 700.0,
  duration_minutes = 90,
  price_note = NULL,
  requires_evaluation = false,
  updated_at = NOW()
WHERE id = '10000000-0000-0000-0000-000000000066';

-- Update Micropigmentação Labial (Matched with CSV: Micropigmentação Labial)
UPDATE services SET 
  base_price = 700.0,
  duration_minutes = 75,
  price_note = NULL,
  requires_evaluation = false,
  updated_at = NOW()
WHERE id = '10000000-0000-0000-0000-000000000067';

-- Update Prime Brow (crescimento do pelo) (Matched with CSV: Prime Brow (crescimento do pelo))
UPDATE services SET 
  base_price = 700.0,
  duration_minutes = 30,
  price_note = NULL,
  requires_evaluation = false,
  updated_at = NOW()
WHERE id = '10000000-0000-0000-0000-000000000068';

-- Update Prime Up (Brow Lamination) (Matched with CSV: Prime Up (Brow Lamination))
UPDATE services SET 
  base_price = 200.0,
  duration_minutes = 60,
  price_note = NULL,
  requires_evaluation = false,
  updated_at = NOW()
WHERE id = '10000000-0000-0000-0000-000000000069';

-- Update Retorno de Olhos (Matched with CSV: Retorno de Olhos)
UPDATE services SET 
  base_price = 0.0,
  duration_minutes = 30,
  price_note = 'cortesia - incluído no procedimento',
  requires_evaluation = false,
  updated_at = NOW()
WHERE id = '10000000-0000-0000-0000-000000000070';

-- Update Retorno Labial (Matched with CSV: Retorno Labial)
UPDATE services SET 
  base_price = 0.0,
  duration_minutes = 60,
  price_note = 'cortesia - incluído no procedimento',
  requires_evaluation = false,
  updated_at = NOW()
WHERE id = '10000000-0000-0000-0000-000000000071';

-- Update Retorno Sobrancelhas (Matched with CSV: Retorno Sobrancelhas)
UPDATE services SET 
  base_price = 0.0,
  duration_minutes = 45,
  price_note = 'cortesia - incluído no procedimento',
  requires_evaluation = false,
  updated_at = NOW()
WHERE id = '10000000-0000-0000-0000-000000000072';

-- Update Tintura de Sobrancelhas (Matched with CSV: Tintura de sobrancelhas)
UPDATE services SET 
  base_price = 80.0,
  duration_minutes = 15,
  price_note = NULL,
  requires_evaluation = false,
  updated_at = NOW()
WHERE id = '10000000-0000-0000-0000-000000000074';

-- Update Designer com Henna (Matched with CSV: Designer Com Henna)
UPDATE services SET 
  base_price = 70.0,
  duration_minutes = 15,
  price_note = NULL,
  requires_evaluation = false,
  updated_at = NOW()
WHERE id = '10000000-0000-0000-0000-000000000075';

-- Update Designer de Sobrancelhas (Matched with CSV: Designer de Sobrancelhas)
UPDATE services SET 
  base_price = 55.0,
  duration_minutes = 15,
  price_note = NULL,
  requires_evaluation = false,
  updated_at = NOW()
WHERE id = '10000000-0000-0000-0000-000000000076';

-- Update Lash Lifting (Matched with CSV: Lash Lifting)
UPDATE services SET 
  base_price = 150.0,
  duration_minutes = 60,
  price_note = NULL,
  requires_evaluation = false,
  updated_at = NOW()
WHERE id = '10000000-0000-0000-0000-000000000073';

-- Update Spa dos Pés (Matched with CSV: Spa dos Pés)
UPDATE services SET 
  base_price = 100.0,
  duration_minutes = 60,
  price_note = NULL,
  requires_evaluation = false,
  updated_at = NOW()
WHERE id = '10000000-0000-0000-0000-000000000077';

-- Update Unha Mão (Matched with CSV: Unha Mão)
UPDATE services SET 
  base_price = 45.0,
  duration_minutes = 45,
  price_note = NULL,
  requires_evaluation = false,
  updated_at = NOW()
WHERE id = '10000000-0000-0000-0000-000000000078';

-- Update Unha Pé (Matched with CSV: Unha Pé)
UPDATE services SET 
  base_price = 45.0,
  duration_minutes = 60,
  price_note = NULL,
  requires_evaluation = false,
  updated_at = NOW()
WHERE id = '10000000-0000-0000-0000-000000000079';

-- Update Unha Pé e Mão (Matched with CSV: Unha Pé e mão)
UPDATE services SET 
  base_price = 80.0,
  duration_minutes = 120,
  price_note = NULL,
  requires_evaluation = false,
  updated_at = NOW()
WHERE id = '10000000-0000-0000-0000-000000000080';

-- Update Bioimpedância (Matched with CSV: Bioimpedância)
UPDATE services SET 
  base_price = 100.0,
  duration_minutes = 30,
  price_note = NULL,
  requires_evaluation = false,
  updated_at = NOW()
WHERE id = '10000000-0000-0000-0000-000000000081';

-- Update Consulta de Enfermagem (Matched with CSV: Consulta de Enfermagem)
UPDATE services SET 
  base_price = 0.0,
  duration_minutes = 60,
  price_note = NULL,
  requires_evaluation = false,
  updated_at = NOW()
WHERE id = '10000000-0000-0000-0000-000000000082';

-- Update Injetáveis (Matched with CSV: Injetaveis)
UPDATE services SET 
  base_price = NULL,
  duration_minutes = 30,
  price_note = 'consulta avaliação',
  requires_evaluation = true,
  updated_at = NOW()
WHERE id = '10000000-0000-0000-0000-000000000083';

-- Update Soroterapia (Matched with CSV: Soroterapia)
UPDATE services SET 
  base_price = NULL,
  duration_minutes = 45,
  price_note = 'consulta avaliação',
  requires_evaluation = true,
  updated_at = NOW()
WHERE id = '10000000-0000-0000-0000-000000000084';

-- Update Alongamento de Unha Fibra (Matched with CSV: Alongamento de  Unha Fibra)
UPDATE services SET 
  base_price = 190.0,
  duration_minutes = 140,
  price_note = NULL,
  requires_evaluation = false,
  updated_at = NOW()
WHERE id = '10000000-0000-0000-0000-000000000085';

-- Update Banho de Gel (Matched with CSV: Banho de Gel)
UPDATE services SET 
  base_price = 160.0,
  duration_minutes = 105,
  price_note = NULL,
  requires_evaluation = false,
  updated_at = NOW()
WHERE id = '10000000-0000-0000-0000-000000000086';

-- Update Esmaltação em Gel (Matched with CSV: Esmaltação em gel)
UPDATE services SET 
  base_price = 90.0,
  duration_minutes = 90,
  price_note = NULL,
  requires_evaluation = false,
  updated_at = NOW()
WHERE id = '10000000-0000-0000-0000-000000000087';

-- Update Esmaltação em Gel Pé (Matched with CSV: Esmaltação em gel pé)
UPDATE services SET 
  base_price = 90.0,
  duration_minutes = 90,
  price_note = NULL,
  requires_evaluation = false,
  updated_at = NOW()
WHERE id = '10000000-0000-0000-0000-000000000088';

-- Update Manutenção de Fibra (Matched with CSV: Manutenção de Fibra)
UPDATE services SET 
  base_price = 160.0,
  duration_minutes = 120,
  price_note = NULL,
  requires_evaluation = false,
  updated_at = NOW()
WHERE id = '10000000-0000-0000-0000-000000000090';

-- Update Remoção de Unha (Matched with CSV: Remoção de Unha)
UPDATE services SET 
  base_price = 50.0,
  duration_minutes = 30,
  price_note = NULL,
  requires_evaluation = false,
  updated_at = NOW()
WHERE id = '10000000-0000-0000-0000-000000000091';

-- Update PEIM (Matched with CSV: PEIM)
UPDATE services SET 
  base_price = NULL,
  duration_minutes = 95,
  price_note = 'consulta avaliação',
  requires_evaluation = true,
  updated_at = NOW()
WHERE id = '10000000-0000-0000-0000-000000000092';

-- Update BB Glow (Matched with CSV: BB Glow)
UPDATE services SET 
  base_price = NULL,
  duration_minutes = 60,
  price_note = 'consulta avaliação',
  requires_evaluation = true,
  updated_at = NOW()
WHERE id = '10000000-0000-0000-0000-000000000093';

-- Update Peeling Químico (Matched with CSV: Peeling Quimico)
UPDATE services SET 
  base_price = NULL,
  duration_minutes = 60,
  price_note = 'consulta avaliação',
  requires_evaluation = true,
  updated_at = NOW()
WHERE id = '10000000-0000-0000-0000-000000000094';

-- Update Avaliação (Matched with CSV: Avaliação)
UPDATE services SET 
  base_price = 0.0,
  duration_minutes = 30,
  price_note = NULL,
  requires_evaluation = false,
  updated_at = NOW()
WHERE id = '10000000-0000-0000-0000-000000000095';

-- Update Consulta Avaliação (Matched with CSV: Consulta Avaliação)
UPDATE services SET 
  base_price = 0.0,
  duration_minutes = 60,
  price_note = NULL,
  requires_evaluation = false,
  updated_at = NOW()
WHERE id = '10000000-0000-0000-0000-000000000096';

-- Update Curso (Matched with CSV: Curso)
UPDATE services SET 
  base_price = NULL,
  duration_minutes = 120,
  price_note = 'consulta avaliação',
  requires_evaluation = true,
  updated_at = NOW()
WHERE id = '10000000-0000-0000-0000-000000000097';

-- Update Retorno de Procedimento (Matched with CSV: Retorno de Procedimento)
UPDATE services SET 
  base_price = NULL,
  duration_minutes = 15,
  price_note = 'consulta avaliação',
  requires_evaluation = true,
  updated_at = NOW()
WHERE id = '10000000-0000-0000-0000-000000000098';

-- ==========================================
-- 2. INSERTS
-- ==========================================



-- ==========================================
-- 3. VALIDATION & COMMIT
-- ==========================================

DO $$
DECLARE
  affected_count INT;
BEGIN
  SELECT count(*) INTO affected_count FROM services WHERE updated_at > NOW() - INTERVAL '1 minute';
  IF affected_count != 97 THEN
    RAISE EXCEPTION 'Expected 97 updates, got %', affected_count;
  END IF;
END $$;

COMMIT;