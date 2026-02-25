import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import * as XLSX from "xlsx";
import { toast } from "sonner";

interface RawRow {
  [key: string]: any;
}

const ImportPage = () => {
  const [rows, setRows] = useState<RawRow[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadFile();
  }, []);

  const loadFile = async () => {
    setLoading(true);
    setError(null);
    try {
      const resp = await fetch("/import-data/agendamentos.xls");
      const buf = await resp.arrayBuffer();
      console.log("File size:", buf.byteLength);
      
      const wb = XLSX.read(buf, { type: "array", password: "02532763140" });
      
      console.log("Sheet names:", wb.SheetNames);
      const ws = wb.Sheets[wb.SheetNames[0]];
      const json: RawRow[] = XLSX.utils.sheet_to_json(ws, { defval: "" });
      console.log("Rows parsed:", json.length);
      if (json.length > 0) {
        setHeaders(Object.keys(json[0]));
        console.log("Headers:", Object.keys(json[0]));
        console.log("Sample:", JSON.stringify(json[0]));
        console.log("Sample2:", JSON.stringify(json[1]));
      }
      setRows(json);
      toast.success(`${json.length} linhas carregadas`);
    } catch (err: any) {
      console.error("Failed:", err);
      setError(err.message);
      toast.error("Erro: " + err.message);
    }
    setLoading(false);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold">Importar Agendamentos</h1>
      {loading && <p>Carregando...</p>}
      {error && <p className="text-destructive text-sm">Erro: {error}</p>}
      {rows.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">{rows.length} linhas • {headers.length} colunas</p>
          <p className="text-xs font-mono bg-muted p-2 rounded overflow-x-auto whitespace-nowrap">
            Colunas: {headers.join(" | ")}
          </p>
          <div className="overflow-auto max-h-[500px] border rounded">
            <table className="text-xs w-full">
              <thead className="sticky top-0">
                <tr className="bg-muted">
                  {headers.map((h) => (
                    <th key={h} className="p-1 text-left whitespace-nowrap border-r">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.slice(0, 30).map((row, i) => (
                  <tr key={i} className="border-t">
                    {headers.map((h) => (
                      <td key={h} className="p-1 whitespace-nowrap border-r">{String(row[h] ?? "")}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImportPage;
