import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface OccupiedSlot {
  start_time: string;
  end_time: string;
  client_name: string | null;
}

/**
 * Fetches existing appointments and blocked slots for a professional on a given date.
 * Returns a helper to check if a given time slot overlaps with any.
 */
export function useOccupiedSlots(
  professionalId: string | undefined,
  date: string | undefined,
  excludeAppointmentId?: string
) {
  const { data: occupied = [] } = useQuery<OccupiedSlot[]>({
    queryKey: ["occupied-slots", professionalId, date, excludeAppointmentId],
    queryFn: async () => {
      if (!professionalId || !date) return [];

      // Use allowlist to avoid PostgREST .not().in() syntax issues.
      // cancelado, falta, removido are all excluded.
      // Now including 'bloqueado' as an occupied status.
      const ACTIVE_STATUSES = ["agendado", "confirmado", "espera", "atendendo", "atendido", "atrasado", "bloqueado"];

      let query = supabase
        .from("appointments")
        .select("start_time, end_time, client_name, status, notes")
        .eq("professional_id", professionalId)
        .eq("date", date)
        .in("status", ACTIVE_STATUSES);

      if (excludeAppointmentId) {
        query = query.neq("id", excludeAppointmentId);
      }

      const { data, error } = await query;
      if (error) {
        console.warn("Failed to fetch occupied slots:", error.message);
        return [];
      }

      const occupiedSlots: OccupiedSlot[] = (data || []).map((a) => ({
        start_time: a.start_time,
        end_time: a.end_time,
        client_name: a.status === "bloqueado" ? `🚫 ${a.notes || "Bloqueado"}` : a.client_name,
      }));

      return occupiedSlots;
    },
    enabled: !!professionalId && !!date,
  });

  /** Check if a slot starting at `time` (HH:MM) with `durationMinutes` overlaps any existing appointment or block */
  const getConflict = (time: string, durationMinutes: number): string | null => {
    if (!time || durationMinutes <= 0) return null;

    const [h, m] = time.split(":").map(Number);
    const slotStart = h * 60 + m;
    const slotEnd = slotStart + durationMinutes;

    for (const appt of occupied) {
      const [ah, am] = appt.start_time.split(":").map(Number);
      const [eh, em] = appt.end_time.split(":").map(Number);
      const apptStart = ah * 60 + am;
      const apptEnd = eh * 60 + em;

      if (slotStart < apptEnd && slotEnd > apptStart) {
        return appt.client_name || "Ocupado";
      }
    }
    return null;
  };

  return { occupied, getConflict };
}
