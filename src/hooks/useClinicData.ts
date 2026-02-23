import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { statusConfig } from "@/data/clinic";

// ========== PROFESSIONALS ==========
export interface DBProfessional {
  id: string;
  name: string;
  role_description: string | null;
  avatar_initials: string | null;
  is_active: boolean;
}

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
      return (data ?? []) as DBProfessional[];
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
      return (data ?? []) as DBService[];
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

      if (error) throw error;
      return (data ?? []) as DBClient[];
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

// Re-export statusConfig for convenience
export { statusConfig };
