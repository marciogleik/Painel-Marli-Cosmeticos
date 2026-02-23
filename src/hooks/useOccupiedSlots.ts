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

      let query = supabase
        .from("appointments")
        .select("start_time, end_time, client_name")
        .eq("professional_id", professionalId)
        .eq("date", date)
        .not("status", "in", '("cancelado","falta")');

      if (excludeAppointmentId) {
        query = query.neq("id", excludeAppointmentId);
      }

      const { data, error } = await query;
      if (error) {
        console.warn("Failed to fetch occupied slots:", error.message);
        return [];
      }

      // Also fetch blocked slots
      const { data: blocked } = await supabase
        .from("blocked_slots")
        .select("start_time, end_time, reason")
        .eq("professional_id", professionalId)
        .eq("date", date);

      const blockedSlots: OccupiedSlot[] = (blocked || []).map((b) => ({
        start_time: b.start_time,
        end_time: b.end_time,
        client_name: `🚫 ${b.reason || "Bloqueado"}`,
      }));

      return [...(data || []), ...blockedSlots];
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
