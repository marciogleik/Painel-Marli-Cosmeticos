BEGIN;
DO $$
DECLARE
    v_appointment_id UUID;
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM appointments 
        WHERE date = '2026-02-20' 
          AND start_time = '09:30:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000006' 
          AND (client_name = 'Sandra Dalmamm' OR client_phone = '(66) 99675-7982')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Sandra Dalmamm', '(66) 99675-7982', '00000000-0000-0000-0000-000000000006', '2026-02-20', '09:30:00', '10:00:00', 'atendido', '', 'Rafaela')
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
        WHERE date = '2026-02-20' 
          AND start_time = '09:30:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000002' 
          AND (client_name = 'DIOVANA MENDEL' OR client_phone = '(66) 99209-9934')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('DIOVANA MENDEL', '(66) 99209-9934', '00000000-0000-0000-0000-000000000002', '2026-02-20', '09:30:00', '10:00:00', 'cancelado', '', 'Dhiani Sbrussi')
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
        WHERE date = '2026-02-20' 
          AND start_time = '10:30:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000005' 
          AND (client_name = 'Angelair Camargo de Rezende Muller' OR client_phone = '(66) 99619-3846')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Angelair Camargo de Rezende Muller', '(66) 99619-3846', '00000000-0000-0000-0000-000000000005', '2026-02-20', '10:30:00', '11:00:00', 'atendido', 'Retorno botox', 'Agendamento')
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
        WHERE date = '2026-02-20' 
          AND start_time = '11:00:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000006' 
          AND (client_name = 'Ingrid Gabe' OR client_phone = '(66) 99634-9161')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Ingrid Gabe', '(66) 99634-9161', '00000000-0000-0000-0000-000000000006', '2026-02-20', '11:00:00', '11:30:00', 'atendido', '', 'Rafaela')
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
        WHERE date = '2026-02-20' 
          AND start_time = '11:00:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000005' 
          AND (client_name = 'Fernando Delosbel' OR client_phone = '(66) 99991-7575')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Fernando Delosbel', '(66) 99991-7575', '00000000-0000-0000-0000-000000000005', '2026-02-20', '11:00:00', '11:30:00', 'atendido', 'Retorno botox', 'Rafaela')
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
        WHERE date = '2026-02-20' 
          AND start_time = '13:30:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000001' 
          AND (client_name = 'Dhionara Sbrussi Lorenzon.' OR client_phone = '(66) 99988-2911')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Dhionara Sbrussi Lorenzon.', '(66) 99988-2911', '00000000-0000-0000-0000-000000000001', '2026-02-20', '13:30:00', '14:00:00', 'atendido', '', 'Rafaela')
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
        WHERE date = '2026-02-20' 
          AND start_time = '13:30:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000002' 
          AND (client_name = 'Lisley Paz De Barros' OR client_phone = '(66) 99939-2957')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Lisley Paz De Barros', '(66) 99939-2957', '00000000-0000-0000-0000-000000000002', '2026-02-20', '13:30:00', '14:15:00', 'atendido', '3/5', 'Agendamento')
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
        WHERE date = '2026-02-20' 
          AND start_time = '13:30:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000001' 
          AND (client_name = 'Delvanda Maia' OR client_phone = '(66) 99217-1372')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Delvanda Maia', '(66) 99217-1372', '00000000-0000-0000-0000-000000000001', '2026-02-20', '13:30:00', '15:00:00', 'cancelado', 'lembrar dela tomar o aciclovir na confirmação', 'Dhionara Sbrussi')
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
        WHERE date = '2026-02-20' 
          AND start_time = '14:00:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000007' 
          AND (client_name = 'Alana Biazi' OR client_phone = '(66) 99663-2260')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Alana Biazi', '(66) 99663-2260', '00000000-0000-0000-0000-000000000007', '2026-02-20', '14:00:00', '14:30:00', 'atendido', '', 'Rafaela')
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
        WHERE date = '2026-02-20' 
          AND start_time = '14:00:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000004' 
          AND (client_name = 'Maria Auxiliadora Ferreira Coelho' OR client_phone = '(66) 99221-6427')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Maria Auxiliadora Ferreira Coelho', '(66) 99221-6427', '00000000-0000-0000-0000-000000000004', '2026-02-20', '14:00:00', '15:00:00', 'espera', '', 'Dhionara Sbrussi')
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
        WHERE date = '2026-02-20' 
          AND start_time = '14:00:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000005' 
          AND (client_name = 'Euzania de Souza Araujo' OR client_phone = '(66) 98409-7391')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Euzania de Souza Araujo', '(66) 98409-7391', '00000000-0000-0000-0000-000000000005', '2026-02-20', '14:00:00', '14:30:00', 'atendido', 'harmonização', 'Agendamento')
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
        WHERE date = '2026-02-20' 
          AND start_time = '14:00:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000003' 
          AND (client_name = 'Jayne Barbosa de Sousa' OR client_phone = '(66) 99964-9402')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Jayne Barbosa de Sousa', '(66) 99964-9402', '00000000-0000-0000-0000-000000000003', '2026-02-20', '14:00:00', '15:00:00', 'atendido', '', 'Rafaela')
        RETURNING id INTO v_appointment_id;

        INSERT INTO appointment_services (appointment_id, service_name, duration_minutes)
        VALUES (v_appointment_id, 'Spa dos Pés', 60);
    END IF;
