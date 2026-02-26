import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import * as XLSX from "xlsx";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";

interface AttachmentRow {
  cliente: string;
  data: any;
  profissional: string;
  ficha: string;
  caminho: string;
  cod_ficha: string;
  observacao: string;
  ip: string;
}

const ImportAnexosPage = () => {
  const [rows, setRows] = useState<AttachmentRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [importing, setImporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [stats, setStats] = useState({ inserted: 0, skipped: 0, errors: 0 });
  const [error, setError] = useState<string | null>(null);
  const [skippedClients, setSkippedClients] = useState<string[]>([]);
  const [skippedProfs, setSkippedProfs] = useState<string[]>([]);
  const [diagnosing, setDiagnosing] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLoading(true);
    setError(null);
    setFileName(file.name);

    try {
      const buf = await file.arrayBuffer();
      const wb = XLSX.read(buf, { type: "array" });
      const ws = wb.Sheets[wb.SheetNames[0]];
      const json: any[] = XLSX.utils.sheet_to_json(ws, { defval: "" });

      const mapped: AttachmentRow[] = json.map((r) => ({
        cliente: String(r["Cliente"] || "").trim(),
        data: r["Data Anexo"] || r["Data"],
        profissional: String(r["Profissional"] || "").trim(),
        ficha: String(r["Ficha"] || "").trim(),
        caminho: String(r["Caminho"] || "").trim(),
        cod_ficha: String(r["Cod.Ficha"] || "").trim(),
        observacao: String(r["Observacao"] || r["Observação"] || "").trim(),
        ip: String(r["IP Assinatura"] || "").trim(),
      }));

      setRows(mapped);
      toast.success(`${mapped.length} anexos carregados de ${file.name}`);
    } catch (err: any) {
      setError(err.message);
    }
    setLoading(false);
  };

  const runDiagnosis = async () => {
    if (rows.length === 0) return;
    setDiagnosing(true);
    setSkippedClients([]);
    setSkippedProfs([]);

    const allSkippedClients = new Set<string>();
    const allSkippedProfs = new Set<string>();
    const CHUNK = 500;
    const total = rows.length;

    for (let i = 0; i < total; i += CHUNK) {
      const chunk = rows.slice(i, i + CHUNK);
      try {
        const { data } = await supabase.functions.invoke("import-attachments", {
          body: { records: chunk, dryRun: true },
        });
        if (data?.skippedClients) {
          data.skippedClients.forEach((c: string) => allSkippedClients.add(c));
        }
        if (data?.skippedProfs) {
          data.skippedProfs.forEach((p: string) => allSkippedProfs.add(p));
        }
      } catch (e) {
        console.error("Diagnosis chunk error:", e);
      }
    }

    const clients = Array.from(allSkippedClients).sort();
    const profs = Array.from(allSkippedProfs).sort();
    setSkippedClients(clients);
    setSkippedProfs(profs);
    setDiagnosing(false);
    toast.success(`Diagnóstico: ${clients.length} clientes e ${profs.length} profissionais não encontrados`);
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
        const { data, error: fnError } = await supabase.functions.invoke("import-attachments", {
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
    toast.success(`Importação concluída! ${inserted} inseridos, ${skipped} pulados, ${errors} erros`);
  };

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold">Importar Anexos de Clientes</h1>

      <div className="space-y-2">
        <label className="block text-sm font-medium">Selecione o arquivo .xlsx com os anexos:</label>
        <input
          type="file"
          accept=".xlsx,.xls"
          onChange={handleFileUpload}
          className="block w-full text-sm border rounded p-2"
          disabled={importing}
        />
        {fileName && <p className="text-xs text-muted-foreground">Arquivo: {fileName}</p>}
      </div>

      {loading && <p>Carregando arquivo...</p>}
      {error && <p className="text-destructive text-sm">Erro: {error}</p>}

      {rows.length > 0 && !importing && (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">{rows.length} anexos no arquivo</p>
          <div className="flex gap-2">
            <Button onClick={runDiagnosis} variant="outline" disabled={diagnosing}>
              {diagnosing ? "Analisando..." : "🔍 Diagnóstico (não importa)"}
            </Button>
            <Button onClick={doImport} size="lg">
              Importar {rows.length} anexos
            </Button>
          </div>

          {(skippedClients.length > 0 || skippedProfs.length > 0) && (
            <div className="space-y-4">
              {skippedProfs.length > 0 && (
                <div className="p-4 border rounded-lg bg-orange-50">
                  <p className="font-medium text-orange-800 mb-2">⚠️ Profissionais não encontrados ({skippedProfs.length}):</p>
                  <ul className="text-sm space-y-1">
                    {skippedProfs.map((p, i) => (
                      <li key={i} className="text-orange-700">• {p || "(vazio)"}</li>
                    ))}
                  </ul>
                </div>
              )}
              {skippedClients.length > 0 && (
                <div className="p-4 border rounded-lg bg-yellow-50 max-h-[400px] overflow-auto">
                  <p className="font-medium text-yellow-800 mb-2">⚠️ Clientes não encontrados ({skippedClients.length}):</p>
                  <ul className="text-sm space-y-1 columns-2">
                    {skippedClients.map((c, i) => (
                      <li key={i} className="text-yellow-700">• {c || "(vazio)"}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          <div className="overflow-auto max-h-[400px] border rounded">
            <table className="text-xs w-full">
              <thead className="sticky top-0">
                <tr className="bg-muted">
                  <th className="p-1 text-left border-r">Cliente</th>
                  <th className="p-1 text-left border-r">Data</th>
                  <th className="p-1 text-left border-r">Profissional</th>
                  <th className="p-1 text-left border-r">Ficha</th>
                  <th className="p-1 text-left border-r">Caminho</th>
                  <th className="p-1 text-left">Cód. Ficha</th>
                </tr>
              </thead>
              <tbody>
                {rows.slice(0, 30).map((row, i) => (
                  <tr key={i} className="border-t">
                    <td className="p-1 whitespace-nowrap border-r">{row.cliente}</td>
                    <td className="p-1 whitespace-nowrap border-r">{String(row.data)}</td>
                    <td className="p-1 whitespace-nowrap border-r">{row.profissional}</td>
                    <td className="p-1 whitespace-nowrap border-r">{row.ficha}</td>
                    <td className="p-1 max-w-[200px] truncate border-r">{row.caminho}</td>
                    <td className="p-1 whitespace-nowrap">{row.cod_ficha}</td>
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
          <p className="text-sm">{progress}% — {stats.inserted} inseridos, {stats.skipped} pulados, {stats.errors} erros</p>
        </div>
      )}

      {!importing && stats.inserted > 0 && (
        <div className="p-4 bg-muted rounded-lg">
          <p className="font-medium">✅ Importação concluída!</p>
          <p className="text-sm text-muted-foreground">{stats.inserted} inseridos • {stats.skipped} pulados • {stats.errors} erros</p>
        </div>
      )}
    </div>
  );
};

export default ImportAnexosPage;
