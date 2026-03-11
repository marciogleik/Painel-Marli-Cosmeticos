BEGIN;
DO $$
DECLARE
    v_appointment_id UUID;
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM appointments 
        WHERE date = '2026-02-05' 
          AND start_time = '08:00:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000004' 
          AND (client_name = 'Maria Aracy Gunter de Oliveira' OR client_phone = '(66) 98409-9130')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Maria Aracy Gunter de Oliveira', '(66) 98409-9130', '00000000-0000-0000-0000-000000000004', '2026-02-05', '08:00:00', '08:30:00', 'atendido', '', 'Tais Pires')
        RETURNING id INTO v_appointment_id;

        INSERT INTO appointment_services (appointment_id, service_name, duration_minutes)
        VALUES (v_appointment_id, 'Designer de Sobrancelhas', 30);
    END IF;
END $$;

DO $$
DECLARE
    v_appointment_id UUID;
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM appointments 
        WHERE date = '2026-02-05' 
          AND start_time = '08:15:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000007' 
          AND (client_name = 'Patricia armanda' OR client_phone = '(66) 98102-1849')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Patricia armanda', '(66) 98102-1849', '00000000-0000-0000-0000-000000000007', '2026-02-05', '08:15:00', '08:45:00', 'agendado', '', 'Agendamento')
        RETURNING id INTO v_appointment_id;

        INSERT INTO appointment_services (appointment_id, service_name, duration_minutes)
        VALUES (v_appointment_id, 'Avaliação', 30);
    END IF;
END $$;

DO $$
DECLARE
    v_appointment_id UUID;
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM appointments 
        WHERE date = '2026-02-05' 
          AND start_time = '08:15:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000004' 
          AND (client_name = 'Patricia armanda' OR client_phone = '(66) 98102-1849')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Patricia armanda', '(66) 98102-1849', '00000000-0000-0000-0000-000000000004', '2026-02-05', '08:15:00', '08:45:00', 'atendido', '', 'Agendamento')
        RETURNING id INTO v_appointment_id;

        INSERT INTO appointment_services (appointment_id, service_name, duration_minutes)
        VALUES (v_appointment_id, 'Dermaplaming', 30);
    END IF;
END $$;

DO $$
DECLARE
    v_appointment_id UUID;
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM appointments 
        WHERE date = '2026-02-05' 
          AND start_time = '08:30:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000001' 
          AND (client_name = 'Erick Santos Rodrigues Cardoso' OR client_phone = '(66) 99233-7937')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Erick Santos Rodrigues Cardoso', '(66) 99233-7937', '00000000-0000-0000-0000-000000000001', '2026-02-05', '08:30:00', '09:00:00', 'atendido', 'tatuagem/braço', 'Dhionara Sbrussi')
        RETURNING id INTO v_appointment_id;

        INSERT INTO appointment_services (appointment_id, service_name, duration_minutes)
        VALUES (v_appointment_id, 'Avaliação', 30);
    END IF;
END $$;

DO $$
DECLARE
    v_appointment_id UUID;
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM appointments 
        WHERE date = '2026-02-05' 
          AND start_time = '08:45:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000004' 
          AND (client_name = 'Patricia armanda' OR client_phone = '(66) 98102-1849')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Patricia armanda', '(66) 98102-1849', '00000000-0000-0000-0000-000000000004', '2026-02-05', '08:45:00', '09:45:00', 'atendido', '', 'Agendamento')
        RETURNING id INTO v_appointment_id;

        INSERT INTO appointment_services (appointment_id, service_name, duration_minutes)
        VALUES (v_appointment_id, 'Limpeza De Pele', 60);
    END IF;
END $$;

DO $$
DECLARE
    v_appointment_id UUID;
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM appointments 
        WHERE date = '2026-02-05' 
          AND start_time = '09:00:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000002' 
          AND (client_name = 'Dhiani Sbrussi' OR client_phone = '(66) 99668-0462')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Dhiani Sbrussi', '(66) 99668-0462', '00000000-0000-0000-0000-000000000002', '2026-02-05', '09:00:00', '09:30:00', 'agendado', '', 'Dhiani Sbrussi')
        RETURNING id INTO v_appointment_id;

        INSERT INTO appointment_services (appointment_id, service_name, duration_minutes)
        VALUES (v_appointment_id, 'Esmaltação em gel', 30);
    END IF;
END $$;

DO $$
DECLARE
    v_appointment_id UUID;
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM appointments 
        WHERE date = '2026-02-05' 
          AND start_time = '09:00:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000007' 
          AND (client_name = 'Dhiani Sbrussi' OR client_phone = '(66) 99668-0462')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Dhiani Sbrussi', '(66) 99668-0462', '00000000-0000-0000-0000-000000000007', '2026-02-05', '09:00:00', '09:30:00', 'atendido', '', 'Patricia Armanda')
        RETURNING id INTO v_appointment_id;

        INSERT INTO appointment_services (appointment_id, service_name, duration_minutes)
        VALUES (v_appointment_id, 'Esmaltação em gel', 30);
    END IF;
END $$;

DO $$
DECLARE
    v_appointment_id UUID;
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM appointments 
        WHERE date = '2026-02-05' 
          AND start_time = '09:00:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000004' 
          AND (client_name = 'Liamara Floss Vitoeino da Silva' OR client_phone = '(66) 99925-3534')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Liamara Floss Vitoeino da Silva', '(66) 99925-3534', '00000000-0000-0000-0000-000000000004', '2026-02-05', '09:00:00', '09:30:00', 'atendido', '', 'Agendamento')
        RETURNING id INTO v_appointment_id;

        INSERT INTO appointment_services (appointment_id, service_name, duration_minutes)
        VALUES (v_appointment_id, 'Designer de Sobrancelhas', 30);
    END IF;
END $$;

DO $$
DECLARE
    v_appointment_id UUID;
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM appointments 
        WHERE date = '2026-02-05' 
          AND start_time = '09:00:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000003' 
          AND (client_name = 'Barbara Roberta Peixoto Rodrigues' OR client_phone = '(66) 99219-7321')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Barbara Roberta Peixoto Rodrigues', '(66) 99219-7321', '00000000-0000-0000-0000-000000000003', '2026-02-05', '09:00:00', '10:00:00', 'cancelado', '', 'Dhionara Sbrussi')
        RETURNING id INTO v_appointment_id;

        INSERT INTO appointment_services (appointment_id, service_name, duration_minutes)
        VALUES (v_appointment_id, 'Unha Pé e mão', 60);
    END IF;
END $$;

DO $$
DECLARE
    v_appointment_id UUID;
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM appointments 
        WHERE date = '2026-02-05' 
          AND start_time = '09:15:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000001' 
          AND (client_name = 'Iliane W. Gabe' OR client_phone = '(66) 99958-9120')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Iliane W. Gabe', '(66) 99958-9120', '00000000-0000-0000-0000-000000000001', '2026-02-05', '09:15:00', '09:45:00', 'atendido', '', 'Rafaela')
        RETURNING id INTO v_appointment_id;

        INSERT INTO appointment_services (appointment_id, service_name, duration_minutes)
        VALUES (v_appointment_id, 'Manutenção de Sobrancelhas Menos de um ano', 30);
    END IF;
END $$;

DO $$
DECLARE
    v_appointment_id UUID;
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM appointments 
        WHERE date = '2026-02-05' 
          AND start_time = '09:15:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000004' 
          AND (client_name = 'Natalia Gomes' OR client_phone = '(51) 99680-0594')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Natalia Gomes', '(51) 99680-0594', '00000000-0000-0000-0000-000000000004', '2026-02-05', '09:15:00', '09:45:00', 'atendido', '', 'Tais Pires')
        RETURNING id INTO v_appointment_id;

        INSERT INTO appointment_services (appointment_id, service_name, duration_minutes)
        VALUES (v_appointment_id, 'Depilação Facial', 30);
    END IF;
END $$;

DO $$
DECLARE
    v_appointment_id UUID;
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM appointments 
        WHERE date = '2026-02-05' 
          AND start_time = '09:30:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000004' 
          AND (client_name = 'Laura Daiana Rodrigues de Oliveira' OR client_phone = '(66) 98114-4858')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Laura Daiana Rodrigues de Oliveira', '(66) 98114-4858', '00000000-0000-0000-0000-000000000004', '2026-02-05', '09:30:00', '10:30:00', 'atendido', 'QUER O BB GLOW JA VENDI PRA ELA PCT', 'Agendamento')
        RETURNING id INTO v_appointment_id;

        INSERT INTO appointment_services (appointment_id, service_name, duration_minutes)
        VALUES (v_appointment_id, 'Limpeza De Pele', 60);
    END IF;
END $$;

