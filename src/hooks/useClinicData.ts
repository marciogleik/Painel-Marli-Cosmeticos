import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { professionals as localProfessionals, services as localServices, sampleAppointments, statusConfig } from "@/data/clinic";

// ========== PROFESSIONALS ==========
export interface DBProfessional {
  id: string;
  name: string;
  role_description: string | null;
  avatar_initials: string | null;
  is_active: boolean;
}

export const useProfessionals = () => {
  return useQuery({
    queryKey: ["professionals"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("professionals")
        .select("*")
        .eq("is_active", true)
        .order("name");

      if (error || !data || data.length === 0) {
        // Fallback to local data
        return localProfessionals.map(p => ({
          id: p.id,
          name: p.name,
          role_description: p.role,
          avatar_initials: p.avatar,
          is_active: true,
        })) as DBProfessional[];
      }
      return data as DBProfessional[];
    },
  });
};

// ========== SERVICES ==========
export interface DBService {
  id: string;
  name: string;
  duration_minutes: number;
  base_price: number | null;
  price_note: string | null;
  category: string;
  requires_evaluation: boolean;
  is_active: boolean;
}

export const useServices = () => {
  return useQuery({
    queryKey: ["services"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("services")
        .select("*")
        .eq("is_active", true)
        .order("name");

      if (error || !data || data.length === 0) {
        return localServices.map(s => ({
          id: s.id,
          name: s.name,
          duration_minutes: s.duration,
          base_price: s.price,
          price_note: s.priceNote || null,
          category: s.category,
          requires_evaluation: s.price === null,
          is_active: true,
        })) as DBService[];
      }
      return data as DBService[];
    },
  });
};

// ========== PROFESSIONAL SERVICES (N:N) ==========
export interface DBProfessionalService {
  id: string;
  professional_id: string;
  service_id: string;
  custom_price: number | null;
  is_active: boolean;
}

export const useProfessionalServices = () => {
  return useQuery({
    queryKey: ["professional_services"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("professional_services")
        .select("*")
        .eq("is_active", true);

      if (error || !data || data.length === 0) {
        // Build from local services professionalIds
        const links: DBProfessionalService[] = [];
        localServices.forEach(s => {
          s.professionalIds.forEach(pid => {
            links.push({
              id: `${s.id}-${pid}`,
              professional_id: pid,
              service_id: s.id,
              custom_price: null,
              is_active: true,
            });
          });
        });
        return links;
      }
      return data as DBProfessionalService[];
    },
  });
};

// Helper: get services for a specific professional
export const useServicesForProfessional = (professionalId: string) => {
  const { data: services } = useServices();
  const { data: links } = useProfessionalServices();

  if (!services || !links) return [];

  const serviceIds = links
    .filter(l => l.professional_id === professionalId)
    .map(l => l.service_id);

  return services.filter(s => serviceIds.includes(s.id));
};

// ========== APPOINTMENTS ==========
export interface DBAppointment {
  id: string;
  client_id: string | null;
  professional_id: string;
  date: string;
  start_time: string;
  end_time: string;
  status: string;
  notes: string | null;
  client_name: string | null;
  client_phone: string | null;
  executed_by: string | null;
  cancellation_reason: string | null;
}

export const useAppointments = (dateFrom?: string, dateTo?: string) => {
  return useQuery({
    queryKey: ["appointments", dateFrom, dateTo],
    queryFn: async () => {
      let query = supabase
        .from("appointments")
        .select("*")
        .order("date")
        .order("start_time");

      if (dateFrom) query = query.gte("date", dateFrom);
      if (dateTo) query = query.lte("date", dateTo);

      const { data, error } = await query;

      if (error || !data || data.length === 0) {
        // Fallback to local data
        return sampleAppointments
          .filter(a => {
            if (dateFrom && a.date < dateFrom) return false;
            if (dateTo && a.date > dateTo) return false;
            return true;
          })
          .map(a => {
            const svc = localServices.find(s => s.name === a.serviceNames[0]);
            const duration = svc?.duration || 30;
            const [h, m] = a.time.split(":").map(Number);
            const endMinutes = h * 60 + m + duration;
            const endH = Math.floor(endMinutes / 60).toString().padStart(2, "0");
            const endM = (endMinutes % 60).toString().padStart(2, "0");

            return {
              id: a.id,
              client_id: null,
              professional_id: a.professionalId,
              date: a.date,
              start_time: a.time + ":00",
              end_time: `${endH}:${endM}:00`,
              status: a.status,
              notes: a.notes || null,
              client_name: a.clientName,
              client_phone: a.clientPhone,
              executed_by: a.executedBy || null,
              cancellation_reason: null,
            } as DBAppointment;
          });
      }
      return data as DBAppointment[];
    },
  });
};

// ========== CLIENTS ==========
export interface DBClient {
  id: string;
  full_name: string;
  phone: string | null;
  phone2: string | null;
  email: string | null;
  cpf: string | null;
  birth_date: string | null;
  notes: string | null;
  is_active: boolean;
  created_at: string;
}

export const useClients = (search?: string) => {
  return useQuery({
    queryKey: ["clients", search],
    queryFn: async () => {
      let query = supabase
        .from("clients")
        .select("*")
        .eq("is_active", true)
        .order("full_name");

      if (search && search.length > 0) {
        query = query.or(`full_name.ilike.%${search}%,phone.ilike.%${search}%`);
      }

      const { data, error } = await query;

      if (error || !data) {
        return [] as DBClient[];
      }
      return data as DBClient[];
    },
  });
};

// Re-export statusConfig for convenience
export { statusConfig };
