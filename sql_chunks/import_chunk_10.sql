BEGIN;
DO $$
DECLARE
    v_appointment_id UUID;
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM appointments 
        WHERE date = '2026-02-13' 
          AND start_time = '09:00:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000006' 
          AND (client_name = 'SIMONE LIMA' OR client_phone = '(66) 98411-5333')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('SIMONE LIMA', '(66) 98411-5333', '00000000-0000-0000-0000-000000000006', '2026-02-13', '09:00:00', '09:30:00', 'atendido', '', 'Agendamento')
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
        WHERE date = '2026-02-13' 
          AND start_time = '09:30:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000004' 
          AND (client_name = 'Izabela Azevedo' OR client_phone = '(66) 98113-2265')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Izabela Azevedo', '(66) 98113-2265', '00000000-0000-0000-0000-000000000004', '2026-02-13', '09:30:00', '10:00:00', 'cancelado', '', 'Dhionara Sbrussi')
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
        WHERE date = '2026-02-13' 
          AND start_time = '09:30:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000001' 
          AND (client_name = 'Mineia Gomes Trindade Suzuki' OR client_phone = '(66) 98458-2273')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Mineia Gomes Trindade Suzuki', '(66) 98458-2273', '00000000-0000-0000-0000-000000000001', '2026-02-13', '09:30:00', '10:00:00', 'atendido', '', 'Agendamento')
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
        WHERE date = '2026-02-13' 
          AND start_time = '09:30:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000002' 
          AND (client_name = 'Kelly Lindemann' OR client_phone = '(66) 99974-8696')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Kelly Lindemann', '(66) 99974-8696', '00000000-0000-0000-0000-000000000002', '2026-02-13', '09:30:00', '10:00:00', 'atendido', '', 'Rafaela')
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
        WHERE date = '2026-02-13' 
          AND start_time = '09:30:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000004' 
          AND (client_name = 'Diane Barros' OR client_phone = '(66) 98115-6096')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Diane Barros', '(66) 98115-6096', '00000000-0000-0000-0000-000000000004', '2026-02-13', '09:30:00', '10:00:00', 'atendido', '', 'Rafaela')
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
        WHERE date = '2026-02-13' 
          AND start_time = '10:00:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000002' 
          AND (client_name = 'Paula Fernanda Ferreira Godoy' OR client_phone = '(66) 99686-6244')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Paula Fernanda Ferreira Godoy', '(66) 99686-6244', '00000000-0000-0000-0000-000000000002', '2026-02-13', '10:00:00', '10:45:00', 'cancelado', '', 'Dhionara Sbrussi')
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
        WHERE date = '2026-02-13' 
          AND start_time = '10:00:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000001' 
          AND (client_name = 'Lenilce Oliveira Santos Souza' OR client_phone = '(63) 99229-1296')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Lenilce Oliveira Santos Souza', '(63) 99229-1296', '00000000-0000-0000-0000-000000000001', '2026-02-13', '10:00:00', '10:30:00', 'atendido', '', 'Rafaela')
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
        WHERE date = '2026-02-13' 
          AND start_time = '10:00:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000004' 
          AND (client_name = 'Diane Barros' OR client_phone = '(66) 98115-6096')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Diane Barros', '(66) 98115-6096', '00000000-0000-0000-0000-000000000004', '2026-02-13', '10:00:00', '10:30:00', 'atendido', '', 'Rafaela')
        RETURNING id INTO v_appointment_id;

        INSERT INTO appointment_services (appointment_id, service_name, duration_minutes)
        VALUES (v_appointment_id, 'Depilação Axila', 30);
    END IF;
END $$;

DO $$
DECLARE
    v_appointment_id UUID;
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM appointments 
        WHERE date = '2026-02-13' 
          AND start_time = '10:15:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000004' 
          AND (client_name = 'Diane Barros' OR client_phone = '(66) 98115-6096')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Diane Barros', '(66) 98115-6096', '00000000-0000-0000-0000-000000000004', '2026-02-13', '10:15:00', '10:45:00', 'atendido', '', 'Agendamento')
        RETURNING id INTO v_appointment_id;

        INSERT INTO appointment_services (appointment_id, service_name, duration_minutes)
        VALUES (v_appointment_id, 'Depilação Perna', 30);
    END IF;
END $$;

