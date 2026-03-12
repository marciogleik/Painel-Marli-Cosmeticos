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
  const ACTIVE_STATUSES = ["agendado", "confirmado", "espera", "atendendo", "atendido", "atrasado"];

  let query = supabase
    .from("appointments")
    .select("id, client_name, start_time, end_time")
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
    return conflict.client_name || "outro cliente";
  }

  // Check blocked slot conflicts
  const { data: blocked, error: blockedError } = await supabase
    .from("blocked_slots")
    .select("id, start_time, end_time, reason")
    .eq("professional_id", professionalId)
    .eq("date", date)
    .lt("start_time", endTime)
    .gt("end_time", startTime);

  if (!blockedError && blocked && blocked.length > 0) {
    return blocked[0].reason || "Horário bloqueado";
  }

  // Check weekly blocked slots
  const relevantWeekly = WEEKLY_BLOCKS.filter(wb => wb.professionalId === professionalId);
  for (const block of relevantWeekly) {
    // Basic overlap check: (start1 < end2) && (end1 > start2)
    const blockStart = block.startTime.length === 5 ? `${block.startTime}:00` : block.startTime;
    const blockEnd = block.endTime.length === 5 ? `${block.endTime}:00` : block.endTime;

    if (startTime < blockEnd && endTime > blockStart) {
      return block.reason || "Indisponibilidade fixa";
    }
  }

  return null;
}
