import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { startOfMonth, endOfMonth, format, subMonths, eachDayOfInterval, parseISO, differenceInDays } from "date-fns";

export interface RevenueByProfessional {
  professional_id: string;
  professional_name: string;
  total: number;
  count: number;
}

export interface RevenueByService {
  service_name: string;
  total: number;
  count: number;
}

export interface DailyRevenue {
  date: string;
  total: number;
}

export interface PreviousMonthComparison {
  revenueDelta: number | null;
  appointmentsDelta: number | null;
  ticketDelta: number | null;
}

async function fetchPeriodData(from: string, to: string, professionalId?: string) {
  let query = supabase
    .from("appointments")
    .select(`
      id, 
      date, 
      professional_id, 
      status,
      appointment_services(price, service_name)
    `)
    .gte("date", from)
    .lte("date", to)
    .in("status", ["concluido", "confirmado", "agendado", "atendido"]);

  if (professionalId) query = query.eq("professional_id", professionalId);

  const { data: appointments, error: appErr } = await query;
  if (appErr) throw appErr;
  if (!appointments?.length) return { byProfessional: [], byService: [], daily: [] as DailyRevenue[], totalRevenue: 0, totalAppointments: 0 };

  const { data: professionals, error: profErr } = await supabase
    .from("professionals")
    .select("id, name");
  if (profErr) throw profErr;

  const profMap = new Map(professionals?.map(p => [p.id, p.name]) ?? []);
  const profRevenue = new Map<string, { total: number; count: number; name: string }>();
  const svcRevenue = new Map<string, { total: number; count: number }>();
  const dailyMap = new Map<string, number>();

  for (const appt of appointments) {
    const services = (appt.appointment_services as any[]) || [];
    const profId = appt.professional_id;
    const date = appt.date;

    for (const svc of services) {
      const price = svc.price ?? 0;
      
      const existing = profRevenue.get(profId) ?? { total: 0, count: 0, name: profMap.get(profId) ?? "Desconhecido" };
      existing.total += price;
      existing.count += 1;
      profRevenue.set(profId, existing);

      const svcName = svc.service_name || "Outros";
      const svcExisting = svcRevenue.get(svcName) ?? { total: 0, count: 0 };
      svcExisting.total += price;
      svcExisting.count += 1;
      svcRevenue.set(svcName, svcExisting);

      dailyMap.set(date, (dailyMap.get(date) ?? 0) + price);
    }
  }

  const byProfessional: RevenueByProfessional[] = Array.from(profRevenue.entries())
    .map(([id, v]) => ({ professional_id: id, professional_name: v.name, total: v.total, count: v.count }))
    .sort((a, b) => b.total - a.total);

  const byService: RevenueByService[] = Array.from(svcRevenue.entries())
    .map(([name, v]) => ({ service_name: name, total: v.total, count: v.count }))
    .sort((a, b) => b.total - a.total);

  // Fill daily for the range
  const startDate = parseISO(from);
  const endDate = parseISO(to) > new Date() ? new Date() : parseISO(to);
  const allDays = eachDayOfInterval({ start: startDate, end: endDate });
  const daily: DailyRevenue[] = allDays.map(d => {
    const key = format(d, "yyyy-MM-dd");
    return { date: key, total: dailyMap.get(key) ?? 0 };
  });

  const totalRevenue = byProfessional.reduce((sum, p) => sum + p.total, 0);
  const totalAppointments = appointments.length;

  return { byProfessional, byService, daily, totalRevenue, totalAppointments };
}

const calcDelta = (curr: number, prev: number): number | null => {
  if (prev === 0) return curr > 0 ? 100 : null;
  return ((curr - prev) / prev) * 100;
};

export const useFinanceReport = (
  month: Date,
  professionalId?: string,
  customRange?: { from: Date; to: Date } | null,
) => {
  const isCustom = !!customRange;
  const from = isCustom ? format(customRange.from, "yyyy-MM-dd") : format(startOfMonth(month), "yyyy-MM-dd");
  const to = isCustom ? format(customRange.to, "yyyy-MM-dd") : format(endOfMonth(month), "yyyy-MM-dd");

  // For comparison: previous period of equal length, or previous month
  const prevMonth = subMonths(month, 1);
  const prevFrom = isCustom
    ? format(new Date(customRange.from.getTime() - (customRange.to.getTime() - customRange.from.getTime()) - 86400000), "yyyy-MM-dd")
    : format(startOfMonth(prevMonth), "yyyy-MM-dd");
  const prevTo = isCustom
    ? format(new Date(customRange.from.getTime() - 86400000), "yyyy-MM-dd")
    : format(endOfMonth(prevMonth), "yyyy-MM-dd");

  return useQuery({
    queryKey: ["finance-report", from, to, professionalId ?? "all"],
    queryFn: async () => {
      const [current, previous] = await Promise.all([
        fetchPeriodData(from, to, professionalId),
        fetchPeriodData(prevFrom, prevTo, professionalId),
      ]);

      const prevTicket = previous.totalAppointments > 0 ? previous.totalRevenue / previous.totalAppointments : 0;
      const currTicket = current.totalAppointments > 0 ? current.totalRevenue / current.totalAppointments : 0;

      const comparison: PreviousMonthComparison = {
        revenueDelta: calcDelta(current.totalRevenue, previous.totalRevenue),
        appointmentsDelta: calcDelta(current.totalAppointments, previous.totalAppointments),
        ticketDelta: calcDelta(currTicket, prevTicket),
      };

      return { ...current, comparison };
    },
  });
};
