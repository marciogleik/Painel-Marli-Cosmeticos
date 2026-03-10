-- Audit: Appointments without services
SELECT count(*) as total_missing
FROM appointments a
LEFT JOIN appointment_services as_link ON a.id = as_link.appointment_id
WHERE as_link.id IS NULL
AND a.status != 'cancelado';

-- Audit: Potential name mismatches (Client ID exists but name is different)
SELECT a.id, a.client_name, c.full_name
FROM appointments a
JOIN clients c ON a.client_id = c.id
WHERE a.client_name != c.full_name
LIMIT 100;

-- Audit: Appointments by status
SELECT status, count(*)
FROM appointments
GROUP BY status;
