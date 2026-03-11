BEGIN;
DO $$
DECLARE
    v_appointment_id UUID;
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM appointments 
        WHERE date = '2026-02-25' 
          AND start_time = '16:15:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000004' 
          AND (client_name = 'Leliane R. Milkevicz Ercico' OR client_phone = '(66) 99943-4511')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Leliane R. Milkevicz Ercico', '(66) 99943-4511', '00000000-0000-0000-0000-000000000004', '2026-02-25', '16:15:00', '16:45:00', 'atendido', '', 'Agendamento')
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
        WHERE date = '2026-02-25' 
          AND start_time = '17:00:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000006' 
          AND (client_name = 'Michele Angrizano Quintana' OR client_phone = '(66) 99217-0456')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Michele Angrizano Quintana', '(66) 99217-0456', '00000000-0000-0000-0000-000000000006', '2026-02-25', '17:00:00', '17:30:00', 'agendado', '', 'Michele Quintana')
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
        WHERE date = '2026-02-25' 
          AND start_time = '17:00:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000001' 
          AND (client_name = 'Liara Marmet da Silva' OR client_phone = '(66) 98408-3247')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Liara Marmet da Silva', '(66) 98408-3247', '00000000-0000-0000-0000-000000000001', '2026-02-25', '17:00:00', '17:30:00', 'atendido', '', 'Dhionara Sbrussi')
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
        WHERE date = '2026-02-25' 
          AND start_time = '17:00:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000004' 
          AND (client_name = 'Adriana Pataty' OR client_phone = '(66) 99966-3579')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Adriana Pataty', '(66) 99966-3579', '00000000-0000-0000-0000-000000000004', '2026-02-25', '17:00:00', '17:30:00', 'cancelado', '', 'Dhionara Sbrussi')
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
        WHERE date = '2026-02-25' 
          AND start_time = '17:15:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000004' 
          AND (client_name = 'Virginia Detoni' OR client_phone = '(66) 99661-9339')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Virginia Detoni', '(66) 99661-9339', '00000000-0000-0000-0000-000000000004', '2026-02-25', '17:15:00', '17:45:00', 'falta', '', 'Tais Pires')
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
        WHERE date = '2026-02-25' 
          AND start_time = '17:30:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000005' 
          AND (client_name = 'Cristiana Aparecida' OR client_phone = '(66) 98413-0466')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Cristiana Aparecida', '(66) 98413-0466', '00000000-0000-0000-0000-000000000005', '2026-02-25', '17:30:00', '18:00:00', 'espera', '', 'Bruna Castanheira')
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
        WHERE date = '2026-02-25' 
          AND start_time = '17:30:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000003' 
          AND (client_name = 'Tatielly Cardoso Araujo' OR client_phone = '(66) 98468-2665')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Tatielly Cardoso Araujo', '(66) 98468-2665', '00000000-0000-0000-0000-000000000003', '2026-02-25', '17:30:00', '18:30:00', 'falta', '', 'Dhionara Sbrussi')
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
        WHERE date = '2026-02-25' 
          AND start_time = '17:30:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000007' 
          AND (client_name = 'Lenilce' OR client_phone = '(66) 99210-4275')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Lenilce', '(66) 99210-4275', '00000000-0000-0000-0000-000000000007', '2026-02-25', '17:30:00', '18:00:00', 'atendido', '', 'Patricia Armanda')
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
        WHERE date = '2026-02-25' 
          AND start_time = '17:30:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000005' 
          AND (client_name = 'Jaqueline Antunes Francischetti' OR client_phone = '(65) 99971-0011')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Jaqueline Antunes Francischetti', '(65) 99971-0011', '00000000-0000-0000-0000-000000000005', '2026-02-25', '17:30:00', '18:00:00', 'atendido', 'Rinomodelação/ provavelmente já vai fazer', 'Bruna Castanheira')
        RETURNING id INTO v_appointment_id;

        INSERT INTO appointment_services (appointment_id, service_name, duration_minutes)
        VALUES (v_appointment_id, 'Harmonização Facial', 30);
    END IF;
END $$;

DO $$
DECLARE
    v_appointment_id UUID;
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM appointments 
        WHERE date = '2026-02-25' 
          AND start_time = '18:30:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000007' 
          AND (client_name = 'Willyane Alves Luz.' OR client_phone = '(66) 98417-4358')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Willyane Alves Luz.', '(66) 98417-4358', '00000000-0000-0000-0000-000000000007', '2026-02-25', '18:30:00', '19:30:00', 'atendido', '', 'Patricia Armanda')
        RETURNING id INTO v_appointment_id;

        INSERT INTO appointment_services (appointment_id, service_name, duration_minutes)
        VALUES (v_appointment_id, 'Alongamento de  Unha Fibra', 60);
    END IF;
END $$;