DO $$
DECLARE
    v_appointment_id UUID;
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM appointments 
        WHERE date = '2026-02-13' 
          AND start_time = '10:30:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000005' 
          AND (client_name = 'Luderli Carneiro Santana Vasconcelos' OR client_phone = '(66) 99937-7472')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Luderli Carneiro Santana Vasconcelos', '(66) 99937-7472', '00000000-0000-0000-0000-000000000005', '2026-02-13', '10:30:00', '11:00:00', 'atendido', 'fios', 'Bruna Castanheira')
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
        WHERE date = '2026-02-13' 
          AND start_time = '10:30:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000006' 
          AND (client_name = 'JUNIOR CIPRIANI' OR client_phone = '(66) 99640-6723')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('JUNIOR CIPRIANI', '(66) 99640-6723', '00000000-0000-0000-0000-000000000006', '2026-02-13', '10:30:00', '11:00:00', 'atendido', '', 'Rafaela')
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
        WHERE date = '2026-02-13' 
          AND start_time = '10:45:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000004' 
          AND (client_name = 'Suzamar Ferreira Sbrussi' OR client_phone = '(66) 98438-2646')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Suzamar Ferreira Sbrussi', '(66) 98438-2646', '00000000-0000-0000-0000-000000000004', '2026-02-13', '10:45:00', '11:15:00', 'atendido', '', 'Agendamento')
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
        WHERE date = '2026-02-13' 
          AND start_time = '11:00:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000004' 
          AND (client_name = 'Carina Martini Fernandes' OR client_phone = '(66) 99988-5228')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Carina Martini Fernandes', '(66) 99988-5228', '00000000-0000-0000-0000-000000000004', '2026-02-13', '11:00:00', '11:30:00', 'falta', '', 'Tais Pires')
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
        WHERE date = '2026-02-13' 
          AND start_time = '11:00:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000006' 
          AND (client_name = 'Ingrid Gabe' OR client_phone = '(66) 99634-9161')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Ingrid Gabe', '(66) 99634-9161', '00000000-0000-0000-0000-000000000006', '2026-02-13', '11:00:00', '11:30:00', 'atendido', '', 'Rafaela')
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
        WHERE date = '2026-02-13' 
          AND start_time = '11:00:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000007' 
          AND (client_name = 'Amabile Minozzo' OR client_phone = '(65) 99942-3559')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Amabile Minozzo', '(65) 99942-3559', '00000000-0000-0000-0000-000000000007', '2026-02-13', '11:00:00', '11:30:00', 'atendido', '', 'Rafaela')
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
        WHERE date = '2026-02-13' 
          AND start_time = '11:15:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000004' 
          AND (client_name = 'Carina Martini Fernandes' OR client_phone = '(66) 99988-5228')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Carina Martini Fernandes', '(66) 99988-5228', '00000000-0000-0000-0000-000000000004', '2026-02-13', '11:15:00', '11:45:00', 'falta', '', 'Tais Pires')
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
        WHERE date = '2026-02-13' 
          AND start_time = '13:30:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000001' 
          AND (client_name = 'Celina Cicilia Secco Cabelho' OR client_phone = '(66) 98115-4101')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Celina Cicilia Secco Cabelho', '(66) 98115-4101', '00000000-0000-0000-0000-000000000001', '2026-02-13', '13:30:00', '14:00:00', 'atendido', '', 'Rafaela')
        RETURNING id INTO v_appointment_id;

        INSERT INTO appointment_services (appointment_id, service_name, duration_minutes)
        VALUES (v_appointment_id, 'Micropigmentação de Sobrancelhas', 30);
    END IF;
END $$;

DO $$
DECLARE
    v_appointment_id UUID;
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM appointments 
        WHERE date = '2026-02-13' 
          AND start_time = '14:00:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000006' 
          AND (client_name = 'Suzamar Ferreira Sbrussi' OR client_phone = '(66) 98438-2646')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Suzamar Ferreira Sbrussi', '(66) 98438-2646', '00000000-0000-0000-0000-000000000006', '2026-02-13', '14:00:00', '14:30:00', 'atendido', '', 'Rafaela')
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
        WHERE date = '2026-02-13' 
          AND start_time = '14:00:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000002' 
          AND (client_name = 'Lisley Paz De Barros' OR client_phone = '(66) 99939-2957')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Lisley Paz De Barros', '(66) 99939-2957', '00000000-0000-0000-0000-000000000002', '2026-02-13', '14:00:00', '14:45:00', 'atendido', '2/5', 'Agendamento')
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
        WHERE date = '2026-02-13' 
          AND start_time = '14:00:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000004' 
          AND (client_name = 'Fabiane Tebald' OR client_phone = '(66) 99987-4874')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Fabiane Tebald', '(66) 99987-4874', '00000000-0000-0000-0000-000000000004', '2026-02-13', '14:00:00', '14:30:00', 'atendido', '', 'Tais Pires')
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
        WHERE date = '2026-02-13' 
          AND start_time = '14:00:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000003' 
          AND (client_name = 'Patricia armanda' OR client_phone = '(66) 98102-1849')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Patricia armanda', '(66) 98102-1849', '00000000-0000-0000-0000-000000000003', '2026-02-13', '14:00:00', '15:00:00', 'atendido', '', 'Agendamento')
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
        WHERE date = '2026-02-13' 
          AND start_time = '14:00:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000007' 
          AND (client_name = 'Patricia armanda' OR client_phone = '(66) 98102-1849')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Patricia armanda', '(66) 98102-1849', '00000000-0000-0000-0000-000000000007', '2026-02-13', '14:00:00', '14:30:00', 'atendido', '', 'Rafaela')
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
        WHERE date = '2026-02-13' 
          AND start_time = '14:15:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000004' 
          AND (client_name = 'Fabiane Tebald' OR client_phone = '(66) 99987-4874')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Fabiane Tebald', '(66) 99987-4874', '00000000-0000-0000-0000-000000000004', '2026-02-13', '14:15:00', '14:45:00', 'atendido', '', 'Tais Pires')
        RETURNING id INTO v_appointment_id;

        INSERT INTO appointment_services (appointment_id, service_name, duration_minutes)
        VALUES (v_appointment_id, 'Depilação Meia Perna', 30);
    END IF;
END $$;

