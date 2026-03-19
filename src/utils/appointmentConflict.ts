import { supabase } from "@/integrations/supabase/client";
import { WEEKLY_BLOCKS } from "@/data/clinic";

/**
 * Checks if a new/edited appointment conflicts with existing ones
 * or blocked slots for the same professional on the same date.
 * Returns the conflicting appointment's client_name or "Horário bloqueado" if found, or null.
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
  // Check appointment conflicts — using allowlist to avoid PostgREST .not().in() syntax issues
  // Including 'bloqueado' status for unified conflict checking.
  const ACTIVE_STATUSES = ["agendado", "confirmado", "espera", "atendendo", "atendido", "atrasado", "bloqueado"];

  let query = supabase
    .from("appointments")
    .select("id, client_name, status, notes, start_time, end_time")
    .eq("professional_id", professionalId)
    .eq("date", date)
    .in("status", ACTIVE_STATUSES)
    .lt("start_time", endTime)
    .gt("end_time", startTime);

  if (excludeAppointmentId) {
    query = query.neq("id", excludeAppointmentId);
  }

  const { data, error } = await query;
  if (error) {
    console.warn("Conflict check failed:", error.message);
    return null;
  }

  if (data && data.length > 0) {
    const conflict = data[0];
    if (conflict.status === "bloqueado") {
      return conflict.notes || "Horário bloqueado";
    }
    return conflict.client_name || "outro cliente";
  }

  return null;
}