DO $$
DECLARE
    v_appointment_id UUID;
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM appointments 
        WHERE date = '2026-02-24' 
          AND start_time = '08:00:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000002' 
          AND (client_name = 'Marli Salete de Avila Sbrussi' OR client_phone = '(66) 98412-6906')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Marli Salete de Avila Sbrussi', '(66) 98412-6906', '00000000-0000-0000-0000-000000000002', '2026-02-24', '08:00:00', '08:30:00', 'atendido', '', 'Rafaela')
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
        WHERE date = '2026-02-24' 
          AND start_time = '08:00:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000006' 
          AND (client_name = 'ELIANE JASCOVSK' OR client_phone = '(66) 98437-8685')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('ELIANE JASCOVSK', '(66) 98437-8685', '00000000-0000-0000-0000-000000000006', '2026-02-24', '08:00:00', '08:30:00', 'cancelado', '', 'Rafaela')
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
        WHERE date = '2026-02-24' 
          AND start_time = '08:00:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000001' 
          AND (client_name = 'Camila Feitosa Gomes' OR client_phone = '(66) 98136-4209')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Camila Feitosa Gomes', '(66) 98136-4209', '00000000-0000-0000-0000-000000000001', '2026-02-24', '08:00:00', '08:30:00', 'atendido', '', 'Rafaela')
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
        WHERE date = '2026-02-24' 
          AND start_time = '08:30:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000001' 
          AND (client_name = 'Larissa Ferrari' OR client_phone = '(66) 98468-2020')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Larissa Ferrari', '(66) 98468-2020', '00000000-0000-0000-0000-000000000001', '2026-02-24', '08:30:00', '09:00:00', 'atendido', '450', 'Agendamento')
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
        WHERE date = '2026-02-24' 
          AND start_time = '08:30:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000006' 
          AND (client_name = 'ELIANE JASCOVSK' OR client_phone = '(66) 98437-8685')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('ELIANE JASCOVSK', '(66) 98437-8685', '00000000-0000-0000-0000-000000000006', '2026-02-24', '08:30:00', '09:00:00', 'atendido', '', 'Rafaela')
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
        WHERE date = '2026-02-24' 
          AND start_time = '09:00:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000006' 
          AND (client_name = 'Iliane W. Gabe' OR client_phone = '(66) 99958-9120')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Iliane W. Gabe', '(66) 99958-9120', '00000000-0000-0000-0000-000000000006', '2026-02-24', '09:00:00', '09:30:00', 'atendido', '', 'Rafaela')
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
        WHERE date = '2026-02-24' 
          AND start_time = '09:30:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000001' 
          AND (client_name = 'Saulo Roberto Beissolotti' OR client_phone = '(66) 98434-9112')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Saulo Roberto Beissolotti', '(66) 98434-9112', '00000000-0000-0000-0000-000000000001', '2026-02-24', '09:30:00', '10:00:00', 'atendido', '', 'Agendamento')
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
        WHERE date = '2026-02-24' 
          AND start_time = '09:30:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000006' 
          AND (client_name = 'LICIA CRISTINA KUHN' OR client_phone = '(66) 99673-1282')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('LICIA CRISTINA KUHN', '(66) 99673-1282', '00000000-0000-0000-0000-000000000006', '2026-02-24', '09:30:00', '10:00:00', 'atendido', '', 'Rafaela')
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
        WHERE date = '2026-02-24' 
          AND start_time = '10:00:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000007' 
          AND (client_name = 'Michele Angrizano Quintana' OR client_phone = '(66) 99217-0456')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Michele Angrizano Quintana', '(66) 99217-0456', '00000000-0000-0000-0000-000000000007', '2026-02-24', '10:00:00', '10:30:00', 'atendido', '', 'Patricia Armanda')
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
        WHERE date = '2026-02-24' 
          AND start_time = '10:00:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000006' 
          AND (client_name = 'Patricia armanda' OR client_phone = '(66) 98102-1849')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Patricia armanda', '(66) 98102-1849', '00000000-0000-0000-0000-000000000006', '2026-02-24', '10:00:00', '10:30:00', 'atendido', '', 'Agendamento')
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
        WHERE date = '2026-02-24' 
          AND start_time = '13:30:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000002' 
          AND (client_name = 'Dhiani Sbrussi' OR client_phone = '(66) 99668-0462')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Dhiani Sbrussi', '(66) 99668-0462', '00000000-0000-0000-0000-000000000002', '2026-02-24', '13:30:00', '14:00:00', 'cancelado', '5/8', 'Dhiani Sbrussi')
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
        WHERE date = '2026-02-24' 
          AND start_time = '13:30:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000006' 
          AND (client_name = 'Tatiane Nicoletti' OR client_phone = '(66) 99685-8581')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Tatiane Nicoletti', '(66) 99685-8581', '00000000-0000-0000-0000-000000000006', '2026-02-24', '13:30:00', '14:00:00', 'atendido', '', 'Rafaela')
        RETURNING id INTO v_appointment_id;

        INSERT INTO appointment_services (appointment_id, service_name, duration_minutes)
        VALUES (v_appointment_id, 'Soroterapia', 30);
    END IF;
END $$;