DO $$
DECLARE
    v_appointment_id UUID;
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM appointments 
        WHERE date = '2026-02-13' 
          AND start_time = '14:30:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000001' 
          AND (client_name = 'Wenio Ramos Neres Silva' OR client_phone = '(66) 99962-1941')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Wenio Ramos Neres Silva', '(66) 99962-1941', '00000000-0000-0000-0000-000000000001', '2026-02-13', '14:30:00', '15:00:00', 'atendido', '350', 'Agendamento')
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
        WHERE date = '2026-02-13' 
          AND start_time = '14:45:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000004' 
          AND (client_name = 'Fabiane Tebald' OR client_phone = '(66) 99987-4874')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Fabiane Tebald', '(66) 99987-4874', '00000000-0000-0000-0000-000000000004', '2026-02-13', '14:45:00', '15:15:00', 'atendido', '', 'Tais Pires')
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
        WHERE date = '2026-02-13' 
          AND start_time = '15:00:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000001' 
          AND (client_name = 'Orlinda Rosa  dos Reis Almeida' OR client_phone = '(54) 99639-8148')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Orlinda Rosa  dos Reis Almeida', '(54) 99639-8148', '00000000-0000-0000-0000-000000000001', '2026-02-13', '15:00:00', '15:30:00', 'atendido', '', 'Dhionara Sbrussi')
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
        WHERE date = '2026-02-13' 
          AND start_time = '15:00:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000003' 
          AND (client_name = 'Rosangela farias Aguiar' OR client_phone = '(66) 98462-6828')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Rosangela farias Aguiar', '(66) 98462-6828', '00000000-0000-0000-0000-000000000003', '2026-02-13', '15:00:00', '16:00:00', 'atendido', '', 'Agendamento')
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
        WHERE date = '2026-02-13' 
          AND start_time = '15:00:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000005' 
          AND (client_name = 'Luciana Mendonça' OR client_phone = '(66) 99660-8098')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Luciana Mendonça', '(66) 99660-8098', '00000000-0000-0000-0000-000000000005', '2026-02-13', '15:00:00', '15:30:00', 'cancelado', 'horario para a filha', 'Bruna Castanheira')
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
        WHERE date = '2026-02-13' 
          AND start_time = '15:00:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000006' 
          AND (client_name = 'Mara Regina Siegel Roffmann' OR client_phone = '(66) 99209-4733')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Mara Regina Siegel Roffmann', '(66) 99209-4733', '00000000-0000-0000-0000-000000000006', '2026-02-13', '15:00:00', '15:30:00', 'agendado', '', 'Michele Quintana')
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
        WHERE date = '2026-02-13' 
          AND start_time = '15:00:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000007' 
          AND (client_name = 'Ariele Guerino' OR client_phone = '(66) 98136-3924')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Ariele Guerino', '(66) 98136-3924', '00000000-0000-0000-0000-000000000007', '2026-02-13', '15:00:00', '15:30:00', 'atendido', '', 'Agendamento')
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
        WHERE date = '2026-02-13' 
          AND start_time = '15:00:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000002' 
          AND (client_name = 'Geny Almeida Sobrinho' OR client_phone = '(66) 99988-3973')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Geny Almeida Sobrinho', '(66) 99988-3973', '00000000-0000-0000-0000-000000000002', '2026-02-13', '15:00:00', '15:30:00', 'atendido', '', 'Agendamento')
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
        WHERE date = '2026-02-13' 
          AND start_time = '15:00:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000005' 
          AND (client_name = 'Cinthya Carvalho' OR client_phone = '(84) 99863-7533')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Cinthya Carvalho', '(84) 99863-7533', '00000000-0000-0000-0000-000000000005', '2026-02-13', '15:00:00', '15:30:00', 'atendido', '', 'Bruna Castanheira')
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
        WHERE date = '2026-02-13' 
          AND start_time = '15:15:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000002' 
          AND (client_name = 'Ines Maria Scheneider dos Santos' OR client_phone = '(66) 99676-3033')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Ines Maria Scheneider dos Santos', '(66) 99676-3033', '00000000-0000-0000-0000-000000000002', '2026-02-13', '15:15:00', '16:00:00', 'cancelado', '4/20', 'Dhionara Sbrussi')
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
        WHERE date = '2026-02-13' 
          AND start_time = '15:15:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000004' 
          AND (client_name = 'Aline Bertol' OR client_phone = '(66) 99619-6505')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Aline Bertol', '(66) 99619-6505', '00000000-0000-0000-0000-000000000004', '2026-02-13', '15:15:00', '15:45:00', 'atendido', '', 'Tais Pires')
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
        WHERE date = '2026-02-13' 
          AND start_time = '15:30:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000006' 
          AND (client_name = 'Andressa' OR client_phone = '(65) 99240-4585')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Andressa', '(65) 99240-4585', '00000000-0000-0000-0000-000000000006', '2026-02-13', '15:30:00', '16:00:00', 'agendado', '', 'Dhionara Sbrussi')
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
        WHERE date = '2026-02-13' 
          AND start_time = '16:00:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000002' 
          AND (client_name = 'Suzamar Ferreira Sbrussi' OR client_phone = '(66) 98438-2646')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Suzamar Ferreira Sbrussi', '(66) 98438-2646', '00000000-0000-0000-0000-000000000002', '2026-02-13', '16:00:00', '16:30:00', 'agendado', '', 'Dhiani Sbrussi')
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
        WHERE date = '2026-02-13' 
          AND start_time = '16:00:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000005' 
          AND (client_name = 'Tatiane Nicoletti' OR client_phone = '(66) 99685-8581')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Tatiane Nicoletti', '(66) 99685-8581', '00000000-0000-0000-0000-000000000005', '2026-02-13', '16:00:00', '16:30:00', 'atendido', 'Retorno botox', 'Bruna Castanheira')
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
        WHERE date = '2026-02-13' 
          AND start_time = '16:00:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000006' 
          AND (client_name = 'Daiany Priscilla Bueno da Silva' OR client_phone = '(62) 98170-0948')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Daiany Priscilla Bueno da Silva', '(62) 98170-0948', '00000000-0000-0000-0000-000000000006', '2026-02-13', '16:00:00', '16:30:00', 'confirmado', '', 'Dhionara Sbrussi')
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
        WHERE date = '2026-02-13' 
          AND start_time = '16:00:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000003' 
          AND (client_name = 'Sullyana Karla Almeida Simões' OR client_phone = '(66) 99659-2333')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Sullyana Karla Almeida Simões', '(66) 99659-2333', '00000000-0000-0000-0000-000000000003', '2026-02-13', '16:00:00', '17:00:00', 'espera', '', 'Dhionara Sbrussi')
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
        WHERE date = '2026-02-13' 
          AND start_time = '16:30:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000004' 
          AND (client_name = 'Kauany Ketlyn Martins da Silva' OR client_phone = '(66) 98111-6652')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Kauany Ketlyn Martins da Silva', '(66) 98111-6652', '00000000-0000-0000-0000-000000000004', '2026-02-13', '16:30:00', '17:00:00', 'atendido', '', 'Agendamento')
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
        WHERE date = '2026-02-13' 
          AND start_time = '16:30:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000005' 
          AND (client_name = 'Fernanda Mottes' OR client_phone = '(66) 98406-7713')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Fernanda Mottes', '(66) 98406-7713', '00000000-0000-0000-0000-000000000005', '2026-02-13', '16:30:00', '17:00:00', 'atendido', 'E Botox', 'Bruna Castanheira')
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
        WHERE date = '2026-02-13' 
          AND start_time = '17:00:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000004' 
          AND (client_name = 'ANDERSON LORENZON' OR client_phone = '(66) 9989-2491')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('ANDERSON LORENZON', '(66) 9989-2491', '00000000-0000-0000-0000-000000000004', '2026-02-13', '17:00:00', '17:30:00', 'atendido', '', 'Agendamento')
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
        WHERE date = '2026-02-13' 
          AND start_time = '17:00:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000004' 
          AND (client_name = 'Sullyana Karla Almeida Simões' OR client_phone = '(66) 99659-2333')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Sullyana Karla Almeida Simões', '(66) 99659-2333', '00000000-0000-0000-0000-000000000004', '2026-02-13', '17:00:00', '17:30:00', 'espera', '', 'Dhionara Sbrussi')
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
        WHERE date = '2026-02-13' 
          AND start_time = '17:00:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000007' 
          AND (client_name = 'Alana Maia' OR client_phone = '(66) 99927-0074')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Alana Maia', '(66) 99927-0074', '00000000-0000-0000-0000-000000000007', '2026-02-13', '17:00:00', '17:30:00', 'atendido', '', 'Rafaela')
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
        WHERE date = '2026-02-13' 
          AND start_time = '17:15:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000004' 
          AND (client_name = 'Gabriel Andrade' OR client_phone = '(62) 99246-4568')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Gabriel Andrade', '(62) 99246-4568', '00000000-0000-0000-0000-000000000004', '2026-02-13', '17:15:00', '17:45:00', 'atendido', '', 'Agendamento')
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
        WHERE date = '2026-02-13' 
          AND start_time = '17:30:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000001' 
          AND (client_name = 'Helen Carla' OR client_phone = '(66) 99687-9946')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Helen Carla', '(66) 99687-9946', '00000000-0000-0000-0000-000000000001', '2026-02-13', '17:30:00', '18:00:00', 'atendido', '', 'Rafaela')
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
        WHERE date = '2026-02-13' 
          AND start_time = '17:30:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000006' 
          AND (client_name = 'Leidiana Venina Ferreira da Silva Alencastro' OR client_phone = '(65) 99239-0819')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Leidiana Venina Ferreira da Silva Alencastro', '(65) 99239-0819', '00000000-0000-0000-0000-000000000006', '2026-02-13', '17:30:00', '18:00:00', 'agendado', '', 'Dhionara Sbrussi')
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
        WHERE date = '2026-02-13' 
          AND start_time = '17:40:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000004' 
          AND (client_name = 'Clarissa machado' OR client_phone = '(62) 98312-4537')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Clarissa machado', '(62) 98312-4537', '00000000-0000-0000-0000-000000000004', '2026-02-13', '17:40:00', '18:10:00', 'atendido', '', 'Rafaela')
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
        WHERE date = '2026-02-13' 
          AND start_time = '17:45:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000004' 
          AND (client_name = 'Jhenifer wendling' OR client_phone = '(66) 98461-5710')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Jhenifer wendling', '(66) 98461-5710', '00000000-0000-0000-0000-000000000004', '2026-02-13', '17:45:00', '18:15:00', 'atendido', '', 'Rafaela')
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
        WHERE date = '2026-02-13' 
          AND start_time = '17:45:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000001' 
          AND (client_name = 'Muriele' OR client_phone = '(21) 96995-4621')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Muriele', '(21) 96995-4621', '00000000-0000-0000-0000-000000000001', '2026-02-13', '17:45:00', '18:15:00', 'atendido', 'pg', 'Rafaela')
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
        WHERE date = '2026-02-13' 
          AND start_time = '18:00:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000004' 
          AND (client_name = 'Tais Pires' OR client_phone = '(66) 98132-6656')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Tais Pires', '(66) 98132-6656', '00000000-0000-0000-0000-000000000004', '2026-02-13', '18:00:00', '19:00:00', 'confirmado', '', 'Agendamento')
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
        WHERE date = '2026-02-13' 
          AND start_time = '18:00:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000003' 
          AND (client_name = 'Tais Pires' OR client_phone = '(66) 98132-6656')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Tais Pires', '(66) 98132-6656', '00000000-0000-0000-0000-000000000003', '2026-02-13', '18:00:00', '19:00:00', 'confirmado', '', 'Agendamento')
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
        WHERE date = '2026-02-13' 
          AND start_time = '18:00:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000005' 
          AND (client_name = 'Cléia Babosa de souza' OR client_phone = '(66) 99988-1485')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Cléia Babosa de souza', '(66) 99988-1485', '00000000-0000-0000-0000-000000000005', '2026-02-13', '18:00:00', '18:30:00', 'atendido', '', 'Bruna Castanheira')
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
        WHERE date = '2026-02-13' 
          AND start_time = '18:00:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000001' 
          AND (client_name = 'Renata' OR client_phone = '(62) 99268-4048')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Renata', '(62) 99268-4048', '00000000-0000-0000-0000-000000000001', '2026-02-13', '18:00:00', '18:30:00', 'atendido', '', 'Agendamento')
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
        WHERE date = '2026-02-13' 
          AND start_time = '18:30:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000007' 
          AND (client_name = 'Calita Solange' OR client_phone = '(66) 99719-7391')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Calita Solange', '(66) 99719-7391', '00000000-0000-0000-0000-000000000007', '2026-02-13', '18:30:00', '19:00:00', 'confirmado', '', 'Dhionara Sbrussi')
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
        WHERE date = '2026-02-12' 
          AND start_time = '08:00:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000003' 
          AND (client_name = 'Karoline Luzia Penha' OR client_phone = '(66) 99647-5011')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Karoline Luzia Penha', '(66) 99647-5011', '00000000-0000-0000-0000-000000000003', '2026-02-12', '08:00:00', '09:00:00', 'atendido', '', 'Agendamento')
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
        WHERE date = '2026-02-12' 
          AND start_time = '08:00:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000004' 
          AND (client_name = 'Luciana Adrinaves' OR client_phone = '(66) 98431-0743')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Luciana Adrinaves', '(66) 98431-0743', '00000000-0000-0000-0000-000000000004', '2026-02-12', '08:00:00', '08:30:00', 'atendido', '', 'Tais Pires')
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
        WHERE date = '2026-02-12' 
          AND start_time = '08:00:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000007' 
          AND (client_name = 'Francyelly' OR client_phone = '(66) 98421-3533')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Francyelly', '(66) 98421-3533', '00000000-0000-0000-0000-000000000007', '2026-02-12', '08:00:00', '09:00:00', 'cancelado', '', 'Patricia Armanda')
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
        WHERE date = '2026-02-12' 
          AND start_time = '08:00:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000007' 
          AND (client_name = 'Renata Carvalho' OR client_phone = '(66) 98111-8654')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Renata Carvalho', '(66) 98111-8654', '00000000-0000-0000-0000-000000000007', '2026-02-12', '08:00:00', '08:30:00', 'atendido', '', 'Agendamento')
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
        WHERE date = '2026-02-12' 
          AND start_time = '08:15:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000004' 
          AND (client_name = 'Willyane Alves Luz.' OR client_phone = '(66) 98417-4358')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Willyane Alves Luz.', '(66) 98417-4358', '00000000-0000-0000-0000-000000000004', '2026-02-12', '08:15:00', '08:45:00', 'cancelado', '', 'Bruna Castanheira')
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
        WHERE date = '2026-02-12' 
          AND start_time = '08:30:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000006' 
          AND (client_name = 'Ingrid Gabe' OR client_phone = '(66) 99634-9161')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Ingrid Gabe', '(66) 99634-9161', '00000000-0000-0000-0000-000000000006', '2026-02-12', '08:30:00', '09:00:00', 'atendido', '', 'Agendamento')
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
        WHERE date = '2026-02-12' 
          AND start_time = '08:30:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000001' 
          AND (client_name = 'Leticia Almeida' OR client_phone = '(66) 98117-9766')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Leticia Almeida', '(66) 98117-9766', '00000000-0000-0000-0000-000000000001', '2026-02-12', '08:30:00', '09:00:00', 'cancelado', '', 'Dhionara Sbrussi')
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
        WHERE date = '2026-02-12' 
          AND start_time = '08:45:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000004' 
          AND (client_name = 'Izabela Azevedo' OR client_phone = '(66) 98113-2265')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Izabela Azevedo', '(66) 98113-2265', '00000000-0000-0000-0000-000000000004', '2026-02-12', '08:45:00', '09:15:00', 'atendido', '', 'Tais Pires')
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
        WHERE date = '2026-02-12' 
          AND start_time = '09:00:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000003' 
          AND (client_name = 'Rafaela Sbrussi Lorenzon' OR client_phone = '(66) 98411-2902')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Rafaela Sbrussi Lorenzon', '(66) 98411-2902', '00000000-0000-0000-0000-000000000003', '2026-02-12', '09:00:00', '10:00:00', 'cancelado', '', 'Rafaela')
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
        WHERE date = '2026-02-12' 
          AND start_time = '09:00:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000006' 
          AND (client_name = 'Luci Ferreira Dutra Trêss' OR client_phone = '(66) 99615-9463')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Luci Ferreira Dutra Trêss', '(66) 99615-9463', '00000000-0000-0000-0000-000000000006', '2026-02-12', '09:00:00', '09:30:00', 'atendido', '', 'Agendamento')
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
        WHERE date = '2026-02-12' 
          AND start_time = '09:00:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000004' 
          AND (client_name = 'Wanderson Eckert' OR client_phone = '(66) 98155-5855')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Wanderson Eckert', '(66) 98155-5855', '00000000-0000-0000-0000-000000000004', '2026-02-12', '09:00:00', '09:30:00', 'falta', '', 'Agendamento')
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
        WHERE date = '2026-02-12' 
          AND start_time = '09:30:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000005' 
          AND (client_name = 'Bruna Lorrany Castanheira' OR client_phone = '(66) 98434-3545')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Bruna Lorrany Castanheira', '(66) 98434-3545', '00000000-0000-0000-0000-000000000005', '2026-02-12', '09:30:00', '10:00:00', 'agendado', '1/20', 'Bruna Castanheira')
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
        WHERE date = '2026-02-12' 
          AND start_time = '09:30:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000007' 
          AND (client_name = 'Bruna Lorrany Castanheira' OR client_phone = '(66) 98434-3545')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Bruna Lorrany Castanheira', '(66) 98434-3545', '00000000-0000-0000-0000-000000000007', '2026-02-12', '09:30:00', '10:00:00', 'atendido', '', 'Patricia Armanda')
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
        WHERE date = '2026-02-12' 
          AND start_time = '09:30:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000004' 
          AND (client_name = 'Laura Daiana Rodrigues de Oliveira' OR client_phone = '(66) 98114-4858')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Laura Daiana Rodrigues de Oliveira', '(66) 98114-4858', '00000000-0000-0000-0000-000000000004', '2026-02-12', '09:30:00', '10:30:00', 'atendido', '', 'Agendamento')
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
        WHERE date = '2026-02-12' 
          AND start_time = '10:00:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000003' 
          AND (client_name = 'Patricia Pinton Dos Santos Garrutti' OR client_phone = '(66) 99975-4661')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Patricia Pinton Dos Santos Garrutti', '(66) 99975-4661', '00000000-0000-0000-0000-000000000003', '2026-02-12', '10:00:00', '11:00:00', 'cancelado', '5/10', 'Dhionara Sbrussi')
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
        WHERE date = '2026-02-12' 
          AND start_time = '10:00:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000004' 
          AND (client_name = 'Kerollen Dinathan Moreira Silva' OR client_phone = '(66) 98138-1568')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Kerollen Dinathan Moreira Silva', '(66) 98138-1568', '00000000-0000-0000-0000-000000000004', '2026-02-12', '10:00:00', '10:30:00', 'atendido', '', 'Tais Pires')
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
        WHERE date = '2026-02-12' 
          AND start_time = '10:00:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000006' 
          AND (client_name = 'Sullyana Karla Almeida Simões' OR client_phone = '(66) 99659-2333')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Sullyana Karla Almeida Simões', '(66) 99659-2333', '00000000-0000-0000-0000-000000000006', '2026-02-12', '10:00:00', '10:30:00', 'agendado', '', 'Agendamento')
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
        WHERE date = '2026-02-12' 
          AND start_time = '10:30:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000004' 
          AND (client_name = 'Kerollen Dinathan Moreira Silva' OR client_phone = '(66) 98138-1568')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Kerollen Dinathan Moreira Silva', '(66) 98138-1568', '00000000-0000-0000-0000-000000000004', '2026-02-12', '10:30:00', '11:00:00', 'atendido', '', 'Tais Pires')
        RETURNING id INTO v_appointment_id;

        INSERT INTO appointment_services (appointment_id, service_name, duration_minutes)
        VALUES (v_appointment_id, 'Depilação de Nariz', 30);
    END IF;