DO $$
DECLARE
    v_appointment_id UUID;
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM appointments 
        WHERE date = '2026-02-05' 
          AND start_time = '10:30:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000006' 
          AND (client_name = 'Dhiani Sbrussi' OR client_phone = '(66) 99668-0462')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Dhiani Sbrussi', '(66) 99668-0462', '00000000-0000-0000-0000-000000000006', '2026-02-05', '10:30:00', '11:00:00', 'agendado', '', 'Dhiani Sbrussi')
        RETURNING id INTO v_appointment_id;

        INSERT INTO appointment_services (appointment_id, service_name, duration_minutes)
        VALUES (v_appointment_id, 'Avaliação', 30);
    END IF;
END $$;

DO $$
DECLARE
    v_appointment_id UUID;
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM appointments 
        WHERE date = '2026-02-05' 
          AND start_time = '10:30:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000002' 
          AND (client_name = 'Michele Angrizano Quintana' OR client_phone = '(66) 99217-0456')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Michele Angrizano Quintana', '(66) 99217-0456', '00000000-0000-0000-0000-000000000002', '2026-02-05', '10:30:00', '11:00:00', 'cancelado', '', 'Dhiani Sbrussi')
        RETURNING id INTO v_appointment_id;

        INSERT INTO appointment_services (appointment_id, service_name, duration_minutes)
        VALUES (v_appointment_id, 'Tratamento corporal', 30);
    END IF;
END $$;

DO $$
DECLARE
    v_appointment_id UUID;
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM appointments 
        WHERE date = '2026-02-05' 
          AND start_time = '11:00:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000004' 
          AND (client_name = 'Patricia Pinton Dos Santos Garrutti' OR client_phone = '(66) 99975-4661')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Patricia Pinton Dos Santos Garrutti', '(66) 99975-4661', '00000000-0000-0000-0000-000000000004', '2026-02-05', '11:00:00', '11:30:00', 'atendido', '13/30', 'Tais Pires')
        RETURNING id INTO v_appointment_id;

        INSERT INTO appointment_services (appointment_id, service_name, duration_minutes)
        VALUES (v_appointment_id, 'Designer Com Henna', 30);
    END IF;
END $$;

DO $$
DECLARE
    v_appointment_id UUID;
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM appointments 
        WHERE date = '2026-02-05' 
          AND start_time = '11:15:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000004' 
          AND (client_name = 'Cyntia Otacilia' OR client_phone = '(66) 99257-7831')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Cyntia Otacilia', '(66) 99257-7831', '00000000-0000-0000-0000-000000000004', '2026-02-05', '11:15:00', '11:45:00', 'atendido', '', 'Agendamento')
        RETURNING id INTO v_appointment_id;

        INSERT INTO appointment_services (appointment_id, service_name, duration_minutes)
        VALUES (v_appointment_id, 'Designer Com Henna', 30);
    END IF;
END $$;

DO $$
DECLARE
    v_appointment_id UUID;
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM appointments 
        WHERE date = '2026-02-05' 
          AND start_time = '13:30:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000001' 
          AND (client_name = 'Eni dos Reis Batista' OR client_phone = '(66) 99613-2212')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Eni dos Reis Batista', '(66) 99613-2212', '00000000-0000-0000-0000-000000000001', '2026-02-05', '13:30:00', '14:00:00', 'falta', '', 'Agendamento')
        RETURNING id INTO v_appointment_id;

        INSERT INTO appointment_services (appointment_id, service_name, duration_minutes)
        VALUES (v_appointment_id, 'Retorno Sobrancelhas', 30);
    END IF;
END $$;

DO $$
DECLARE
    v_appointment_id UUID;
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM appointments 
        WHERE date = '2026-02-05' 
          AND start_time = '13:30:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000006' 
          AND (client_name = 'Juliane' OR client_phone = '(66) 98410-1970')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Juliane', '(66) 98410-1970', '00000000-0000-0000-0000-000000000006', '2026-02-05', '13:30:00', '14:00:00', 'atendido', '', 'Agendamento')
        RETURNING id INTO v_appointment_id;

        INSERT INTO appointment_services (appointment_id, service_name, duration_minutes)
        VALUES (v_appointment_id, 'Injetaveis', 30);
    END IF;
END $$;

DO $$
DECLARE
    v_appointment_id UUID;
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM appointments 
        WHERE date = '2026-02-05' 
          AND start_time = '14:00:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000005' 
          AND (client_name = 'Aniele Tumelero Schineider' OR client_phone = '(66) 99230-1804')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Aniele Tumelero Schineider', '(66) 99230-1804', '00000000-0000-0000-0000-000000000005', '2026-02-05', '14:00:00', '14:30:00', 'atendido', 'Retorno botox', 'Bruna Castanheira')
        RETURNING id INTO v_appointment_id;

        INSERT INTO appointment_services (appointment_id, service_name, duration_minutes)
        VALUES (v_appointment_id, 'Retorno de Procedimento', 30);
    END IF;
END $$;

DO $$
DECLARE
    v_appointment_id UUID;
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM appointments 
        WHERE date = '2026-02-05' 
          AND start_time = '14:00:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000006' 
          AND (client_name = 'Michele Angrizano Quintana' OR client_phone = '(66) 99217-0456')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Michele Angrizano Quintana', '(66) 99217-0456', '00000000-0000-0000-0000-000000000006', '2026-02-05', '14:00:00', '14:30:00', 'agendado', '', 'Michele Quintana')
        RETURNING id INTO v_appointment_id;

        INSERT INTO appointment_services (appointment_id, service_name, duration_minutes)
        VALUES (v_appointment_id, 'Avaliação', 30);
    END IF;
END $$;

DO $$
DECLARE
    v_appointment_id UUID;
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM appointments 
        WHERE date = '2026-02-05' 
          AND start_time = '14:00:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000001' 
          AND (client_name = 'Eliane Ribeiro' OR client_phone = '(66) 99625-6692')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Eliane Ribeiro', '(66) 99625-6692', '00000000-0000-0000-0000-000000000001', '2026-02-05', '14:00:00', '14:30:00', 'atendido', '', 'Rafaela')
        RETURNING id INTO v_appointment_id;

        INSERT INTO appointment_services (appointment_id, service_name, duration_minutes)
        VALUES (v_appointment_id, 'Despigmentação', 30);
    END IF;
END $$;

DO $$
DECLARE
    v_appointment_id UUID;
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM appointments 
        WHERE date = '2026-02-05' 
          AND start_time = '14:00:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000007' 
          AND (client_name = 'Renata Maia Solto Fernandes' OR client_phone = '(66) 99999-2202')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Renata Maia Solto Fernandes', '(66) 99999-2202', '00000000-0000-0000-0000-000000000007', '2026-02-05', '14:00:00', '14:30:00', 'atendido', '', 'Rafaela')
        RETURNING id INTO v_appointment_id;

        INSERT INTO appointment_services (appointment_id, service_name, duration_minutes)
        VALUES (v_appointment_id, 'Manutenção de Fibra', 30);
    END IF;
END $$;

DO $$
DECLARE
    v_appointment_id UUID;
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM appointments 
        WHERE date = '2026-02-05' 
          AND start_time = '14:00:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000003' 
          AND (client_name = 'Renata Maia Solto Fernandes' OR client_phone = '(66) 99999-2202')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Renata Maia Solto Fernandes', '(66) 99999-2202', '00000000-0000-0000-0000-000000000003', '2026-02-05', '14:00:00', '15:00:00', 'atendido', '', 'Rafaela')
        RETURNING id INTO v_appointment_id;

        INSERT INTO appointment_services (appointment_id, service_name, duration_minutes)
        VALUES (v_appointment_id, 'Unha Pé', 60);
    END IF;
END $$;

DO $$
DECLARE
    v_appointment_id UUID;
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM appointments 
        WHERE date = '2026-02-05' 
          AND start_time = '14:00:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000002' 
          AND (client_name = 'Jow Silva' OR client_phone = '(66) 98401-0335')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Jow Silva', '(66) 98401-0335', '00000000-0000-0000-0000-000000000002', '2026-02-05', '14:00:00', '14:30:00', 'falta', '', 'Dhionara Sbrussi')
        RETURNING id INTO v_appointment_id;

        INSERT INTO appointment_services (appointment_id, service_name, duration_minutes)
        VALUES (v_appointment_id, 'Massagem', 30);
    END IF;
END $$;

DO $$
DECLARE
    v_appointment_id UUID;
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM appointments 
        WHERE date = '2026-02-05' 
          AND start_time = '14:15:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000004' 
          AND (client_name = 'Fabiana' OR client_phone = '(49) 99126-9861')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Fabiana', '(49) 99126-9861', '00000000-0000-0000-0000-000000000004', '2026-02-05', '14:15:00', '14:45:00', 'atendido', '', 'Agendamento')
        RETURNING id INTO v_appointment_id;

        INSERT INTO appointment_services (appointment_id, service_name, duration_minutes)
        VALUES (v_appointment_id, 'Designer de Sobrancelhas', 30);
    END IF;