END $$;

DO $$
DECLARE
    v_appointment_id UUID;
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM appointments 
        WHERE date = '2026-02-20' 
          AND start_time = '14:15:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000002' 
          AND (client_name = 'Kenia Cardoso Brito Fialho' OR client_phone = '(66) 98135-6357')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Kenia Cardoso Brito Fialho', '(66) 98135-6357', '00000000-0000-0000-0000-000000000002', '2026-02-20', '14:15:00', '14:45:00', 'atendido', '', 'Rafaela')
        RETURNING id INTO v_appointment_id;

        INSERT INTO appointment_services (appointment_id, service_name, duration_minutes)
        VALUES (v_appointment_id, 'Depilação Definitiva', 30);
    END IF;
END $$;

DO $$
DECLARE
    v_appointment_id UUID;
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM appointments 
        WHERE date = '2026-02-20' 
          AND start_time = '14:30:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000004' 
          AND (client_name = 'Maria Auxiliadora Ferreira Coelho' OR client_phone = '(66) 99221-6427')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Maria Auxiliadora Ferreira Coelho', '(66) 99221-6427', '00000000-0000-0000-0000-000000000004', '2026-02-20', '14:30:00', '15:00:00', 'espera', '', 'Dhionara Sbrussi')
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
        WHERE date = '2026-02-20' 
          AND start_time = '14:30:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000006' 
          AND (client_name = 'Andressa' OR client_phone = '(65) 99240-4585')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Andressa', '(65) 99240-4585', '00000000-0000-0000-0000-000000000006', '2026-02-20', '14:30:00', '15:00:00', 'atendido', '', 'Agendamento')
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
        WHERE date = '2026-02-20' 
          AND start_time = '14:30:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000005' 
          AND (client_name = 'Rhana Carolina Luz Kalil da Silva' OR client_phone = '(65) 98153-2103')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Rhana Carolina Luz Kalil da Silva', '(65) 98153-2103', '00000000-0000-0000-0000-000000000005', '2026-02-20', '14:30:00', '15:00:00', 'atendido', '', 'Agendamento')
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
        WHERE date = '2026-02-20' 
          AND start_time = '14:45:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000002' 
          AND (client_name = 'Janainne Venicia Silva' OR client_phone = '(66) 99241-5675')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Janainne Venicia Silva', '(66) 99241-5675', '00000000-0000-0000-0000-000000000002', '2026-02-20', '14:45:00', '15:15:00', 'atendido', 'Marcia', 'Agendamento')
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
        WHERE date = '2026-02-20' 
          AND start_time = '15:00:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000006' 
          AND (client_name = 'Antonia Depieri Medeiros' OR client_phone = '(66) 99999-0522')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Antonia Depieri Medeiros', '(66) 99999-0522', '00000000-0000-0000-0000-000000000006', '2026-02-20', '15:00:00', '15:30:00', 'atendido', '', 'Rafaela')
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
        WHERE date = '2026-02-20' 
          AND start_time = '15:00:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000003' 
          AND (client_name = 'Marli Salete de Avila Sbrussi' OR client_phone = '(66) 98412-6906')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Marli Salete de Avila Sbrussi', '(66) 98412-6906', '00000000-0000-0000-0000-000000000003', '2026-02-20', '15:00:00', '16:00:00', 'atendido', '', 'Agendamento')
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
        WHERE date = '2026-02-20' 
          AND start_time = '15:00:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000004' 
          AND (client_name = 'Fabiana Lemes' OR client_phone = '(66) 98429-6213')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Fabiana Lemes', '(66) 98429-6213', '00000000-0000-0000-0000-000000000004', '2026-02-20', '15:00:00', '15:30:00', 'falta', '', 'Agendamento')
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
        WHERE date = '2026-02-20' 
          AND start_time = '15:00:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000005' 
          AND (client_name = 'Graciela Mees de Andrade' OR client_phone = '(66) 99628-3404')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Graciela Mees de Andrade', '(66) 99628-3404', '00000000-0000-0000-0000-000000000005', '2026-02-20', '15:00:00', '15:30:00', 'atendido', '', 'Bruna Castanheira')
        RETURNING id INTO v_appointment_id;

        INSERT INTO appointment_services (appointment_id, service_name, duration_minutes)
        VALUES (v_appointment_id, 'Bioestimulador com Sculptra', 30);
    END IF;
END $$;

