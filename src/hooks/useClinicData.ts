import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { statusConfig } from "@/data/clinic";
import type { Database } from "@/integrations/supabase/types";

type Tables = Database["public"]["Tables"];
type Views = Database["public"]["Views"];

// ========== PROFESSIONALS ==========
export type DBProfessional = Tables["professionals"]["Row"];

export const useProfessionals = (optionsOrIncludeInactive: boolean | { includeInactive?: boolean, onlyVisibleInAgenda?: boolean } = false) => {
  const options = typeof optionsOrIncludeInactive === "boolean"
    ? { includeInactive: optionsOrIncludeInactive }
    : optionsOrIncludeInactive;

  const { includeInactive = false, onlyVisibleInAgenda = false } = options;

  return useQuery({
    queryKey: ["professionals", includeInactive, onlyVisibleInAgenda],
    queryFn: async () => {
      let query = supabase
        .from("professionals")
        .select("*")
        .order("agenda_order")
        .order("name");

      if (!includeInactive) query = query.eq("is_active", true);
      if (onlyVisibleInAgenda) query = query.eq("can_receive_appointments", true);

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
  professionals?: { name: string };
  appointment_services?: {
    id: string;
    service_name: string;
    service_id: string | null;
    duration_minutes: number;
    price: number | null;
  }[];
}

export const useAppointments = (dateFrom?: string, dateTo?: string) => {
  return useQuery({
    queryKey: ["appointments", dateFrom, dateTo],
    refetchInterval: 300000, // 5 minutes
    queryFn: async () => {
      let query = supabase
        .from("appointments")
        .select("*, appointment_services(*), professionals(name)")
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
export type DBClient = Tables["clients"]["Row"];
export type DBClientDetail = Views["client_details_view"]["Row"];

export const useClients = (options: {
  search?: string;
  page?: number;
  pageSize?: number;
  sortBy?: string;
  is_active?: boolean;
  filterIncomplete?: boolean;
  filterCity?: string;
  filterDateFrom?: string;
  filterDateTo?: string;
} = {}) => {
  const {
    search,
    page = 1,
    pageSize = 50,
    sortBy,
    is_active = true,
    filterIncomplete,
    filterCity,
    filterDateFrom,
    filterDateTo
  } = options;

  return useQuery({
    queryKey: ["clients", search, page, pageSize, sortBy, is_active, filterIncomplete, filterCity, filterDateFrom, filterDateTo],
    queryFn: async () => {
      let query = supabase
        .from("client_details_view")
        .select("*", { count: "exact" })
        .eq("is_active", is_active);

      if (search && search.trim().length > 0) {
        const cleanSearch = search.trim().normalize("NFC");
        const numericSearch = cleanSearch.replace(/\D/g, '');
        if (numericSearch.length >= 8) {
          query = query.or(`full_name.ilike.%${cleanSearch}%,phone.ilike.%${cleanSearch}%,phone.ilike.%${numericSearch}%,cpf.ilike.%${cleanSearch}%`);
        } else {
          query = query.or(`full_name.ilike.%${cleanSearch}%,phone.ilike.%${cleanSearch}%,cpf.ilike.%${cleanSearch}%`);
        }
      }

      if (filterCity) {
        query = query.eq("city", filterCity);
      }

      if (filterDateFrom) {
        query = query.gte("created_at", filterDateFrom);
      }

      if (filterDateTo) {
        query = query.lte("created_at", filterDateTo + 'T23:59:59');
      }

      if (filterIncomplete) {
        query = query.or('cpf.is.null,address.is.null,city.is.null');
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
        data: (data || []) as DBClientDetail[],
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

// ========== PATIENT RECORDS (ANAMNESIS) ==========
export interface DBPatientRecord {
  id: string;
  client_id: string;
  professional_id: string | null;
  record_type: string;
  title: string | null;
  created_at: string;
  updated_at: string;
  clients?: { full_name: string };
  professionals?: { name: string };
}

export const usePatientRecords = (options: {
  search?: string;
  page?: number;
  pageSize?: number;
  typeFilter?: string;
} = {}) => {
  const { search, page = 1, pageSize = 20, typeFilter } = options;

  return useQuery({
    queryKey: ["patient_records", search, page, pageSize, typeFilter],
    queryFn: async () => {
      let query = supabase
        .from("patient_records")
        .select("*, clients(full_name), professionals(name)", { count: "exact" })
        .order("created_at", { ascending: false });

      if (typeFilter && typeFilter !== "all" && typeFilter !== "") {
        query = query.eq("title", typeFilter);
      }

      if (search && search.trim().length > 0) {
        // Search on title or record_type. For searching client names, 
        // we'd ideally need a View or a separate client-side filter if search is small,
        // but since we want server-side, we search on what's available in the table.
        query = query.or(`title.ilike.%${search}%,record_type.ilike.%${search}%`);
      }

      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;

      const { data, error, count } = await query.range(from, to);

      if (error) throw error;

      return {
        data: (data || []).map(r => ({
          ...r,
          client_name: (r as any).clients?.full_name || "Cliente",
          professional_name: (r as any).professionals?.name || null
        })),
        count: count || 0,
      };
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

export const useNotifications = (professionalName?: string | null) => {
  return useQuery({
    queryKey: ["notifications", professionalName ?? "all"],
    queryFn: async () => {
      let query = supabase
        .from("notifications" as any)
        .select("*")
        .order("created_at", { ascending: false });

      const { data, error } = await query;

      if (error) throw error;

      let result = (data as unknown as DBNotification[]) ?? [];

      // Se profissional não-gestora, filtra apenas as próprias notificações
      if (professionalName) {
        result = result.filter(
          (n) => (n.metadata?.professional_name ?? "") === professionalName
        );
      }

      return result;
    },
  });
};

// Re-export statusConfig and WEEKLY_BLOCKS for convenience
export { statusConfig };
export { WEEKLY_BLOCKS } from "@/data/clinic";
