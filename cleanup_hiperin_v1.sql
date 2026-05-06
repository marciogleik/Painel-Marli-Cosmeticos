-- CLEANUP SQL: Consolidating Hiperin records into Peeling Químico
BEGIN;

-- 1. Processing: Hiperin Químico (10000000-0000-0000-0000-000000000099)
-- Migrating any potential appointments
UPDATE appointment_services 
SET service_id = '10000000-0000-0000-0000-000000000094' 
WHERE service_id = '10000000-0000-0000-0000-000000000099';

-- Migrating potential professional links
INSERT INTO professional_services (professional_id, service_id) 
SELECT professional_id, '10000000-0000-0000-0000-000000000094' 
FROM professional_services 
WHERE service_id = '10000000-0000-0000-0000-000000000099' 
ON CONFLICT DO NOTHING;

DELETE FROM professional_services WHERE service_id = '10000000-0000-0000-0000-000000000099';
DELETE FROM services WHERE id = '10000000-0000-0000-0000-000000000099';

-- 2. Processing: HIPERIN QUIMICO (ab1aec1c-4837-423b-88ce-15184b9bb413)
-- Migrating any potential appointments
UPDATE appointment_services 
SET service_id = '10000000-0000-0000-0000-000000000094' 
WHERE service_id = 'ab1aec1c-4837-423b-88ce-15184b9bb413';

-- Migrating potential professional links
INSERT INTO professional_services (professional_id, service_id) 
SELECT professional_id, '10000000-0000-0000-0000-000000000094' 
FROM professional_services 
WHERE service_id = 'ab1aec1c-4837-423b-88ce-15184b9bb413' 
ON CONFLICT DO NOTHING;

DELETE FROM professional_services WHERE service_id = 'ab1aec1c-4837-423b-88ce-15184b9bb413';
DELETE FROM services WHERE id = 'ab1aec1c-4837-423b-88ce-15184b9bb413';

-- ==========================================
-- VALIDATION: Confirm both records are gone
-- ==========================================
DO $$
DECLARE
  remaining_dups INT;
BEGIN
  SELECT COUNT(*) INTO remaining_dups 
  FROM services 
  WHERE id IN (
    '10000000-0000-0000-0000-000000000099',
    'ab1aec1c-4837-423b-88ce-15184b9bb413'
  );

  IF remaining_dups != 0 THEN
    RAISE EXCEPTION 'Cleanup incomplete: % Hiperin records still exist', remaining_dups;
  END IF;
END $$;

COMMIT;
