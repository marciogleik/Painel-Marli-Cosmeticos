import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const PAGE_SIZE_OPTIONS = [5, 10, 25, 50, 100];

interface ClientPaginationProps {
  startIndex: number;
  pageSize: number;
  totalItems: number;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}

const ClientPagination = ({
  startIndex,
  pageSize,
  totalItems,
  currentPage,
  totalPages,
  onPageChange,
  onPageSizeChange,
}: ClientPaginationProps) => {
  const getPageNumbers = () => {
    const pages: (number | 'ellipsis')[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push('ellipsis');
      for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
        pages.push(i);
      }
      if (currentPage < totalPages - 2) pages.push('ellipsis');
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between px-4 sm:px-8 py-3 gap-4 border-t border-border/10 shrink-0 bg-background/80 backdrop-blur-sm">
      <div className="flex items-center gap-3 text-[11px] sm:text-xs text-muted-foreground font-medium order-2 sm:order-1">
        <span className="hidden xs:inline text-foreground/60">Mostrando {startIndex + 1}–{Math.min(startIndex + pageSize, totalItems)} de {totalItems}</span>
        <span className="hidden xs:inline mx-1 opacity-30">|</span>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border/60 bg-card text-[10px] sm:text-xs font-bold hover:bg-muted transition-all shadow-sm active:scale-95">
              {pageSize} / página
              <ChevronDown className="w-3 h-3" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="bg-popover z-50 shadow-xl border-border/50">
            {PAGE_SIZE_OPTIONS.map(size => (
              <DropdownMenuItem
                key={size}
                onClick={() => onPageSizeChange(size)}
                className={cn("text-xs font-medium", pageSize === size ? "bg-primary/10 text-primary font-bold" : "")}
              >
                {size} por página
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex items-center gap-2 order-1 sm:order-2">
        <Button
          variant="outline"
          size="icon"
          className="w-8 h-8 rounded-full border-border/60 hover:border-primary/50 transition-colors"
          disabled={currentPage <= 1}
          onClick={() => onPageChange(currentPage - 1)}
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>
        
        {/* Mobile Page Indicator */}
        <div className="sm:hidden px-3 text-[11px] font-bold tracking-tight">
          Pág. <span className="text-primary">{currentPage}</span> de {totalPages}
        </div>

        {/* Desktop Page Numbers */}
        <div className="hidden sm:flex items-center gap-1.5">
          {getPageNumbers().map((page, i) =>
            page === 'ellipsis' ? (
              <span key={`e${i}`} className="px-1 text-muted-foreground text-xs opacity-50">…</span>
            ) : (
              <Button
                key={page}
                variant={page === currentPage ? "default" : "outline"}
                size="icon"
                className={cn(
                  "w-8 h-8 text-[11px] font-bold rounded-lg transition-all",
                  page === currentPage ? "shadow-md shadow-primary/20 scale-105" : "border-border/60 hover:border-primary/30"
                )}
                onClick={() => onPageChange(page as number)}
              >
                {page}
              </Button>
            )
          )}
        </div>

        <Button
          variant="outline"
          size="icon"
          className="w-8 h-8 rounded-full border-border/60 hover:border-primary/50 transition-colors"
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange(currentPage + 1)}
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default ClientPagination;