DO $$
DECLARE
    v_appointment_id UUID;
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM appointments 
        WHERE date = '2026-02-24' 
          AND start_time = '13:30:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000001' 
          AND (client_name = 'Cleidiane Barbora Aguiar' OR client_phone = '(66) 98427-1975')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Cleidiane Barbora Aguiar', '(66) 98427-1975', '00000000-0000-0000-0000-000000000001', '2026-02-24', '13:30:00', '14:00:00', 'atendido', 'ver se vai fazer micro', 'Agendamento')
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
        WHERE date = '2026-02-24' 
          AND start_time = '14:00:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000007' 
          AND (client_name = 'Gabriela Janaina trees' OR client_phone = '(66) 99959-0908')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Gabriela Janaina trees', '(66) 99959-0908', '00000000-0000-0000-0000-000000000007', '2026-02-24', '14:00:00', '14:30:00', 'atendido', '', 'Rafaela')
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
        WHERE date = '2026-02-24' 
          AND start_time = '14:00:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000005' 
          AND (client_name = 'Tatiane Nicoletti' OR client_phone = '(66) 99685-8581')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Tatiane Nicoletti', '(66) 99685-8581', '00000000-0000-0000-0000-000000000005', '2026-02-24', '14:00:00', '14:30:00', 'cancelado', '', 'Bruna Castanheira')
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
        WHERE date = '2026-02-24' 
          AND start_time = '14:00:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000004' 
          AND (client_name = 'Pollyana Ragagnini' OR client_phone = '(64) 99981-0740')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Pollyana Ragagnini', '(64) 99981-0740', '00000000-0000-0000-0000-000000000004', '2026-02-24', '14:00:00', '14:30:00', 'espera', '', 'Dhionara Sbrussi')
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
        WHERE date = '2026-02-24' 
          AND start_time = '14:15:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000001' 
          AND (client_name = 'Delvanda Maia' OR client_phone = '(66) 99217-1372')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Delvanda Maia', '(66) 99217-1372', '00000000-0000-0000-0000-000000000001', '2026-02-24', '14:15:00', '15:45:00', 'atendido', '', 'Rafaela')
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
        WHERE date = '2026-02-24' 
          AND start_time = '15:00:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000002' 
          AND (client_name = 'Geny Almeida Sobrinho' OR client_phone = '(66) 99988-3973')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Geny Almeida Sobrinho', '(66) 99988-3973', '00000000-0000-0000-0000-000000000002', '2026-02-24', '15:00:00', '15:30:00', 'atendido', '', 'Agendamento')
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
        WHERE date = '2026-02-24' 
          AND start_time = '16:00:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000003' 
          AND (client_name = 'Suzamar Ferreira Sbrussi' OR client_phone = '(66) 98438-2646')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Suzamar Ferreira Sbrussi', '(66) 98438-2646', '00000000-0000-0000-0000-000000000003', '2026-02-24', '16:00:00', '17:00:00', 'atendido', '13/30', 'Rafaela')
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
        WHERE date = '2026-02-24' 
          AND start_time = '16:00:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000007' 
          AND (client_name = 'Suzamar Ferreira Sbrussi' OR client_phone = '(66) 98438-2646')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Suzamar Ferreira Sbrussi', '(66) 98438-2646', '00000000-0000-0000-0000-000000000007', '2026-02-24', '16:00:00', '16:30:00', 'atendido', '', 'Rafaela')
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
        WHERE date = '2026-02-24' 
          AND start_time = '16:00:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000007' 
          AND (client_name = 'Michele Angrizano Quintana' OR client_phone = '(66) 99217-0456')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Michele Angrizano Quintana', '(66) 99217-0456', '00000000-0000-0000-0000-000000000007', '2026-02-24', '16:00:00', '16:30:00', 'cancelado', '', 'Dhionara Sbrussi')
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
        WHERE date = '2026-02-24' 
          AND start_time = '16:15:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000001' 
          AND (client_name = 'Dhionara Sbrussi Lorenzon.' OR client_phone = '(66) 99988-2911')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Dhionara Sbrussi Lorenzon.', '(66) 99988-2911', '00000000-0000-0000-0000-000000000001', '2026-02-24', '16:15:00', '16:45:00', 'atendido', 'REUNIÃO MARKETING - NEYCY', 'Rafaela')
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
        WHERE date = '2026-02-24' 
          AND start_time = '16:15:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000006' 
          AND (client_name = 'Dayvane Renck Mendel' OR client_phone = '(66) 98437-5437')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Dayvane Renck Mendel', '(66) 98437-5437', '00000000-0000-0000-0000-000000000006', '2026-02-24', '16:15:00', '16:45:00', 'atendido', '', 'Rafaela')
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
        WHERE date = '2026-02-24' 
          AND start_time = '16:30:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000004' 
          AND (client_name = 'Adriana Maria da Conceição' OR client_phone = '(66) 98424-2290')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Adriana Maria da Conceição', '(66) 98424-2290', '00000000-0000-0000-0000-000000000004', '2026-02-24', '16:30:00', '17:00:00', 'atendido', '', 'Rafaela')
        RETURNING id INTO v_appointment_id;

        INSERT INTO appointment_services (appointment_id, service_name, duration_minutes)
        VALUES (v_appointment_id, 'depilação', 30);
    END IF;
END $$;

DO $$
DECLARE
    v_appointment_id UUID;
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM appointments 
        WHERE date = '2026-02-24' 
          AND start_time = '17:00:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000005' 
          AND (client_name = 'Neilse Antunes Oliveira' OR client_phone = '(66) 98418-2258')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Neilse Antunes Oliveira', '(66) 98418-2258', '00000000-0000-0000-0000-000000000005', '2026-02-24', '17:00:00', '17:30:00', 'atendido', '', 'Bruna Castanheira')
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
        WHERE date = '2026-02-24' 
          AND start_time = '17:00:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000001' 
          AND (client_name = 'Daiane Casanova' OR client_phone = '(66) 99207-5980')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Daiane Casanova', '(66) 99207-5980', '00000000-0000-0000-0000-000000000001', '2026-02-24', '17:00:00', '17:30:00', 'atendido', '', 'Rafaela')
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
        WHERE date = '2026-02-24' 
          AND start_time = '17:00:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000005' 
          AND (client_name = 'Ana Paula Amorin' OR client_phone = '(66) 98417-6059')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Ana Paula Amorin', '(66) 98417-6059', '00000000-0000-0000-0000-000000000005', '2026-02-24', '17:00:00', '17:30:00', 'cancelado', '', 'Bruna Castanheira')
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
        WHERE date = '2026-02-24' 
          AND start_time = '17:30:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000004' 
          AND (client_name = 'Raiara' OR client_phone = '(66) 98421-2250')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Raiara', '(66) 98421-2250', '00000000-0000-0000-0000-000000000004', '2026-02-24', '17:30:00', '18:00:00', 'atendido', 'varizes', 'Agendamento')
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
        WHERE date = '2026-02-24' 
          AND start_time = '17:30:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000003' 
          AND (client_name = 'Daizi Perozzo' OR client_phone = '(66) 98102-4551')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Daizi Perozzo', '(66) 98102-4551', '00000000-0000-0000-0000-000000000003', '2026-02-24', '17:30:00', '18:30:00', 'atendido', '', 'Rafaela')
        RETURNING id INTO v_appointment_id;

        INSERT INTO appointment_services (appointment_id, service_name, duration_minutes)
        VALUES (v_appointment_id, 'Unha Mão', 60);
    END IF;
