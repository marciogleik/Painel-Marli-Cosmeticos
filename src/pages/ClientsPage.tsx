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

const isIncomplete = (c: { cpf?: string | null; address?: string | null; city?: string | null }) =>
  !c.cpf && !c.address && !c.city;

const ClientsPage = () => {
  const [search, setSearch] = useState('');
  const [showNewClient, setShowNewClient] = useState(false);
  const [showInactive, setShowInactive] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortBy, setSortBy] = useState<SortBy>('last_visit');
  const [filterIncomplete, setFilterIncomplete] = useState(false);
  const [filterCity, setFilterCity] = useState('');
  const [filterDateFrom, setFilterDateFrom] = useState('');
  const [filterDateTo, setFilterDateTo] = useState('');

  // New optimized hook usage
  const { data: clientsData, isLoading } = useClients({
    search,
    page: currentPage,
    pageSize,
    sortBy,
    is_active: !showInactive,
    filterIncomplete,
    filterCity,
    filterDateFrom,
    filterDateTo
  });

  const clients = clientsData?.data ?? [];
  const totalItems = clientsData?.count ?? 0;

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

  const reactivateMutation = useMutation({
    mutationFn: async (clientId: string) => {
      const { error } = await supabase
        .from("clients")
        .update({ is_active: true })
        .eq("id", clientId);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Cliente reativado com sucesso");
      queryClient.invalidateQueries({ queryKey: ["clients"] });
      queryClient.invalidateQueries({ queryKey: ["clients_inactive"] });
    },
    onError: (err: Error) => {
      toast.error(err.message ?? "Erro ao reativar cliente");
    },
  });

  // Cities are now fetched globally or we can still derive from current page as suggestion, 
  // but for a true filter we should have a separate query for unique cities.
  // For now, keeping the current derivation but it will only show cities from the current page.
  const availableCities = useMemo(() => {
    const cities = new Set<string>();
    for (const c of clients) {
      if (c.city) cities.add(c.city);
    }
    return Array.from(cities).sort();
  }, [clients]);

  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const safePage = Math.min(currentPage, totalPages);
  const startIndex = (safePage - 1) * pageSize;
  const paginatedClients = clients; 

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
    <div className="flex flex-col h-full overflow-hidden bg-transparent">
      {/* Header Hub Style */}
      <div className="flex flex-col md:flex-row md:items-end justify-between px-4 sm:px-8 pt-8 sm:pt-12 pb-6 shrink-0 gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 mb-1">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Plus className="w-5 h-5 text-primary" />
            </div>
            <span className="text-xs font-black tracking-[0.3em] text-primary uppercase">Base de Dados</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-display font-black tracking-tighter text-foreground uppercase leading-none">
            Clientes
          </h1>
          <p className="text-muted-foreground font-medium max-w-md pt-1">
            Gerencie sua base de {totalItems} clientes com inteligência e agilidade.
          </p>
        </div>
        <Button 
          className="gap-3 h-14 px-8 rounded-2xl text-xs font-black uppercase tracking-[0.2em] w-full md:w-auto shadow-2xl shadow-primary/30 hover:scale-105 active:scale-95 transition-all bg-primary text-primary-foreground" 
          onClick={() => setShowNewClient(true)}
        >
          <Plus className="w-5 h-5" /> Novo Cliente
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
        isEmpty={clients.length === 0}
        search={search}
        sortBy={sortBy}
        inactiveClients={inactiveClients}
        showInactive={showInactive}
        onShowInactiveChange={setShowInactive}
        onReactivate={(id: string) => reactivateMutation.mutate(id)}
        isReactivating={reactivateMutation.isPending}
        listRef={listRef as React.RefObject<HTMLDivElement>}
      />

      {!isLoading && clients.length > 0 && (
        <ClientPagination
          startIndex={startIndex}
          pageSize={pageSize}
          totalItems={totalItems}
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
