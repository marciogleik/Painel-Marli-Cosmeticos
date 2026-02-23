import { useState, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useClients, useInactiveClients } from "@/hooks/useClinicData";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, Phone, Mail, ChevronRight, SlidersHorizontal, ChevronDown, ChevronLeft, RotateCcw, CalendarDays, Hash, X } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import NewClientDialog from "@/components/client/NewClientDialog";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

const isIncomplete = (c: { email?: string | null; birth_date?: string | null }) =>
  !c.email || !c.birth_date;

const PAGE_SIZE_OPTIONS = [5, 10, 25, 50, 100];

const ClientsPage = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [showNewClient, setShowNewClient] = useState(false);
  const [showInactive, setShowInactive] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortBy, setSortBy] = useState<'name' | 'last_visit' | 'total_visits'>('name');
  const [filterIncomplete, setFilterIncomplete] = useState(false);
  const [filterCity, setFilterCity] = useState<string>('');
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
  // Fetch appointment stats per client (last visit date + total count)
  const { data: appointmentStats = {} } = useQuery({
    queryKey: ["client_appointment_stats"],
    queryFn: async () => {
      const stats: Record<string, { lastVisit: string | null; totalVisits: number }> = {};
      const pageSize = 1000;
      let from = 0;
      while (true) {
        const { data, error } = await supabase
          .from("appointments")
          .select("client_id, date")
          .not("client_id", "is", null)
          .order("date", { ascending: false })
          .range(from, from + pageSize - 1);
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
        if (data.length < pageSize) break;
        from += pageSize;
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

  // Extract unique cities from clients
  const availableCities = useMemo(() => {
    const cities = new Set<string>();
    for (const c of clients) {
      if (c.city) cities.add(c.city);
    }
    return Array.from(cities).sort();
  }, [clients]);

  const displayClients = useMemo(() => {
    let list = clients.length > 0 ? [...clients] : [];

    // Apply filters
    if (filterIncomplete) {
      list = list.filter(c => isIncomplete(c));
    }
    if (filterCity) {
      list = list.filter(c => c.city === filterCity);
    }
    if (filterDateFrom) {
      list = list.filter(c => c.created_at >= filterDateFrom);
    }
    if (filterDateTo) {
      list = list.filter(c => c.created_at <= filterDateTo + 'T23:59:59');
    }

    // Apply sorting
    if (sortBy === 'last_visit') {
      list.sort((a, b) => {
        const aDate = appointmentStats[a.id]?.lastVisit ?? '';
        const bDate = appointmentStats[b.id]?.lastVisit ?? '';
        return bDate.localeCompare(aDate);
      });
    } else if (sortBy === 'total_visits') {
      list.sort((a, b) => {
        const aCount = appointmentStats[a.id]?.totalVisits ?? 0;
        const bCount = appointmentStats[b.id]?.totalVisits ?? 0;
        return bCount - aCount;
      });
    }
    return list;
  }, [clients, sortBy, appointmentStats, filterIncomplete, filterCity, filterDateFrom, filterDateTo]);

  const totalPages = Math.max(1, Math.ceil(displayClients.length / pageSize));
  const safePage = Math.min(currentPage, totalPages);
  const startIndex = (safePage - 1) * pageSize;
  const paginatedClients = displayClients.slice(startIndex, startIndex + pageSize);

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    listRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Reset page on search change
  const handleSearchChange = (value: string) => {
    setSearch(value);
    setCurrentPage(1);
  };

  const getInitials = (name: string) => {
    const parts = name.split(' ').filter(Boolean);
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return name.slice(0, 2).toUpperCase();
  };

  // Generate page numbers to show
  const getPageNumbers = () => {
    const pages: (number | 'ellipsis')[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (safePage > 3) pages.push('ellipsis');
      for (let i = Math.max(2, safePage - 1); i <= Math.min(totalPages - 1, safePage + 1); i++) {
        pages.push(i);
      }
      if (safePage < totalPages - 2) pages.push('ellipsis');
      pages.push(totalPages);
    }
    return pages;
  };

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

      {/* Search & Filter */}
      <div className="flex items-center gap-3 px-8 py-4 shrink-0">
        <div className="relative flex-1 max-w-lg">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={e => handleSearchChange(e.target.value)}
            placeholder="Buscar por nome ou telefone..."
            className="pl-9 bg-card"
          />
        </div>
        <Popover>
          <PopoverTrigger asChild>
            <button className={`relative p-2.5 rounded-lg border border-border hover:bg-muted ${hasActiveFilters ? 'bg-primary/10 border-primary' : ''}`}>
              <SlidersHorizontal className="w-4 h-4 text-muted-foreground" />
              {hasActiveFilters && (
                <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-primary" />
              )}
            </button>
          </PopoverTrigger>
          <PopoverContent align="start" className="w-72 bg-popover z-50">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-sm">Filtros</h4>
                {hasActiveFilters && (
                  <button onClick={clearFilters} className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1">
                    <X className="w-3 h-3" /> Limpar
                  </button>
                )}
              </div>

              {/* Cadastro incompleto */}
              <div className="flex items-center gap-2">
                <Checkbox
                  id="filter-incomplete"
                  checked={filterIncomplete}
                  onCheckedChange={(v) => { setFilterIncomplete(!!v); setCurrentPage(1); }}
                />
                <Label htmlFor="filter-incomplete" className="text-sm cursor-pointer">
                  Cadastro incompleto
                </Label>
              </div>

              {/* Cidade */}
              {availableCities.length > 0 && (
                <div className="space-y-1.5">
                  <Label className="text-sm">Cidade</Label>
                  <Select value={filterCity} onValueChange={(v) => { setFilterCity(v === '__all__' ? '' : v); setCurrentPage(1); }}>
                    <SelectTrigger className="bg-card">
                      <SelectValue placeholder="Todas as cidades" />
                    </SelectTrigger>
                    <SelectContent className="bg-popover z-50">
                      <SelectItem value="__all__">Todas as cidades</SelectItem>
                      {availableCities.map(city => (
                        <SelectItem key={city} value={city}>{city}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Data de cadastro */}
              <div className="space-y-1.5">
                <Label className="text-sm">Data de cadastro</Label>
                <div className="flex items-center gap-2">
                  <Input
                    type="date"
                    value={filterDateFrom}
                    onChange={e => { setFilterDateFrom(e.target.value); setCurrentPage(1); }}
                    className="bg-card text-sm"
                    placeholder="De"
                  />
                  <span className="text-muted-foreground text-xs">até</span>
                  <Input
                    type="date"
                    value={filterDateTo}
                    onChange={e => { setFilterDateTo(e.target.value); setCurrentPage(1); }}
                    className="bg-card text-sm"
                    placeholder="Até"
                  />
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>
        <select
          className="text-sm border border-border rounded-lg px-3 py-2.5 bg-card text-foreground"
          value={sortBy}
          onChange={e => {
            setSortBy(e.target.value as 'name' | 'last_visit' | 'total_visits');
            setCurrentPage(1);
          }}
        >
          <option value="name">Nome (A-Z)</option>
          <option value="last_visit">Última visita</option>
          <option value="total_visits">Total de visitas</option>
        </select>
      </div>

      {/* Client List - Paginated */}
      <div ref={listRef} className="flex-1 overflow-auto px-8">
        {isLoading && (
          <p className="text-sm text-muted-foreground text-center py-8">Carregando...</p>
        )}
        {!isLoading && displayClients.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-8">
            {search ? 'Nenhum cliente encontrado' : 'Nenhum cliente cadastrado. Faça login para ver os dados.'}
          </p>
        )}
        {!isLoading && paginatedClients.length > 0 && (
          <div className="space-y-1">
            {paginatedClients.map(client => (
              <div
                key={client.id}
                onClick={() => navigate(`/clientes/${client.id}`)}
                className="flex items-center justify-between p-4 rounded-lg hover:bg-card border border-transparent hover:border-border transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary shrink-0">
                    {getInitials(client.full_name)}
                  </div>
                  <div>
                    <p className="font-semibold text-sm">
                      {client.full_name}
                      {isIncomplete(client) && (
                        <Badge className="ml-2 bg-blue-900 text-white hover:bg-blue-900 text-[10px] px-1.5 py-0">CADASTRO INCOMPLETO</Badge>
                      )}
                    </p>
                    <div className="flex items-center gap-3 mt-0.5 text-xs text-muted-foreground">
                      {client.phone && (
                        <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{client.phone}</span>
                      )}
                      {client.email && (
                        <span className="flex items-center gap-1"><Mail className="w-3 h-3" />{client.email}</span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  {sortBy === 'last_visit' && appointmentStats[client.id]?.lastVisit && (
                    <span className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted px-2.5 py-1 rounded-full">
                      <CalendarDays className="w-3 h-3" />
                      {new Date(appointmentStats[client.id].lastVisit + 'T00:00:00').toLocaleDateString('pt-BR')}
                    </span>
                  )}
                  {sortBy === 'total_visits' && (appointmentStats[client.id]?.totalVisits ?? 0) > 0 && (
                    <span className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted px-2.5 py-1 rounded-full">
                      <Hash className="w-3 h-3" />
                      {appointmentStats[client.id].totalVisits} visita{appointmentStats[client.id].totalVisits !== 1 ? 's' : ''}
                    </span>
                  )}
                  <ChevronRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Inactive Clients Section */}
        {inactiveClients.length > 0 && (
          <div className="pb-4 mt-4">
            <Collapsible open={showInactive} onOpenChange={setShowInactive}>
              <CollapsibleTrigger asChild>
                <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors py-2">
                  <ChevronDown className={`w-4 h-4 transition-transform ${showInactive ? 'rotate-0' : '-rotate-90'}`} />
                  Clientes inativos ({inactiveClients.length})
                </button>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="space-y-1 mt-1">
                  {inactiveClients.map(client => (
                    <div key={client.id} className="flex items-center justify-between p-4 rounded-lg border border-border bg-muted/30 opacity-70">
                      <div className="flex items-center gap-4">
                        <div className="w-11 h-11 rounded-full bg-muted flex items-center justify-center text-sm font-bold text-muted-foreground">
                          {getInitials(client.full_name)}
                        </div>
                        <div>
                          <p className="font-semibold text-sm text-muted-foreground">{client.full_name}</p>
                          <div className="flex items-center gap-3 mt-0.5 text-xs text-muted-foreground">
                            {client.phone && (
                              <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{client.phone}</span>
                            )}
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-1.5 shrink-0"
                        onClick={() => reactivateMutation.mutate(client.id)}
                        disabled={reactivateMutation.isPending}
                      >
                        <RotateCcw className="w-3.5 h-3.5" /> Reativar
                      </Button>
                    </div>
                  ))}
                </div>
              </CollapsibleContent>
            </Collapsible>
          </div>
        )}
      </div>

      {/* Pagination Footer */}
      {!isLoading && displayClients.length > 0 && (
        <div className="flex items-center justify-between px-8 py-3 border-t border-border shrink-0 bg-background">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Mostrando {startIndex + 1}–{Math.min(startIndex + pageSize, displayClients.length)} de {displayClients.length}</span>
            <span className="mx-1">·</span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md border border-border bg-card text-sm font-medium hover:bg-muted transition-colors">
                  {pageSize} por página
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="bg-popover z-50">
                {PAGE_SIZE_OPTIONS.map(size => (
                  <DropdownMenuItem
                    key={size}
                    onClick={() => handlePageSizeChange(size)}
                    className={pageSize === size ? "font-semibold" : ""}
                  >
                    {pageSize === size && <span className="mr-1">✓</span>}
                    {size} por página
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              className="w-8 h-8"
              disabled={safePage <= 1}
              onClick={() => handlePageChange(safePage - 1)}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            {getPageNumbers().map((page, i) =>
              page === 'ellipsis' ? (
                <span key={`e${i}`} className="px-1 text-muted-foreground text-sm">…</span>
              ) : (
                <Button
                  key={page}
                  variant={page === safePage ? "default" : "outline"}
                  size="icon"
                  className="w-8 h-8 text-xs"
                  onClick={() => handlePageChange(page as number)}
                >
                  {page}
                </Button>
              )
            )}
            <Button
              variant="outline"
              size="icon"
              className="w-8 h-8"
              disabled={safePage >= totalPages}
              onClick={() => handlePageChange(safePage + 1)}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      <NewClientDialog open={showNewClient} onOpenChange={setShowNewClient} />
    </div>
  );
};

export default ClientsPage;
