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
    <div className="flex items-center gap-3 px-8 py-4 shrink-0">
      <div className="relative flex-1 max-w-lg">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          value={search}
          onChange={e => onSearchChange(e.target.value)}
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
                <button onClick={onClearFilters} className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1">
                  <X className="w-3 h-3" /> Limpar
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <Checkbox
                id="filter-incomplete"
                checked={filterIncomplete}
                onCheckedChange={(v) => onFilterIncompleteChange(!!v)}
              />
              <Label htmlFor="filter-incomplete" className="text-sm cursor-pointer">
                Cadastro incompleto
              </Label>
            </div>

            {availableCities.length > 0 && (
              <div className="space-y-1.5">
                <Label className="text-sm">Cidade</Label>
                <Select value={filterCity} onValueChange={(v) => onFilterCityChange(v === '__all__' ? '' : v)}>
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

            <div className="space-y-1.5">
              <Label className="text-sm">Data de cadastro</Label>
              <div className="flex items-center gap-2">
                <Input
                  type="date"
                  value={filterDateFrom}
                  onChange={e => onFilterDateFromChange(e.target.value)}
                  className="bg-card text-sm"
                  placeholder="De"
                />
                <span className="text-muted-foreground text-xs">até</span>
                <Input
                  type="date"
                  value={filterDateTo}
                  onChange={e => onFilterDateToChange(e.target.value)}
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
        onChange={e => onSortChange(e.target.value as SortBy)}
      >
        <option value="name">Nome (A-Z)</option>
        <option value="last_visit">Última visita</option>
        <option value="total_visits">Total de visitas</option>
      </select>
    </div>
  );
};

export default ClientFilters;
