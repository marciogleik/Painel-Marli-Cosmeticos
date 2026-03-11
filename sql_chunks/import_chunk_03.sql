BEGIN;
DO $$
DECLARE
    v_appointment_id UUID;
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM appointments 
        WHERE date = '2026-03-07' 
          AND start_time = '11:00:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000003' 
          AND (client_name = 'Amabile Minozzo' OR client_phone = '(65) 99942-3559')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Amabile Minozzo', '(65) 99942-3559', '00000000-0000-0000-0000-000000000003', '2026-03-07', '11:00:00', '12:00:00', 'atendido', '', 'Agendamento')
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
        WHERE date = '2026-03-07' 
          AND start_time = '11:45:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000004' 
          AND (client_name = 'Tatiane Caroline  Vefago henz' OR client_phone = '(66) 98147-8919')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Tatiane Caroline  Vefago henz', '(66) 98147-8919', '00000000-0000-0000-0000-000000000004', '2026-03-07', '11:45:00', '12:15:00', 'atendido', '', 'Tais Pires')
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
        WHERE date = '2026-03-07' 
          AND start_time = '12:00:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000007' 
          AND (client_name = 'Taynara' OR client_phone = '(66) 98443-7804')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Taynara', '(66) 98443-7804', '00000000-0000-0000-0000-000000000007', '2026-03-07', '12:00:00', '12:30:00', 'confirmado', 'Não cobrar (minha irmã)', 'Patricia Armanda')
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
        WHERE date = '2026-03-07' 
          AND start_time = '14:00:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000007' 
          AND (client_name = 'Luiza' OR client_phone = '(66) 99276-1089')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Luiza', '(66) 99276-1089', '00000000-0000-0000-0000-000000000007', '2026-03-07', '14:00:00', '15:00:00', 'cancelado', '', 'Dhionara Sbrussi')
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
        WHERE date = '2026-03-07' 
          AND start_time = '16:00:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000005' 
          AND (client_name = 'Fabiana Silva Arruda Lansoni' OR client_phone = '(66) 99632-9265')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Fabiana Silva Arruda Lansoni', '(66) 99632-9265', '00000000-0000-0000-0000-000000000005', '2026-03-07', '16:00:00', '16:30:00', 'atendido', 'botox', 'Bruna Castanheira')
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
        WHERE date = '2026-03-06' 
          AND start_time = '07:00:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000005' 
          AND (client_name = 'Maria do Carmo Jesus Bispo' OR client_phone = '(34) 62356-6372')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Maria do Carmo Jesus Bispo', '(34) 62356-6372', '00000000-0000-0000-0000-000000000005', '2026-03-06', '07:00:00', '07:30:00', 'agendado', 'Mandar mensagem para agendar o Botox', 'Bruna Castanheira')
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
        WHERE date = '2026-03-06' 
          AND start_time = '08:00:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000006' 
          AND (client_name = 'Suzamar Ferreira Sbrussi' OR client_phone = '(66) 98438-2646')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Suzamar Ferreira Sbrussi', '(66) 98438-2646', '00000000-0000-0000-0000-000000000006', '2026-03-06', '08:00:00', '08:30:00', 'atendido', '', 'Agendamento')
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
        WHERE date = '2026-03-06' 
          AND start_time = '08:00:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000007' 
          AND (client_name = 'Raissa' OR client_phone = '(66) 98158-9735')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Raissa', '(66) 98158-9735', '00000000-0000-0000-0000-000000000007', '2026-03-06', '08:00:00', '08:30:00', 'atendido', '', 'Rafaela')
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
        WHERE date = '2026-03-06' 
          AND start_time = '08:30:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000002' 
          AND (client_name = 'Adylaine Alves' OR client_phone = '(66) 99965-1911')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Adylaine Alves', '(66) 99965-1911', '00000000-0000-0000-0000-000000000002', '2026-03-06', '08:30:00', '09:00:00', 'atendido', '', 'Dhiani Sbrussi')
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
        WHERE date = '2026-03-06' 
          AND start_time = '08:30:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000006' 
          AND (client_name = 'Karullyn' OR client_phone = '(66) 99931-1314')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Karullyn', '(66) 99931-1314', '00000000-0000-0000-0000-000000000006', '2026-03-06', '08:30:00', '09:00:00', 'confirmado', '', 'Dhionara Sbrussi')
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
        WHERE date = '2026-03-06' 
          AND start_time = '08:30:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000001' 
          AND (client_name = 'Ludmilla Morgana' OR client_phone = '(77) 99843-3149')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Ludmilla Morgana', '(77) 99843-3149', '00000000-0000-0000-0000-000000000001', '2026-03-06', '08:30:00', '09:00:00', 'atendido', '', 'Rafaela')
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
        WHERE date = '2026-03-06' 
          AND start_time = '09:00:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000004' 
          AND (client_name = 'Ana Claudia Freitas da Cruz Branquinho' OR client_phone = '(66) 99688-1705')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Ana Claudia Freitas da Cruz Branquinho', '(66) 99688-1705', '00000000-0000-0000-0000-000000000004', '2026-03-06', '09:00:00', '09:30:00', 'atendido', '', 'Agendamento')
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
        WHERE date = '2026-03-06' 
          AND start_time = '09:00:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000006' 
          AND (client_name = 'Etianete' OR client_phone = '(66) 99683-0850')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Etianete', '(66) 99683-0850', '00000000-0000-0000-0000-000000000006', '2026-03-06', '09:00:00', '09:30:00', 'agendado', '', 'Michele Quintana')
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
        WHERE date = '2026-03-06' 
          AND start_time = '09:00:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000006' 
          AND (client_name = 'Luzinei Ferreira Dutra' OR client_phone = '(66) 98446-1826')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Luzinei Ferreira Dutra', '(66) 98446-1826', '00000000-0000-0000-0000-000000000006', '2026-03-06', '09:00:00', '09:30:00', 'cancelado', '', 'Dhionara Sbrussi')
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
        WHERE date = '2026-03-06' 
          AND start_time = '09:00:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000001' 
          AND (client_name = 'Ludmilla Morgana' OR client_phone = '(77) 99843-3149')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Ludmilla Morgana', '(77) 99843-3149', '00000000-0000-0000-0000-000000000001', '2026-03-06', '09:00:00', '09:30:00', 'atendido', '', 'Rafaela')
        RETURNING id INTO v_appointment_id;

        INSERT INTO appointment_services (appointment_id, service_name, duration_minutes)
        VALUES (v_appointment_id, 'Prime Up (Brow Lamination)', 30);
    END IF;