END $$;

DO $$
DECLARE
    v_appointment_id UUID;
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM appointments 
        WHERE date = '2026-02-05' 
          AND start_time = '14:30:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000005' 
          AND (client_name = 'Caroline Mendel' OR client_phone = '(66) 98415-7178')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Caroline Mendel', '(66) 98415-7178', '00000000-0000-0000-0000-000000000005', '2026-02-05', '14:30:00', '15:00:00', 'espera', 'Retorno botox', 'Bruna Castanheira')
        RETURNING id INTO v_appointment_id;

        INSERT INTO appointment_services (appointment_id, service_name, duration_minutes)
        VALUES (v_appointment_id, 'Retorno de Procedimento', 30);
    END IF;
END $$;

DO $$
DECLARE
    v_appointment_id UUID;
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM appointments 
        WHERE date = '2026-02-05' 
          AND start_time = '14:30:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000001' 
          AND (client_name = 'Patricia Damaren' OR client_phone = '(66) 99661-5455')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Patricia Damaren', '(66) 99661-5455', '00000000-0000-0000-0000-000000000001', '2026-02-05', '14:30:00', '15:00:00', 'atendido', 'Anual', 'Rafaela')
        RETURNING id INTO v_appointment_id;

        INSERT INTO appointment_services (appointment_id, service_name, duration_minutes)
        VALUES (v_appointment_id, 'Manutenção de Sobrancelhas', 30);
    END IF;
END $$;

DO $$
DECLARE
    v_appointment_id UUID;
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM appointments 
        WHERE date = '2026-02-05' 
          AND start_time = '14:30:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000004' 
          AND (client_name = 'Bia Taileno Monteiro' OR client_phone = '(66) 99927-6996')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Bia Taileno Monteiro', '(66) 99927-6996', '00000000-0000-0000-0000-000000000004', '2026-02-05', '14:30:00', '15:00:00', 'atendido', '', 'Agendamento')
        RETURNING id INTO v_appointment_id;

        INSERT INTO appointment_services (appointment_id, service_name, duration_minutes)
        VALUES (v_appointment_id, 'Designer de Sobrancelhas', 30);
    END IF;
END $$;

DO $$
DECLARE
    v_appointment_id UUID;
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM appointments 
        WHERE date = '2026-02-05' 
          AND start_time = '14:30:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000006' 
          AND (client_name = 'JEFERSON ANTONIO' OR client_phone = '(66) 98407-9905')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('JEFERSON ANTONIO', '(66) 98407-9905', '00000000-0000-0000-0000-000000000006', '2026-02-05', '14:30:00', '15:00:00', 'confirmado', '', 'Dhionara Sbrussi')
        RETURNING id INTO v_appointment_id;

        INSERT INTO appointment_services (appointment_id, service_name, duration_minutes)
        VALUES (v_appointment_id, 'Injetaveis', 30);
    END IF;
END $$;

DO $$
DECLARE
    v_appointment_id UUID;
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM appointments 
        WHERE date = '2026-02-05' 
          AND start_time = '15:00:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000003' 
          AND (client_name = 'Marli Salete de Avila Sbrussi' OR client_phone = '(66) 98412-6906')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Marli Salete de Avila Sbrussi', '(66) 98412-6906', '00000000-0000-0000-0000-000000000003', '2026-02-05', '15:00:00', '16:00:00', 'atendido', '18/20', 'Rafaela')
        RETURNING id INTO v_appointment_id;

        INSERT INTO appointment_services (appointment_id, service_name, duration_minutes)
        VALUES (v_appointment_id, 'Unha Pé', 60);
    END IF;
END $$;

DO $$
DECLARE
    v_appointment_id UUID;
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM appointments 
        WHERE date = '2026-02-05' 
          AND start_time = '15:00:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000002' 
          AND (client_name = 'Geny Almeida Sobrinho' OR client_phone = '(66) 99988-3973')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Geny Almeida Sobrinho', '(66) 99988-3973', '00000000-0000-0000-0000-000000000002', '2026-02-05', '15:00:00', '15:30:00', 'atendido', '', 'Rafaela')
        RETURNING id INTO v_appointment_id;

        INSERT INTO appointment_services (appointment_id, service_name, duration_minutes)
        VALUES (v_appointment_id, 'Tratamento corporal', 30);
    END IF;
END $$;

DO $$
DECLARE
    v_appointment_id UUID;
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM appointments 
        WHERE date = '2026-02-05' 
          AND start_time = '15:15:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000004' 
          AND (client_name = 'Roseli Marta Seibt' OR client_phone = '(66) 99988-7028')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Roseli Marta Seibt', '(66) 99988-7028', '00000000-0000-0000-0000-000000000004', '2026-02-05', '15:15:00', '15:45:00', 'atendido', 'para o sobrinho', 'Tais Pires')
        RETURNING id INTO v_appointment_id;

        INSERT INTO appointment_services (appointment_id, service_name, duration_minutes)
        VALUES (v_appointment_id, 'Designer de Sobrancelhas', 30);
    END IF;
END $$;

DO $$
DECLARE
    v_appointment_id UUID;
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM appointments 
        WHERE date = '2026-02-05' 
          AND start_time = '15:30:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000004' 
          AND (client_name = 'Antonio Medeiros' OR client_phone = '(66) 99999-0522')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Antonio Medeiros', '(66) 99999-0522', '00000000-0000-0000-0000-000000000004', '2026-02-05', '15:30:00', '16:30:00', 'atendido', '', 'Tais Pires')
        RETURNING id INTO v_appointment_id;

        INSERT INTO appointment_services (appointment_id, service_name, duration_minutes)
        VALUES (v_appointment_id, 'Retorno limpeza de pele', 60);
    END IF;
END $$;

DO $$
DECLARE
    v_appointment_id UUID;
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM appointments 
        WHERE date = '2026-02-05' 
          AND start_time = '15:30:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000005' 
          AND (client_name = 'Meiryelen Fachinello' OR client_phone = '(66) 98401-6591')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Meiryelen Fachinello', '(66) 98401-6591', '00000000-0000-0000-0000-000000000005', '2026-02-05', '15:30:00', '17:00:00', 'atendido', '', 'Rafaela')
        RETURNING id INTO v_appointment_id;

        INSERT INTO appointment_services (appointment_id, service_name, duration_minutes)
        VALUES (v_appointment_id, 'Aplicação de Botox', 90);
    END IF;
END $$;

DO $$
DECLARE
    v_appointment_id UUID;
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM appointments 
        WHERE date = '2026-02-05' 
          AND start_time = '15:30:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000001' 
          AND (client_name = 'Jaqueline Alcantra Dias' OR client_phone = '(66) 98439-3893')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Jaqueline Alcantra Dias', '(66) 98439-3893', '00000000-0000-0000-0000-000000000001', '2026-02-05', '15:30:00', '16:00:00', 'atendido', '', 'Agendamento')
        RETURNING id INTO v_appointment_id;

        INSERT INTO appointment_services (appointment_id, service_name, duration_minutes)
        VALUES (v_appointment_id, 'Manutenção Labial', 30);
    END IF;
END $$;

DO $$
DECLARE
    v_appointment_id UUID;
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM appointments 
        WHERE date = '2026-02-05' 
          AND start_time = '15:30:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000001' 
          AND (client_name = 'Jaqueline Dias' OR client_phone = '(66) 99244-1724')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Jaqueline Dias', '(66) 99244-1724', '00000000-0000-0000-0000-000000000001', '2026-02-05', '15:30:00', '16:00:00', 'cancelado', '', 'Rafaela')
        RETURNING id INTO v_appointment_id;

        INSERT INTO appointment_services (appointment_id, service_name, duration_minutes)
        VALUES (v_appointment_id, 'Manutenção Labial', 30);
    END IF;
END $$;

DO $$
DECLARE
    v_appointment_id UUID;
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM appointments 
        WHERE date = '2026-02-05' 
          AND start_time = '15:30:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000006' 
          AND (client_name = 'Eliane souza' OR client_phone = '(66) 98412-0899')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Eliane souza', '(66) 98412-0899', '00000000-0000-0000-0000-000000000006', '2026-02-05', '15:30:00', '16:00:00', 'espera', '', 'Dhionara Sbrussi')
        RETURNING id INTO v_appointment_id;

        INSERT INTO appointment_services (appointment_id, service_name, duration_minutes)
        VALUES (v_appointment_id, 'Avaliação', 30);
    END IF;
END $$;

