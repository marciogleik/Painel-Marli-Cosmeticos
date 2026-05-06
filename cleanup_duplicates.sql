-- CLEANUP SQL: Duplicate Service Removal & Migration
BEGIN;

-- Processing: Peeling para Melasma (DELETE_SAFE)
DELETE FROM services WHERE id = 'ff3379a6-5c8c-4daf-b2fc-b32e9c74b188';

-- Processing: Preenchimento Bigodinho (MERGE_TO_KEEP)
UPDATE appointment_services SET service_id = '10000000-0000-0000-0000-000000000016' WHERE service_id = 'bd4fc599-2bc5-4ac7-969a-ba893c5b00dd';
INSERT INTO professional_services (professional_id, service_id) SELECT professional_id, '10000000-0000-0000-0000-000000000016' FROM professional_services WHERE service_id = 'bd4fc599-2bc5-4ac7-969a-ba893c5b00dd' ON CONFLICT DO NOTHING;
DELETE FROM professional_services WHERE service_id = 'bd4fc599-2bc5-4ac7-969a-ba893c5b00dd';
DELETE FROM services WHERE id = 'bd4fc599-2bc5-4ac7-969a-ba893c5b00dd';

-- Processing: Preenchimento de Mandíbula (MERGE_TO_KEEP)
UPDATE appointment_services SET service_id = '10000000-0000-0000-0000-000000000017' WHERE service_id = '086a15d1-c92d-4c57-b95e-7a0b4007293c';
INSERT INTO professional_services (professional_id, service_id) SELECT professional_id, '10000000-0000-0000-0000-000000000017' FROM professional_services WHERE service_id = '086a15d1-c92d-4c57-b95e-7a0b4007293c' ON CONFLICT DO NOTHING;
DELETE FROM professional_services WHERE service_id = '086a15d1-c92d-4c57-b95e-7a0b4007293c';
DELETE FROM services WHERE id = '086a15d1-c92d-4c57-b95e-7a0b4007293c';

-- Processing: Preenchimento de Têmporas (MERGE_TO_KEEP)
UPDATE appointment_services SET service_id = '10000000-0000-0000-0000-000000000020' WHERE service_id = 'c52aa79f-03d9-475c-9511-c6a2660b53e7';
INSERT INTO professional_services (professional_id, service_id) SELECT professional_id, '10000000-0000-0000-0000-000000000020' FROM professional_services WHERE service_id = 'c52aa79f-03d9-475c-9511-c6a2660b53e7' ON CONFLICT DO NOTHING;
DELETE FROM professional_services WHERE service_id = 'c52aa79f-03d9-475c-9511-c6a2660b53e7';
DELETE FROM services WHERE id = 'c52aa79f-03d9-475c-9511-c6a2660b53e7';

-- Processing: Preenchimento de Zigomático (MERGE_TO_KEEP)
UPDATE appointment_services SET service_id = '10000000-0000-0000-0000-000000000021' WHERE service_id = '49064e05-b819-4ecc-97c3-8b43813717e9';
INSERT INTO professional_services (professional_id, service_id) SELECT professional_id, '10000000-0000-0000-0000-000000000021' FROM professional_services WHERE service_id = '49064e05-b819-4ecc-97c3-8b43813717e9' ON CONFLICT DO NOTHING;
DELETE FROM professional_services WHERE service_id = '49064e05-b819-4ecc-97c3-8b43813717e9';
DELETE FROM services WHERE id = '49064e05-b819-4ecc-97c3-8b43813717e9';

-- Processing: Retorno Limpeza de Pele (DELETE_SAFE)
DELETE FROM services WHERE id = '0bbdaa0b-ae69-4c0f-9c6d-0f228be53a3a';

-- Processing: Pós Operatório (MERGE_TO_KEEP)
UPDATE appointment_services SET service_id = '10000000-0000-0000-0000-000000000040' WHERE service_id = '178e13a8-9b68-4ab3-badc-7ae820313fd1';
INSERT INTO professional_services (professional_id, service_id) SELECT professional_id, '10000000-0000-0000-0000-000000000040' FROM professional_services WHERE service_id = '178e13a8-9b68-4ab3-badc-7ae820313fd1' ON CONFLICT DO NOTHING;
DELETE FROM professional_services WHERE service_id = '178e13a8-9b68-4ab3-badc-7ae820313fd1';
DELETE FROM services WHERE id = '178e13a8-9b68-4ab3-badc-7ae820313fd1';

-- Processing: Depilação Costas (MERGE_TO_KEEP)
UPDATE appointment_services SET service_id = '10000000-0000-0000-0000-000000000047' WHERE service_id = 'b91265c3-e555-43a9-bc60-43fe4b5128a8';
INSERT INTO professional_services (professional_id, service_id) SELECT professional_id, '10000000-0000-0000-0000-000000000047' FROM professional_services WHERE service_id = 'b91265c3-e555-43a9-bc60-43fe4b5128a8' ON CONFLICT DO NOTHING;
DELETE FROM professional_services WHERE service_id = 'b91265c3-e555-43a9-bc60-43fe4b5128a8';
DELETE FROM services WHERE id = 'b91265c3-e555-43a9-bc60-43fe4b5128a8';