END $$;

DO $$
DECLARE
    v_appointment_id UUID;
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM appointments 
        WHERE date = '2026-03-06' 
          AND start_time = '10:00:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000001' 
          AND (client_name = 'Marilia Monteiro' OR client_phone = '(66) 98467-3668')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Marilia Monteiro', '(66) 98467-3668', '00000000-0000-0000-0000-000000000001', '2026-03-06', '10:00:00', '10:30:00', 'cancelado', '', 'Dhionara Sbrussi')
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
        WHERE date = '2026-03-06' 
          AND start_time = '10:00:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000004' 
          AND (client_name = 'Lia irene Monteiro' OR client_phone = '(66) 99659-5811')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Lia irene Monteiro', '(66) 99659-5811', '00000000-0000-0000-0000-000000000004', '2026-03-06', '10:00:00', '11:00:00', 'atendido', '', 'Tais Pires')
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
        WHERE date = '2026-03-06' 
          AND start_time = '10:30:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000001' 
          AND (client_name = 'Patrícia Cristina da Costa Silva' OR client_phone = '(66) 99618-0906')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Patrícia Cristina da Costa Silva', '(66) 99618-0906', '00000000-0000-0000-0000-000000000001', '2026-03-06', '10:30:00', '11:00:00', 'atendido', '', 'Dhionara Sbrussi')
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
        WHERE date = '2026-03-06' 
          AND start_time = '11:00:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000004' 
          AND (client_name = 'Catia Maria de Abreu' OR client_phone = '(66) 99656-8080')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Catia Maria de Abreu', '(66) 99656-8080', '00000000-0000-0000-0000-000000000004', '2026-03-06', '11:00:00', '11:30:00', 'atendido', '', 'Dhionara Sbrussi')
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
        WHERE date = '2026-03-06' 
          AND start_time = '11:00:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000006' 
          AND (client_name = 'Ingrid Gabe' OR client_phone = '(66) 99634-9161')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Ingrid Gabe', '(66) 99634-9161', '00000000-0000-0000-0000-000000000006', '2026-03-06', '11:00:00', '11:30:00', 'atendido', '', 'Dhionara Sbrussi')
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
        WHERE date = '2026-03-06' 
          AND start_time = '11:00:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000001' 
          AND (client_name = 'Lia irene Monteiro' OR client_phone = '(66) 99659-5811')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Lia irene Monteiro', '(66) 99659-5811', '00000000-0000-0000-0000-000000000001', '2026-03-06', '11:00:00', '11:30:00', 'atendido', '', 'Dhionara Sbrussi')
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
        WHERE date = '2026-03-06' 
          AND start_time = '13:30:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000001' 
          AND (client_name = 'Dhionara Sbrussi Lorenzon.' OR client_phone = '(66) 99988-2911')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Dhionara Sbrussi Lorenzon.', '(66) 99988-2911', '00000000-0000-0000-0000-000000000001', '2026-03-06', '13:30:00', '14:00:00', 'agendado', 'mercado', 'Rafaela')
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
        WHERE date = '2026-03-06' 
          AND start_time = '13:30:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000002' 
          AND (client_name = 'Lisley Paz De Barros' OR client_phone = '(66) 99939-2957')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Lisley Paz De Barros', '(66) 99939-2957', '00000000-0000-0000-0000-000000000002', '2026-03-06', '13:30:00', '14:15:00', 'espera', '5/5', 'Dhiani Sbrussi')
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
        WHERE date = '2026-03-06' 
          AND start_time = '13:30:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000006' 
          AND (client_name = 'Amabile Minozzo' OR client_phone = '(65) 99942-3559')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Amabile Minozzo', '(65) 99942-3559', '00000000-0000-0000-0000-000000000006', '2026-03-06', '13:30:00', '14:00:00', 'atendido', '', 'Agendamento')
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
        WHERE date = '2026-03-06' 
          AND start_time = '13:45:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000001' 
          AND (client_name = 'Dhionara Sbrussi Lorenzon.' OR client_phone = '(66) 99988-2911')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Dhionara Sbrussi Lorenzon.', '(66) 99988-2911', '00000000-0000-0000-0000-000000000001', '2026-03-06', '13:45:00', '14:15:00', 'cancelado', 'mercado', 'Agendamento')
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
        WHERE date = '2026-03-06' 
          AND start_time = '14:00:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000007' 
          AND (client_name = 'Rosana Perozzo' OR client_phone = '(66) 99979-9630')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Rosana Perozzo', '(66) 99979-9630', '00000000-0000-0000-0000-000000000007', '2026-03-06', '14:00:00', '14:30:00', 'atendido', '', 'Patricia Armanda')
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
        WHERE date = '2026-03-06' 
          AND start_time = '14:00:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000004' 
          AND (client_name = 'Alana Biazi' OR client_phone = '(66) 99663-2260')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Alana Biazi', '(66) 99663-2260', '00000000-0000-0000-0000-000000000004', '2026-03-06', '14:00:00', '15:00:00', 'atendido', '', 'Tais Pires')
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
        WHERE date = '2026-03-06' 
          AND start_time = '14:00:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000005' 
          AND (client_name = 'Eliete Fabio Zandona' OR client_phone = '(66) 98411-0361')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Eliete Fabio Zandona', '(66) 98411-0361', '00000000-0000-0000-0000-000000000005', '2026-03-06', '14:00:00', '14:30:00', 'atendido', '', 'Rafaela')
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
        WHERE date = '2026-03-06' 
          AND start_time = '14:00:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000006' 
          AND (client_name = 'Juliane Lucia Modolo' OR client_phone = '(66) 98409-3397')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Juliane Lucia Modolo', '(66) 98409-3397', '00000000-0000-0000-0000-000000000006', '2026-03-06', '14:00:00', '14:30:00', 'atendido', '', 'Agendamento')
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
        WHERE date = '2026-03-06' 
          AND start_time = '14:15:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000002' 
          AND (client_name = 'Aline Rodrigues' OR client_phone = '(54) 99635-2405')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Aline Rodrigues', '(54) 99635-2405', '00000000-0000-0000-0000-000000000002', '2026-03-06', '14:15:00', '14:45:00', 'cancelado', '', 'Dhionara Sbrussi')
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
        WHERE date = '2026-03-06' 
          AND start_time = '14:30:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000004' 
          AND (client_name = 'kayla Maihery Lourenço Silva' OR client_phone = '(66) 99918-0655')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('kayla Maihery Lourenço Silva', '(66) 99918-0655', '00000000-0000-0000-0000-000000000004', '2026-03-06', '14:30:00', '15:30:00', 'atendido', '', 'Tais Pires')
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
        WHERE date = '2026-03-06' 
          AND start_time = '14:30:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000001' 
          AND (client_name = 'Katryne Georgea Moura Santos' OR client_phone = '(62) 99664-2518')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Katryne Georgea Moura Santos', '(62) 99664-2518', '00000000-0000-0000-0000-000000000001', '2026-03-06', '14:30:00', '15:00:00', 'atendido', '', 'Dhionara Sbrussi')
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
        WHERE date = '2026-03-06' 
          AND start_time = '15:00:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000003' 
          AND (client_name = 'Suzamar Ferreira Sbrussi' OR client_phone = '(66) 98438-2646')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Suzamar Ferreira Sbrussi', '(66) 98438-2646', '00000000-0000-0000-0000-000000000003', '2026-03-06', '15:00:00', '16:00:00', 'atendido', '15/30', 'Agendamento')
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
        WHERE date = '2026-03-06' 
          AND start_time = '15:00:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000006' 
          AND (client_name = 'Helaine Cristina Santos Barbosa' OR client_phone = '(66) 99988-9676')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Helaine Cristina Santos Barbosa', '(66) 99988-9676', '00000000-0000-0000-0000-000000000006', '2026-03-06', '15:00:00', '15:30:00', 'atendido', '', 'Rafaela')
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
        WHERE date = '2026-03-06' 
          AND start_time = '15:00:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000001' 
          AND (client_name = 'Amanda Karine Boing Santi Calixto' OR client_phone = '(66) 99696-2386')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Amanda Karine Boing Santi Calixto', '(66) 99696-2386', '00000000-0000-0000-0000-000000000001', '2026-03-06', '15:00:00', '15:30:00', 'atendido', '', 'Dhionara Sbrussi')
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
        WHERE date = '2026-03-06' 
          AND start_time = '15:15:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000002' 
          AND (client_name = 'Ines Maria Scheneider dos Santos' OR client_phone = '(66) 99676-3033')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Ines Maria Scheneider dos Santos', '(66) 99676-3033', '00000000-0000-0000-0000-000000000002', '2026-03-06', '15:15:00', '16:00:00', 'cancelado', '7/20', 'Dhiani Sbrussi')
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
        WHERE date = '2026-03-06' 
          AND start_time = '15:15:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000002' 
          AND (client_name = 'Geny Almeida Sobrinho' OR client_phone = '(66) 99988-3973')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Geny Almeida Sobrinho', '(66) 99988-3973', '00000000-0000-0000-0000-000000000002', '2026-03-06', '15:15:00', '15:45:00', 'atendido', '', 'Agendamento')
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
        WHERE date = '2026-03-06' 
          AND start_time = '15:30:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000007' 
          AND (client_name = 'Lidyane Amorim Rodrigues' OR client_phone = '(66) 99998-2890')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Lidyane Amorim Rodrigues', '(66) 99998-2890', '00000000-0000-0000-0000-000000000007', '2026-03-06', '15:30:00', '16:00:00', 'cancelado', '', 'Dhionara Sbrussi')
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
        WHERE date = '2026-03-06' 
          AND start_time = '15:30:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000004' 
          AND (client_name = 'kayla Maihery Lourenço Silva' OR client_phone = '(66) 99918-0655')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('kayla Maihery Lourenço Silva', '(66) 99918-0655', '00000000-0000-0000-0000-000000000004', '2026-03-06', '15:30:00', '16:00:00', 'atendido', '', 'Tais Pires')
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
        WHERE date = '2026-03-06' 
          AND start_time = '15:30:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000001' 
          AND (client_name = 'Patricia Damaren' OR client_phone = '(66) 99661-5455')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Patricia Damaren', '(66) 99661-5455', '00000000-0000-0000-0000-000000000001', '2026-03-06', '15:30:00', '16:00:00', 'atendido', '', 'Agendamento')
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
        WHERE date = '2026-03-06' 
          AND start_time = '15:30:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000007' 
          AND (client_name = 'Leidiane Aparecida de Souza' OR client_phone = '(66) 99605-8883')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Leidiane Aparecida de Souza', '(66) 99605-8883', '00000000-0000-0000-0000-000000000007', '2026-03-06', '15:30:00', '16:00:00', 'atendido', '', 'Agendamento')
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
        WHERE date = '2026-03-06' 
          AND start_time = '15:45:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000003' 
          AND (client_name = 'Ana Claudia Freitas da Cruz Branquinho' OR client_phone = '(66) 99688-1705')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Ana Claudia Freitas da Cruz Branquinho', '(66) 99688-1705', '00000000-0000-0000-0000-000000000003', '2026-03-06', '15:45:00', '16:45:00', 'atendido', '', 'Rafaela')
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
        WHERE date = '2026-03-06' 
          AND start_time = '15:45:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000004' 
          AND (client_name = 'Ana clara do Nascimento Thomé' OR client_phone = '(66) 99714-2167')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Ana clara do Nascimento Thomé', '(66) 99714-2167', '00000000-0000-0000-0000-000000000004', '2026-03-06', '15:45:00', '16:15:00', 'atendido', '', 'Agendamento')
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
        WHERE date = '2026-03-06' 
          AND start_time = '16:00:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000004' 
          AND (client_name = 'Margarete Capitanio' OR client_phone = '(66) 99658-9586')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Margarete Capitanio', '(66) 99658-9586', '00000000-0000-0000-0000-000000000004', '2026-03-06', '16:00:00', '16:30:00', 'atendido', '', 'Agendamento')
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
        WHERE date = '2026-03-06' 
          AND start_time = '16:00:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000005' 
          AND (client_name = 'Bruna Pimentel Rafaeli' OR client_phone = '(66) 99903-7559')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Bruna Pimentel Rafaeli', '(66) 99903-7559', '00000000-0000-0000-0000-000000000005', '2026-03-06', '16:00:00', '16:30:00', 'atendido', '', 'Rafaela')
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
        WHERE date = '2026-03-06' 
          AND start_time = '16:00:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000006' 
          AND (client_name = 'Bruno' OR client_phone = '(66) 99204-0802')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Bruno', '(66) 99204-0802', '00000000-0000-0000-0000-000000000006', '2026-03-06', '16:00:00', '16:30:00', 'atendido', '', 'Rafaela')
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
        WHERE date = '2026-03-06' 
          AND start_time = '16:00:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000006' 
          AND (client_name = 'DINAURA FRANCISCA DE SOUZA' OR client_phone = '(66) 99988-1067')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('DINAURA FRANCISCA DE SOUZA', '(66) 99988-1067', '00000000-0000-0000-0000-000000000006', '2026-03-06', '16:00:00', '16:30:00', 'cancelado', '', 'Dhionara Sbrussi')
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
        WHERE date = '2026-03-06' 
          AND start_time = '16:15:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000002' 
          AND (client_name = 'Suzamar Ferreira Sbrussi' OR client_phone = '(66) 98438-2646')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Suzamar Ferreira Sbrussi', '(66) 98438-2646', '00000000-0000-0000-0000-000000000002', '2026-03-06', '16:15:00', '17:00:00', 'cancelado', '', 'Dhionara Sbrussi')
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
        WHERE date = '2026-03-06' 
          AND start_time = '16:15:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000002' 
          AND (client_name = 'Kauany Ketlyn Martins da Silva' OR client_phone = '(66) 98111-6652')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Kauany Ketlyn Martins da Silva', '(66) 98111-6652', '00000000-0000-0000-0000-000000000002', '2026-03-06', '16:15:00', '16:45:00', 'atendido', 'enzimas', 'Agendamento')
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
        WHERE date = '2026-03-06' 
          AND start_time = '16:15:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000004' 
          AND (client_name = 'Gleksane Liell' OR client_phone = '(66) 99926-0577')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Gleksane Liell', '(66) 99926-0577', '00000000-0000-0000-0000-000000000004', '2026-03-06', '16:15:00', '16:45:00', 'atendido', '', 'Tais Pires')
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
        WHERE date = '2026-03-06' 
          AND start_time = '16:15:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000001' 
          AND (client_name = 'Ligia Moura' OR client_phone = '(66) 98424-3674')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Ligia Moura', '(66) 98424-3674', '00000000-0000-0000-0000-000000000001', '2026-03-06', '16:15:00', '16:45:00', 'atendido', '', 'Agendamento')
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
        WHERE date = '2026-03-06' 
          AND start_time = '16:30:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000004' 
          AND (client_name = 'Kauany Ketlyn Martins da Silva' OR client_phone = '(66) 98111-6652')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Kauany Ketlyn Martins da Silva', '(66) 98111-6652', '00000000-0000-0000-0000-000000000004', '2026-03-06', '16:30:00', '17:30:00', 'atendido', '', 'Agendamento')
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
        WHERE date = '2026-03-06' 
          AND start_time = '16:30:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000005' 
          AND (client_name = 'Alana Biazi' OR client_phone = '(66) 99663-2260')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Alana Biazi', '(66) 99663-2260', '00000000-0000-0000-0000-000000000005', '2026-03-06', '16:30:00', '17:00:00', 'atendido', '', 'Bruna Castanheira')
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
        WHERE date = '2026-03-06' 
          AND start_time = '17:00:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000005' 
          AND (client_name = 'Divani Soler' OR client_phone = '(66) 99625-4644')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Divani Soler', '(66) 99625-4644', '00000000-0000-0000-0000-000000000005', '2026-03-06', '17:00:00', '18:30:00', 'atendido', 'Lábios', 'Rafaela')
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
        WHERE date = '2026-03-06' 
          AND start_time = '17:00:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000006' 
          AND (client_name = 'TEREZA ARMANDA' OR client_phone = '(66) 98133-4831')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('TEREZA ARMANDA', '(66) 98133-4831', '00000000-0000-0000-0000-000000000006', '2026-03-06', '17:00:00', '17:30:00', 'cancelado', '', 'Dhionara Sbrussi')
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
        WHERE date = '2026-03-06' 
          AND start_time = '17:30:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000004' 
          AND (client_name = 'Roberta Bonomo' OR client_phone = '(66) 99604-3253')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Roberta Bonomo', '(66) 99604-3253', '00000000-0000-0000-0000-000000000004', '2026-03-06', '17:30:00', '18:00:00', 'atendido', '', 'Agendamento')
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
        WHERE date = '2026-03-06' 
          AND start_time = '17:30:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000006' 
          AND (client_name = 'Michelle Tamara Ferreira de Sousa' OR client_phone = '(66) 8449-3980')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Michelle Tamara Ferreira de Sousa', '(66) 8449-3980', '00000000-0000-0000-0000-000000000006', '2026-03-06', '17:30:00', '18:00:00', 'agendado', '', 'Dhionara Sbrussi')
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
        WHERE date = '2026-03-06' 
          AND start_time = '17:30:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000003' 
          AND (client_name = 'Barbara Camilo Rosa' OR client_phone = '(17) 99158-9785')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Barbara Camilo Rosa', '(17) 99158-9785', '00000000-0000-0000-0000-000000000003', '2026-03-06', '17:30:00', '18:30:00', 'atendendo', '12/20', 'Agendamento')
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
        WHERE date = '2026-03-06' 
          AND start_time = '17:30:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000007' 
          AND (client_name = 'Milena Reichert Vedovatto' OR client_phone = '(54) 99150-9978')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Milena Reichert Vedovatto', '(54) 99150-9978', '00000000-0000-0000-0000-000000000007', '2026-03-06', '17:30:00', '18:00:00', 'atendido', '', 'Patricia Armanda')
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
        WHERE date = '2026-03-06' 
          AND start_time = '17:30:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000006' 
          AND (client_name = 'Lumara' OR client_phone = '(66) 98425-2040')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Lumara', '(66) 98425-2040', '00000000-0000-0000-0000-000000000006', '2026-03-06', '17:30:00', '18:00:00', 'confirmado', 'para o marido também', 'Dhionara Sbrussi')
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
        WHERE date = '2026-03-06' 
          AND start_time = '17:40:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000001' 
          AND (client_name = 'Camila Feitosa Gomes' OR client_phone = '(66) 98136-4209')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Camila Feitosa Gomes', '(66) 98136-4209', '00000000-0000-0000-0000-000000000001', '2026-03-06', '17:40:00', '18:10:00', 'atendido', '', 'Rafaela')
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
        WHERE date = '2026-03-06' 
          AND start_time = '17:45:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000004' 
          AND (client_name = 'Roberta Bonomo' OR client_phone = '(66) 99604-3253')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Roberta Bonomo', '(66) 99604-3253', '00000000-0000-0000-0000-000000000004', '2026-03-06', '17:45:00', '18:15:00', 'atendido', '', 'Agendamento')
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
        WHERE date = '2026-03-06' 
          AND start_time = '18:30:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000005' 
          AND (client_name = 'Debora Araujo' OR client_phone = '(66) 99984-1407')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Debora Araujo', '(66) 99984-1407', '00000000-0000-0000-0000-000000000005', '2026-03-06', '18:30:00', '20:00:00', 'atendido', '', 'Bruna Castanheira')
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
        WHERE date = '2026-03-06' 
          AND start_time = '19:00:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000007' 
          AND (client_name = 'Neycyane Ribeiro' OR client_phone = '(66) 98410-2162')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Neycyane Ribeiro', '(66) 98410-2162', '00000000-0000-0000-0000-000000000007', '2026-03-06', '19:00:00', '19:30:00', 'atendido', '', 'Patricia Armanda')
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
        WHERE date = '2026-03-05' 
          AND start_time = '08:00:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000002' 
          AND (client_name = 'Dhiani Sbrussi' OR client_phone = '(66) 99668-0462')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Dhiani Sbrussi', '(66) 99668-0462', '00000000-0000-0000-0000-000000000002', '2026-03-05', '08:00:00', '08:30:00', 'agendado', 'Consulta mae', 'Dhiani Sbrussi')
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
        WHERE date = '2026-03-05' 
          AND start_time = '08:00:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000003' 
          AND (client_name = 'Sidriane de  Mello' OR client_phone = '(44) 98809-7910')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Sidriane de  Mello', '(44) 98809-7910', '00000000-0000-0000-0000-000000000003', '2026-03-05', '08:00:00', '09:00:00', 'atendido', '', 'Agendamento')
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
        WHERE date = '2026-03-05' 
          AND start_time = '08:00:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000006' 
          AND (client_name = 'ELAINE AMORIM' OR client_phone = '(66) 99235-3113')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('ELAINE AMORIM', '(66) 99235-3113', '00000000-0000-0000-0000-000000000006', '2026-03-05', '08:00:00', '08:30:00', 'atendido', '', 'Agendamento')
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
        WHERE date = '2026-03-05' 
          AND start_time = '08:30:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000004' 
          AND (client_name = 'Izabela Azevedo' OR client_phone = '(66) 98113-2265')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Izabela Azevedo', '(66) 98113-2265', '00000000-0000-0000-0000-000000000004', '2026-03-05', '08:30:00', '09:00:00', 'espera', '', 'Dhionara Sbrussi')
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
        WHERE date = '2026-03-05' 
          AND start_time = '08:30:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000006' 
          AND (client_name = 'ELIANE JASCOVSK' OR client_phone = '(66) 98437-8685')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('ELIANE JASCOVSK', '(66) 98437-8685', '00000000-0000-0000-0000-000000000006', '2026-03-05', '08:30:00', '09:00:00', 'atendido', '', 'Agendamento')
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
        WHERE date = '2026-03-05' 
          AND start_time = '09:00:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000006' 
          AND (client_name = 'Rhana Carolina Luz Kalil da Silva' OR client_phone = '(65) 98153-2103')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Rhana Carolina Luz Kalil da Silva', '(65) 98153-2103', '00000000-0000-0000-0000-000000000006', '2026-03-05', '09:00:00', '09:30:00', 'atendido', '', 'Agendamento')
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
        WHERE date = '2026-03-05' 
          AND start_time = '09:30:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000004' 
          AND (client_name = 'Evone Wagner' OR client_phone = '(66) 99650-3151')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Evone Wagner', '(66) 99650-3151', '00000000-0000-0000-0000-000000000004', '2026-03-05', '09:30:00', '10:00:00', 'atendido', '', 'Tais Pires')
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
        WHERE date = '2026-03-05' 
          AND start_time = '09:30:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000006' 
          AND (client_name = 'Juciane Borges' OR client_phone = '(66) 98111-0346')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Juciane Borges', '(66) 98111-0346', '00000000-0000-0000-0000-000000000006', '2026-03-05', '09:30:00', '10:00:00', 'atendido', '', 'Agendamento')
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
        WHERE date = '2026-03-05' 
          AND start_time = '09:30:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000002' 
          AND (client_name = 'DIOVANA MENDEL' OR client_phone = '(66) 99209-9934')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('DIOVANA MENDEL', '(66) 99209-9934', '00000000-0000-0000-0000-000000000002', '2026-03-05', '09:30:00', '10:00:00', 'atendido', '1/10', 'Agendamento')
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
        WHERE date = '2026-03-05' 
          AND start_time = '10:00:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000005' 
          AND (client_name = 'Dayane Queiroz' OR client_phone = '(66) 99720-0152')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Dayane Queiroz', '(66) 99720-0152', '00000000-0000-0000-0000-000000000005', '2026-03-05', '10:00:00', '10:30:00', 'atendido', '', 'Agendamento')
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
        WHERE date = '2026-03-05' 
          AND start_time = '10:00:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000003' 
          AND (client_name = 'Gabriela Volkweis' OR client_phone = '(49) 99196-1203')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Gabriela Volkweis', '(49) 99196-1203', '00000000-0000-0000-0000-000000000003', '2026-03-05', '10:00:00', '11:00:00', 'atendido', '', 'Agendamento')
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
        WHERE date = '2026-03-05' 
          AND start_time = '10:30:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000006' 
          AND (client_name = 'Fabia Ferreira Barbosa' OR client_phone = '(66) 98416-7183')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Fabia Ferreira Barbosa', '(66) 98416-7183', '00000000-0000-0000-0000-000000000006', '2026-03-05', '10:30:00', '11:00:00', 'atendido', '', 'Agendamento')
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
        WHERE date = '2026-03-05' 
          AND start_time = '11:00:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000004' 
          AND (client_name = 'Patricia Pinton Dos Santos Garrutti' OR client_phone = '(66) 99975-4661')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Patricia Pinton Dos Santos Garrutti', '(66) 99975-4661', '00000000-0000-0000-0000-000000000004', '2026-03-05', '11:00:00', '11:30:00', 'atendido', '17/30', 'Agendamento')
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
        WHERE date = '2026-03-05' 
          AND start_time = '13:30:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000002' 
          AND (client_name = 'Dhiani Sbrussi' OR client_phone = '(66) 99668-0462')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Dhiani Sbrussi', '(66) 99668-0462', '00000000-0000-0000-0000-000000000002', '2026-03-05', '13:30:00', '14:00:00', 'agendado', '', 'Dhiani Sbrussi')
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
        WHERE date = '2026-03-05' 
          AND start_time = '13:30:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000003' 
          AND (client_name = 'Delvanda Maia' OR client_phone = '(66) 99217-1372')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Delvanda Maia', '(66) 99217-1372', '00000000-0000-0000-0000-000000000003', '2026-03-05', '13:30:00', '14:30:00', 'atendido', '3/20', 'Agendamento')
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
        WHERE date = '2026-03-05' 
          AND start_time = '13:30:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000001' 
          AND (client_name = 'Sidriane de  Mello' OR client_phone = '(44) 98809-7910')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Sidriane de  Mello', '(44) 98809-7910', '00000000-0000-0000-0000-000000000001', '2026-03-05', '13:30:00', '14:00:00', 'atendido', '', 'Agendamento')
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
        WHERE date = '2026-03-05' 
          AND start_time = '13:30:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000006' 
          AND (client_name = 'Juliane' OR client_phone = '(66) 98410-1970')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Juliane', '(66) 98410-1970', '00000000-0000-0000-0000-000000000006', '2026-03-05', '13:30:00', '14:00:00', 'atendido', '', 'Michele Quintana')
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
        WHERE date = '2026-03-05' 
          AND start_time = '13:30:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000002' 
          AND (client_name = 'Maira' OR client_phone = '(66) 99997-5772')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Maira', '(66) 99997-5772', '00000000-0000-0000-0000-000000000002', '2026-03-05', '13:30:00', '14:00:00', 'espera', '', 'Dhionara Sbrussi')
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
        WHERE date = '2026-03-05' 
          AND start_time = '14:00:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000004' 
          AND (client_name = 'Alana Biazi' OR client_phone = '(66) 99663-2260')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Alana Biazi', '(66) 99663-2260', '00000000-0000-0000-0000-000000000004', '2026-03-05', '14:00:00', '15:00:00', 'falta', '', 'Tais Pires')
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
        WHERE date = '2026-03-05' 
          AND start_time = '14:00:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000006' 
          AND (client_name = 'Juliane Lucia Modolo' OR client_phone = '(66) 98409-3397')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Juliane Lucia Modolo', '(66) 98409-3397', '00000000-0000-0000-0000-000000000006', '2026-03-05', '14:00:00', '14:30:00', 'cancelado', '', 'Michele Quintana')
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
        WHERE date = '2026-03-05' 
          AND start_time = '14:00:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000007' 
          AND (client_name = 'Renata Maia Solto Fernandes' OR client_phone = '(66) 99999-2202')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Renata Maia Solto Fernandes', '(66) 99999-2202', '00000000-0000-0000-0000-000000000007', '2026-03-05', '14:00:00', '14:30:00', 'atendido', '', 'Agendamento')
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
        WHERE date = '2026-03-05' 
          AND start_time = '14:15:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000001' 
          AND (client_name = 'Delvanda Maia' OR client_phone = '(66) 99217-1372')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Delvanda Maia', '(66) 99217-1372', '00000000-0000-0000-0000-000000000001', '2026-03-05', '14:15:00', '14:45:00', 'atendido', '3/20', 'Agendamento')
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
        WHERE date = '2026-03-05' 
          AND start_time = '14:30:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000003' 
          AND (client_name = 'Rafaela Sbrussi Lorenzon' OR client_phone = '(66) 98411-2902')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Rafaela Sbrussi Lorenzon', '(66) 98411-2902', '00000000-0000-0000-0000-000000000003', '2026-03-05', '14:30:00', '15:30:00', 'atendido', '', 'Agendamento')
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
        WHERE date = '2026-03-05' 
          AND start_time = '14:30:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000001' 
          AND (client_name = 'Sidriane de  Mello' OR client_phone = '(44) 98809-7910')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Sidriane de  Mello', '(44) 98809-7910', '00000000-0000-0000-0000-000000000001', '2026-03-05', '14:30:00', '15:00:00', 'atendido', '', 'Agendamento')
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
        WHERE date = '2026-03-05' 
          AND start_time = '14:30:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000004' 
          AND (client_name = 'Maria Eduarda Vagner Da Silva' OR client_phone = '(66) 98416-3365')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Maria Eduarda Vagner Da Silva', '(66) 98416-3365', '00000000-0000-0000-0000-000000000004', '2026-03-05', '14:30:00', '15:30:00', 'atendido', '', 'Agendamento')
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
        WHERE date = '2026-03-05' 
          AND start_time = '14:45:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000001' 
          AND (client_name = 'Marla Alcobia' OR client_phone = '(66) 98427-7634')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Marla Alcobia', '(66) 98427-7634', '00000000-0000-0000-0000-000000000001', '2026-03-05', '14:45:00', '15:15:00', 'atendido', '', 'Agendamento')
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
        WHERE date = '2026-03-05' 
          AND start_time = '15:00:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000001' 
          AND (client_name = 'Angela Rezende Teodoro' OR client_phone = '(66) 98102-3820')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Angela Rezende Teodoro', '(66) 98102-3820', '00000000-0000-0000-0000-000000000001', '2026-03-05', '15:00:00', '15:30:00', 'atendido', '700,00 reais já está pago', 'Agendamento')
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
        WHERE date = '2026-03-05' 
          AND start_time = '15:30:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000006' 
          AND (client_name = 'Delvanda Maia' OR client_phone = '(66) 99217-1372')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Delvanda Maia', '(66) 99217-1372', '00000000-0000-0000-0000-000000000006', '2026-03-05', '15:30:00', '16:00:00', 'atendido', '', 'Michele Quintana')
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
        WHERE date = '2026-03-05' 
          AND start_time = '15:30:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000002' 
          AND (client_name = 'Daiany Priscilla Bueno da Silva' OR client_phone = '(62) 98170-0948')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Daiany Priscilla Bueno da Silva', '(62) 98170-0948', '00000000-0000-0000-0000-000000000002', '2026-03-05', '15:30:00', '16:00:00', 'atendido', '', 'Agendamento')
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
        WHERE date = '2026-03-05' 
          AND start_time = '15:30:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000001' 
          AND (client_name = 'Pollyana Ragagnini' OR client_phone = '(64) 99981-0740')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Pollyana Ragagnini', '(64) 99981-0740', '00000000-0000-0000-0000-000000000001', '2026-03-05', '15:30:00', '17:00:00', 'atendido', '', 'Agendamento')
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
        WHERE date = '2026-03-05' 
          AND start_time = '15:30:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000004' 
          AND (client_name = 'Maria Eduarda Vagner Da Silva' OR client_phone = '(66) 98416-3365')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Maria Eduarda Vagner Da Silva', '(66) 98416-3365', '00000000-0000-0000-0000-000000000004', '2026-03-05', '15:30:00', '16:00:00', 'atendido', '', 'Agendamento')
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
        WHERE date = '2026-03-05' 
          AND start_time = '15:45:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000004' 
          AND (client_name = 'Alessandra Naiara dos Santos Pavessi' OR client_phone = '(66) 98132-9032')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Alessandra Naiara dos Santos Pavessi', '(66) 98132-9032', '00000000-0000-0000-0000-000000000004', '2026-03-05', '15:45:00', '16:15:00', 'atendido', '', 'Tais Pires')
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
        WHERE date = '2026-03-05' 
          AND start_time = '15:45:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000003' 
          AND (client_name = 'Renata Maia Solto Fernandes' OR client_phone = '(66) 99999-2202')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Renata Maia Solto Fernandes', '(66) 99999-2202', '00000000-0000-0000-0000-000000000003', '2026-03-05', '15:45:00', '16:45:00', 'atendido', '', 'Agendamento')
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
        WHERE date = '2026-03-05' 
          AND start_time = '16:00:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000006' 
          AND (client_name = 'Cintia Liani Franciscon de Mathia' OR client_phone = '(66) 99642-8165')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Cintia Liani Franciscon de Mathia', '(66) 99642-8165', '00000000-0000-0000-0000-000000000006', '2026-03-05', '16:00:00', '16:30:00', 'confirmado', '', 'Dhionara Sbrussi')
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
        WHERE date = '2026-03-05' 
          AND start_time = '16:00:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000006' 
          AND (client_name = 'Bruno' OR client_phone = '(66) 99204-0802')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Bruno', '(66) 99204-0802', '00000000-0000-0000-0000-000000000006', '2026-03-05', '16:00:00', '16:30:00', 'cancelado', '', 'Michele Quintana')
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
        WHERE date = '2026-03-05' 
          AND start_time = '16:15:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000004' 
          AND (client_name = 'Clarice Pigozzo' OR client_phone = '(66) 99224-0221')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Clarice Pigozzo', '(66) 99224-0221', '00000000-0000-0000-0000-000000000004', '2026-03-05', '16:15:00', '17:15:00', 'atendido', '', 'Rafaela')
        RETURNING id INTO v_appointment_id;

        INSERT INTO appointment_services (appointment_id, service_name, duration_minutes)
        VALUES (v_appointment_id, 'Limpeza De Pele', 60);
    END IF;
END $$;

COMMIT;