END $$;

DO $$
DECLARE
    v_appointment_id UUID;
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM appointments 
        WHERE date = '2026-02-24' 
          AND start_time = '17:30:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000007' 
          AND (client_name = 'Thais dutra' OR client_phone = '(66) 99661-9387')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Thais dutra', '(66) 99661-9387', '00000000-0000-0000-0000-000000000007', '2026-02-24', '17:30:00', '18:30:00', 'atendido', '', 'Rafaela')
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
        WHERE date = '2026-02-24' 
          AND start_time = '17:30:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000006' 
          AND (client_name = 'WANEIDIANA RODRIGUES DA SILVA' OR client_phone = '(66) 99230-7975')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('WANEIDIANA RODRIGUES DA SILVA', '(66) 99230-7975', '00000000-0000-0000-0000-000000000006', '2026-02-24', '17:30:00', '18:00:00', 'atendido', '', 'Agendamento')
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
        WHERE date = '2026-02-24' 
          AND start_time = '18:00:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000004' 
          AND (client_name = 'Raiara' OR client_phone = '(66) 98421-2250')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Raiara', '(66) 98421-2250', '00000000-0000-0000-0000-000000000004', '2026-02-24', '18:00:00', '18:30:00', 'atendido', 'varizes', 'Agendamento')
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
        WHERE date = '2026-02-23' 
          AND start_time = '08:00:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000006' 
          AND (client_name = 'Neycyane Ribeiro' OR client_phone = '(66) 98410-2162')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Neycyane Ribeiro', '(66) 98410-2162', '00000000-0000-0000-0000-000000000006', '2026-02-23', '08:00:00', '08:30:00', 'atendido', '', 'Rafaela')
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
        WHERE date = '2026-02-23' 
          AND start_time = '09:00:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000004' 
          AND (client_name = 'Andreia Cristiane Schosser' OR client_phone = '(66) 99607-4672')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Andreia Cristiane Schosser', '(66) 99607-4672', '00000000-0000-0000-0000-000000000004', '2026-02-23', '09:00:00', '09:30:00', 'atendido', '', 'Dhiani Sbrussi')
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
        WHERE date = '2026-02-23' 
          AND start_time = '09:00:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000002' 
          AND (client_name = 'Mineia Gomes Trindade Suzuki' OR client_phone = '(66) 98458-2273')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Mineia Gomes Trindade Suzuki', '(66) 98458-2273', '00000000-0000-0000-0000-000000000002', '2026-02-23', '09:00:00', '09:30:00', 'atendido', '', 'Rafaela')
        RETURNING id INTO v_appointment_id;

        INSERT INTO appointment_services (appointment_id, service_name, duration_minutes)
        VALUES (v_appointment_id, 'Tratamento Luz Pulsada', 30);
    END IF;
END $$;

DO $$
DECLARE
    v_appointment_id UUID;
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM appointments 
        WHERE date = '2026-02-23' 
          AND start_time = '09:00:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000006' 
          AND (client_name = 'CRISTINA' OR client_phone = '(66) 98112-6534')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('CRISTINA', '(66) 98112-6534', '00000000-0000-0000-0000-000000000006', '2026-02-23', '09:00:00', '09:30:00', 'atendido', '', 'Rafaela')
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
        WHERE date = '2026-02-23' 
          AND start_time = '10:00:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000002' 
          AND (client_name = 'Ana Paula Silveira Parente' OR client_phone = '(65) 99801-6189')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Ana Paula Silveira Parente', '(65) 99801-6189', '00000000-0000-0000-0000-000000000002', '2026-02-23', '10:00:00', '10:30:00', 'cancelado', '2/12', 'Dhionara Sbrussi')
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
        WHERE date = '2026-02-23' 
          AND start_time = '10:45:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000006' 
          AND (client_name = 'Kathileenn Keilla de Souza Marca Bahia' OR client_phone = '(66) 99956-7922')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Kathileenn Keilla de Souza Marca Bahia', '(66) 99956-7922', '00000000-0000-0000-0000-000000000006', '2026-02-23', '10:45:00', '11:15:00', 'atendido', '', 'Agendamento')
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
        WHERE date = '2026-02-23' 
          AND start_time = '13:30:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000001' 
          AND (client_name = 'Dhionara Sbrussi Lorenzon.' OR client_phone = '(66) 99988-2911')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Dhionara Sbrussi Lorenzon.', '(66) 99988-2911', '00000000-0000-0000-0000-000000000001', '2026-02-23', '13:30:00', '14:00:00', 'agendado', '', 'Dhionara Sbrussi')
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
        WHERE date = '2026-02-23' 
          AND start_time = '13:30:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000002' 
          AND (client_name = 'Lisley Paz De Barros' OR client_phone = '(66) 99939-2957')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Lisley Paz De Barros', '(66) 99939-2957', '00000000-0000-0000-0000-000000000002', '2026-02-23', '13:30:00', '14:15:00', 'atendido', '2/5', 'Agendamento')
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
        WHERE date = '2026-02-23' 
          AND start_time = '14:00:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000003' 
          AND (client_name = 'Daizi Perozzo' OR client_phone = '(66) 98102-4551')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Daizi Perozzo', '(66) 98102-4551', '00000000-0000-0000-0000-000000000003', '2026-02-23', '14:00:00', '15:00:00', 'espera', '', 'Dhionara Sbrussi')
        RETURNING id INTO v_appointment_id;

        INSERT INTO appointment_services (appointment_id, service_name, duration_minutes)
        VALUES (v_appointment_id, 'Unha Mão', 60);
    END IF;