-- Processing: Manutenção Olho (DELETE_SAFE)
DELETE FROM services WHERE id = 'ec45f1b0-e2f0-44f2-b096-76667d6d4661';

-- Processing: Tintura de Sobrancelhas (DELETE_SAFE)
DELETE FROM services WHERE id = '0f7ca0a8-982c-4d54-a32b-0166b0b737c6';

-- Processing: Peeling Químico (MERGE_TO_KEEP)
UPDATE appointment_services SET service_id = '10000000-0000-0000-0000-000000000094' WHERE service_id = '3274c1d6-77e6-4df7-aefa-5443aeffee1f';
INSERT INTO professional_services (professional_id, service_id) SELECT professional_id, '10000000-0000-0000-0000-000000000094' FROM professional_services WHERE service_id = '3274c1d6-77e6-4df7-aefa-5443aeffee1f' ON CONFLICT DO NOTHING;
DELETE FROM professional_services WHERE service_id = '3274c1d6-77e6-4df7-aefa-5443aeffee1f';
DELETE FROM services WHERE id = '3274c1d6-77e6-4df7-aefa-5443aeffee1f';

-- Processing: Tratamento Corporal (MERGE_TO_KEEP)
UPDATE appointment_services SET service_id = '10000000-0000-0000-0000-000000000031' WHERE service_id = 'dce8d339-3d69-4782-9e6f-6113cd7f217d';
INSERT INTO professional_services (professional_id, service_id) SELECT professional_id, '10000000-0000-0000-0000-000000000031' FROM professional_services WHERE service_id = 'dce8d339-3d69-4782-9e6f-6113cd7f217d' ON CONFLICT DO NOTHING;
DELETE FROM professional_services WHERE service_id = 'dce8d339-3d69-4782-9e6f-6113cd7f217d';
DELETE FROM services WHERE id = 'dce8d339-3d69-4782-9e6f-6113cd7f217d';

-- Processing: Tratamento Estrias (SWAP)
UPDATE appointment_services SET service_id = '08eebba7-65bd-45c2-ab3b-c9d86ac5c1be' WHERE service_id = '10000000-0000-0000-0000-000000000034';
INSERT INTO professional_services (professional_id, service_id) SELECT professional_id, '08eebba7-65bd-45c2-ab3b-c9d86ac5c1be' FROM professional_services WHERE service_id = '10000000-0000-0000-0000-000000000034' ON CONFLICT DO NOTHING;
DELETE FROM professional_services WHERE service_id = '10000000-0000-0000-0000-000000000034';
DELETE FROM services WHERE id = '10000000-0000-0000-0000-000000000034';

-- Processing: Limpeza de Pele (MERGE_TO_KEEP)
UPDATE appointment_services SET service_id = '10000000-0000-0000-0000-000000000041' WHERE service_id = '2384954f-4d3c-496e-a963-801c7118c33d';
INSERT INTO professional_services (professional_id, service_id) SELECT professional_id, '10000000-0000-0000-0000-000000000041' FROM professional_services WHERE service_id = '2384954f-4d3c-496e-a963-801c7118c33d' ON CONFLICT DO NOTHING;
DELETE FROM professional_services WHERE service_id = '2384954f-4d3c-496e-a963-801c7118c33d';
DELETE FROM services WHERE id = '2384954f-4d3c-496e-a963-801c7118c33d';

-- Processing: Dermaplaning (SWAP)
UPDATE appointment_services SET service_id = 'e651c272-fb95-43a4-b69e-9ff17ca58760' WHERE service_id = '10000000-0000-0000-0000-000000000056';
INSERT INTO professional_services (professional_id, service_id) SELECT professional_id, 'e651c272-fb95-43a4-b69e-9ff17ca58760' FROM professional_services WHERE service_id = '10000000-0000-0000-0000-000000000056' ON CONFLICT DO NOTHING;
DELETE FROM professional_services WHERE service_id = '10000000-0000-0000-0000-000000000056';
DELETE FROM services WHERE id = '10000000-0000-0000-0000-000000000056';

-- Processing: Designer com Henna (MERGE_TO_KEEP)
UPDATE appointment_services SET service_id = '10000000-0000-0000-0000-000000000075' WHERE service_id = '5886d74f-acb0-49bc-b666-35d6c53ad486';
INSERT INTO professional_services (professional_id, service_id) SELECT professional_id, '10000000-0000-0000-0000-000000000075' FROM professional_services WHERE service_id = '5886d74f-acb0-49bc-b666-35d6c53ad486' ON CONFLICT DO NOTHING;
DELETE FROM professional_services WHERE service_id = '5886d74f-acb0-49bc-b666-35d6c53ad486';
DELETE FROM services WHERE id = '5886d74f-acb0-49bc-b666-35d6c53ad486';

