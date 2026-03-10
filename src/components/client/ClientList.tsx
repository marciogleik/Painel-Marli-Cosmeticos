import { useNavigate } from "react-router-dom";
import { Phone, Mail, ChevronRight, ChevronDown, CalendarDays, Hash, RotateCcw } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DBClient, DBClientDetail } from "@/hooks/useClinicData";
import type { SortBy } from "./ClientFilters";

const isIncomplete = (c: { cpf?: string | null; address?: string | null; city?: string | null }) =>
  !c.cpf && !c.address && !c.city;

const getInitials = (name: string) => {
  const parts = name.split(' ').filter(Boolean);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase();
};

interface ClientListProps {
  clients: DBClientDetail[];
  isLoading: boolean;
  isEmpty: boolean;
  search: string;
  sortBy: SortBy;
  inactiveClients: DBClient[];
  showInactive: boolean;
  onShowInactiveChange: (value: boolean) => void;
  onReactivate: (clientId: string) => void;
  isReactivating: boolean;
  listRef: React.RefObject<HTMLDivElement>;
}

const ClientList = ({
  clients,
  isLoading,
  isEmpty,
  search,
  sortBy,
  inactiveClients,
  showInactive,
  onShowInactiveChange,
  onReactivate,
  isReactivating,
  listRef,
}: ClientListProps) => {
  const navigate = useNavigate();

  return (
    <div ref={listRef} className="flex-1 overflow-auto px-8">
      {isLoading && (
        <p className="text-sm text-muted-foreground text-center py-8">Carregando...</p>
      )}
      {!isLoading && isEmpty && (
        <p className="text-sm text-muted-foreground text-center py-8">
          {search ? 'Nenhum cliente encontrado' : 'Nenhum cliente cadastrado.'}
        </p>
      )}
      {!isLoading && clients.length > 0 && (
        <div className="space-y-1">
          {clients.map(client => (
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
                {sortBy === 'last_visit' && client.last_visit && (
                  <span className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted px-2.5 py-1 rounded-full">
                    <CalendarDays className="w-3 h-3" />
                    {new Date(client.last_visit + 'T00:00:00').toLocaleDateString('pt-BR')}
                  </span>
                )}
                {sortBy === 'total_visits' && (client.total_visits ?? 0) > 0 && (
                  <span className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted px-2.5 py-1 rounded-full">
                    <Hash className="w-3 h-3" />
                    {client.total_visits} visita{client.total_visits !== 1 ? 's' : ''}
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
          <Collapsible open={showInactive} onOpenChange={onShowInactiveChange}>
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
                      onClick={() => onReactivate(client.id)}
                      disabled={isReactivating}
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
  );
};

export default ClientList;