END $$;

DO $$
DECLARE
    v_appointment_id UUID;
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM appointments 
        WHERE date = '2026-02-12' 
          AND start_time = '11:00:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000004' 
          AND (client_name = 'Patricia Pinton Dos Santos Garrutti' OR client_phone = '(66) 99975-4661')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Patricia Pinton Dos Santos Garrutti', '(66) 99975-4661', '00000000-0000-0000-0000-000000000004', '2026-02-12', '11:00:00', '11:30:00', 'atendido', '14/30', 'Tais Pires')
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
        WHERE date = '2026-02-12' 
          AND start_time = '13:30:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000003' 
          AND (client_name = 'Delvanda Maia' OR client_phone = '(66) 99217-1372')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Delvanda Maia', '(66) 99217-1372', '00000000-0000-0000-0000-000000000003', '2026-02-12', '13:30:00', '14:30:00', 'atendido', '', 'Rafaela')
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
        WHERE date = '2026-02-12' 
          AND start_time = '13:30:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000006' 
          AND (client_name = 'Juliane' OR client_phone = '(66) 98410-1970')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Juliane', '(66) 98410-1970', '00000000-0000-0000-0000-000000000006', '2026-02-12', '13:30:00', '14:00:00', 'atendido', '', 'Rafaela')
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
        WHERE date = '2026-02-12' 
          AND start_time = '13:30:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000002' 
          AND (client_name = 'Aline Rodrigues' OR client_phone = '(54) 99635-2405')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Aline Rodrigues', '(54) 99635-2405', '00000000-0000-0000-0000-000000000002', '2026-02-12', '13:30:00', '14:00:00', 'cancelado', '', 'Dhionara Sbrussi')
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
        WHERE date = '2026-02-12' 
          AND start_time = '14:00:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000007' 
          AND (client_name = 'Suzamar Ferreira Sbrussi' OR client_phone = '(66) 98438-2646')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Suzamar Ferreira Sbrussi', '(66) 98438-2646', '00000000-0000-0000-0000-000000000007', '2026-02-12', '14:00:00', '14:30:00', 'atendido', '', 'Rafaela')
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
        WHERE date = '2026-02-12' 
          AND start_time = '14:00:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000005' 
          AND (client_name = 'Dayanne Freitas Martins Garcia' OR client_phone = '(34) 99974-7786')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Dayanne Freitas Martins Garcia', '(34) 99974-7786', '00000000-0000-0000-0000-000000000005', '2026-02-12', '14:00:00', '14:30:00', 'atendido', 'talvez Lavieen, quer avaliar primeiro', 'Bruna Castanheira')
        RETURNING id INTO v_appointment_id;

        INSERT INTO appointment_services (appointment_id, service_name, duration_minutes)
        VALUES (v_appointment_id, 'Microagulhamento', 30);
    END IF;