DO $$
DECLARE
    v_appointment_id UUID;
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM appointments 
        WHERE date = '2026-02-05' 
          AND start_time = '15:30:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000006' 
          AND (client_name = 'Isamara' OR client_phone = '(66) 98445-1138')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Isamara', '(66) 98445-1138', '00000000-0000-0000-0000-000000000006', '2026-02-05', '15:30:00', '16:00:00', 'atendido', '', 'Rafaela')
        RETURNING id INTO v_appointment_id;

        INSERT INTO appointment_services (appointment_id, service_name, duration_minutes)
        VALUES (v_appointment_id, 'Avaliação', 30);
    END IF;
END $$;

DO $$
DECLARE
    v_appointment_id UUID;
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM appointments 
        WHERE date = '2026-02-05' 
          AND start_time = '16:00:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000002' 
          AND (client_name = 'Daiany Priscilla Bueno da Silva' OR client_phone = '(62) 98170-0948')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Daiany Priscilla Bueno da Silva', '(62) 98170-0948', '00000000-0000-0000-0000-000000000002', '2026-02-05', '16:00:00', '16:30:00', 'atendido', '', 'Rafaela')
        RETURNING id INTO v_appointment_id;

        INSERT INTO appointment_services (appointment_id, service_name, duration_minutes)
        VALUES (v_appointment_id, 'Tratamento corporal', 30);
    END IF;
END $$;

DO $$
DECLARE
    v_appointment_id UUID;
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM appointments 
        WHERE date = '2026-02-05' 
          AND start_time = '16:00:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000001' 
          AND (client_name = 'Renata Maia Solto Fernandes' OR client_phone = '(66) 99999-2202')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Renata Maia Solto Fernandes', '(66) 99999-2202', '00000000-0000-0000-0000-000000000001', '2026-02-05', '16:00:00', '16:30:00', 'atendido', '', 'Rafaela')
        RETURNING id INTO v_appointment_id;

        INSERT INTO appointment_services (appointment_id, service_name, duration_minutes)
        VALUES (v_appointment_id, 'Designer de Sobrancelhas', 30);
    END IF;
END $$;

DO $$
DECLARE
    v_appointment_id UUID;
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM appointments 
        WHERE date = '2026-02-05' 
          AND start_time = '16:00:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000007' 
          AND (client_name = 'Helen' OR client_phone = '(66) 99619-8835')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Helen', '(66) 99619-8835', '00000000-0000-0000-0000-000000000007', '2026-02-05', '16:00:00', '16:30:00', 'espera', '', 'Dhionara Sbrussi')
        RETURNING id INTO v_appointment_id;

        INSERT INTO appointment_services (appointment_id, service_name, duration_minutes)
        VALUES (v_appointment_id, 'Banho de Gel', 30);
    END IF;
END $$;

DO $$
DECLARE
    v_appointment_id UUID;
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM appointments 
        WHERE date = '2026-02-05' 
          AND start_time = '16:09:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000006' 
          AND (client_name = 'Rosane de Albuquerque' OR client_phone = '(66) 99978-7196')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Rosane de Albuquerque', '(66) 99978-7196', '00000000-0000-0000-0000-000000000006', '2026-02-05', '16:09:00', '16:39:00', 'atendido', '', 'Rafaela')
        RETURNING id INTO v_appointment_id;

        INSERT INTO appointment_services (appointment_id, service_name, duration_minutes)
        VALUES (v_appointment_id, 'Injetaveis', 30);
    END IF;
END $$;

DO $$
DECLARE
    v_appointment_id UUID;
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM appointments 
        WHERE date = '2026-02-05' 
          AND start_time = '16:30:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000004' 
          AND (client_name = 'Maria fernanda Canide' OR client_phone = '(66) 98425-9503')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Maria fernanda Canide', '(66) 98425-9503', '00000000-0000-0000-0000-000000000004', '2026-02-05', '16:30:00', '17:00:00', 'atendido', '', 'Rafaela')
        RETURNING id INTO v_appointment_id;

        INSERT INTO appointment_services (appointment_id, service_name, duration_minutes)
        VALUES (v_appointment_id, 'Designer de Sobrancelhas', 30);
    END IF;
END $$;

DO $$
DECLARE
    v_appointment_id UUID;
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM appointments 
        WHERE date = '2026-02-05' 
          AND start_time = '16:30:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000006' 
          AND (client_name = 'DINAURA FRANCISCA DE SOUZA' OR client_phone = '(66) 99988-1067')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('DINAURA FRANCISCA DE SOUZA', '(66) 99988-1067', '00000000-0000-0000-0000-000000000006', '2026-02-05', '16:30:00', '17:00:00', 'atendido', '', 'Rafaela')
        RETURNING id INTO v_appointment_id;

        INSERT INTO appointment_services (appointment_id, service_name, duration_minutes)
        VALUES (v_appointment_id, 'Injetaveis', 30);
    END IF;
END $$;

DO $$
DECLARE
    v_appointment_id UUID;
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM appointments 
        WHERE date = '2026-02-05' 
          AND start_time = '16:45:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000004' 
          AND (client_name = 'Weslaine Maia' OR client_phone = '(66) 98126-6623')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Weslaine Maia', '(66) 98126-6623', '00000000-0000-0000-0000-000000000004', '2026-02-05', '16:45:00', '17:15:00', 'atendido', '', 'Rafaela')
        RETURNING id INTO v_appointment_id;

        INSERT INTO appointment_services (appointment_id, service_name, duration_minutes)
        VALUES (v_appointment_id, 'Depilação Virilha', 30);
    END IF;
END $$;

DO $$
DECLARE
    v_appointment_id UUID;
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM appointments 
        WHERE date = '2026-02-05' 
          AND start_time = '17:00:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000005' 
          AND (client_name = 'Debora Araujo' OR client_phone = '(66) 99984-1407')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Debora Araujo', '(66) 99984-1407', '00000000-0000-0000-0000-000000000005', '2026-02-05', '17:00:00', '17:30:00', 'atendido', '', 'Rafaela')
        RETURNING id INTO v_appointment_id;

        INSERT INTO appointment_services (appointment_id, service_name, duration_minutes)
        VALUES (v_appointment_id, 'Lavieen', 30);
    END IF;
END $$;

DO $$
DECLARE
    v_appointment_id UUID;
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM appointments 
        WHERE date = '2026-02-05' 
          AND start_time = '17:00:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000007' 
          AND (client_name = 'Milena Reichert Vedovatto' OR client_phone = '(54) 99150-9978')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Milena Reichert Vedovatto', '(54) 99150-9978', '00000000-0000-0000-0000-000000000007', '2026-02-05', '17:00:00', '17:30:00', 'atendido', '', 'Patricia Armanda')
        RETURNING id INTO v_appointment_id;

        INSERT INTO appointment_services (appointment_id, service_name, duration_minutes)
        VALUES (v_appointment_id, 'Manutenção de Fibra', 30);
    END IF;
END $$;

DO $$
DECLARE
    v_appointment_id UUID;
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM appointments 
        WHERE date = '2026-02-05' 
          AND start_time = '17:15:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000004' 
          AND (client_name = 'Weslaine Maia' OR client_phone = '(66) 98126-6623')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Weslaine Maia', '(66) 98126-6623', '00000000-0000-0000-0000-000000000004', '2026-02-05', '17:15:00', '17:45:00', 'atendido', '', 'Rafaela')
        RETURNING id INTO v_appointment_id;

        INSERT INTO appointment_services (appointment_id, service_name, duration_minutes)
        VALUES (v_appointment_id, 'Designer Com Henna', 30);
    END IF;
END $$;

DO $$
DECLARE
    v_appointment_id UUID;
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM appointments 
        WHERE date = '2026-02-05' 
          AND start_time = '17:30:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000005' 
          AND (client_name = 'Jociele Helena da Silva' OR client_phone = '(66) 98462-4215')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Jociele Helena da Silva', '(66) 98462-4215', '00000000-0000-0000-0000-000000000005', '2026-02-05', '17:30:00', '18:00:00', 'atendido', 'Retorno botox/ chegará as 17:45', 'Bruna Castanheira')
        RETURNING id INTO v_appointment_id;

        INSERT INTO appointment_services (appointment_id, service_name, duration_minutes)
        VALUES (v_appointment_id, 'Preenchimento Labial', 30);
    END IF;
END $$;

DO $$
DECLARE
    v_appointment_id UUID;
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM appointments 
        WHERE date = '2026-02-05' 
          AND start_time = '17:30:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000004' 
          AND (client_name = 'Divani Soler' OR client_phone = '(66) 99625-4644')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Divani Soler', '(66) 99625-4644', '00000000-0000-0000-0000-000000000004', '2026-02-05', '17:30:00', '18:00:00', 'atendido', '', 'Rafaela')
        RETURNING id INTO v_appointment_id;

        INSERT INTO appointment_services (appointment_id, service_name, duration_minutes)
        VALUES (v_appointment_id, 'Designer de Sobrancelhas', 30);
    END IF;
END $$;

