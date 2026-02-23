import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format, startOfYear, endOfYear, subYears, eachMonthOfInterval } from "date-fns";
import { ptBR } from "date-fns/locale";

export interface MonthlyRevenue {
  month: string; // "Jan", "Fev", etc.
  monthIndex: number;
  currentYear: number;
  previousYear: number;
}

async function fetchYearRevenue(year: number, professionalId?: string) {
  const from = format(startOfYear(new Date(year, 0, 1)), "yyyy-MM-dd");
  const to = format(endOfYear(new Date(year, 0, 1)), "yyyy-MM-dd");

  let query = supabase
    .from("appointments")
    .select("id, date, professional_id, status")
    .gte("date", from)
    .lte("date", to)
    .in("status", ["concluido", "confirmado", "agendado", "atendido"]);

  if (professionalId) query = query.eq("professional_id", professionalId);

  const { data: appointments, error: appErr } = await query;
  if (appErr) throw appErr;
  if (!appointments?.length) return new Map<number, number>();

  const appointmentIds = appointments.map(a => a.id);

  const { data: services, error: svcErr } = await supabase
    .from("appointment_services")
    .select("appointment_id, price")
    .in("appointment_id", appointmentIds);
  if (svcErr) throw svcErr;

  const apptMap = new Map(appointments.map(a => [a.id, a]));
  const monthlyMap = new Map<number, number>();

  for (const svc of (services ?? [])) {
    const appt = apptMap.get(svc.appointment_id);
    if (!appt) continue;
    const monthIdx = new Date(appt.date + "T12:00:00").getMonth();
    monthlyMap.set(monthIdx, (monthlyMap.get(monthIdx) ?? 0) + (svc.price ?? 0));
  }

  return monthlyMap;
}

export const useYearlyComparison = (professionalId?: string) => {
  const currentYear = new Date().getFullYear();
  const previousYear = currentYear - 1;

  return useQuery({
    queryKey: ["yearly-comparison", currentYear, professionalId ?? "all"],
    queryFn: async () => {
      const [currentData, previousData] = await Promise.all([
        fetchYearRevenue(currentYear, professionalId),
        fetchYearRevenue(previousYear, professionalId),
      ]);

      const months = eachMonthOfInterval({
        start: startOfYear(new Date()),
        end: endOfYear(new Date()),
      });

      const data: MonthlyRevenue[] = months.map((m, i) => ({
        month: format(m, "MMM", { locale: ptBR }).replace(".", ""),
        monthIndex: i,
        currentYear: currentData.get(i) ?? 0,
        previousYear: previousData.get(i) ?? 0,
      }));

      return { data, currentYear, previousYear };
    },
  });
};
