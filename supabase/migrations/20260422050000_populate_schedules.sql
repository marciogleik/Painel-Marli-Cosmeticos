-- Popular professional_schedules com os horários de trabalho reais
-- Baseado nos bloqueios conhecidos e horário da clínica (Seg-Sáb 09:00-17:00)
-- day_of_week: 0=Domingo, 1=Segunda, ..., 6=Sábado

-- Dhionara Sbrussi (Micropigmentação) — Seg a Sáb 09:00-17:00
INSERT INTO professional_schedules (professional_id, day_of_week, start_time, end_time, is_active)
SELECT '00000000-0000-0000-0000-000000000001', d, '09:00'::time, '17:00'::time, true
FROM generate_series(1, 6) AS d  -- Segunda a Sábado
ON CONFLICT (professional_id, day_of_week) DO UPDATE SET start_time = EXCLUDED.start_time, end_time = EXCLUDED.end_time, is_active = true;

-- Dhiani Sbrussi (Corporal/Estética) — Seg a Sáb 09:00-17:00
INSERT INTO professional_schedules (professional_id, day_of_week, start_time, end_time, is_active)
SELECT '00000000-0000-0000-0000-000000000002', d, '09:00'::time, '17:00'::time, true
FROM generate_series(1, 6) AS d
ON CONFLICT (professional_id, day_of_week) DO UPDATE SET start_time = EXCLUDED.start_time, end_time = EXCLUDED.end_time, is_active = true;

-- Luciane Castanheira (Manicure/Pedicure) — Seg a Sáb 09:00-17:00
INSERT INTO professional_schedules (professional_id, day_of_week, start_time, end_time, is_active)
SELECT '00000000-0000-0000-0000-000000000003', d, '09:00'::time, '17:00'::time, true
FROM generate_series(1, 6) AS d
ON CONFLICT (professional_id, day_of_week) DO UPDATE SET start_time = EXCLUDED.start_time, end_time = EXCLUDED.end_time, is_active = true;

-- Tais Pires (Estética/Depilação) — Seg a Sáb 09:00-17:00
INSERT INTO professional_schedules (professional_id, day_of_week, start_time, end_time, is_active)
SELECT '00000000-0000-0000-0000-000000000004', d, '09:00'::time, '17:00'::time, true
FROM generate_series(1, 6) AS d
ON CONFLICT (professional_id, day_of_week) DO UPDATE SET start_time = EXCLUDED.start_time, end_time = EXCLUDED.end_time, is_active = true;

-- Bruna Castanheira (Biomédica/Injetáveis) — Seg a Sáb 09:00-17:00
INSERT INTO professional_schedules (professional_id, day_of_week, start_time, end_time, is_active)
SELECT '00000000-0000-0000-0000-000000000005', d, '09:00'::time, '17:00'::time, true
FROM generate_series(1, 6) AS d
ON CONFLICT (professional_id, day_of_week) DO UPDATE SET start_time = EXCLUDED.start_time, end_time = EXCLUDED.end_time, is_active = true;

-- Michele Quintana (Enfermeira/Injetáveis) — Seg a Sáb 09:00-17:00
INSERT INTO professional_schedules (professional_id, day_of_week, start_time, end_time, is_active)
SELECT '00000000-0000-0000-0000-000000000006', d, '09:00'::time, '17:00'::time, true
FROM generate_series(1, 6) AS d
ON CONFLICT (professional_id, day_of_week) DO UPDATE SET start_time = EXCLUDED.start_time, end_time = EXCLUDED.end_time, is_active = true;

-- Patricia Amanda (Nail Designer) — Seg a Sáb 09:00-17:00
INSERT INTO professional_schedules (professional_id, day_of_week, start_time, end_time, is_active)
SELECT '00000000-0000-0000-0000-000000000007', d, '09:00'::time, '17:00'::time, true
FROM generate_series(1, 6) AS d
ON CONFLICT (professional_id, day_of_week) DO UPDATE SET start_time = EXCLUDED.start_time, end_time = EXCLUDED.end_time, is_active = true;