DO $$
DECLARE
    v_appointment_id UUID;
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM appointments 
        WHERE date = '2026-02-05' 
          AND start_time = '17:30:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000006' 
          AND (client_name = 'Michelle Tamara Ferreira de Sousa' OR client_phone = '(66) 8449-3980')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Michelle Tamara Ferreira de Sousa', '(66) 8449-3980', '00000000-0000-0000-0000-000000000006', '2026-02-05', '17:30:00', '18:00:00', 'confirmado', '', 'Dhionara Sbrussi')
        RETURNING id INTO v_appointment_id;

        INSERT INTO appointment_services (appointment_id, service_name, duration_minutes)
        VALUES (v_appointment_id, 'Injetaveis', 30);
    END IF;
END $$;

DO $$
DECLARE
    v_appointment_id UUID;
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM appointments 
        WHERE date = '2026-02-05' 
          AND start_time = '18:30:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000005' 
          AND (client_name = 'Ana Paula Almeida Naves' OR client_phone = '(66) 99606-6586')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Ana Paula Almeida Naves', '(66) 99606-6586', '00000000-0000-0000-0000-000000000005', '2026-02-05', '18:30:00', '19:00:00', 'atendido', '', 'Bruna Castanheira')
        RETURNING id INTO v_appointment_id;

        INSERT INTO appointment_services (appointment_id, service_name, duration_minutes)
        VALUES (v_appointment_id, 'Retorno de Procedimento', 30);
    END IF;
END $$;

DO $$
DECLARE
    v_appointment_id UUID;
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM appointments 
        WHERE date = '2026-02-04' 
          AND start_time = '08:00:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000007' 
          AND (client_name = 'Marli Salete de Avila Sbrussi' OR client_phone = '(66) 98412-6906')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Marli Salete de Avila Sbrussi', '(66) 98412-6906', '00000000-0000-0000-0000-000000000007', '2026-02-04', '08:00:00', '08:30:00', 'atendido', '', 'Patricia Armanda')
        RETURNING id INTO v_appointment_id;

        INSERT INTO appointment_services (appointment_id, service_name, duration_minutes)
        VALUES (v_appointment_id, 'Banho de Gel', 30);
    END IF;
END $$;

DO $$
DECLARE
    v_appointment_id UUID;
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM appointments 
        WHERE date = '2026-02-04' 
          AND start_time = '08:00:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000003' 
          AND (client_name = 'Marcia Nascimento Evangelista' OR client_phone = '(66) 99935-9113')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Marcia Nascimento Evangelista', '(66) 99935-9113', '00000000-0000-0000-0000-000000000003', '2026-02-04', '08:00:00', '09:00:00', 'atendido', '', 'Rafaela')
        RETURNING id INTO v_appointment_id;

        INSERT INTO appointment_services (appointment_id, service_name, duration_minutes)
        VALUES (v_appointment_id, 'Unha Pé e mão', 60);
    END IF;
END $$;

DO $$
DECLARE
    v_appointment_id UUID;
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM appointments 
        WHERE date = '2026-02-04' 
          AND start_time = '08:30:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000004' 
          AND (client_name = 'Maria divina' OR client_phone = '(66) 98442-7097')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Maria divina', '(66) 98442-7097', '00000000-0000-0000-0000-000000000004', '2026-02-04', '08:30:00', '09:00:00', 'atendido', '', 'Tais Pires')
        RETURNING id INTO v_appointment_id;

        INSERT INTO appointment_services (appointment_id, service_name, duration_minutes)
        VALUES (v_appointment_id, 'Designer Com Henna', 30);
    END IF;
END $$;

DO $$
DECLARE
    v_appointment_id UUID;
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM appointments 
        WHERE date = '2026-02-04' 
          AND start_time = '08:30:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000002' 
          AND (client_name = 'Rosane de Albuquerque' OR client_phone = '(66) 99978-7196')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Rosane de Albuquerque', '(66) 99978-7196', '00000000-0000-0000-0000-000000000002', '2026-02-04', '08:30:00', '09:00:00', 'atendido', '', 'Dhiani Sbrussi')
        RETURNING id INTO v_appointment_id;

        INSERT INTO appointment_services (appointment_id, service_name, duration_minutes)
        VALUES (v_appointment_id, 'Tratamento corporal', 30);
    END IF;
END $$;

DO $$
DECLARE
    v_appointment_id UUID;
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM appointments 
        WHERE date = '2026-02-04' 
          AND start_time = '08:45:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000004' 
          AND (client_name = 'Alessandra Naiara dos Santos Pavessi' OR client_phone = '(66) 98132-9032')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Alessandra Naiara dos Santos Pavessi', '(66) 98132-9032', '00000000-0000-0000-0000-000000000004', '2026-02-04', '08:45:00', '09:15:00', 'atendido', '', 'Rafaela')
        RETURNING id INTO v_appointment_id;

        INSERT INTO appointment_services (appointment_id, service_name, duration_minutes)
        VALUES (v_appointment_id, 'Designer de Sobrancelhas', 30);
    END IF;
END $$;

DO $$
DECLARE
    v_appointment_id UUID;
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM appointments 
        WHERE date = '2026-02-04' 
          AND start_time = '09:00:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000001' 
          AND (client_name = 'Laura Daiana Rodrigues de Oliveira' OR client_phone = '(66) 98114-4858')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Laura Daiana Rodrigues de Oliveira', '(66) 98114-4858', '00000000-0000-0000-0000-000000000001', '2026-02-04', '09:00:00', '09:30:00', 'atendido', '', 'Rafaela')
        RETURNING id INTO v_appointment_id;

        INSERT INTO appointment_services (appointment_id, service_name, duration_minutes)
        VALUES (v_appointment_id, 'Retorno Sobrancelhas', 30);
    END IF;
END $$;

DO $$
DECLARE
    v_appointment_id UUID;
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM appointments 
        WHERE date = '2026-02-04' 
          AND start_time = '09:00:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000006' 
          AND (client_name = 'RAFAEL RODRIGUES' OR client_phone = '(66) 99964-2605')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('RAFAEL RODRIGUES', '(66) 99964-2605', '00000000-0000-0000-0000-000000000006', '2026-02-04', '09:00:00', '09:30:00', 'atendido', '', 'Rafaela')
        RETURNING id INTO v_appointment_id;

        INSERT INTO appointment_services (appointment_id, service_name, duration_minutes)
        VALUES (v_appointment_id, 'Injetaveis', 30);
    END IF;
END $$;

DO $$
DECLARE
    v_appointment_id UUID;
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM appointments 
        WHERE date = '2026-02-04' 
          AND start_time = '09:00:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000004' 
          AND (client_name = 'Rayssa Vitória dos Santos' OR client_phone = '(44) 99702-8319')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Rayssa Vitória dos Santos', '(44) 99702-8319', '00000000-0000-0000-0000-000000000004', '2026-02-04', '09:00:00', '10:00:00', 'atendido', '', 'Rafaela')
        RETURNING id INTO v_appointment_id;

        INSERT INTO appointment_services (appointment_id, service_name, duration_minutes)
        VALUES (v_appointment_id, 'Retorno limpeza de pele', 60);
    END IF;
END $$;

DO $$
DECLARE
    v_appointment_id UUID;
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM appointments 
        WHERE date = '2026-02-04' 
          AND start_time = '09:30:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000006' 
          AND (client_name = 'Fabia Ferreira Barbosa' OR client_phone = '(66) 98416-7183')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Fabia Ferreira Barbosa', '(66) 98416-7183', '00000000-0000-0000-0000-000000000006', '2026-02-04', '09:30:00', '10:00:00', 'falta', '', 'Rafaela')
        RETURNING id INTO v_appointment_id;

        INSERT INTO appointment_services (appointment_id, service_name, duration_minutes)
        VALUES (v_appointment_id, 'Injetaveis', 30);
    END IF;
END $$;

DO $$
DECLARE
    v_appointment_id UUID;
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM appointments 
        WHERE date = '2026-02-04' 
          AND start_time = '09:30:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000004' 
          AND (client_name = 'Rosane de Albuquerque' OR client_phone = '(66) 99978-7196')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Rosane de Albuquerque', '(66) 99978-7196', '00000000-0000-0000-0000-000000000004', '2026-02-04', '09:30:00', '10:00:00', 'atendido', '', 'Tais Pires')
        RETURNING id INTO v_appointment_id;

        INSERT INTO appointment_services (appointment_id, service_name, duration_minutes)
        VALUES (v_appointment_id, 'PEIM', 30);
    END IF;
END $$;

DO $$
DECLARE
    v_appointment_id UUID;
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM appointments 
        WHERE date = '2026-02-04' 
          AND start_time = '09:45:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000001' 
          AND (client_name = 'Liliane Frapporti Bertol' OR client_phone = '(66) 98408-8172')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Liliane Frapporti Bertol', '(66) 98408-8172', '00000000-0000-0000-0000-000000000001', '2026-02-04', '09:45:00', '10:15:00', 'atendido', '', 'Rafaela')
        RETURNING id INTO v_appointment_id;

        INSERT INTO appointment_services (appointment_id, service_name, duration_minutes)
        VALUES (v_appointment_id, 'Prime Brow (crescimento do pelo)', 30);
    END IF;
