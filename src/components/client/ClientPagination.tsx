import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";

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
    <div className="flex items-center justify-between px-8 py-3 border-t border-border shrink-0 bg-background">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <span>Mostrando {startIndex + 1}–{Math.min(startIndex + pageSize, totalItems)} de {totalItems}</span>
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
                onClick={() => onPageSizeChange(size)}
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
          disabled={currentPage <= 1}
          onClick={() => onPageChange(currentPage - 1)}
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>
        {getPageNumbers().map((page, i) =>
          page === 'ellipsis' ? (
            <span key={`e${i}`} className="px-1 text-muted-foreground text-sm">…</span>
          ) : (
            <Button
              key={page}
              variant={page === currentPage ? "default" : "outline"}
              size="icon"
              className="w-8 h-8 text-xs"
              onClick={() => onPageChange(page as number)}
            >
              {page}
            </Button>
          )
        )}
        <Button
          variant="outline"
          size="icon"
          className="w-8 h-8"
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