END $$;

DO $$
DECLARE
    v_appointment_id UUID;
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM appointments 
        WHERE date = '2026-02-23' 
          AND start_time = '14:00:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000007' 
          AND (client_name = 'Patricia armanda' OR client_phone = '(66) 98102-1849')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Patricia armanda', '(66) 98102-1849', '00000000-0000-0000-0000-000000000007', '2026-02-23', '14:00:00', '15:00:00', 'agendado', '', 'Agendamento')
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
        WHERE date = '2026-02-23' 
          AND start_time = '14:00:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000004' 
          AND (client_name = 'Patricia armanda' OR client_phone = '(66) 98102-1849')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Patricia armanda', '(66) 98102-1849', '00000000-0000-0000-0000-000000000004', '2026-02-23', '14:00:00', '15:00:00', 'atendido', '', 'Rafaela')
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
        WHERE date = '2026-02-23' 
          AND start_time = '14:15:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000002' 
          AND (client_name = 'Janainne Venicia Silva' OR client_phone = '(66) 99241-5675')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Janainne Venicia Silva', '(66) 99241-5675', '00000000-0000-0000-0000-000000000002', '2026-02-23', '14:15:00', '15:15:00', 'atendido', '', 'Agendamento')
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
        WHERE date = '2026-02-23' 
          AND start_time = '14:30:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000007' 
          AND (client_name = 'Dhionara Sbrussi Lorenzon.' OR client_phone = '(66) 99988-2911')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Dhionara Sbrussi Lorenzon.', '(66) 99988-2911', '00000000-0000-0000-0000-000000000007', '2026-02-23', '14:30:00', '15:30:00', 'atendido', '', 'Patricia Armanda')
        RETURNING id INTO v_appointment_id;

        INSERT INTO appointment_services (appointment_id, service_name, duration_minutes)
        VALUES (v_appointment_id, 'Alongamento de  Unha Fibra', 60);
    END IF;
END $$;

DO $$
DECLARE
    v_appointment_id UUID;
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM appointments 
        WHERE date = '2026-02-23' 
          AND start_time = '14:30:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000001' 
          AND (client_name = 'Divina Santana da Silva' OR client_phone = '(66) 99227-1319')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Divina Santana da Silva', '(66) 99227-1319', '00000000-0000-0000-0000-000000000001', '2026-02-23', '14:30:00', '15:00:00', 'atendido', '', 'Agendamento')
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
        WHERE date = '2026-02-23' 
          AND start_time = '14:30:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000004' 
          AND (client_name = 'Maria de Fatima Marques Pereira' OR client_phone = '(66) 99988-5188')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Maria de Fatima Marques Pereira', '(66) 99988-5188', '00000000-0000-0000-0000-000000000004', '2026-02-23', '14:30:00', '15:00:00', 'atendido', '', 'Agendamento')
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
        WHERE date = '2026-02-23' 
          AND start_time = '14:45:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000003' 
          AND (client_name = 'Andreia Cristiane Schosser' OR client_phone = '(66) 99607-4672')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Andreia Cristiane Schosser', '(66) 99607-4672', '00000000-0000-0000-0000-000000000003', '2026-02-23', '14:45:00', '15:45:00', 'atendido', '', 'Agendamento')
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
        WHERE date = '2026-02-23' 
          AND start_time = '14:45:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000004' 
          AND (client_name = 'Maria de Fatima Marques Pereira' OR client_phone = '(66) 99988-5188')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Maria de Fatima Marques Pereira', '(66) 99988-5188', '00000000-0000-0000-0000-000000000004', '2026-02-23', '14:45:00', '15:15:00', 'atendido', '', 'Agendamento')
        RETURNING id INTO v_appointment_id;

        INSERT INTO appointment_services (appointment_id, service_name, duration_minutes)
        VALUES (v_appointment_id, 'Depilação Buço', 30);
    END IF;
END $$;