-- Processing: Unha Pé e Mão (MERGE_TO_KEEP)
UPDATE appointment_services SET service_id = '10000000-0000-0000-0000-000000000080' WHERE service_id = '6ebfc334-9d58-44c6-94fe-be99fbe4a55a';
INSERT INTO professional_services (professional_id, service_id) SELECT professional_id, '10000000-0000-0000-0000-000000000080' FROM professional_services WHERE service_id = '6ebfc334-9d58-44c6-94fe-be99fbe4a55a' ON CONFLICT DO NOTHING;
DELETE FROM professional_services WHERE service_id = '6ebfc334-9d58-44c6-94fe-be99fbe4a55a';
DELETE FROM services WHERE id = '6ebfc334-9d58-44c6-94fe-be99fbe4a55a';

-- Processing: Esmaltação em Gel (MERGE_TO_KEEP)
UPDATE appointment_services SET service_id = '10000000-0000-0000-0000-000000000087' WHERE service_id = 'ca86b241-767b-43d3-9981-199f9d62e09e';
INSERT INTO professional_services (professional_id, service_id) SELECT professional_id, '10000000-0000-0000-0000-000000000087' FROM professional_services WHERE service_id = 'ca86b241-767b-43d3-9981-199f9d62e09e' ON CONFLICT DO NOTHING;
DELETE FROM professional_services WHERE service_id = 'ca86b241-767b-43d3-9981-199f9d62e09e';
DELETE FROM services WHERE id = 'ca86b241-767b-43d3-9981-199f9d62e09e';

-- Processing: Esmaltação em Gel Pé (MERGE_TO_KEEP)
UPDATE appointment_services SET service_id = '10000000-0000-0000-0000-000000000088' WHERE service_id = '632f1956-cde3-40ad-9719-14fee45e5fd3';
INSERT INTO professional_services (professional_id, service_id) SELECT professional_id, '10000000-0000-0000-0000-000000000088' FROM professional_services WHERE service_id = '632f1956-cde3-40ad-9719-14fee45e5fd3' ON CONFLICT DO NOTHING;
DELETE FROM professional_services WHERE service_id = '632f1956-cde3-40ad-9719-14fee45e5fd3';
DELETE FROM services WHERE id = '632f1956-cde3-40ad-9719-14fee45e5fd3';

-- Processing: Carboxterapia (MERGE_TO_KEEP)
UPDATE appointment_services SET service_id = 'd19377b8-bf2d-4254-b2fd-fd78c51eaefd' WHERE service_id = '10000000-0000-0000-0000-000000000038';
INSERT INTO professional_services (professional_id, service_id) SELECT professional_id, 'd19377b8-bf2d-4254-b2fd-fd78c51eaefd' FROM professional_services WHERE service_id = '10000000-0000-0000-0000-000000000038' ON CONFLICT DO NOTHING;
DELETE FROM professional_services WHERE service_id = '10000000-0000-0000-0000-000000000038';
DELETE FROM services WHERE id = '10000000-0000-0000-0000-000000000038';

-- Processing: Manutenção de Sobrancelhas (menos de 1 ano) (MERGE_TO_KEEP)
UPDATE appointment_services SET service_id = '3a5a303b-f637-4020-adb0-0404f604335b' WHERE service_id = '10000000-0000-0000-0000-000000000060';
INSERT INTO professional_services (professional_id, service_id) SELECT professional_id, '3a5a303b-f637-4020-adb0-0404f604335b' FROM professional_services WHERE service_id = '10000000-0000-0000-0000-000000000060' ON CONFLICT DO NOTHING;
DELETE FROM professional_services WHERE service_id = '10000000-0000-0000-0000-000000000060';
DELETE FROM services WHERE id = '10000000-0000-0000-0000-000000000060';

-- Processing: Manutenção Labial (menos de 1 ano) (MERGE_TO_KEEP)
UPDATE appointment_services SET service_id = 'a157c8d4-1f9a-40df-b4e3-74ecf1da71b6' WHERE service_id = '10000000-0000-0000-0000-000000000062';
INSERT INTO professional_services (professional_id, service_id) SELECT professional_id, 'a157c8d4-1f9a-40df-b4e3-74ecf1da71b6' FROM professional_services WHERE service_id = '10000000-0000-0000-0000-000000000062' ON CONFLICT DO NOTHING;
DELETE FROM professional_services WHERE service_id = '10000000-0000-0000-0000-000000000062';
DELETE FROM services WHERE id = '10000000-0000-0000-0000-000000000062';

-- Processing: Manutenção Olho (menos de 1 ano) (MERGE_TO_KEEP)
UPDATE appointment_services SET service_id = '50edd1ab-2045-4a0f-a2f3-260068ce1035' WHERE service_id = '10000000-0000-0000-0000-000000000064';
INSERT INTO professional_services (professional_id, service_id) SELECT professional_id, '50edd1ab-2045-4a0f-a2f3-260068ce1035' FROM professional_services WHERE service_id = '10000000-0000-0000-0000-000000000064' ON CONFLICT DO NOTHING;
DELETE FROM professional_services WHERE service_id = '10000000-0000-0000-0000-000000000064';
DELETE FROM services WHERE id = '10000000-0000-0000-0000-000000000064';

COMMIT;