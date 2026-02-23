import { useState, useRef, useMemo } from "react";
import { useClients, useInactiveClients } from "@/hooks/useClinicData";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import NewClientDialog from "@/components/client/NewClientDialog";
import ClientFilters, { type SortBy } from "@/components/client/ClientFilters";
import ClientList from "@/components/client/ClientList";
import ClientPagination from "@/components/client/ClientPagination";
import { toast } from "sonner";

const isIncomplete = (c: { email?: string | null; birth_date?: string | null }) =>
  !c.email || !c.birth_date;

const ClientsPage = () => {
  const [search, setSearch] = useState('');
  const [showNewClient, setShowNewClient] = useState(false);
  const [showInactive, setShowInactive] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortBy, setSortBy] = useState<SortBy>('name');
  const [filterIncomplete, setFilterIncomplete] = useState(false);
  const [filterCity, setFilterCity] = useState('');
  const [filterDateFrom, setFilterDateFrom] = useState('');
  const [filterDateTo, setFilterDateTo] = useState('');
  const { data: clients = [], isLoading } = useClients(search);
  const { data: inactiveClients = [] } = useInactiveClients();
  const queryClient = useQueryClient();
  const listRef = useRef<HTMLDivElement>(null);

  const hasActiveFilters = filterIncomplete || filterCity !== '' || filterDateFrom !== '' || filterDateTo !== '';

  const clearFilters = () => {
    setFilterIncomplete(false);
    setFilterCity('');
    setFilterDateFrom('');
    setFilterDateTo('');
    setCurrentPage(1);
  };

  // Fetch appointment stats per client
  const { data: appointmentStats = {} } = useQuery({
    queryKey: ["client_appointment_stats"],
    queryFn: async () => {
      const stats: Record<string, { lastVisit: string | null; totalVisits: number }> = {};
      const batchSize = 1000;
      let from = 0;
      while (true) {
        const { data, error } = await supabase
          .from("appointments")
          .select("client_id, date")
          .not("client_id", "is", null)
          .order("date", { ascending: false })
          .range(from, from + batchSize - 1);
        if (error) throw error;
        if (!data || data.length === 0) break;
        for (const row of data) {
          if (!row.client_id) continue;
          if (!stats[row.client_id]) {
            stats[row.client_id] = { lastVisit: row.date, totalVisits: 0 };
          }
          stats[row.client_id].totalVisits++;
          if (!stats[row.client_id].lastVisit || row.date > stats[row.client_id].lastVisit!) {
            stats[row.client_id].lastVisit = row.date;
          }
        }
        if (data.length < batchSize) break;
        from += batchSize;
      }
      return stats;
    },
  });

  const reactivateMutation = useMutation({
    mutationFn: async (clientId: string) => {
      const { error } = await supabase
        .from("clients")
        .update({ is_active: true } as any)
        .eq("id", clientId);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Cliente reativado com sucesso");
      queryClient.invalidateQueries({ queryKey: ["clients"] });
      queryClient.invalidateQueries({ queryKey: ["clients_inactive"] });
    },
    onError: (err: any) => {
      toast.error(err.message ?? "Erro ao reativar cliente");
    },
  });

  const availableCities = useMemo(() => {
    const cities = new Set<string>();
    for (const c of clients) {
      if (c.city) cities.add(c.city);
    }
    return Array.from(cities).sort();
  }, [clients]);

  const displayClients = useMemo(() => {
    let list = clients.length > 0 ? [...clients] : [];

    if (filterIncomplete) list = list.filter(c => isIncomplete(c));
    if (filterCity) list = list.filter(c => c.city === filterCity);
    if (filterDateFrom) list = list.filter(c => c.created_at >= filterDateFrom);
    if (filterDateTo) list = list.filter(c => c.created_at <= filterDateTo + 'T23:59:59');

    if (sortBy === 'last_visit') {
      list.sort((a, b) => (appointmentStats[b.id]?.lastVisit ?? '').localeCompare(appointmentStats[a.id]?.lastVisit ?? ''));
    } else if (sortBy === 'total_visits') {
      list.sort((a, b) => (appointmentStats[b.id]?.totalVisits ?? 0) - (appointmentStats[a.id]?.totalVisits ?? 0));
    }
    return list;
  }, [clients, sortBy, appointmentStats, filterIncomplete, filterCity, filterDateFrom, filterDateTo]);

  const totalPages = Math.max(1, Math.ceil(displayClients.length / pageSize));
  const safePage = Math.min(currentPage, totalPages);
  const startIndex = (safePage - 1) * pageSize;
  const paginatedClients = displayClients.slice(startIndex, startIndex + pageSize);

  const handleSearchChange = (value: string) => { setSearch(value); setCurrentPage(1); };
  const handlePageSizeChange = (size: number) => { setPageSize(size); setCurrentPage(1); };
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    listRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const handleSortChange = (value: SortBy) => { setSortBy(value); setCurrentPage(1); };
  const handleFilterIncomplete = (v: boolean) => { setFilterIncomplete(v); setCurrentPage(1); };
  const handleFilterCity = (v: string) => { setFilterCity(v); setCurrentPage(1); };
  const handleFilterDateFrom = (v: string) => { setFilterDateFrom(v); setCurrentPage(1); };
  const handleFilterDateTo = (v: string) => { setFilterDateTo(v); setCurrentPage(1); };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-8 pt-8 pb-2 shrink-0">
        <div>
          <h1 className="text-2xl font-display font-bold">Clientes</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {displayClients.length} clientes {search ? 'encontrados' : 'cadastrados'}
          </p>
        </div>
        <Button className="gap-1.5" onClick={() => setShowNewClient(true)}>
          <Plus className="w-4 h-4" /> Novo Cliente
        </Button>
      </div>

      <ClientFilters
        search={search}
        onSearchChange={handleSearchChange}
        sortBy={sortBy}
        onSortChange={handleSortChange}
        filterIncomplete={filterIncomplete}
        onFilterIncompleteChange={handleFilterIncomplete}
        filterCity={filterCity}
        onFilterCityChange={handleFilterCity}
        filterDateFrom={filterDateFrom}
        onFilterDateFromChange={handleFilterDateFrom}
        filterDateTo={filterDateTo}
        onFilterDateToChange={handleFilterDateTo}
        availableCities={availableCities}
        hasActiveFilters={hasActiveFilters}
        onClearFilters={clearFilters}
      />

      <ClientList
        clients={paginatedClients}
        isLoading={isLoading}
        isEmpty={displayClients.length === 0}
        search={search}
        sortBy={sortBy}
        appointmentStats={appointmentStats}
        inactiveClients={inactiveClients}
        showInactive={showInactive}
        onShowInactiveChange={setShowInactive}
        onReactivate={(id) => reactivateMutation.mutate(id)}
        isReactivating={reactivateMutation.isPending}
        listRef={listRef as React.RefObject<HTMLDivElement>}
      />

      {!isLoading && displayClients.length > 0 && (
        <ClientPagination
          startIndex={startIndex}
          pageSize={pageSize}
          totalItems={displayClients.length}
          currentPage={safePage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
        />
      )}

      <NewClientDialog open={showNewClient} onOpenChange={setShowNewClient} />
    </div>
  );
};

export default ClientsPage;