END $$;

DO $$
DECLARE
    v_appointment_id UUID;
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM appointments 
        WHERE date = '2026-02-04' 
          AND start_time = '10:00:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000005' 
          AND (client_name = 'Bruna Lorrany Castanheira' OR client_phone = '(66) 98434-3545')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Bruna Lorrany Castanheira', '(66) 98434-3545', '00000000-0000-0000-0000-000000000005', '2026-02-04', '10:00:00', '10:45:00', 'agendado', '11/20', 'Agendamento')
        RETURNING id INTO v_appointment_id;

        INSERT INTO appointment_services (appointment_id, service_name, duration_minutes)
        VALUES (v_appointment_id, 'Drenagem Linfática', 45);
    END IF;
END $$;

DO $$
DECLARE
    v_appointment_id UUID;
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM appointments 
        WHERE date = '2026-02-04' 
          AND start_time = '10:00:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000002' 
          AND (client_name = 'Bruna Lorrany Castanheira' OR client_phone = '(66) 98434-3545')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Bruna Lorrany Castanheira', '(66) 98434-3545', '00000000-0000-0000-0000-000000000002', '2026-02-04', '10:00:00', '10:45:00', 'atendido', '1/10', 'Dhiani Sbrussi')
        RETURNING id INTO v_appointment_id;

        INSERT INTO appointment_services (appointment_id, service_name, duration_minutes)
        VALUES (v_appointment_id, 'Drenagem Linfática', 45);
    END IF;
END $$;

DO $$
DECLARE
    v_appointment_id UUID;
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM appointments 
        WHERE date = '2026-02-04' 
          AND start_time = '10:00:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000006' 
          AND (client_name = 'Tatiane Nicoletti' OR client_phone = '(66) 99685-8581')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Tatiane Nicoletti', '(66) 99685-8581', '00000000-0000-0000-0000-000000000006', '2026-02-04', '10:00:00', '10:30:00', 'atendido', '', 'Agendamento')
        RETURNING id INTO v_appointment_id;

        INSERT INTO appointment_services (appointment_id, service_name, duration_minutes)
        VALUES (v_appointment_id, 'Injetaveis', 30);
    END IF;
END $$;

DO $$
DECLARE
    v_appointment_id UUID;
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM appointments 
        WHERE date = '2026-02-04' 
          AND start_time = '10:30:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000001' 
          AND (client_name = 'Dhionara Sbrussi Lorenzon.' OR client_phone = '(66) 99988-2911')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Dhionara Sbrussi Lorenzon.', '(66) 99988-2911', '00000000-0000-0000-0000-000000000001', '2026-02-04', '10:30:00', '11:00:00', 'agendado', '', 'Dhionara Sbrussi')
        RETURNING id INTO v_appointment_id;

        INSERT INTO appointment_services (appointment_id, service_name, duration_minutes)
        VALUES (v_appointment_id, 'Consulta Avaliação', 30);
    END IF;
END $$;

DO $$
DECLARE
    v_appointment_id UUID;
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM appointments 
        WHERE date = '2026-02-04' 
          AND start_time = '11:00:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000005' 
          AND (client_name = 'Sara Gardinal' OR client_phone = '(66) 99682-9086')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Sara Gardinal', '(66) 99682-9086', '00000000-0000-0000-0000-000000000005', '2026-02-04', '11:00:00', '11:30:00', 'atendido', 'Retorno lábios', 'Agendamento')
        RETURNING id INTO v_appointment_id;

        INSERT INTO appointment_services (appointment_id, service_name, duration_minutes)
        VALUES (v_appointment_id, 'Preenchimento Labial', 30);
    END IF;
END $$;

DO $$
DECLARE
    v_appointment_id UUID;
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM appointments 
        WHERE date = '2026-02-04' 
          AND start_time = '13:30:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000002' 
          AND (client_name = 'Aline Rodrigues' OR client_phone = '(54) 99635-2405')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Aline Rodrigues', '(54) 99635-2405', '00000000-0000-0000-0000-000000000002', '2026-02-04', '13:30:00', '14:00:00', 'atendido', '', 'Dhiani Sbrussi')
        RETURNING id INTO v_appointment_id;

        INSERT INTO appointment_services (appointment_id, service_name, duration_minutes)
        VALUES (v_appointment_id, 'Avaliação', 30);
    END IF;
END $$;

DO $$
DECLARE
    v_appointment_id UUID;
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM appointments 
        WHERE date = '2026-02-04' 
          AND start_time = '14:00:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000003' 
          AND (client_name = 'Dhiani Sbrussi' OR client_phone = '(66) 99668-0462')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Dhiani Sbrussi', '(66) 99668-0462', '00000000-0000-0000-0000-000000000003', '2026-02-04', '14:00:00', '15:00:00', 'atendido', '3/30', 'Dhiani Sbrussi')
        RETURNING id INTO v_appointment_id;

        INSERT INTO appointment_services (appointment_id, service_name, duration_minutes)
        VALUES (v_appointment_id, 'Unha Pé', 60);
    END IF;
END $$;

DO $$
DECLARE
    v_appointment_id UUID;
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM appointments 
        WHERE date = '2026-02-04' 
          AND start_time = '14:00:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000002' 
          AND (client_name = 'Dhiani Sbrussi' OR client_phone = '(66) 99668-0462')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Dhiani Sbrussi', '(66) 99668-0462', '00000000-0000-0000-0000-000000000002', '2026-02-04', '14:00:00', '15:00:00', 'atendido', '3/30', 'Agendamento')
        RETURNING id INTO v_appointment_id;

        INSERT INTO appointment_services (appointment_id, service_name, duration_minutes)
        VALUES (v_appointment_id, 'Unha Pé', 60);
    END IF;
END $$;

DO $$
DECLARE
    v_appointment_id UUID;
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM appointments 
        WHERE date = '2026-02-04' 
          AND start_time = '14:00:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000007' 
          AND (client_name = 'Rosana Perozzo' OR client_phone = '(66) 99979-9630')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Rosana Perozzo', '(66) 99979-9630', '00000000-0000-0000-0000-000000000007', '2026-02-04', '14:00:00', '14:30:00', 'atendido', '', 'Rafaela')
        RETURNING id INTO v_appointment_id;

        INSERT INTO appointment_services (appointment_id, service_name, duration_minutes)
        VALUES (v_appointment_id, 'Manutenção Banho de Gel', 30);
    END IF;
END $$;

DO $$
DECLARE
    v_appointment_id UUID;
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM appointments 
        WHERE date = '2026-02-04' 
          AND start_time = '14:00:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000004' 
          AND (client_name = 'Andressa Geovana Maniotte Pavezi' OR client_phone = '(64) 99606-3431')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Andressa Geovana Maniotte Pavezi', '(64) 99606-3431', '00000000-0000-0000-0000-000000000004', '2026-02-04', '14:00:00', '15:00:00', 'atendido', '', 'Rafaela')
        RETURNING id INTO v_appointment_id;

        INSERT INTO appointment_services (appointment_id, service_name, duration_minutes)
        VALUES (v_appointment_id, 'Limpeza De Pele', 60);
    END IF;
END $$;

DO $$
DECLARE
    v_appointment_id UUID;
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM appointments 
        WHERE date = '2026-02-04' 
          AND start_time = '14:00:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000001' 
          AND (client_name = 'Noeli Ozana Sott  De Mello' OR client_phone = '(66) 99951-3642')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Noeli Ozana Sott  De Mello', '(66) 99951-3642', '00000000-0000-0000-0000-000000000001', '2026-02-04', '14:00:00', '14:30:00', 'atendido', '', 'Rafaela')
        RETURNING id INTO v_appointment_id;

        INSERT INTO appointment_services (appointment_id, service_name, duration_minutes)
        VALUES (v_appointment_id, 'Tintura de sobrancelhas', 30);
    END IF;
END $$;

DO $$
DECLARE
    v_appointment_id UUID;
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM appointments 
        WHERE date = '2026-02-04' 
          AND start_time = '14:00:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000006' 
          AND (client_name = 'Wilma Alves Rodrigues' OR client_phone = '(64) 98419-9671')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Wilma Alves Rodrigues', '(64) 98419-9671', '00000000-0000-0000-0000-000000000006', '2026-02-04', '14:00:00', '14:30:00', 'atendido', '', 'Rafaela')
        RETURNING id INTO v_appointment_id;

        INSERT INTO appointment_services (appointment_id, service_name, duration_minutes)
        VALUES (v_appointment_id, 'Injetaveis', 30);
    END IF;
