-- Add 'removido' and other missing statuses to the appointments table constraint
ALTER TABLE appointments DROP CONSTRAINT IF EXISTS appointments_status_check;
ALTER TABLE appointments ADD CONSTRAINT appointments_status_check 
CHECK (status IN ('agendado', 'confirmado', 'cancelado', 'atendido', 'espera', 'atendendo', 'atrasado', 'falta', 'removido'));