END $$;

DO $$
DECLARE
    v_appointment_id UUID;
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM appointments 
        WHERE date = '2026-02-12' 
          AND start_time = '14:15:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000001' 
          AND (client_name = 'Sebastiana Pereira Campos' OR client_phone = '(66) 99612-8122')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Sebastiana Pereira Campos', '(66) 99612-8122', '00000000-0000-0000-0000-000000000001', '2026-02-12', '14:15:00', '14:45:00', 'atendido', '', 'Agendamento')
        RETURNING id INTO v_appointment_id;

        INSERT INTO appointment_services (appointment_id, service_name, duration_minutes)
        VALUES (v_appointment_id, 'Micropigmentação de Sobrancelhas', 30);
    END IF;
END $$;

DO $$
DECLARE
    v_appointment_id UUID;
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM appointments 
        WHERE date = '2026-02-12' 
          AND start_time = '15:30:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000001' 
          AND (client_name = 'Delvanda Maia' OR client_phone = '(66) 99217-1372')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Delvanda Maia', '(66) 99217-1372', '00000000-0000-0000-0000-000000000001', '2026-02-12', '15:30:00', '16:00:00', 'atendido', '', 'Agendamento')
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
        WHERE date = '2026-02-12' 
          AND start_time = '15:30:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000005' 
          AND (client_name = 'Flavia Lanfredi Guimaraes.' OR client_phone = '(66) 99998-1720')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Flavia Lanfredi Guimaraes.', '(66) 99998-1720', '00000000-0000-0000-0000-000000000005', '2026-02-12', '15:30:00', '17:00:00', 'atendido', '', 'Rafaela')
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
        WHERE date = '2026-02-12' 
          AND start_time = '15:45:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000001' 
          AND (client_name = 'Valéria Magna Gonzaga Ferreira' OR client_phone = '(66) 99216-7870')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Valéria Magna Gonzaga Ferreira', '(66) 99216-7870', '00000000-0000-0000-0000-000000000001', '2026-02-12', '15:45:00', '16:15:00', 'atendido', 'promo', 'Agendamento')
        RETURNING id INTO v_appointment_id;

        INSERT INTO appointment_services (appointment_id, service_name, duration_minutes)
        VALUES (v_appointment_id, 'Micropigmentação de Sobrancelhas', 30);
    END IF;