END $$;

DO $$
DECLARE
    v_appointment_id UUID;
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM appointments 
        WHERE date = '2026-02-04' 
          AND start_time = '14:15:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000001' 
          AND (client_name = 'Luciana Moura Borges' OR client_phone = '(66) 98478-1942')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Luciana Moura Borges', '(66) 98478-1942', '00000000-0000-0000-0000-000000000001', '2026-02-04', '14:15:00', '14:45:00', 'atendido', '', 'Agendamento')
        RETURNING id INTO v_appointment_id;

        INSERT INTO appointment_services (appointment_id, service_name, duration_minutes)
        VALUES (v_appointment_id, 'Designer de Sobrancelhas', 30);
    END IF;
END $$;

DO $$
DECLARE
    v_appointment_id UUID;
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM appointments 
        WHERE date = '2026-02-04' 
          AND start_time = '15:00:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000006' 
          AND (client_name = 'Dhionara Sbrussi Lorenzon.' OR client_phone = '(66) 99988-2911')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Dhionara Sbrussi Lorenzon.', '(66) 99988-2911', '00000000-0000-0000-0000-000000000006', '2026-02-04', '15:00:00', '15:30:00', 'atendido', '', 'Rafaela')
        RETURNING id INTO v_appointment_id;

        INSERT INTO appointment_services (appointment_id, service_name, duration_minutes)
        VALUES (v_appointment_id, 'Consulta Avaliação', 30);
    END IF;
END $$;

DO $$
DECLARE
    v_appointment_id UUID;
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM appointments 
        WHERE date = '2026-02-04' 
          AND start_time = '15:00:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000001' 
          AND (client_name = 'Michele Angrizano Quintana' OR client_phone = '(66) 99217-0456')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Michele Angrizano Quintana', '(66) 99217-0456', '00000000-0000-0000-0000-000000000001', '2026-02-04', '15:00:00', '15:30:00', 'atendido', '', 'Rafaela')
        RETURNING id INTO v_appointment_id;

        INSERT INTO appointment_services (appointment_id, service_name, duration_minutes)
        VALUES (v_appointment_id, 'Retorno Labial', 30);
    END IF;
END $$;

DO $$
DECLARE
    v_appointment_id UUID;
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM appointments 
        WHERE date = '2026-02-04' 
          AND start_time = '15:00:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000002' 
          AND (client_name = 'Rhana Carolina Luz Kalil da Silva' OR client_phone = '(65) 98153-2103')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Rhana Carolina Luz Kalil da Silva', '(65) 98153-2103', '00000000-0000-0000-0000-000000000002', '2026-02-04', '15:00:00', '15:45:00', 'cancelado', '', 'Dhionara Sbrussi')
        RETURNING id INTO v_appointment_id;

        INSERT INTO appointment_services (appointment_id, service_name, duration_minutes)
        VALUES (v_appointment_id, 'Drenagem Linfática', 45);
    END IF;
END $$;

DO $$
DECLARE
    v_appointment_id UUID;
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM appointments 
        WHERE date = '2026-02-04' 
          AND start_time = '15:30:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000004' 
          AND (client_name = 'Andreia' OR client_phone = '(66) 98463-3471')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Andreia', '(66) 98463-3471', '00000000-0000-0000-0000-000000000004', '2026-02-04', '15:30:00', '16:30:00', 'atendido', '', 'Agendamento')
        RETURNING id INTO v_appointment_id;

        INSERT INTO appointment_services (appointment_id, service_name, duration_minutes)
        VALUES (v_appointment_id, 'Limpeza De Pele', 60);
    END IF;
END $$;

DO $$
DECLARE
    v_appointment_id UUID;
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM appointments 
        WHERE date = '2026-02-04' 
          AND start_time = '15:45:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000002' 
          AND (client_name = 'Ana Paula Santos da Silva' OR client_phone = '(66) 98417-7640')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Ana Paula Santos da Silva', '(66) 98417-7640', '00000000-0000-0000-0000-000000000002', '2026-02-04', '15:45:00', '16:15:00', 'atendido', 'estrias/ jato', 'Agendamento')
        RETURNING id INTO v_appointment_id;

        INSERT INTO appointment_services (appointment_id, service_name, duration_minutes)
        VALUES (v_appointment_id, 'Avaliação', 30);
    END IF;
END $$;

DO $$
DECLARE
    v_appointment_id UUID;
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM appointments 
        WHERE date = '2026-02-04' 
          AND start_time = '16:00:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000002' 
          AND (client_name = 'Fabiana Zilli' OR client_phone = '(66) 99983-3058')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Fabiana Zilli', '(66) 99983-3058', '00000000-0000-0000-0000-000000000002', '2026-02-04', '16:00:00', '16:30:00', 'atendido', '', 'Agendamento')
        RETURNING id INTO v_appointment_id;

        INSERT INTO appointment_services (appointment_id, service_name, duration_minutes)
        VALUES (v_appointment_id, 'Tratamento corporal', 30);
    END IF;
END $$;

DO $$
DECLARE
    v_appointment_id UUID;
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM appointments 
        WHERE date = '2026-02-04' 
          AND start_time = '16:00:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000007' 
          AND (client_name = 'Kelly Lindemann' OR client_phone = '(66) 99974-8696')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Kelly Lindemann', '(66) 99974-8696', '00000000-0000-0000-0000-000000000007', '2026-02-04', '16:00:00', '16:30:00', 'atendido', '', 'Agendamento')
        RETURNING id INTO v_appointment_id;

        INSERT INTO appointment_services (appointment_id, service_name, duration_minutes)
        VALUES (v_appointment_id, 'Banho de Gel', 30);
    END IF;
END $$;

DO $$
DECLARE
    v_appointment_id UUID;
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM appointments 
        WHERE date = '2026-02-04' 
          AND start_time = '16:30:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000004' 
          AND (client_name = 'Juliana Santos   Carlesso' OR client_phone = '(67) 99910-1459')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Juliana Santos   Carlesso', '(67) 99910-1459', '00000000-0000-0000-0000-000000000004', '2026-02-04', '16:30:00', '17:30:00', 'atendido', '', 'Tais Pires')
        RETURNING id INTO v_appointment_id;

        INSERT INTO appointment_services (appointment_id, service_name, duration_minutes)
        VALUES (v_appointment_id, 'Limpeza De Pele', 60);
    END IF;
END $$;

DO $$
DECLARE
    v_appointment_id UUID;
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM appointments 
        WHERE date = '2026-02-04' 
          AND start_time = '16:30:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000001' 
          AND (client_name = 'Viviany Cristino de Lima' OR client_phone = '(66) 99212-9041')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Viviany Cristino de Lima', '(66) 99212-9041', '00000000-0000-0000-0000-000000000001', '2026-02-04', '16:30:00', '17:00:00', 'atendido', '2 SESSOA FAZER TINTURA', 'Rafaela')
        RETURNING id INTO v_appointment_id;

        INSERT INTO appointment_services (appointment_id, service_name, duration_minutes)
        VALUES (v_appointment_id, 'Prime Brow (crescimento do pelo)', 30);
    END IF;
END $$;

DO $$
DECLARE
    v_appointment_id UUID;
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM appointments 
        WHERE date = '2026-02-04' 
          AND start_time = '17:45:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000004' 
          AND (client_name = 'Patricia armanda' OR client_phone = '(66) 98102-1849')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Patricia armanda', '(66) 98102-1849', '00000000-0000-0000-0000-000000000004', '2026-02-04', '17:45:00', '18:15:00', 'atendido', '', 'Agendamento')
        RETURNING id INTO v_appointment_id;

        INSERT INTO appointment_services (appointment_id, service_name, duration_minutes)
        VALUES (v_appointment_id, 'Designer de Sobrancelhas', 30);
    END IF;
END $$;

DO $$
DECLARE
    v_appointment_id UUID;
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM appointments 
        WHERE date = '2026-02-04' 
          AND start_time = '18:00:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000006' 
          AND (client_name = 'TALITA' OR client_phone = '(66) 99929-7340')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('TALITA', '(66) 99929-7340', '00000000-0000-0000-0000-000000000006', '2026-02-04', '18:00:00', '18:30:00', 'agendado', '', 'Dhionara Sbrussi')
        RETURNING id INTO v_appointment_id;

        INSERT INTO appointment_services (appointment_id, service_name, duration_minutes)
        VALUES (v_appointment_id, 'Injetaveis', 30);
    END IF;
END $$;

