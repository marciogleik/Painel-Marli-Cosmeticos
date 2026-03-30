import { useEffect, useState, useCallback } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { parseLegacyTechnicalObservation, LASER_COLUMNS, PMU_COLUMNS } from "@/utils/legacyProcedureParser";

export interface TechObsData {
  isStructured: boolean;
  columns?: string[];
  rows: any[];
  notes: string;
}

interface TechnicalObservationsGridProps {
  value: string;
  label?: string;
  onChange: (value: string) => void;
}

export const TechnicalObservationsGrid = ({ value, label, onChange }: TechnicalObservationsGridProps) => {
  const [columns, setColumns] = useState<string[]>(label?.toLowerCase().includes("laser") ? LASER_COLUMNS : PMU_COLUMNS);
  const [rows, setRows] = useState<string[][]>([]);
  const [notes, setNotes] = useState<string>("");
  const [lastExternalValue, setLastExternalValue] = useState<string | undefined>();

  useEffect(() => {
    if (value !== lastExternalValue) {
      const parsed = parseLegacyTechnicalObservation(value || "", label);
      
      setColumns(parsed.columns);
      if (parsed.rows.length === 0 && !parsed.notes) {
        setRows([new Array(parsed.columns.length).fill("")]);
      } else {
        setRows(parsed.rows);
      }
      setNotes(parsed.notes);
      setLastExternalValue(value);
    }
  }, [value, lastExternalValue, label]);

  const notifyChange = (newCols: string[], newRows: string[][], newNotes: string) => {
    setColumns(newCols);
    setRows(newRows);
    setNotes(newNotes);
    
    // Remove completely empty rows
    const cleanRows = newRows.filter(r => r.some(cell => cell.trim() !== ""));
    const newString = JSON.stringify({ isStructured: true, columns: newCols, rows: cleanRows, notes: newNotes });
    setLastExternalValue(newString);
    onChange(newString);
  };

  const addRow = () => notifyChange(columns, [...rows, new Array(columns.length).fill("")], notes);

  const removeRow = (index: number) => {
    const newRows = [...rows];
    newRows.splice(index, 1);
    notifyChange(columns, newRows, notes);
  };

  const updateRow = (rowIndex: number, colIndex: number, val: string) => {
    const newRows = [...rows];
    newRows[rowIndex][colIndex] = val;
    notifyChange(columns, newRows, notes);
  };

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-slate-200 overflow-hidden bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-[#f8f9fa] border-b border-slate-200">
              <tr>
                {columns.map((col, i) => (
                  <th key={i} className="px-3 py-2.5 font-semibold text-slate-700 whitespace-nowrap">{col}</th>
                ))}
                <th className="px-3 py-2.5 w-[50px]"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rows.map((row, i) => (
                <tr key={i} className="hover:bg-slate-50 transition-colors group">
                  {columns.map((col, cIdx) => (
                    <td key={cIdx} className="p-1 min-w-[120px]">
                      <Input 
                        placeholder={col === 'Data' ? 'DD/MM/AA' : ''} 
                        value={row[cIdx] || ""} 
                        onChange={(e) => updateRow(i, cIdx, e.target.value)}
                        className="h-9 border-transparent hover:border-slate-200 focus:border-blue-400 bg-transparent shadow-none px-2 text-xs md:text-sm"
                      />
                    </td>
                  ))}
                  <td className="p-1 text-center">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 text-slate-400 hover:text-red-500 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-all"
                      onClick={() => removeRow(i)}
                      title="Remover sessão"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="bg-[#f8f9fa] border-t border-slate-200 p-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={addRow}
            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 text-xs font-semibold"
          >
            <Plus className="w-4 h-4 mr-1" />
            Adicionar Nova Sessão
          </Button>
        </div>
      </div>

      <div className="space-y-1.5 mt-4">
        <label className="text-sm font-semibold text-slate-700">Notas Adicionais Gerais</label>
        <p className="text-xs text-slate-500">Qualquer texto legado sem data, ou informações gerais que não cabem nas sessões acima.</p>
        <Textarea 
          value={notes}
          onChange={(e) => notifyChange(columns, rows, e.target.value)}
          placeholder="Anotações extras do procedimento..."
          className="min-h-[100px] bg-amber-50/30 border-amber-200 focus-visible:ring-amber-400"
        />
      </div>
    </div>
  );
};