END $$;

DO $$
DECLARE
    v_appointment_id UUID;
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM appointments 
        WHERE date = '2026-02-12' 
          AND start_time = '16:00:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000003' 
          AND (client_name = 'Suzamar Ferreira Sbrussi' OR client_phone = '(66) 98438-2646')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Suzamar Ferreira Sbrussi', '(66) 98438-2646', '00000000-0000-0000-0000-000000000003', '2026-02-12', '16:00:00', '17:00:00', 'atendido', '12/30', 'Agendamento')
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
        WHERE date = '2026-02-12' 
          AND start_time = '16:00:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000003' 
          AND (client_name = 'Marli Salete de Avila Sbrussi' OR client_phone = '(66) 98412-6906')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Marli Salete de Avila Sbrussi', '(66) 98412-6906', '00000000-0000-0000-0000-000000000003', '2026-02-12', '16:00:00', '17:00:00', 'cancelado', '19/20', 'Dhionara Sbrussi')
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
        WHERE date = '2026-02-12' 
          AND start_time = '16:00:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000006' 
          AND (client_name = 'Michele Angrizano Quintana' OR client_phone = '(66) 99217-0456')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Michele Angrizano Quintana', '(66) 99217-0456', '00000000-0000-0000-0000-000000000006', '2026-02-12', '16:00:00', '16:30:00', 'atendido', '', 'Rafaela')
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
        WHERE date = '2026-02-12' 
          AND start_time = '16:00:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000002' 
          AND (client_name = 'Daiany Priscilla Bueno da Silva' OR client_phone = '(62) 98170-0948')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Daiany Priscilla Bueno da Silva', '(62) 98170-0948', '00000000-0000-0000-0000-000000000002', '2026-02-12', '16:00:00', '16:30:00', 'atendido', '', 'Rafaela')
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
        WHERE date = '2026-02-12' 
          AND start_time = '16:00:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000007' 
          AND (client_name = 'Andressa' OR client_phone = '(65) 99240-4585')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Andressa', '(65) 99240-4585', '00000000-0000-0000-0000-000000000007', '2026-02-12', '16:00:00', '16:30:00', 'atendido', '', 'Rafaela')
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
        WHERE date = '2026-02-12' 
          AND start_time = '16:00:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000004' 
          AND (client_name = 'ROSILENE TEREZINHA RECKZIEGEL GIACOMLLI' OR client_phone = '(66) 99211-0508')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('ROSILENE TEREZINHA RECKZIEGEL GIACOMLLI', '(66) 99211-0508', '00000000-0000-0000-0000-000000000004', '2026-02-12', '16:00:00', '17:00:00', 'atendido', '', 'Agendamento')
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
        WHERE date = '2026-02-12' 
          AND start_time = '16:30:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000005' 
          AND (client_name = 'Scarlet Bohen Carneiro' OR client_phone = '(66) 98478-0722')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Scarlet Bohen Carneiro', '(66) 98478-0722', '00000000-0000-0000-0000-000000000005', '2026-02-12', '16:30:00', '18:00:00', 'atendido', 'Bigode chinês', 'Bruna Castanheira')
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
        WHERE date = '2026-02-12' 
          AND start_time = '16:30:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000004' 
          AND (client_name = 'SALETE HANEL' OR client_phone = '(66) 98133-1662')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('SALETE HANEL', '(66) 98133-1662', '00000000-0000-0000-0000-000000000004', '2026-02-12', '16:30:00', '17:30:00', 'atendido', '', 'Rafaela')
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
        WHERE date = '2026-02-12' 
          AND start_time = '16:30:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000005' 
          AND (client_name = 'Gabriela Fernandes Malta' OR client_phone = '(66) 99999-7026')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Gabriela Fernandes Malta', '(66) 99999-7026', '00000000-0000-0000-0000-000000000005', '2026-02-12', '16:30:00', '17:00:00', 'espera', 'online', 'Bruna Castanheira')
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
        WHERE date = '2026-02-12' 
          AND start_time = '16:45:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000002' 
          AND (client_name = 'Luciane dos santos' OR client_phone = '(66) 99644-1530')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Luciane dos santos', '(66) 99644-1530', '00000000-0000-0000-0000-000000000002', '2026-02-12', '16:45:00', '17:15:00', 'atendido', '', 'Rafaela')
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
        WHERE date = '2026-02-12' 
          AND start_time = '17:00:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000003' 
          AND (client_name = 'Ana paula taveira dos santos' OR client_phone = '(66) 98463-8360')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Ana paula taveira dos santos', '(66) 98463-8360', '00000000-0000-0000-0000-000000000003', '2026-02-12', '17:00:00', '18:00:00', 'atendido', '', 'Rafaela')
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
        WHERE date = '2026-02-12' 
          AND start_time = '17:30:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000001' 
          AND (client_name = 'Jaqueline Nunes de Oliveira' OR client_phone = '(66) 98433-1907')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Jaqueline Nunes de Oliveira', '(66) 98433-1907', '00000000-0000-0000-0000-000000000001', '2026-02-12', '17:30:00', '19:00:00', 'atendendo', '', 'Rafaela')
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
        WHERE date = '2026-02-12' 
          AND start_time = '17:30:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000005' 
          AND (client_name = 'Valesca Tura' OR client_phone = '(66) 98432-8530')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Valesca Tura', '(66) 98432-8530', '00000000-0000-0000-0000-000000000005', '2026-02-12', '17:30:00', '18:00:00', 'atendido', 'Terceira sessão/ irá pagar as duas sessões', 'Rafaela')
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
        WHERE date = '2026-02-12' 
          AND start_time = '17:40:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000004' 
          AND (client_name = 'Deriene' OR client_phone = '(67) 99653-9644')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Deriene', '(67) 99653-9644', '00000000-0000-0000-0000-000000000004', '2026-02-12', '17:40:00', '18:40:00', 'cancelado', '', 'Dhionara Sbrussi')
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
        WHERE date = '2026-02-12' 
          AND start_time = '18:00:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000005' 
          AND (client_name = 'Laura Adriana Carvalho' OR client_phone = '(66) 98447-8762')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Laura Adriana Carvalho', '(66) 98447-8762', '00000000-0000-0000-0000-000000000005', '2026-02-12', '18:00:00', '18:30:00', 'atendido', 'Restante da harmonização', 'Bruna Castanheira')
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
        WHERE date = '2026-02-11' 
          AND start_time = '08:00:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000007' 
          AND (client_name = 'Rafaela Sbrussi Lorenzon' OR client_phone = '(66) 98411-2902')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Rafaela Sbrussi Lorenzon', '(66) 98411-2902', '00000000-0000-0000-0000-000000000007', '2026-02-11', '08:00:00', '09:00:00', 'atendido', '', 'Agendamento')
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
        WHERE date = '2026-02-11' 
          AND start_time = '08:00:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000003' 
          AND (client_name = 'Marcia Nascimento Evangelista' OR client_phone = '(66) 99935-9113')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Marcia Nascimento Evangelista', '(66) 99935-9113', '00000000-0000-0000-0000-000000000003', '2026-02-11', '08:00:00', '09:00:00', 'atendido', '1/20', 'Agendamento')
        RETURNING id INTO v_appointment_id;

        INSERT INTO appointment_services (appointment_id, service_name, duration_minutes)
        VALUES (v_appointment_id, 'Unha Pé e mão', 60);
    END IF;
END $$;

COMMIT;