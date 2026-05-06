-- CLEANUP SQL: Duplicate Service Removal & Migration v3
BEGIN;

-- Processing: Injetáveis (MERGE_TO_KEEP)
-- Migrating 1078 appointments from e31fd035-6ce0-4883-bffe-8dc9a16c8c7a to 10000000-0000-0000-0000-000000000083
UPDATE appointment_services 
SET service_id = '10000000-0000-0000-0000-000000000083' 
WHERE service_id = 'e31fd035-6ce0-4883-bffe-8dc9a16c8c7a';

-- Defensive: handle any professional_services that may have appeared since impact report
INSERT INTO professional_services (professional_id, service_id) 
SELECT professional_id, '10000000-0000-0000-0000-000000000083' 
FROM professional_services 
WHERE service_id = 'e31fd035-6ce0-4883-bffe-8dc9a16c8c7a' 
ON CONFLICT DO NOTHING;

DELETE FROM professional_services WHERE service_id = 'e31fd035-6ce0-4883-bffe-8dc9a16c8c7a';
DELETE FROM services WHERE id = 'e31fd035-6ce0-4883-bffe-8dc9a16c8c7a';

-- Processing: Alongamento de Unha Fibra (MERGE_TO_KEEP)
-- Migrating 217 appointments from e2c80295-0033-4c71-ad11-60ba502c99d2 to 10000000-0000-0000-0000-000000000085
UPDATE appointment_services 
SET service_id = '10000000-0000-0000-0000-000000000085' 
WHERE service_id = 'e2c80295-0033-4c71-ad11-60ba502c99d2';

-- Defensive: handle any professional_services that may have appeared since impact report
INSERT INTO professional_services (professional_id, service_id) 
SELECT professional_id, '10000000-0000-0000-0000-000000000085' 
FROM professional_services 
WHERE service_id = 'e2c80295-0033-4c71-ad11-60ba502c99d2' 
ON CONFLICT DO NOTHING;

DELETE FROM professional_services WHERE service_id = 'e2c80295-0033-4c71-ad11-60ba502c99d2';
DELETE FROM services WHERE id = 'e2c80295-0033-4c71-ad11-60ba502c99d2';

-- ==========================================
-- VALIDATION: Confirm both duplicates are gone
-- ==========================================
DO $$
DECLARE
  remaining_dups INT;
BEGIN
  SELECT COUNT(*) INTO remaining_dups 
  FROM services 
  WHERE id IN (
    'e31fd035-6ce0-4883-bffe-8dc9a16c8c7a',
    'e2c80295-0033-4c71-ad11-60ba502c99d2'
  );
  IF remaining_dups != 0 THEN
    RAISE EXCEPTION 'Cleanup incomplete: % duplicates still exist', remaining_dups;
  END IF;
END $$;

COMMIT;
