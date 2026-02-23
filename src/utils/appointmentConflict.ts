import { supabase } from "@/integrations/supabase/client";

/**
 * Checks if a new/edited appointment conflicts with existing ones
 * for the same professional on the same date.
 * Returns the conflicting appointment's client_name if found, or null.
 */
export async function checkAppointmentConflict({
  professionalId,
  date,
  startTime,
  endTime,
  excludeAppointmentId,
}: {
  professionalId: string;
  date: string;
  startTime: string; // HH:MM:SS
  endTime: string;   // HH:MM:SS
  excludeAppointmentId?: string;
}): Promise<string | null> {
  let query = supabase
    .from("appointments")
    .select("id, client_name, start_time, end_time")
    .eq("professional_id", professionalId)
    .eq("date", date)
    .not("status", "in", '("cancelado","falta")')
    .lt("start_time", endTime)
    .gt("end_time", startTime);

  if (excludeAppointmentId) {
    query = query.neq("id", excludeAppointmentId);
  }

  const { data, error } = await query;
  if (error) {
    console.warn("Conflict check failed:", error.message);
    return null; // fail open — don't block on query errors
  }

  if (data && data.length > 0) {
    const conflict = data[0];
    return conflict.client_name || "outro cliente";
  }

  return null;
}
