import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { statusConfig } from "@/data/clinic";
import type { Database } from "@/integrations/supabase/types";

type Tables = Database["public"]["Tables"];
type Views = Database["public"]["Views"];

// ========== PROFESSIONALS ==========
export type DBProfessional = Tables["professionals"]["Row"];

export const useProfessionals = (includeInactive = false) => {
  return useQuery({
    queryKey: ["professionals", includeInactive],
    queryFn: async () => {
      let query = supabase
        .from("professionals")
        .select("*")
        .order("name");

      if (!includeInactive) query = query.eq("is_active", true);

      const { data, error } = await query;
      if (error) throw error;
      return data ?? [];
    },
  });
};

// ========== SERVICES ==========
export type DBService = Tables["services"]["Row"];

export const useServices = (includeInactive = false) => {
  return useQuery({
    queryKey: ["services", includeInactive],
    queryFn: async () => {
      let query = supabase
        .from("services")
        .select("*")
        .order("name");

      if (!includeInactive) query = query.eq("is_active", true);

      const { data, error } = await query;
      if (error) throw error;
      return data ?? [];
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

      if (error) throw error;
      return (data ?? []) as DBProfessionalService[];
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
    refetchInterval: 300000, // 5 minutes
    queryFn: async () => {
      let query = supabase
        .from("appointments")
        .select("*")
        .order("date")
        .order("start_time");

      if (dateFrom) query = query.gte("date", dateFrom);
      if (dateTo) query = query.lte("date", dateTo);

      const { data, error } = await query;

      if (error) throw error;
      return (data ?? []) as DBAppointment[];
    },
  });
};

// ========== CLIENTS ==========
export type DBClient = Views["client_details_view"]["Row"];

export const useClients = (options: {
  search?: string;
  page?: number;
  pageSize?: number;
  sortBy?: string;
  is_active?: boolean;
} = {}) => {
  const { search, page = 1, pageSize = 50, sortBy, is_active = true } = options;

  return useQuery({
    queryKey: ["clients", search, page, pageSize, sortBy, is_active],
    queryFn: async () => {
      let query = supabase
        .from("client_details_view")
        .select("*", { count: "exact" })
        .eq("is_active", is_active);

      if (search && search.trim().length > 0) {
        const numericSearch = search.replace(/\D/g, '');
        if (numericSearch.length >= 8) {
          // If searching by number, try to match digits too
          query = query.or(`full_name.ilike.%${search}%,phone.ilike.%${search}%,phone.ilike.%${numericSearch}%,cpf.ilike.%${search}%`);
        } else {
          query = query.or(`full_name.ilike.%${search}%,phone.ilike.%${search}%,cpf.ilike.%${search}%`);
        }
      }

      if (sortBy === 'last_visit') {
        query = query.order("last_visit", { ascending: false, nullsFirst: false });
      } else if (sortBy === 'total_visits') {
        query = query.order("total_visits", { ascending: false });
      } else {
        query = query.order("full_name", { ascending: true });
      }

      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;

      const { data, error, count } = await query.range(from, to);

      if (error) throw error;

      return {
        data: data || [],
        count: count || 0,
      };
    },
  });
};

export const useInactiveClients = () => {
  return useQuery({
    queryKey: ["clients_inactive"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("clients")
        .select("*")
        .eq("is_active", false)
        .order("full_name");

      if (error) throw error;
      return (data ?? []) as DBClient[];
    },
  });
};

// ========== NOTIFICATIONS ==========
export type DBNotification = {
  id: string;
  type: string;
  title: string;
  content: string;
  metadata: any;
  is_read: boolean;
  created_at: string;
};

export const useNotifications = () => {
  return useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("notifications" as any)
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return (data as unknown as DBNotification[]) ?? [];
    },
  });
};

// Re-export statusConfig and WEEKLY_BLOCKS for convenience
export { statusConfig };
export { WEEKLY_BLOCKS } from "@/data/clinic";
