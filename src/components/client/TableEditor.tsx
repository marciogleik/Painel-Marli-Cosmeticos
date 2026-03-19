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
  const [headers, setHeaders] = useState<string[]>([]);

  // Parse markdown table to rows
  useEffect(() => {
    if (!value) {
      setHeaders(["Data", "Procedimento Realizado", "Observação"]);
      setRows([["", "", ""]]);
      return;
    }

    const lines = value.split("\n").filter(l => l.trim().length > 0);
    if (lines.length === 0) return;

    // First line is headers
    const rawHeaders = lines[0].split("|").map(s => s.trim());
    setHeaders(rawHeaders);

    // Skip the separator line (contains ---)
    const dataLines = lines.filter((l, i) => i > 0 && !l.includes("---"));
    const newRows = dataLines.map(l => {
      const cells = l.split("|").map(s => s.trim());
      // Ensure row has same length as headers
      while (cells.length < rawHeaders.length) cells.push("");
      return cells.slice(0, rawHeaders.length);
    });

    if (newRows.length === 0) newRows.push(new Array(rawHeaders.length).fill(""));
    setRows(newRows);
  }, [value]);

  const updateCell = (rowIndex: number, colIndex: number, newValue: string) => {
    const newRows = [...rows];
    newRows[rowIndex][colIndex] = newValue;
    setRows(newRows);
    save(headers, newRows);
  };

  const addRow = () => {
    const newRows = [...rows, new Array(headers.length).fill("")];
    setRows(newRows);
    save(headers, newRows);
  };

  const removeRow = (index: number) => {
    if (rows.length <= 1) {
      const newRows = [new Array(headers.length).fill("")];
      setRows(newRows);
      save(headers, newRows);
      return;
    }
    const newRows = rows.filter((_, i) => i !== index);
    setRows(newRows);
    save(headers, newRows);
  };

  const save = (h: string[], r: string[][]) => {
    const headerLine = h.join(" | ");
    const separatorLine = h.map(() => "---").join("|");
    const dataLines = r.map(row => row.join(" | "));
    onChange([headerLine, separatorLine, ...dataLines].join("\n"));
  };

  return (
    <div className="border rounded-lg overflow-hidden bg-white shadow-sm">
      <div className="bg-slate-50 border-b p-2 flex items-center justify-between">
        <div className="flex items-center gap-2 text-slate-600 font-medium text-sm">
          <TableIcon className="w-4 h-4" />
          Tabela de Procedimentos
        </div>
        <Button variant="outline" size="sm" onClick={addRow} className="h-8 gap-1 text-xs">
          <Plus className="w-3 h-3" /> Adicionar Linha
        </Button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-slate-50/50">
              {headers.map((h, i) => (
                <th key={i} className="border-b border-r last:border-r-0 p-2 text-left font-semibold text-slate-700 w-1/3">
                  {h}
                </th>
              ))}
              <th className="border-b p-2 w-10"></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIndex) => (
              <tr key={rowIndex} className="hover:bg-slate-50/30 transition-colors">
                {row.map((cell, colIndex) => (
                  <td key={colIndex} className="border-b border-r last:border-r-0 p-0">
                    <Input
                      value={cell}
                      onChange={(e) => updateCell(rowIndex, colIndex, e.target.value)}
                      className="border-none shadow-none focus-visible:ring-0 rounded-none bg-transparent h-10 text-sm"
                    />
                  </td>
                ))}
                <td className="border-b p-1 text-center">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => removeRow(rowIndex)}
                    className="h-7 w-7 text-slate-400 hover:text-red-500"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