DO $$
DECLARE
    v_appointment_id UUID;
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM appointments 
        WHERE date = '2026-02-04' 
          AND start_time = '18:15:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000004' 
          AND (client_name = 'Patricia armanda' OR client_phone = '(66) 98102-1849')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Patricia armanda', '(66) 98102-1849', '00000000-0000-0000-0000-000000000004', '2026-02-04', '18:15:00', '18:45:00', 'cancelado', '', 'Agendamento')
        RETURNING id INTO v_appointment_id;

        INSERT INTO appointment_services (appointment_id, service_name, duration_minutes)
        VALUES (v_appointment_id, 'Designer de Sobrancelhas', 30);
    END IF;
END $$;

DO $$
DECLARE
    v_appointment_id UUID;
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM appointments 
        WHERE date = '2026-02-04' 
          AND start_time = '18:30:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000007' 
          AND (client_name = 'Kauany Ketlyn Martins da Silva' OR client_phone = '(66) 98111-6652')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Kauany Ketlyn Martins da Silva', '(66) 98111-6652', '00000000-0000-0000-0000-000000000007', '2026-02-04', '18:30:00', '19:30:00', 'atendido', '', 'Patricia Armanda')
        RETURNING id INTO v_appointment_id;

        INSERT INTO appointment_services (appointment_id, service_name, duration_minutes)
        VALUES (v_appointment_id, 'Esmaltação em gel pé', 60);
    END IF;
END $$;

DO $$
DECLARE
    v_appointment_id UUID;
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM appointments 
        WHERE date = '2026-02-03' 
          AND start_time = '07:30:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000006' 
          AND (client_name = 'NOEMI CAROLINA DOS SANTOS' OR client_phone = '(66) 98424-8883')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('NOEMI CAROLINA DOS SANTOS', '(66) 98424-8883', '00000000-0000-0000-0000-000000000006', '2026-02-03', '07:30:00', '08:00:00', 'atendido', 'avisar Michele chegar', 'Agendamento')
        RETURNING id INTO v_appointment_id;

        INSERT INTO appointment_services (appointment_id, service_name, duration_minutes)
        VALUES (v_appointment_id, 'Avaliação', 30);
    END IF;
END $$;

DO $$
DECLARE
    v_appointment_id UUID;
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM appointments 
        WHERE date = '2026-02-03' 
          AND start_time = '08:00:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000002' 
          AND (client_name = 'Marli Salete de Avila Sbrussi' OR client_phone = '(66) 98412-6906')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Marli Salete de Avila Sbrussi', '(66) 98412-6906', '00000000-0000-0000-0000-000000000002', '2026-02-03', '08:00:00', '08:30:00', 'atendido', '', 'Agendamento')
        RETURNING id INTO v_appointment_id;

        INSERT INTO appointment_services (appointment_id, service_name, duration_minutes)
        VALUES (v_appointment_id, 'Depilação Completa', 30);
    END IF;
END $$;

DO $$
DECLARE
    v_appointment_id UUID;
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM appointments 
        WHERE date = '2026-02-03' 
          AND start_time = '08:00:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000002' 
          AND (client_name = 'Claudyane' OR client_phone = '(66) 98400-0714')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Claudyane', '(66) 98400-0714', '00000000-0000-0000-0000-000000000002', '2026-02-03', '08:00:00', '08:30:00', 'atendido', '', 'Rafaela')
        RETURNING id INTO v_appointment_id;

        INSERT INTO appointment_services (appointment_id, service_name, duration_minutes)
        VALUES (v_appointment_id, 'Depilação Virilha', 30);
    END IF;
END $$;

DO $$
DECLARE
    v_appointment_id UUID;
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM appointments 
        WHERE date = '2026-02-03' 
          AND start_time = '08:00:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000006' 
          AND (client_name = 'Daiany Priscilla Bueno da Silva' OR client_phone = '(62) 98170-0948')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Daiany Priscilla Bueno da Silva', '(62) 98170-0948', '00000000-0000-0000-0000-000000000006', '2026-02-03', '08:00:00', '08:30:00', 'atendido', '', 'Agendamento')
        RETURNING id INTO v_appointment_id;

        INSERT INTO appointment_services (appointment_id, service_name, duration_minutes)
        VALUES (v_appointment_id, 'Bioimpedância', 30);
    END IF;
END $$;

DO $$
DECLARE
    v_appointment_id UUID;
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM appointments 
        WHERE date = '2026-02-03' 
          AND start_time = '08:00:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000007' 
          AND (client_name = 'CRISTIANE' OR client_phone = '(66) 98133-2490')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('CRISTIANE', '(66) 98133-2490', '00000000-0000-0000-0000-000000000007', '2026-02-03', '08:00:00', '08:30:00', 'atendido', '', 'Rafaela')
        RETURNING id INTO v_appointment_id;

        INSERT INTO appointment_services (appointment_id, service_name, duration_minutes)
        VALUES (v_appointment_id, 'Banho de Gel', 30);
    END IF;
END $$;

DO $$
DECLARE
    v_appointment_id UUID;
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM appointments 
        WHERE date = '2026-02-03' 
          AND start_time = '08:30:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000006' 
          AND (client_name = 'Amélia luiz Fernandes' OR client_phone = '(66) 99699-4669')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Amélia luiz Fernandes', '(66) 99699-4669', '00000000-0000-0000-0000-000000000006', '2026-02-03', '08:30:00', '09:00:00', 'atendido', '', 'Rafaela')
        RETURNING id INTO v_appointment_id;

        INSERT INTO appointment_services (appointment_id, service_name, duration_minutes)
        VALUES (v_appointment_id, 'Injetaveis', 30);
    END IF;
END $$;

DO $$
DECLARE
    v_appointment_id UUID;
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM appointments 
        WHERE date = '2026-02-03' 
          AND start_time = '08:45:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000001' 
          AND (client_name = 'Kelly cristina  Toniazzo' OR client_phone = '(66) 99952-7328')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Kelly cristina  Toniazzo', '(66) 99952-7328', '00000000-0000-0000-0000-000000000001', '2026-02-03', '08:45:00', '10:15:00', 'atendido', 'enviar lembrete meia hora antes', 'Rafaela')
        RETURNING id INTO v_appointment_id;

        INSERT INTO appointment_services (appointment_id, service_name, duration_minutes)
        VALUES (v_appointment_id, 'Micropigmentação Labial', 90);
    END IF;
END $$;

DO $$
DECLARE
    v_appointment_id UUID;
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM appointments 
        WHERE date = '2026-02-03' 
          AND start_time = '09:00:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000006' 
          AND (client_name = 'RAFAEL RODRIGUES' OR client_phone = '(66) 99964-2605')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('RAFAEL RODRIGUES', '(66) 99964-2605', '00000000-0000-0000-0000-000000000006', '2026-02-03', '09:00:00', '09:30:00', 'cancelado', '', 'Michele Quintana')
        RETURNING id INTO v_appointment_id;

        INSERT INTO appointment_services (appointment_id, service_name, duration_minutes)
        VALUES (v_appointment_id, 'Injetaveis', 30);
    END IF;
END $$;

DO $$
DECLARE
    v_appointment_id UUID;
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM appointments 
        WHERE date = '2026-02-03' 
          AND start_time = '09:00:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000006' 
          AND (client_name = 'SIMONE LIMA' OR client_phone = '(66) 98411-5333')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('SIMONE LIMA', '(66) 98411-5333', '00000000-0000-0000-0000-000000000006', '2026-02-03', '09:00:00', '09:30:00', 'atendido', '', 'Dhiani Sbrussi')
        RETURNING id INTO v_appointment_id;

        INSERT INTO appointment_services (appointment_id, service_name, duration_minutes)
        VALUES (v_appointment_id, 'Injetaveis', 30);
    END IF;
END $$;

DO $$
DECLARE
    v_appointment_id UUID;
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM appointments 
        WHERE date = '2026-02-03' 
          AND start_time = '10:00:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000007' 
          AND (client_name = 'Francisca Lima Morais' OR client_phone = '(66) 98444-5189')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Francisca Lima Morais', '(66) 98444-5189', '00000000-0000-0000-0000-000000000007', '2026-02-03', '10:00:00', '11:00:00', 'cancelado', '', 'Agendamento')
        RETURNING id INTO v_appointment_id;

        INSERT INTO appointment_services (appointment_id, service_name, duration_minutes)
        VALUES (v_appointment_id, 'Remoção de Unha', 60);
    END IF;
END $$;

DO $$
DECLARE
    v_appointment_id UUID;
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM appointments 
        WHERE date = '2026-02-03' 
          AND start_time = '10:00:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000006' 
          AND (client_name = 'Karol Basso' OR client_phone = '(66) 99926-2026')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Karol Basso', '(66) 99926-2026', '00000000-0000-0000-0000-000000000006', '2026-02-03', '10:00:00', '10:30:00', 'atendido', '', 'Rafaela')
        RETURNING id INTO v_appointment_id;

        INSERT INTO appointment_services (appointment_id, service_name, duration_minutes)
        VALUES (v_appointment_id, 'Injetaveis', 30);
    END IF;
END $$;

COMMIT;