DO $$
DECLARE
    v_appointment_id UUID;
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM appointments 
        WHERE date = '2026-02-20' 
          AND start_time = '15:15:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000002' 
          AND (client_name = 'Ines Maria Scheneider dos Santos' OR client_phone = '(66) 99676-3033')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Ines Maria Scheneider dos Santos', '(66) 99676-3033', '00000000-0000-0000-0000-000000000002', '2026-02-20', '15:15:00', '16:00:00', 'atendido', '5/20', 'Agendamento')
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
        WHERE date = '2026-02-20' 
          AND start_time = '15:15:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000004' 
          AND (client_name = 'Ana Carla' OR client_phone = '(66) 98400-0377')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Ana Carla', '(66) 98400-0377', '00000000-0000-0000-0000-000000000004', '2026-02-20', '15:15:00', '15:45:00', 'falta', '', 'Rafaela')
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
        WHERE date = '2026-02-20' 
          AND start_time = '15:15:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000004' 
          AND (client_name = 'Dienne Santos' OR client_phone = '(66) 98440-1662')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Dienne Santos', '(66) 98440-1662', '00000000-0000-0000-0000-000000000004', '2026-02-20', '15:15:00', '15:45:00', 'cancelado', '', 'Dhionara Sbrussi')
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
        WHERE date = '2026-02-20' 
          AND start_time = '15:15:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000001' 
          AND (client_name = 'Jayne Barbosa de Sousa' OR client_phone = '(66) 99964-9402')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Jayne Barbosa de Sousa', '(66) 99964-9402', '00000000-0000-0000-0000-000000000001', '2026-02-20', '15:15:00', '15:45:00', 'atendido', 'já tá pago - nanofios', 'Rafaela')
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
        WHERE date = '2026-02-20' 
          AND start_time = '15:30:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000004' 
          AND (client_name = 'Aline' OR client_phone = '(66) 98133-7299')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Aline', '(66) 98133-7299', '00000000-0000-0000-0000-000000000004', '2026-02-20', '15:30:00', '16:00:00', 'cancelado', '', 'Dhionara Sbrussi')
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
        WHERE date = '2026-02-20' 
          AND start_time = '15:30:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000004' 
          AND (client_name = 'Gabrielly Azeredo dos Santos' OR client_phone = '(66) 99232-4596')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Gabrielly Azeredo dos Santos', '(66) 99232-4596', '00000000-0000-0000-0000-000000000004', '2026-02-20', '15:30:00', '16:00:00', 'falta', '', 'Agendamento')
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
        WHERE date = '2026-02-20' 
          AND start_time = '15:45:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000004' 
          AND (client_name = 'Hamilton Conceição Silva' OR client_phone = '(66) 98449-4827')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Hamilton Conceição Silva', '(66) 98449-4827', '00000000-0000-0000-0000-000000000004', '2026-02-20', '15:45:00', '16:15:00', 'atendido', '', 'Agendamento')
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
        WHERE date = '2026-02-20' 
          AND start_time = '15:45:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000003' 
          AND (client_name = 'Lorena' OR client_phone = '(66) 98430-9885')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Lorena', '(66) 98430-9885', '00000000-0000-0000-0000-000000000003', '2026-02-20', '15:45:00', '16:45:00', 'atendido', '', 'Rafaela')
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
          AND start_time = '16:00:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000002' 
          AND (client_name = 'Marli Salete de Avila Sbrussi' OR client_phone = '(66) 98412-6906')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Marli Salete de Avila Sbrussi', '(66) 98412-6906', '00000000-0000-0000-0000-000000000002', '2026-02-20', '16:00:00', '17:00:00', 'cancelado', '', 'Dhiani Sbrussi')
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
        WHERE date = '2026-02-20' 
          AND start_time = '16:00:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000002' 
          AND (client_name = 'Laise Matuchake Rezende' OR client_phone = '(66) 99989-2175')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Laise Matuchake Rezende', '(66) 99989-2175', '00000000-0000-0000-0000-000000000002', '2026-02-20', '16:00:00', '16:30:00', 'atendido', '', 'Rafaela')
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
        WHERE date = '2026-02-20' 
          AND start_time = '16:00:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000005' 
          AND (client_name = 'Franciela Deyse Mees' OR client_phone = '(66) 99982-0552')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Franciela Deyse Mees', '(66) 99982-0552', '00000000-0000-0000-0000-000000000005', '2026-02-20', '16:00:00', '16:30:00', 'atendido', '', 'Rafaela')
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
        WHERE date = '2026-02-20' 
          AND start_time = '16:00:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000007' 
          AND (client_name = 'Arielly Luiza Pereira Gomes' OR client_phone = '(66) 98121-7167')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Arielly Luiza Pereira Gomes', '(66) 98121-7167', '00000000-0000-0000-0000-000000000007', '2026-02-20', '16:00:00', '16:30:00', 'atendido', '', 'Agendamento')
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
          AND start_time = '16:17:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000004' 
          AND (client_name = 'Elsilena Maria de Sousa' OR client_phone = '(66) 98134-1055')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Elsilena Maria de Sousa', '(66) 98134-1055', '00000000-0000-0000-0000-000000000004', '2026-02-20', '16:17:00', '17:17:00', 'atendido', '', 'Agendamento')
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
        WHERE date = '2026-02-20' 
          AND start_time = '17:00:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000006' 
          AND (client_name = 'Michele Angrizano Quintana' OR client_phone = '(66) 99217-0456')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Michele Angrizano Quintana', '(66) 99217-0456', '00000000-0000-0000-0000-000000000006', '2026-02-20', '17:00:00', '17:30:00', 'agendado', '', 'Michele Quintana')
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
        WHERE date = '2026-02-20' 
          AND start_time = '17:00:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000005' 
          AND (client_name = 'Luis Gustavo Basto de Oliveira' OR client_phone = '(66) 99648-5243')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Luis Gustavo Basto de Oliveira', '(66) 99648-5243', '00000000-0000-0000-0000-000000000005', '2026-02-20', '17:00:00', '17:30:00', 'atendido', 'mento', 'Agendamento')
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
        WHERE date = '2026-02-20' 
          AND start_time = '17:15:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000001' 
          AND (client_name = 'Elsilena Maria de Sousa' OR client_phone = '(66) 98134-1055')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Elsilena Maria de Sousa', '(66) 98134-1055', '00000000-0000-0000-0000-000000000001', '2026-02-20', '17:15:00', '17:45:00', 'atendido', 'agendar caso surja uma vga/pago', 'Rafaela')
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
        WHERE date = '2026-02-20' 
          AND start_time = '17:30:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000003' 
          AND (client_name = 'Barbara Camilo Rosa' OR client_phone = '(17) 99158-9785')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Barbara Camilo Rosa', '(17) 99158-9785', '00000000-0000-0000-0000-000000000003', '2026-02-20', '17:30:00', '18:30:00', 'atendido', '10/20', 'Rafaela')
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
        WHERE date = '2026-02-20' 
          AND start_time = '17:30:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000006' 
          AND (client_name = 'Leidiana Venina Ferreira da Silva Alencastro' OR client_phone = '(65) 99239-0819')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Leidiana Venina Ferreira da Silva Alencastro', '(65) 99239-0819', '00000000-0000-0000-0000-000000000006', '2026-02-20', '17:30:00', '18:00:00', 'falta', '', 'Agendamento')
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
        WHERE date = '2026-02-20' 
          AND start_time = '18:00:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000004' 
          AND (client_name = 'Camila Schneider Garcia Salamoni' OR client_phone = '(66) 98435-2360')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Camila Schneider Garcia Salamoni', '(66) 98435-2360', '00000000-0000-0000-0000-000000000004', '2026-02-20', '18:00:00', '18:30:00', 'atendido', '', 'Rafaela')
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
        WHERE date = '2026-02-20' 
          AND start_time = '18:00:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000005' 
          AND (client_name = 'Vanessa Rafaelli' OR client_phone = '(66) 99918-1038')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Vanessa Rafaelli', '(66) 99918-1038', '00000000-0000-0000-0000-000000000005', '2026-02-20', '18:00:00', '18:30:00', 'atendido', '', 'Bruna Castanheira')
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
        WHERE date = '2026-02-20' 
          AND start_time = '18:30:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000007' 
          AND (client_name = 'Natiele Brito' OR client_phone = '(66) 98452-4855')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Natiele Brito', '(66) 98452-4855', '00000000-0000-0000-0000-000000000007', '2026-02-20', '18:30:00', '19:00:00', 'atendido', '', 'Patricia Armanda')
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
        WHERE date = '2026-02-19' 
          AND start_time = '00:00:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000001' 
          AND (client_name = 'Viviany Cristino de Lima' OR client_phone = '(66) 99212-9041')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Viviany Cristino de Lima', '(66) 99212-9041', '00000000-0000-0000-0000-000000000001', '2026-02-19', '00:00:00', '00:30:00', 'agendado', '', 'Agendamento')
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
        WHERE date = '2026-02-19' 
          AND start_time = '07:00:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000005' 
          AND (client_name = 'Areolanda Montel Costa' OR client_phone = '(66) 98433-2914')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Areolanda Montel Costa', '(66) 98433-2914', '00000000-0000-0000-0000-000000000005', '2026-02-19', '07:00:00', '07:30:00', 'agendado', '', 'Bruna Castanheira')
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
        WHERE date = '2026-02-19' 
          AND start_time = '08:00:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000004' 
          AND (client_name = 'Vanessa Sicorra Da Rosa Thoma' OR client_phone = '(66) 99671-7399')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Vanessa Sicorra Da Rosa Thoma', '(66) 99671-7399', '00000000-0000-0000-0000-000000000004', '2026-02-19', '08:00:00', '08:30:00', 'atendido', '', 'Tais Pires')
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
        WHERE date = '2026-02-19' 
          AND start_time = '08:00:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000007' 
          AND (client_name = 'Westterleny' OR client_phone = '(66) 99938-5079')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Westterleny', '(66) 99938-5079', '00000000-0000-0000-0000-000000000007', '2026-02-19', '08:00:00', '08:30:00', 'atendido', 'manter a promoção 10%', 'Rafaela')
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
        WHERE date = '2026-02-19' 
          AND start_time = '08:30:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000001' 
          AND (client_name = 'Neiva Della Senta' OR client_phone = '(66) 99901-1774')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Neiva Della Senta', '(66) 99901-1774', '00000000-0000-0000-0000-000000000001', '2026-02-19', '08:30:00', '09:00:00', 'atendido', '', 'Rafaela')
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
        WHERE date = '2026-02-19' 
          AND start_time = '09:00:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000001' 
          AND (client_name = 'Neiva Della Senta' OR client_phone = '(66) 99901-1774')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Neiva Della Senta', '(66) 99901-1774', '00000000-0000-0000-0000-000000000001', '2026-02-19', '09:00:00', '09:30:00', 'atendido', '', 'Rafaela')
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
        WHERE date = '2026-02-19' 
          AND start_time = '09:00:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000003' 
          AND (client_name = 'Patricia Jaqueline' OR client_phone = '(42) 99919-8990')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Patricia Jaqueline', '(42) 99919-8990', '00000000-0000-0000-0000-000000000003', '2026-02-19', '09:00:00', '10:00:00', 'atendido', '', 'Rafaela')
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
        WHERE date = '2026-02-19' 
          AND start_time = '09:00:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000006' 
          AND (client_name = 'Luzinei Ferreira Dutra' OR client_phone = '(66) 98446-1826')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Luzinei Ferreira Dutra', '(66) 98446-1826', '00000000-0000-0000-0000-000000000006', '2026-02-19', '09:00:00', '09:30:00', 'atendido', '', 'Agendamento')
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
        WHERE date = '2026-02-19' 
          AND start_time = '09:30:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000006' 
          AND (client_name = 'Sumaia' OR client_phone = '(66) 99661-7393')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Sumaia', '(66) 99661-7393', '00000000-0000-0000-0000-000000000006', '2026-02-19', '09:30:00', '10:00:00', 'cancelado', '', 'Michele Quintana')
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
        WHERE date = '2026-02-19' 
          AND start_time = '09:30:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000006' 
          AND (client_name = 'Jader Bahia' OR client_phone = '(66) 98122-4077')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Jader Bahia', '(66) 98122-4077', '00000000-0000-0000-0000-000000000006', '2026-02-19', '09:30:00', '10:00:00', 'atendido', '', 'Rafaela')
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
        WHERE date = '2026-02-19' 
          AND start_time = '09:30:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000002' 
          AND (client_name = 'Weslaine moraes' OR client_phone = '(66) 98464-4132')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Weslaine moraes', '(66) 98464-4132', '00000000-0000-0000-0000-000000000002', '2026-02-19', '09:30:00', '10:00:00', 'atendido', 'Fiz 2.200', 'Dhiani Sbrussi')
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
        WHERE date = '2026-02-19' 
          AND start_time = '09:45:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000004' 
          AND (client_name = 'Patricia Pinton Dos Santos Garrutti' OR client_phone = '(66) 99975-4661')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Patricia Pinton Dos Santos Garrutti', '(66) 99975-4661', '00000000-0000-0000-0000-000000000004', '2026-02-19', '09:45:00', '10:15:00', 'atendido', '15/30', 'Agendamento')
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
        WHERE date = '2026-02-19' 
          AND start_time = '10:00:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000004' 
          AND (client_name = 'Camila fachinello' OR client_phone = '(66) 99690-5174')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Camila fachinello', '(66) 99690-5174', '00000000-0000-0000-0000-000000000004', '2026-02-19', '10:00:00', '10:30:00', 'atendido', '', 'Agendamento')
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
        WHERE date = '2026-02-19' 
          AND start_time = '10:00:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000006' 
          AND (client_name = 'Fabia Ferreira Barbosa' OR client_phone = '(66) 98416-7183')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Fabia Ferreira Barbosa', '(66) 98416-7183', '00000000-0000-0000-0000-000000000006', '2026-02-19', '10:00:00', '10:30:00', 'atendido', '', 'Rafaela')
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
        WHERE date = '2026-02-19' 
          AND start_time = '10:00:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000003' 
          AND (client_name = 'Westterleny' OR client_phone = '(66) 99938-5079')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Westterleny', '(66) 99938-5079', '00000000-0000-0000-0000-000000000003', '2026-02-19', '10:00:00', '11:00:00', 'atendido', '', 'Agendamento')
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
        WHERE date = '2026-02-19' 
          AND start_time = '10:00:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000007' 
          AND (client_name = 'MARA URSINO' OR client_phone = '(66) 99964-5447')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('MARA URSINO', '(66) 99964-5447', '00000000-0000-0000-0000-000000000007', '2026-02-19', '10:00:00', '11:00:00', 'atendido', '', 'Rafaela')
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
        WHERE date = '2026-02-19' 
          AND start_time = '11:30:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000007' 
          AND (client_name = 'VALENTINE GARBUI' OR client_phone = '(66) 98422-7288')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('VALENTINE GARBUI', '(66) 98422-7288', '00000000-0000-0000-0000-000000000007', '2026-02-19', '11:30:00', '12:00:00', 'atendido', 'Pago', 'Rafaela')
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
        WHERE date = '2026-02-19' 
          AND start_time = '13:30:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000003' 
          AND (client_name = 'Delvanda Maia' OR client_phone = '(66) 99217-1372')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Delvanda Maia', '(66) 99217-1372', '00000000-0000-0000-0000-000000000003', '2026-02-19', '13:30:00', '14:30:00', 'atendido', '1/20', 'Agendamento')
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
        WHERE date = '2026-02-19' 
          AND start_time = '13:30:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000002' 
          AND (client_name = 'Rosane de Albuquerque' OR client_phone = '(66) 99978-7196')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Rosane de Albuquerque', '(66) 99978-7196', '00000000-0000-0000-0000-000000000002', '2026-02-19', '13:30:00', '14:00:00', 'atendido', '', 'Rafaela')
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
        WHERE date = '2026-02-19' 
          AND start_time = '13:30:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000006' 
          AND (client_name = 'Juliane' OR client_phone = '(66) 98410-1970')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Juliane', '(66) 98410-1970', '00000000-0000-0000-0000-000000000006', '2026-02-19', '13:30:00', '14:00:00', 'atendido', '', 'Agendamento')
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
        WHERE date = '2026-02-19' 
          AND start_time = '13:45:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000001' 
          AND (client_name = 'Jiselli Maria Souto Jost' OR client_phone = '(66) 99631-6207')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Jiselli Maria Souto Jost', '(66) 99631-6207', '00000000-0000-0000-0000-000000000001', '2026-02-19', '13:45:00', '14:15:00', 'atendido', '', 'Agendamento')
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
        WHERE date = '2026-02-19' 
          AND start_time = '14:00:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000006' 
          AND (client_name = 'Sumaia' OR client_phone = '(66) 99661-7393')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Sumaia', '(66) 99661-7393', '00000000-0000-0000-0000-000000000006', '2026-02-19', '14:00:00', '14:30:00', 'atendido', '', 'Rafaela')
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
        WHERE date = '2026-02-19' 
          AND start_time = '14:00:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000004' 
          AND (client_name = 'Adriana Moraes' OR client_phone = '(66) 98445-1588')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Adriana Moraes', '(66) 98445-1588', '00000000-0000-0000-0000-000000000004', '2026-02-19', '14:00:00', '14:30:00', 'atendido', '', 'Tais Pires')
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
        WHERE date = '2026-02-19' 
          AND start_time = '14:00:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000001' 
          AND (client_name = 'Jaqueline Calvalcante Marques' OR client_phone = '(66) 99907-0104')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Jaqueline Calvalcante Marques', '(66) 99907-0104', '00000000-0000-0000-0000-000000000001', '2026-02-19', '14:00:00', '14:30:00', 'atendido', '', 'Agendamento')
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
        WHERE date = '2026-02-19' 
          AND start_time = '14:00:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000005' 
          AND (client_name = 'Monalisa Moreira Delosbel' OR client_phone = '(66) 99672-0229')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Monalisa Moreira Delosbel', '(66) 99672-0229', '00000000-0000-0000-0000-000000000005', '2026-02-19', '14:00:00', '14:30:00', 'atendido', 'Retorno botox', 'Rafaela')
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
        WHERE date = '2026-02-19' 
          AND start_time = '14:00:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000007' 
          AND (client_name = 'Renata Maia Solto Fernandes' OR client_phone = '(66) 99999-2202')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Renata Maia Solto Fernandes', '(66) 99999-2202', '00000000-0000-0000-0000-000000000007', '2026-02-19', '14:00:00', '14:30:00', 'atendido', '', 'Patricia Armanda')
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
        WHERE date = '2026-02-19' 
          AND start_time = '14:30:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000002' 
          AND (client_name = 'Tatiane Nicoletti' OR client_phone = '(66) 99685-8581')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Tatiane Nicoletti', '(66) 99685-8581', '00000000-0000-0000-0000-000000000002', '2026-02-19', '14:30:00', '15:00:00', 'atendido', '', 'Rafaela')
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
        WHERE date = '2026-02-19' 
          AND start_time = '14:30:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000005' 
          AND (client_name = 'Alana de Quadros' OR client_phone = '(66) 99924-4980')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Alana de Quadros', '(66) 99924-4980', '00000000-0000-0000-0000-000000000005', '2026-02-19', '14:30:00', '15:00:00', 'atendido', 'Retorno botox', 'Bruna Castanheira')
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
        WHERE date = '2026-02-19' 
          AND start_time = '15:00:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000006' 
          AND (client_name = 'Mara Regina Siegel Roffmann' OR client_phone = '(66) 99209-4733')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Mara Regina Siegel Roffmann', '(66) 99209-4733', '00000000-0000-0000-0000-000000000006', '2026-02-19', '15:00:00', '15:30:00', 'atendido', '', 'Agendamento')
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
        WHERE date = '2026-02-19' 
          AND start_time = '15:00:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000001' 
          AND (client_name = 'DIOVANA MENDEL' OR client_phone = '(66) 99209-9934')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('DIOVANA MENDEL', '(66) 99209-9934', '00000000-0000-0000-0000-000000000001', '2026-02-19', '15:00:00', '15:30:00', 'atendido', '', 'Agendamento')
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
        WHERE date = '2026-02-19' 
          AND start_time = '15:00:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000005' 
          AND (client_name = 'Bruno Gomes' OR client_phone = '(66) 99957-7192')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Bruno Gomes', '(66) 99957-7192', '00000000-0000-0000-0000-000000000005', '2026-02-19', '15:00:00', '15:30:00', 'atendido', '', 'Bruna Castanheira')
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
        WHERE date = '2026-02-19' 
          AND start_time = '15:30:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000001' 
          AND (client_name = 'Delvanda Maia' OR client_phone = '(66) 99217-1372')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Delvanda Maia', '(66) 99217-1372', '00000000-0000-0000-0000-000000000001', '2026-02-19', '15:30:00', '16:00:00', 'atendido', '1/20', 'Agendamento')
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
        WHERE date = '2026-02-19' 
          AND start_time = '15:30:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000002' 
          AND (client_name = 'Daiany Priscilla Bueno da Silva' OR client_phone = '(62) 98170-0948')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Daiany Priscilla Bueno da Silva', '(62) 98170-0948', '00000000-0000-0000-0000-000000000002', '2026-02-19', '15:30:00', '16:00:00', 'atendido', '', 'Rafaela')
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
        WHERE date = '2026-02-19' 
          AND start_time = '15:30:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000004' 
          AND (client_name = 'Maria do Carmo Jesus Bispo' OR client_phone = '(34) 62356-6372')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Maria do Carmo Jesus Bispo', '(34) 62356-6372', '00000000-0000-0000-0000-000000000004', '2026-02-19', '15:30:00', '16:30:00', 'atendido', '', 'Agendamento')
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
        WHERE date = '2026-02-19' 
          AND start_time = '16:00:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000003' 
          AND (client_name = 'Marli Salete de Avila Sbrussi' OR client_phone = '(66) 98412-6906')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Marli Salete de Avila Sbrussi', '(66) 98412-6906', '00000000-0000-0000-0000-000000000003', '2026-02-19', '16:00:00', '17:00:00', 'cancelado', '20/20', 'Dhionara Sbrussi')
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
        WHERE date = '2026-02-19' 
          AND start_time = '16:00:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000006' 
          AND (client_name = 'Michele Angrizano Quintana' OR client_phone = '(66) 99217-0456')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Michele Angrizano Quintana', '(66) 99217-0456', '00000000-0000-0000-0000-000000000006', '2026-02-19', '16:00:00', '16:30:00', 'agendado', '', 'Michele Quintana')
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
        WHERE date = '2026-02-19' 
          AND start_time = '16:30:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000001' 
          AND (client_name = 'Maria do Carmo Jesus Bispo' OR client_phone = '(34) 62356-6372')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Maria do Carmo Jesus Bispo', '(34) 62356-6372', '00000000-0000-0000-0000-000000000001', '2026-02-19', '16:30:00', '17:00:00', 'atendido', 'fiz lazer', 'Agendamento')
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
        WHERE date = '2026-02-19' 
          AND start_time = '17:15:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000003' 
          AND (client_name = 'ZILIANE COSTA' OR client_phone = '(65) 99919-4985')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('ZILIANE COSTA', '(65) 99919-4985', '00000000-0000-0000-0000-000000000003', '2026-02-19', '17:15:00', '18:15:00', 'atendido', '', 'Dhiani Sbrussi')
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
        WHERE date = '2026-02-19' 
          AND start_time = '17:30:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000004' 
          AND (client_name = 'SALETE HANEL' OR client_phone = '(66) 98133-1662')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('SALETE HANEL', '(66) 98133-1662', '00000000-0000-0000-0000-000000000004', '2026-02-19', '17:30:00', '18:30:00', 'espera', '', 'Dhionara Sbrussi')
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
        WHERE date = '2026-02-19' 
          AND start_time = '18:00:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000004' 
          AND (client_name = 'Lanna Mikaelly Galle Silva' OR client_phone = '(66) 98400-9604')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Lanna Mikaelly Galle Silva', '(66) 98400-9604', '00000000-0000-0000-0000-000000000004', '2026-02-19', '18:00:00', '18:30:00', 'atendido', '', 'Tais Pires')
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
        WHERE date = '2026-02-19' 
          AND start_time = '18:00:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000005' 
          AND (client_name = 'Rosangela Evangelista da Silva' OR client_phone = '(66) 99624-0545')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Rosangela Evangelista da Silva', '(66) 99624-0545', '00000000-0000-0000-0000-000000000005', '2026-02-19', '18:00:00', '18:30:00', 'atendido', '', 'Bruna Castanheira')
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
        WHERE date = '2026-02-19' 
          AND start_time = '18:30:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000005' 
          AND (client_name = 'Liara Marmet da Silva' OR client_phone = '(66) 98408-3247')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Liara Marmet da Silva', '(66) 98408-3247', '00000000-0000-0000-0000-000000000005', '2026-02-19', '18:30:00', '20:00:00', 'atendido', '', 'Bruna Castanheira')
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
        WHERE date = '2026-02-18' 
          AND start_time = '08:00:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000003' 
          AND (client_name = 'Vanda R. M. de Paula Thomas' OR client_phone = '(66) 99660-7327')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Vanda R. M. de Paula Thomas', '(66) 99660-7327', '00000000-0000-0000-0000-000000000003', '2026-02-18', '08:00:00', '09:00:00', 'atendido', '', 'Rafaela')
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
        WHERE date = '2026-02-18' 
          AND start_time = '08:00:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000004' 
          AND (client_name = 'Liamara Floss Vitoeino da Silva' OR client_phone = '(66) 99925-3534')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Liamara Floss Vitoeino da Silva', '(66) 99925-3534', '00000000-0000-0000-0000-000000000004', '2026-02-18', '08:00:00', '08:30:00', 'cancelado', '', 'Dhionara Sbrussi')
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
        WHERE date = '2026-02-18' 
          AND start_time = '08:00:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000003' 
          AND (client_name = 'Marcia Nascimento Evangelista' OR client_phone = '(66) 99935-9113')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Marcia Nascimento Evangelista', '(66) 99935-9113', '00000000-0000-0000-0000-000000000003', '2026-02-18', '08:00:00', '09:00:00', 'cancelado', '2/20', 'Dhionara Sbrussi')
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
        WHERE date = '2026-02-18' 
          AND start_time = '08:00:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000007' 
          AND (client_name = 'Natalia Valencio' OR client_phone = '(66) 99630-8014')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Natalia Valencio', '(66) 99630-8014', '00000000-0000-0000-0000-000000000007', '2026-02-18', '08:00:00', '08:30:00', 'atendido', '', 'Patricia Armanda')
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
        WHERE date = '2026-02-18' 
          AND start_time = '08:15:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000002' 
          AND (client_name = 'Tais Pires' OR client_phone = '(66) 98132-6656')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Tais Pires', '(66) 98132-6656', '00000000-0000-0000-0000-000000000002', '2026-02-18', '08:15:00', '08:45:00', 'atendido', 'DEIXAR SUA AMIGUINHA GOSTOSONA PRA ELA IR PRA PRAIA', 'Rafaela')
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
        WHERE date = '2026-02-18' 
          AND start_time = '08:15:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000004' 
          AND (client_name = 'Tais Pires' OR client_phone = '(66) 98132-6656')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Tais Pires', '(66) 98132-6656', '00000000-0000-0000-0000-000000000004', '2026-02-18', '08:15:00', '08:45:00', 'atendido', '', 'Rafaela')
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
        WHERE date = '2026-02-18' 
          AND start_time = '09:00:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000004' 
          AND (client_name = 'Vanda R. M. de Paula Thomas' OR client_phone = '(66) 99660-7327')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Vanda R. M. de Paula Thomas', '(66) 99660-7327', '00000000-0000-0000-0000-000000000004', '2026-02-18', '09:00:00', '09:30:00', 'atendido', '', 'Rafaela')
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
        WHERE date = '2026-02-18' 
          AND start_time = '09:00:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000003' 
          AND (client_name = 'Marcia Nascimento Evangelista' OR client_phone = '(66) 99935-9113')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Marcia Nascimento Evangelista', '(66) 99935-9113', '00000000-0000-0000-0000-000000000003', '2026-02-18', '09:00:00', '10:00:00', 'atendido', '', 'Rafaela')
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
        WHERE date = '2026-02-18' 
          AND start_time = '09:15:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000004' 
          AND (client_name = 'Vanda R. M. de Paula Thomas' OR client_phone = '(66) 99660-7327')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Vanda R. M. de Paula Thomas', '(66) 99660-7327', '00000000-0000-0000-0000-000000000004', '2026-02-18', '09:15:00', '09:45:00', 'atendido', '', 'Rafaela')
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
        WHERE date = '2026-02-18' 
          AND start_time = '09:30:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000006' 
          AND (client_name = 'Daisyane Elis Budel' OR client_phone = '(66) 99925-9942')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Daisyane Elis Budel', '(66) 99925-9942', '00000000-0000-0000-0000-000000000006', '2026-02-18', '09:30:00', '10:00:00', 'atendido', '', 'Agendamento')
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
        WHERE date = '2026-02-18' 
          AND start_time = '09:30:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000002' 
          AND (client_name = 'Kleide de Oliveira' OR client_phone = '(66) 99244-1418')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Kleide de Oliveira', '(66) 99244-1418', '00000000-0000-0000-0000-000000000002', '2026-02-18', '09:30:00', '10:00:00', 'atendido', '', 'Rafaela')
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
        WHERE date = '2026-02-18' 
          AND start_time = '10:00:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000005' 
          AND (client_name = 'Bruna Lorrany Castanheira' OR client_phone = '(66) 98434-3545')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Bruna Lorrany Castanheira', '(66) 98434-3545', '00000000-0000-0000-0000-000000000005', '2026-02-18', '10:00:00', '10:45:00', 'espera', '13/20', 'Bruna Castanheira')
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
        WHERE date = '2026-02-18' 
          AND start_time = '10:00:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000002' 
          AND (client_name = 'Bruna Lorrany Castanheira' OR client_phone = '(66) 98434-3545')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Bruna Lorrany Castanheira', '(66) 98434-3545', '00000000-0000-0000-0000-000000000002', '2026-02-18', '10:00:00', '10:45:00', 'espera', '3/10', 'Bruna Castanheira')
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
        WHERE date = '2026-02-18' 
          AND start_time = '10:30:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000001' 
          AND (client_name = 'Dhionara Sbrussi Lorenzon.' OR client_phone = '(66) 99988-2911')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Dhionara Sbrussi Lorenzon.', '(66) 99988-2911', '00000000-0000-0000-0000-000000000001', '2026-02-18', '10:30:00', '11:00:00', 'atendido', '', 'Agendamento')
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
        WHERE date = '2026-02-18' 
          AND start_time = '10:45:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000004' 
          AND (client_name = 'Gilda' OR client_phone = '(66) 99988-6461')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('Gilda', '(66) 99988-6461', '00000000-0000-0000-0000-000000000004', '2026-02-18', '10:45:00', '11:15:00', 'atendido', '', 'Agendamento')
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
        WHERE date = '2026-02-18' 
          AND start_time = '11:00:00' 
          AND professional_id = '00000000-0000-0000-0000-000000000006' 
          AND (client_name = 'ELAINE AMORIM' OR client_phone = '(66) 99235-3113')
    ) THEN
        INSERT INTO appointments (client_name, client_phone, professional_id, date, start_time, end_time, status, notes, executed_by)
        VALUES ('ELAINE AMORIM', '(66) 99235-3113', '00000000-0000-0000-0000-000000000006', '2026-02-18', '11:00:00', '11:30:00', 'atendido', '', 'Agendamento')
        RETURNING id INTO v_appointment_id;

        INSERT INTO appointment_services (appointment_id, service_name, duration_minutes)
        VALUES (v_appointment_id, 'Injetaveis', 30);
    END IF;
END $$;

COMMIT;