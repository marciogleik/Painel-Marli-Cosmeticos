import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import * as XLSX from "xlsx";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";

interface ClientRow {
  nome: string;
  cpf: string;
  nascimento: any;
  endereco: string;
  numero: string;
  bairro: string;
  cidade: string;
  observacao: string;
  telefone: string;
}

const ImportClientesPage = () => {
  const [rows, setRows] = useState<ClientRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [importing, setImporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [stats, setStats] = useState({ inserted: 0, updated: 0, skipped: 0, errors: 0 });
  const [error, setError] = useState<string | null>(null);
  const [diagnosing, setDiagnosing] = useState(false);
  const [diagResult, setDiagResult] = useState<{ inserted: number; updated: number; skipped: number; skippedNames: string[] } | null>(null);

  useEffect(() => { loadFile(); }, []);

  const loadFile = async () => {
    setLoading(true);
    setError(null);
    try {
      const resp = await fetch("/import-data/clientes.xlsx");
      const buf = await resp.arrayBuffer();
      const wb = XLSX.read(buf, { type: "array" });
      // Find the CLIENTES sheet
      const sheetName = wb.SheetNames.find(s => s.toUpperCase().includes("CLIENTES")) || wb.SheetNames[1] || wb.SheetNames[0];
      const ws = wb.Sheets[sheetName];
      const json: any[] = XLSX.utils.sheet_to_json(ws, { defval: "" });

      const mapped: ClientRow[] = json
        .filter(r => String(r["Nome do Cliente"] || "").trim().length >= 2)
        .map((r) => ({
          nome: String(r["Nome do Cliente"] || "").trim(),
          cpf: String(r["CPF"] || "").trim(),
          nascimento: r["Data Nascimento"],
          endereco: String(r["Endereço"] || "").trim(),
          numero: String(r["Número"] || r["Numero"] || "").trim(),
          bairro: String(r["Bairro"] || "").trim(),
          cidade: String(r["Cidade"] || "").trim(),
          observacao: String(r["Observação do Cliente"] || "").trim(),
          telefone: String(r["Contatos"] || "").trim(),
        }));

      setRows(mapped);
      toast.success(`${mapped.length} clientes carregados do arquivo`);
    } catch (err: any) {
      setError(err.message);
    }
    setLoading(false);
  };

  const runDiagnosis = async () => {
    if (rows.length === 0) return;
    setDiagnosing(true);
    setDiagResult(null);

    let totalInserted = 0, totalUpdated = 0, totalSkipped = 0;
    const allSkippedNames: string[] = [];
    const CHUNK = 500;

    for (let i = 0; i < rows.length; i += CHUNK) {
      const chunk = rows.slice(i, i + CHUNK);
      try {
        const { data } = await supabase.functions.invoke("import-clients", {
          body: { records: chunk, dryRun: true },
        });
        if (data) {
          totalInserted += data.inserted || 0;
          totalUpdated += data.updated || 0;
          totalSkipped += data.skipped || 0;
          if (data.skippedNames) allSkippedNames.push(...data.skippedNames);
        }
      } catch (e) {
        console.error("Diagnosis error:", e);
      }
    }

    setDiagResult({ inserted: totalInserted, updated: totalUpdated, skipped: totalSkipped, skippedNames: allSkippedNames });
    setDiagnosing(false);
    toast.success(`Diagnóstico: ${totalInserted} novos, ${totalUpdated} a atualizar, ${totalSkipped} pulados`);
  };

  const doImport = async () => {
    if (rows.length === 0) return;
    setImporting(true);
    setProgress(0);
    setStats({ inserted: 0, updated: 0, skipped: 0, errors: 0 });

    let inserted = 0, updated = 0, skipped = 0, errors = 0;
    const CHUNK = 500;

    for (let i = 0; i < rows.length; i += CHUNK) {
      const chunk = rows.slice(i, i + CHUNK);
      try {
        const { data, error: fnError } = await supabase.functions.invoke("import-clients", {
          body: { records: chunk },
        });
        if (fnError) {
          errors += chunk.length;
        } else if (data) {
          inserted += data.inserted || 0;
          updated += data.updated || 0;
          skipped += data.skipped || 0;
          errors += data.errors || 0;
        }
      } catch (e) {
        errors += chunk.length;
      }
      setProgress(Math.min(100, Math.round(((i + chunk.length) / rows.length) * 100)));
      setStats({ inserted, updated, skipped, errors });
    }

    setImporting(false);
    toast.success(`Importação concluída! ${inserted} inseridos, ${updated} atualizados, ${skipped} pulados, ${errors} erros`);
  };

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold">Importar Clientes</h1>
      {loading && <p>Carregando arquivo...</p>}
      {error && <p className="text-destructive text-sm">Erro: {error}</p>}

      {rows.length > 0 && !importing && (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">{rows.length} clientes no arquivo</p>
          <div className="flex gap-2">
            <Button onClick={runDiagnosis} variant="outline" disabled={diagnosing}>
              {diagnosing ? "Analisando..." : "🔍 Diagnóstico (não importa)"}
            </Button>
            <Button onClick={doImport} size="lg">
              Importar {rows.length} clientes
            </Button>
          </div>

          {diagResult && (
            <div className="p-4 border rounded-lg bg-muted/50 space-y-2">
              <p className="font-medium">📊 Resultado do diagnóstico:</p>
              <p className="text-sm">🆕 {diagResult.inserted} novos clientes a inserir</p>
              <p className="text-sm">🔄 {diagResult.updated} clientes existentes a atualizar</p>
              <p className="text-sm">⏩ {diagResult.skipped} pulados (nome inválido)</p>
              {diagResult.skippedNames.length > 0 && (
                <div className="mt-2 p-3 bg-yellow-50 rounded text-sm">
                  <p className="font-medium text-yellow-800 mb-1">Nomes pulados:</p>
                  <ul className="text-yellow-700 space-y-0.5">
                    {diagResult.skippedNames.map((n, i) => <li key={i}>• {n}</li>)}
                  </ul>
                </div>
              )}
            </div>
          )}

          <div className="overflow-auto max-h-[400px] border rounded">
            <table className="text-xs w-full">
              <thead className="sticky top-0">
                <tr className="bg-muted">
                  <th className="p-1 text-left border-r">Nome</th>
                  <th className="p-1 text-left border-r">CPF</th>
                  <th className="p-1 text-left border-r">Nascimento</th>
                  <th className="p-1 text-left border-r">Cidade</th>
                  <th className="p-1 text-left border-r">Telefone</th>
                  <th className="p-1 text-left">Endereço</th>
                </tr>
              </thead>
              <tbody>
                {rows.slice(0, 30).map((row, i) => (
                  <tr key={i} className="border-t">
                    <td className="p-1 whitespace-nowrap border-r">{row.nome}</td>
                    <td className="p-1 whitespace-nowrap border-r">{row.cpf}</td>
                    <td className="p-1 whitespace-nowrap border-r">{String(row.nascimento)}</td>
                    <td className="p-1 whitespace-nowrap border-r">{row.cidade}</td>
                    <td className="p-1 whitespace-nowrap border-r">{row.telefone}</td>
                    <td className="p-1 max-w-[200px] truncate">{[row.endereco, row.numero, row.bairro].filter(Boolean).join(", ")}</td>
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
          <p className="text-sm">{progress}% — {stats.inserted} inseridos, {stats.updated} atualizados, {stats.skipped} pulados, {stats.errors} erros</p>
        </div>
      )}

      {!importing && stats.inserted + stats.updated > 0 && (
        <div className="p-4 bg-muted rounded-lg">
          <p className="font-medium">✅ Importação concluída!</p>
          <p className="text-sm text-muted-foreground">{stats.inserted} inseridos • {stats.updated} atualizados • {stats.skipped} pulados • {stats.errors} erros</p>
        </div>
      )}
    </div>
  );
};

export default ImportClientesPage;
