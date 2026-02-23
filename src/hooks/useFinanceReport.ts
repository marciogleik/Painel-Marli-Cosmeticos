import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { startOfMonth, endOfMonth, format, subMonths, eachDayOfInterval, parseISO } from "date-fns";

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

export const useFinanceReport = (month: Date) => {
  const from = format(startOfMonth(month), "yyyy-MM-dd");
  const to = format(endOfMonth(month), "yyyy-MM-dd");

  return useQuery({
    queryKey: ["finance-report", from, to],
    queryFn: async () => {
      // Get completed appointments with their services and prices
      const { data: appointments, error: appErr } = await supabase
        .from("appointments")
        .select("id, date, professional_id, status")
        .gte("date", from)
        .lte("date", to)
        .in("status", ["concluido", "confirmado", "agendado"]);

      if (appErr) throw appErr;
      if (!appointments?.length) return { byProfessional: [], byService: [], daily: [], totalRevenue: 0, totalAppointments: 0 };

      const appointmentIds = appointments.map(a => a.id);

      const { data: services, error: svcErr } = await supabase
        .from("appointment_services")
        .select("appointment_id, service_name, price, duration_minutes")
        .in("appointment_id", appointmentIds);

      if (svcErr) throw svcErr;

      const { data: professionals, error: profErr } = await supabase
        .from("professionals")
        .select("id, name");

      if (profErr) throw profErr;

      const profMap = new Map(professionals?.map(p => [p.id, p.name]) ?? []);

      // Build appointment map
      const apptMap = new Map(appointments.map(a => [a.id, a]));

      // Revenue by professional
      const profRevenue = new Map<string, { total: number; count: number; name: string }>();
      // Revenue by service
      const svcRevenue = new Map<string, { total: number; count: number }>();
      // Daily revenue
      const dailyMap = new Map<string, number>();

      for (const svc of (services ?? [])) {
        const appt = apptMap.get(svc.appointment_id);
        if (!appt) continue;
        const price = svc.price ?? 0;

        // By professional
        const profId = appt.professional_id;
        const existing = profRevenue.get(profId) ?? { total: 0, count: 0, name: profMap.get(profId) ?? "Desconhecido" };
        existing.total += price;
        existing.count += 1;
        profRevenue.set(profId, existing);

        // By service
        const svcExisting = svcRevenue.get(svc.service_name) ?? { total: 0, count: 0 };
        svcExisting.total += price;
        svcExisting.count += 1;
        svcRevenue.set(svc.service_name, svcExisting);

        // Daily
        dailyMap.set(appt.date, (dailyMap.get(appt.date) ?? 0) + price);
      }

      const byProfessional: RevenueByProfessional[] = Array.from(profRevenue.entries())
        .map(([id, v]) => ({ professional_id: id, professional_name: v.name, total: v.total, count: v.count }))
        .sort((a, b) => b.total - a.total);

      const byService: RevenueByService[] = Array.from(svcRevenue.entries())
        .map(([name, v]) => ({ service_name: name, total: v.total, count: v.count }))
        .sort((a, b) => b.total - a.total);

      // Fill all days of the month
      const allDays = eachDayOfInterval({ start: startOfMonth(month), end: endOfMonth(month) > new Date() ? new Date() : endOfMonth(month) });
      const daily: DailyRevenue[] = allDays.map(d => {
        const key = format(d, "yyyy-MM-dd");
        return { date: key, total: dailyMap.get(key) ?? 0 };
      });

      const totalRevenue = byProfessional.reduce((sum, p) => sum + p.total, 0);
      const totalAppointments = appointments.length;

      return { byProfessional, byService, daily, totalRevenue, totalAppointments };
    },
  });
};
