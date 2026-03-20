import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, SlidersHorizontal, X } from "lucide-react";

export type SortBy = 'name' | 'last_visit' | 'total_visits';

interface ClientFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  sortBy: SortBy;
  onSortChange: (value: SortBy) => void;
  filterIncomplete: boolean;
  onFilterIncompleteChange: (value: boolean) => void;
  filterCity: string;
  onFilterCityChange: (value: string) => void;
  filterDateFrom: string;
  onFilterDateFromChange: (value: string) => void;
  filterDateTo: string;
  onFilterDateToChange: (value: string) => void;
  availableCities: string[];
  hasActiveFilters: boolean;
  onClearFilters: () => void;
}

const ClientFilters = ({
  search,
  onSearchChange,
  sortBy,
  onSortChange,
  filterIncomplete,
  onFilterIncompleteChange,
  filterCity,
  onFilterCityChange,
  filterDateFrom,
  onFilterDateFromChange,
  filterDateTo,
  onFilterDateToChange,
  availableCities,
  hasActiveFilters,
  onClearFilters,
}: ClientFiltersProps) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-3 px-4 sm:px-8 py-3 sm:py-4 shrink-0 border-b border-border/10 bg-muted/5">
      <div className="relative flex-1 w-full sm:max-w-lg">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          value={search}
          onChange={e => onSearchChange(e.target.value)}
          placeholder="Buscar por nome ou telefone..."
          className="pl-9 bg-card border-border/60"
        />
      </div>
      <div className="flex items-center gap-2 w-full sm:w-auto">
        <Popover>
          <PopoverTrigger asChild>
            <button className={`flex-1 sm:flex-none flex items-center justify-center gap-2 p-2.5 rounded-lg border border-border hover:bg-muted transition-colors ${hasActiveFilters ? 'bg-primary/10 border-primary text-primary' : 'text-muted-foreground'}`}>
              <SlidersHorizontal className="w-4 h-4" />
              <span className="text-xs sm:hidden font-medium">Filtros</span>
              {hasActiveFilters && (
                <span className="w-2 h-2 rounded-full bg-primary" />
              )}
            </button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-[calc(100vw-32px)] sm:w-72 bg-popover z-50 shadow-xl border-border/50">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-sm Outfit tracking-tight">Filtros Avançados</h4>
                {hasActiveFilters && (
                  <button onClick={onClearFilters} className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground hover:text-primary flex items-center gap-1 transition-colors">
                    <X className="w-3 h-3" /> Limpar
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/30 border border-border/20">
                <Checkbox
                  id="filter-incomplete"
                  checked={filterIncomplete}
                  onCheckedChange={(v) => onFilterIncompleteChange(!!v)}
                />
                <Label htmlFor="filter-incomplete" className="text-xs font-medium cursor-pointer flex-1">
                  Cadastro incompleto
                </Label>
              </div>

              {availableCities.length > 0 && (
                <div className="space-y-1.5">
                  <Label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Cidade</Label>
                  <Select value={filterCity} onValueChange={(v) => onFilterCityChange(v === '__all__' ? '' : v)}>
                    <SelectTrigger className="bg-card text-sm h-9">
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

              <div className="space-y-1.5">
                <Label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Data de cadastro</Label>
                <div className="grid grid-cols-[1fr,auto,1fr] items-center gap-2">
                  <Input
                    type="date"
                    value={filterDateFrom}
                    onChange={e => onFilterDateFromChange(e.target.value)}
                    className="bg-card text-xs h-9 px-2"
                  />
                  <span className="text-muted-foreground text-[10px] font-bold">ATÉ</span>
                  <Input
                    type="date"
                    value={filterDateTo}
                    onChange={e => onFilterDateToChange(e.target.value)}
                    className="bg-card text-xs h-9 px-2"
                  />
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>
        <select
          className="flex-1 sm:flex-none text-xs border border-border rounded-lg px-3 py-2.5 bg-card text-foreground font-medium outline-none focus:ring-2 focus:ring-primary/20 appearance-none text-center sm:text-left"
          value={sortBy}
          onChange={e => onSortChange(e.target.value as SortBy)}
        >
          <option value="name">Nome (A-Z)</option>
          <option value="last_visit">Última visita</option>
          <option value="total_visits">Total visitas</option>
        </select>
      </div>
    </div>
  );
};

export default ClientFilters;
