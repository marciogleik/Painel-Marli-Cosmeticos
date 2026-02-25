import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import * as XLSX from "xlsx";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";

interface FichaRow {
  cliente: string;
  data: any;
  profissional: string;
  ficha: string;
  descricao: string;
}

const ImportFichasPage = () => {
  const [rows, setRows] = useState<FichaRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [importing, setImporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [stats, setStats] = useState({ inserted: 0, skipped: 0, errors: 0 });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => { loadFile(); }, []);

  const loadFile = async () => {
    setLoading(true);
    setError(null);
    try {
      const resp = await fetch("/import-data/fichas.xlsx");
      const buf = await resp.arrayBuffer();
      const wb = XLSX.read(buf, { type: "array" });
      const ws = wb.Sheets[wb.SheetNames[0]];
      const json: any[] = XLSX.utils.sheet_to_json(ws, { defval: "" });

      const mapped: FichaRow[] = json.map((r) => ({
        cliente: String(r["Cliente"] || "").trim(),
        data: r["Data"],
        profissional: String(r["Profissional"] || "").trim(),
        ficha: String(r["Ficha"] || "").trim(),
        descricao: String(r["Descrição"] || r["Descricao"] || "").trim(),
      }));

      setRows(mapped);
      toast.success(`${mapped.length} fichas carregadas`);
    } catch (err: any) {
      setError(err.message);
    }
    setLoading(false);
  };

  const doImport = async () => {
    if (rows.length === 0) return;
    setImporting(true);
    setProgress(0);
    setStats({ inserted: 0, skipped: 0, errors: 0 });

    let inserted = 0;
    let skipped = 0;
    let errors = 0;
    const CHUNK = 500;
    const total = rows.length;

    for (let i = 0; i < total; i += CHUNK) {
      const chunk = rows.slice(i, i + CHUNK);

      try {
        const { data, error: fnError } = await supabase.functions.invoke("import-fichas", {
          body: { records: chunk },
        });

        if (fnError) {
          console.error(`Chunk ${i} error:`, fnError);
          errors += chunk.length;
        } else if (data) {
          inserted += data.inserted || 0;
          skipped += data.skipped || 0;
          errors += data.errors || 0;
        }
      } catch (e: any) {
        console.error(`Chunk ${i} exception:`, e);
        errors += chunk.length;
      }

      setProgress(Math.min(100, Math.round(((i + chunk.length) / total) * 100)));
      setStats({ inserted, skipped, errors });
    }

    setImporting(false);
    toast.success(`Importação concluída! ${inserted} inseridas, ${skipped} puladas, ${errors} erros`);
  };

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold">Importar Fichas de Anamnese</h1>
      {loading && <p>Carregando arquivo...</p>}
      {error && <p className="text-destructive text-sm">Erro: {error}</p>}

      {rows.length > 0 && !importing && stats.inserted === 0 && (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">{rows.length} fichas prontas para importar</p>
          <Button onClick={doImport} size="lg">
            Importar {rows.length} fichas
          </Button>
          <div className="overflow-auto max-h-[400px] border rounded">
            <table className="text-xs w-full">
              <thead className="sticky top-0">
                <tr className="bg-muted">
                  <th className="p-1 text-left border-r">Cliente</th>
                  <th className="p-1 text-left border-r">Data</th>
                  <th className="p-1 text-left border-r">Profissional</th>
                  <th className="p-1 text-left border-r">Ficha</th>
                  <th className="p-1 text-left">Descrição (início)</th>
                </tr>
              </thead>
              <tbody>
                {rows.slice(0, 20).map((row, i) => (
                  <tr key={i} className="border-t">
                    <td className="p-1 whitespace-nowrap border-r">{row.cliente}</td>
                    <td className="p-1 whitespace-nowrap border-r">{String(row.data)}</td>
                    <td className="p-1 whitespace-nowrap border-r">{row.profissional}</td>
                    <td className="p-1 whitespace-nowrap border-r">{row.ficha}</td>
                    <td className="p-1 max-w-[300px] truncate">{row.descricao.slice(0, 100)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {importing && (
        <div className="space-y-3">
          <Progress value={progress} className="w-full" />
          <p className="text-sm">{progress}% — {stats.inserted} inseridas, {stats.skipped} puladas, {stats.errors} erros</p>
        </div>
      )}

      {!importing && stats.inserted > 0 && (
        <div className="p-4 bg-muted rounded-lg">
          <p className="font-medium">✅ Importação concluída!</p>
          <p className="text-sm text-muted-foreground">{stats.inserted} inseridas • {stats.skipped} puladas • {stats.errors} erros</p>
        </div>
      )}
    </div>
  );
};

export default ImportFichasPage;