DO $$
DECLARE
    v_appointment_id UUID;
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM appointments 
        WHERE date = '2026-02-23' 
          AND start_time = '15:00:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000001' 
          AND (client_name = 'Dhionara Sbrussi Lorenzon.' OR client_phone = '(66) 99988-2911')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Dhionara Sbrussi Lorenzon.', '(66) 99988-2911', '00000000-0000-0000-0000-000000000001', '2026-02-23', '15:00:00', '15:30:00', 'confirmado', '', 'Agendamento')
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
        WHERE date = '2026-02-23' 
          AND start_time = '15:00:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000006' 
          AND (client_name = 'Dhiani Sbrussi' OR client_phone = '(66) 99668-0462')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Dhiani Sbrussi', '(66) 99668-0462', '00000000-0000-0000-0000-000000000006', '2026-02-23', '15:00:00', '15:30:00', 'atendido', '', 'Agendamento')
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
        WHERE date = '2026-02-23' 
          AND start_time = '15:00:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000004' 
          AND (client_name = 'Andressa Geovana Maniotte Pavezi' OR client_phone = '(64) 99606-3431')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Andressa Geovana Maniotte Pavezi', '(64) 99606-3431', '00000000-0000-0000-0000-000000000004', '2026-02-23', '15:00:00', '15:30:00', 'atendido', '', 'Agendamento')
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
        WHERE date = '2026-02-23' 
          AND start_time = '15:00:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000002' 
          AND (client_name = 'Michele Angrizano Quintana' OR client_phone = '(66) 99217-0456')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Michele Angrizano Quintana', '(66) 99217-0456', '00000000-0000-0000-0000-000000000002', '2026-02-23', '15:00:00', '15:30:00', 'atendido', '', 'Agendamento')
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
        WHERE date = '2026-02-23' 
          AND start_time = '15:30:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000004' 
          AND (client_name = 'Andressa Geovana Maniotte Pavezi' OR client_phone = '(64) 99606-3431')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Andressa Geovana Maniotte Pavezi', '(64) 99606-3431', '00000000-0000-0000-0000-000000000004', '2026-02-23', '15:30:00', '16:00:00', 'atendido', '', 'Agendamento')
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
        WHERE date = '2026-02-23' 
          AND start_time = '15:45:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000007' 
          AND (client_name = 'Michele Angrizano Quintana' OR client_phone = '(66) 99217-0456')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Michele Angrizano Quintana', '(66) 99217-0456', '00000000-0000-0000-0000-000000000007', '2026-02-23', '15:45:00', '16:15:00', 'cancelado', '', 'Patricia Armanda')
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
        WHERE date = '2026-02-23' 
          AND start_time = '16:00:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000006' 
          AND (client_name = 'Sumaia' OR client_phone = '(66) 99661-7393')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Sumaia', '(66) 99661-7393', '00000000-0000-0000-0000-000000000006', '2026-02-23', '16:00:00', '16:30:00', 'atendendo', '', 'Agendamento')
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
        WHERE date = '2026-02-23' 
          AND start_time = '16:15:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000006' 
          AND (client_name = 'Michele Angrizano Quintana' OR client_phone = '(66) 99217-0456')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Michele Angrizano Quintana', '(66) 99217-0456', '00000000-0000-0000-0000-000000000006', '2026-02-23', '16:15:00', '16:45:00', 'falta', '', 'Agendamento')
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
        WHERE date = '2026-02-23' 
          AND start_time = '17:00:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000004' 
          AND (client_name = 'Gabriel Nogueira' OR client_phone = '(66) 98418-7521')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Gabriel Nogueira', '(66) 98418-7521', '00000000-0000-0000-0000-000000000004', '2026-02-23', '17:00:00', '17:30:00', 'atendido', '', 'Agendamento')
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
        WHERE date = '2026-02-23' 
          AND start_time = '17:15:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000007' 
          AND (client_name = 'Silvie' OR client_phone = '(64) 98410-2693')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Silvie', '(64) 98410-2693', '00000000-0000-0000-0000-000000000007', '2026-02-23', '17:15:00', '17:45:00', 'atendido', '', 'Patricia Armanda')
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
        WHERE date = '2026-02-23' 
          AND start_time = '17:30:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000003' 
          AND (client_name = 'Juliana' OR client_phone = '(66) 99989-8343')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Juliana', '(66) 99989-8343', '00000000-0000-0000-0000-000000000003', '2026-02-23', '17:30:00', '18:30:00', 'confirmado', '', 'Dhionara Sbrussi')
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
        WHERE date = '2026-02-23' 
          AND start_time = '18:45:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000007' 
          AND (client_name = 'Silvie' OR client_phone = '(64) 98410-2693')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Silvie', '(64) 98410-2693', '00000000-0000-0000-0000-000000000007', '2026-02-23', '18:45:00', '19:45:00', 'cancelado', '', 'Agendamento')
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
        WHERE date = '2026-02-21' 
          AND start_time = '08:00:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000007' 
          AND (client_name = 'Kauany Ketlyn Martins da Silva' OR client_phone = '(66) 98111-6652')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Kauany Ketlyn Martins da Silva', '(66) 98111-6652', '00000000-0000-0000-0000-000000000007', '2026-02-21', '08:00:00', '08:30:00', 'atendido', '', 'Rafaela')
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
        WHERE date = '2026-02-21' 
          AND start_time = '08:00:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000002' 
          AND (client_name = 'Jaqueline Micolino da Vega' OR client_phone = '(66) 99611-9874')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Jaqueline Micolino da Vega', '(66) 99611-9874', '00000000-0000-0000-0000-000000000002', '2026-02-21', '08:00:00', '08:30:00', 'cancelado', '6/12', 'Dhionara Sbrussi')
        RETURNING id INTO v_appointment_id;

        INSERT INTO appointment_services (appointment_id, service_name, duration_minutes)
        VALUES (v_appointment_id, 'Prime Bumbum', 30);
    END IF;
END $$;

DO $$
DECLARE
    v_appointment_id UUID;
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM appointments 
        WHERE date = '2026-02-21' 
          AND start_time = '08:00:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000006' 
          AND (client_name = 'Ludmilla rezende' OR client_phone = '(66) 99628-2182')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Ludmilla rezende', '(66) 99628-2182', '00000000-0000-0000-0000-000000000006', '2026-02-21', '08:00:00', '08:30:00', 'atendido', '', 'Rafaela')
        RETURNING id INTO v_appointment_id;

        INSERT INTO appointment_services (appointment_id, service_name, duration_minutes)
        VALUES (v_appointment_id, 'Soroterapia', 30);
    END IF;
END $$;

