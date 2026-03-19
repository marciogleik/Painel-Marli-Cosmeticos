import React, { useState, useEffect } from "react";
import { Table as TableIcon, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface TableEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export function TableEditor({ value, onChange }: TableEditorProps) {
  const [rows, setRows] = useState<string[][]>([]);
  const headers = ["Data", "Procedimento Realizado", "Observação"];

  // Parse markdown table to rows
  useEffect(() => {
    if (!value || value.trim().length === 0) {
      setRows([["", "", ""]]);
      return;
    }

    // Heuristic: If it contains the header text in a single line without pipes, it's a legacy dump
    const legacyHeaders = ["Data", "Procedimento Realizado", "Observação"];
    if (!value.includes("|") && value.toLowerCase().includes("procedimento realizado")) {
      // Try to strip the headers and get the data
      let cleanValue = value;
      legacyHeaders.forEach(h => {
        const regex = new RegExp(h, "gi");
        cleanValue = cleanValue.replace(regex, "");
      });
      
      const trimmed = cleanValue.trim();
      if (trimmed.length > 0) {
        // Split by dates (format DD/MM/YY or DD/MM/YYYY)
        // Find all occurrences of dates
        const dateRegex = /(\d{2}\/\d{2}(\/\d{2,4})?)/g;
        const matches = [...trimmed.matchAll(dateRegex)];
        
        if (matches.length > 0) {
          const newRows: string[][] = [];
          for (let i = 0; i < matches.length; i++) {
            const dateStr = matches[i][1];
            const start = matches[i].index! + dateStr.length;
            const end = i + 1 < matches.length ? matches[i + 1].index : trimmed.length;
            const procStr = trimmed.substring(start, end).trim();
            newRows.push([dateStr, procStr, ""]);
          }
          setRows(newRows);
          return;
        }

        setRows([["", trimmed, ""]]);
        return;
      }
    }

    const lines = value.split("\n").filter(l => l.trim().length > 0);
    // Skip header and separator lines
    const dataLines = lines.filter((l, i) => {
      const isHeader = i === 0 && (l.toLowerCase().includes("data") || l.includes("|"));
      const isSeparator = l.includes("---");
      return !isHeader && !isSeparator;
    });

    const newRows = dataLines.map(l => {
      const cells = l.split("|").map(s => s.trim());
      // Ensure row has same length as headers (3)
      while (cells.length < 3) cells.push("");
      return cells.slice(0, 3);
    });

    if (newRows.length === 0) newRows.push(["", "", ""]);
    setRows(newRows);
  }, [value]);

  const updateCell = (rowIndex: number, colIndex: number, newValue: string) => {
    const newRows = [...rows];
    newRows[rowIndex][colIndex] = newValue;
    setRows(newRows);
    save(newRows);
  };

  const addRow = () => {
    const newRows = [...rows, ["", "", ""]];
    setRows(newRows);
    save(newRows);
  };

  const removeRow = (index: number) => {
    if (rows.length <= 1) {
      const newRows = [["", "", ""]];
      setRows(newRows);
      save(newRows);
      return;
    }
    const newRows = rows.filter((_, i) => i !== index);
    setRows(newRows);
    save(newRows);
  };

  const save = (r: string[][]) => {
    const headerLine = headers.join(" | ");
    const separatorLine = headers.map(() => "---").join("|");
    const dataLines = r.map(row => row.join(" | "));
    onChange([headerLine, separatorLine, ...dataLines].join("\n"));
  };

  return (
    <div className="border border-slate-200 rounded-md overflow-hidden bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse table-fixed">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="px-4 py-2.5 text-left text-xs font-semibold text-slate-600 border-r border-slate-200 w-[80px]">
                Data
              </th>
              <th className="px-4 py-2.5 text-left text-xs font-semibold text-slate-600 border-r border-slate-200">
                Procedimento Realizado
              </th>
              <th className="px-4 py-2.5 text-left text-xs font-semibold text-slate-600 border-r border-slate-200 w-[200px]">
                Observação
              </th>
              <th className="w-10 bg-slate-50"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map((row, rowIndex) => (
              <tr key={rowIndex} className="group hover:bg-slate-50/50 transition-colors">
                <td className="p-0 border-r border-slate-200 h-10">
                  <Input
                    value={row[0]}
                    onChange={(e) => updateCell(rowIndex, 0, e.target.value)}
                    placeholder="00/00"
                    className="border-none shadow-none focus-visible:ring-0 rounded-none bg-transparent h-full text-sm px-4 text-center placeholder:text-slate-300"
                  />
                </td>
                <td className="p-0 border-r border-slate-200 h-10">
                  <Input
                    value={row[1]}
                    onChange={(e) => updateCell(rowIndex, 1, e.target.value)}
                    placeholder="Descreva o procedimento..."
                    className="border-none shadow-none focus-visible:ring-0 rounded-none bg-transparent h-full text-sm px-4 placeholder:text-slate-300"
                  />
                </td>
                <td className="p-0 border-r border-slate-200 h-10">
                  <Input
                    value={row[2]}
                    onChange={(e) => updateCell(rowIndex, 2, e.target.value)}
                    className="border-none shadow-none focus-visible:ring-0 rounded-none bg-transparent h-full text-sm px-4 placeholder:text-slate-300"
                  />
                </td>
                <td className="p-1 text-center bg-white">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => removeRow(rowIndex)}
                    className="h-7 w-7 text-slate-300 hover:text-red-500 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="bg-slate-50 border-t border-slate-200 p-2 flex justify-center">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={addRow} 
          className="h-8 gap-2 text-xs font-medium text-slate-600 hover:text-[#5c7cbe] hover:border-[#5c7cbe] bg-white transition-all shadow-sm"
        >
          <Plus className="w-3.5 h-3.5" /> Adicionar registro de evolução
        </Button>
      </div>
    </div>
  );
}
