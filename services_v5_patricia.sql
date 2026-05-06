-- CLEANUP & INSERT: Patrícia Armanda (Nail Designer) Updates
BEGIN;

-- ==========================================
-- 1. MERGE "Manutenção Banho de Gel" (...089) -> "Banho de Gel" (...086)
-- ==========================================
-- Migrating 73 appointments
UPDATE appointment_services 
SET service_id = '10000000-0000-0000-0000-000000000086' 
WHERE service_id = '10000000-0000-0000-0000-000000000089';

-- Migrating professional links
INSERT INTO professional_services (professional_id, service_id) 
SELECT professional_id, '10000000-0000-0000-0000-000000000086' 
FROM professional_services 
WHERE service_id = '10000000-0000-0000-0000-000000000089' 
ON CONFLICT DO NOTHING;

DELETE FROM professional_services WHERE service_id = '10000000-0000-0000-0000-000000000089';
DELETE FROM services WHERE id = '10000000-0000-0000-0000-000000000089';

-- ==========================================
-- 2. INSERT 4 NEW SERVICES
-- ==========================================
-- Using temporary variables to store new IDs for professional mapping
DO $$
DECLARE
  fibra_dec_id UUID := gen_random_uuid();
  manut_dec_id UUID := gen_random_uuid();
  gel_dec_id   UUID := gen_random_uuid();
  repos_id     UUID := gen_random_uuid();
  
  patricia_id  UUID := '00000000-0000-0000-0000-000000000007';
  luciane_id   UUID := '00000000-0000-0000-0000-000000000003';
BEGIN
  -- Insert Services
  INSERT INTO services (id, name, base_price, duration_minutes, price_note, requires_evaluation, created_at, updated_at)
  VALUES 
    (fibra_dec_id, 'Aplicação Fibra Decorada', 220.00, 140, NULL, false, NOW(), NOW()),
    (manut_dec_id, 'Manutenção Decorada', 180.00, 120, NULL, false, NOW(), NOW()),
    (gel_dec_id,   'Banho de Gel Decorado', 180.00, 105, NULL, false, NOW(), NOW()),
    (repos_id,     'Reposição de Unha', 15.00, 15, 'R$ 15 e 15min por unha — se mais de 1, confirmar com cliente', false, NOW(), NOW());

  -- Insert Professional Links
  -- Fibra Decorada -> Patricia
  INSERT INTO professional_services (professional_id, service_id) VALUES (patricia_id, fibra_dec_id);
  -- Manutenção Decorada -> Patricia
  INSERT INTO professional_services (professional_id, service_id) VALUES (patricia_id, manut_dec_id);
  -- Banho de Gel Decorado -> Patricia
  INSERT INTO professional_services (professional_id, service_id) VALUES (patricia_id, gel_dec_id);
  -- Reposição de Unha -> Patricia & Luciane
  INSERT INTO professional_services (professional_id, service_id) VALUES (patricia_id, repos_id);
  INSERT INTO professional_services (professional_id, service_id) VALUES (luciane_id, repos_id);

END $$;

-- ==========================================
-- 3. FINAL VALIDATION
-- ==========================================
DO $$
DECLARE total_after INT;
BEGIN
  SELECT COUNT(*) INTO total_after FROM services;
  IF total_after != 101 THEN
    RAISE EXCEPTION 'Total services unexpected: %. Expected 101.', total_after;
  END IF;
END $$;

COMMIT;