DO $$
DECLARE
    v_appointment_id UUID;
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM appointments 
        WHERE date = '2026-02-21' 
          AND start_time = '08:00:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000004' 
          AND (client_name = 'Edgar' OR client_phone = '(66) 99958-8563')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Edgar', '(66) 99958-8563', '00000000-0000-0000-0000-000000000004', '2026-02-21', '08:00:00', '09:00:00', 'cancelado', '', 'Dhionara Sbrussi')
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
        WHERE date = '2026-02-21' 
          AND start_time = '08:00:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000003' 
          AND (client_name = 'Edineia' OR client_phone = '(66) 98424-1535')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Edineia', '(66) 98424-1535', '00000000-0000-0000-0000-000000000003', '2026-02-21', '08:00:00', '09:00:00', 'atendido', '', 'Rafaela')
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
        WHERE date = '2026-02-21' 
          AND start_time = '09:00:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000001' 
          AND (client_name = 'Elisangela Marion' OR client_phone = '(66) 99662-4172')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Elisangela Marion', '(66) 99662-4172', '00000000-0000-0000-0000-000000000001', '2026-02-21', '09:00:00', '09:30:00', 'atendido', '', 'Rafaela')
        RETURNING id INTO v_appointment_id;

        INSERT INTO appointment_services (appointment_id, service_name, duration_minutes)
        VALUES (v_appointment_id, 'Lash Lifting', 30);
    END IF;
END $$;

DO $$
DECLARE
    v_appointment_id UUID;
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM appointments 
        WHERE date = '2026-02-21' 
          AND start_time = '09:00:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000004' 
          AND (client_name = 'Ana Canide' OR client_phone = '(66) 98131-3781')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Ana Canide', '(66) 98131-3781', '00000000-0000-0000-0000-000000000004', '2026-02-21', '09:00:00', '09:30:00', 'atendido', '', 'Tais Pires')
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
        WHERE date = '2026-02-21' 
          AND start_time = '09:00:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000006' 
          AND (client_name = 'Karla carvalho' OR client_phone = '(66) 98431-2323')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Karla carvalho', '(66) 98431-2323', '00000000-0000-0000-0000-000000000006', '2026-02-21', '09:00:00', '09:30:00', 'atendido', '', 'Rafaela')
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
        WHERE date = '2026-02-21' 
          AND start_time = '09:15:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000004' 
          AND (client_name = 'Arielly Luiza Pereira Gomes' OR client_phone = '(66) 98121-7167')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Arielly Luiza Pereira Gomes', '(66) 98121-7167', '00000000-0000-0000-0000-000000000004', '2026-02-21', '09:15:00', '09:45:00', 'espera', '', 'Dhionara Sbrussi')
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
        WHERE date = '2026-02-21' 
          AND start_time = '09:30:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000002' 
          AND (client_name = 'Ana Paula Silveira Parente' OR client_phone = '(65) 99801-6189')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Ana Paula Silveira Parente', '(65) 99801-6189', '00000000-0000-0000-0000-000000000002', '2026-02-21', '09:30:00', '10:15:00', 'cancelado', '1/10', 'Dhionara Sbrussi')
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
        WHERE date = '2026-02-21' 
          AND start_time = '09:30:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000006' 
          AND (client_name = 'Amabile Minozzo' OR client_phone = '(65) 99942-3559')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Amabile Minozzo', '(65) 99942-3559', '00000000-0000-0000-0000-000000000006', '2026-02-21', '09:30:00', '10:00:00', 'atendido', '', 'Rafaela')
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
        WHERE date = '2026-02-21' 
          AND start_time = '10:00:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000001' 
          AND (client_name = 'Dhionara Sbrussi Lorenzon.' OR client_phone = '(66) 99988-2911')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Dhionara Sbrussi Lorenzon.', '(66) 99988-2911', '00000000-0000-0000-0000-000000000001', '2026-02-21', '10:00:00', '10:30:00', 'atendido', '', 'Rafaela')
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
        WHERE date = '2026-02-21' 
          AND start_time = '10:00:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000003' 
          AND (client_name = 'Andreia Rosana Farias' OR client_phone = '(66) 98414-2372')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Andreia Rosana Farias', '(66) 98414-2372', '00000000-0000-0000-0000-000000000003', '2026-02-21', '10:00:00', '11:00:00', 'cancelado', '6/30', 'Dhionara Sbrussi')
        RETURNING id INTO v_appointment_id;

        INSERT INTO appointment_services (appointment_id, service_name, duration_minutes)
        VALUES (v_appointment_id, 'Unha Mão', 60);
    END IF;
END $$;

DO $$
DECLARE
    v_appointment_id UUID;
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM appointments 
        WHERE date = '2026-02-21' 
          AND start_time = '10:00:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000007' 
          AND (client_name = 'Liara Marmet da Silva' OR client_phone = '(66) 98408-3247')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Liara Marmet da Silva', '(66) 98408-3247', '00000000-0000-0000-0000-000000000007', '2026-02-21', '10:00:00', '10:30:00', 'atendido', 'Parceria', 'Patricia Armanda')
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
        WHERE date = '2026-02-21' 
          AND start_time = '10:00:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000006' 
          AND (client_name = 'Jessica gabe' OR client_phone = '(66) 9986-0835')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Jessica gabe', '(66) 9986-0835', '00000000-0000-0000-0000-000000000006', '2026-02-21', '10:00:00', '10:30:00', 'agendado', '', 'Agendamento')
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
        WHERE date = '2026-02-21' 
          AND start_time = '10:15:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000002' 
          AND (client_name = 'Jow Silva' OR client_phone = '(66) 98401-0335')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Jow Silva', '(66) 98401-0335', '00000000-0000-0000-0000-000000000002', '2026-02-21', '10:15:00', '11:15:00', 'falta', '', 'Rafaela')
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
        WHERE date = '2026-02-21' 
          AND start_time = '10:30:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000006' 
          AND (client_name = 'Debora Araujo' OR client_phone = '(66) 99984-1407')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Debora Araujo', '(66) 99984-1407', '00000000-0000-0000-0000-000000000006', '2026-02-21', '10:30:00', '11:00:00', 'espera', '', 'Dhionara Sbrussi')
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
        WHERE date = '2026-02-21' 
          AND start_time = '10:45:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000003' 
          AND (client_name = 'Nadir Maria Matioski Tavares' OR client_phone = '(66) 99689-6300')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Nadir Maria Matioski Tavares', '(66) 99689-6300', '00000000-0000-0000-0000-000000000003', '2026-02-21', '10:45:00', '11:45:00', 'atendido', '', 'Dhionara Sbrussi')
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
        WHERE date = '2026-02-21' 
          AND start_time = '11:00:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000006' 
          AND (client_name = 'Fabiana Silva Arruda Lansoni' OR client_phone = '(66) 99632-9265')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Fabiana Silva Arruda Lansoni', '(66) 99632-9265', '00000000-0000-0000-0000-000000000006', '2026-02-21', '11:00:00', '11:30:00', 'agendado', '', 'Michele Quintana')
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
        WHERE date = '2026-02-21' 
          AND start_time = '11:00:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000004' 
          AND (client_name = 'Janaina' OR client_phone = '(66) 99961-6910')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Janaina', '(66) 99961-6910', '00000000-0000-0000-0000-000000000004', '2026-02-21', '11:00:00', '11:30:00', 'atendido', '', 'Rafaela')
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
        WHERE date = '2026-02-21' 
          AND start_time = '11:15:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000004' 
          AND (client_name = 'Edilaine Mendes da Silva' OR client_phone = '(15) 98818-5067')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Edilaine Mendes da Silva', '(15) 98818-5067', '00000000-0000-0000-0000-000000000004', '2026-02-21', '11:15:00', '11:45:00', 'atendido', '', 'Agendamento')
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
        WHERE date = '2026-02-21' 
          AND start_time = '11:30:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000007' 
          AND (client_name = 'Dorinha' OR client_phone = '(66) 99679-8835')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Dorinha', '(66) 99679-8835', '00000000-0000-0000-0000-000000000007', '2026-02-21', '11:30:00', '12:00:00', 'atendido', 'Minha tia. Não cobrar', 'Patricia Armanda')
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
        WHERE date = '2026-02-20' 
          AND start_time = '07:00:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000005' 
          AND (client_name = 'Everiane Luzia Francisco da Silva Pezzini' OR client_phone = '(66) 99610-5382')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Everiane Luzia Francisco da Silva Pezzini', '(66) 99610-5382', '00000000-0000-0000-0000-000000000005', '2026-02-20', '07:00:00', '08:30:00', 'agendado', '6 meses botox', 'Bruna Castanheira')
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
        WHERE date = '2026-02-20' 
          AND start_time = '07:30:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000005' 
          AND (client_name = 'Kimberly Martins da Serra' OR client_phone = '(66) 98420-8024')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Kimberly Martins da Serra', '(66) 98420-8024', '00000000-0000-0000-0000-000000000005', '2026-02-20', '07:30:00', '09:00:00', 'agendado', '6 meses botox', 'Bruna Castanheira')
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
        WHERE date = '2026-02-20' 
          AND start_time = '08:00:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000002' 
          AND (client_name = 'Dhiani Sbrussi' OR client_phone = '(66) 99668-0462')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Dhiani Sbrussi', '(66) 99668-0462', '00000000-0000-0000-0000-000000000002', '2026-02-20', '08:00:00', '08:30:00', 'atendido', '', 'Agendamento')
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
        WHERE date = '2026-02-20' 
          AND start_time = '08:00:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000007' 
          AND (client_name = 'Dhiani Sbrussi' OR client_phone = '(66) 99668-0462')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Dhiani Sbrussi', '(66) 99668-0462', '00000000-0000-0000-0000-000000000007', '2026-02-20', '08:00:00', '08:30:00', 'atendido', '', 'Patricia Armanda')
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
        WHERE date = '2026-02-20' 
          AND start_time = '08:00:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000003' 
          AND (client_name = 'Gilda' OR client_phone = '(66) 99988-6461')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Gilda', '(66) 99988-6461', '00000000-0000-0000-0000-000000000003', '2026-02-20', '08:00:00', '09:00:00', 'atendido', '', 'Rafaela')
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
        WHERE date = '2026-02-20' 
          AND start_time = '09:00:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000001' 
          AND (client_name = 'Mariane Paixão Iora' OR client_phone = '(66) 99922-7533')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Mariane Paixão Iora', '(66) 99922-7533', '00000000-0000-0000-0000-000000000001', '2026-02-20', '09:00:00', '09:30:00', 'atendido', '', 'Agendamento')
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
        WHERE date = '2026-02-20' 
          AND start_time = '09:30:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000001' 
          AND (client_name = 'Maria de Lurdes Moreto Moresco' OR client_phone = '(66) 98460-0438')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Maria de Lurdes Moreto Moresco', '(66) 98460-0438', '00000000-0000-0000-0000-000000000001', '2026-02-20', '09:30:00', '10:00:00', 'atendido', '', 'Agendamento')
        RETURNING id INTO v_appointment_id;

        INSERT INTO appointment_services (appointment_id, service_name, duration_minutes)
        VALUES (v_appointment_id, 'Manutenção olho', 30);
    END IF;
END $$;

COMMIT;