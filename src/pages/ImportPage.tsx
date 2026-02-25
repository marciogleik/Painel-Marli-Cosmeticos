import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import * as XLSX from "xlsx";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";

interface RawRow {
  [key: string]: any;
}

const PROF_MAP: Record<string, string> = {
  "patricia": "00000000-0000-0000-0000-000000000007",
  "dhionara": "00000000-0000-0000-0000-000000000001",
  "dhiani": "00000000-0000-0000-0000-000000000002",
  "bruna": "00000000-0000-0000-0000-000000000005",
  "luciane": "00000000-0000-0000-0000-000000000003",
  "tais": "00000000-0000-0000-0000-000000000004",
  "michele": "00000000-0000-0000-0000-000000000006",
};

const STATUS_MAP: Record<string, string> = {
  "agendado": "agendado",
  "confirmado": "confirmado",
  "atendido": "atendido",
  "cancelado": "cancelado",
  "em espera": "espera",
  "falta": "falta",
  "não compareceu": "falta",
};

function parseDateStr(dateStr: string): { date: string; time: string } | null {
  if (!dateStr) return null;
  const parts = dateStr.trim().split(" ");
  const dateParts = parts[0].split("/");
  if (dateParts.length !== 3) return null;
  const [day, month, year] = dateParts;
  const date = `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
  const time = parts[1] ? `${parts[1]}:00` : "09:00:00";
  return { date, time };
}

function addMinutes(time: string, minutes: number): string {
  const [h, m] = time.split(":").map(Number);
  const totalMin = h * 60 + m + minutes;
  const newH = Math.floor(totalMin / 60) % 24;
  const newM = totalMin % 60;
  return `${String(newH).padStart(2, "0")}:${String(newM).padStart(2, "0")}:00`;
}

function matchProfessional(name: string): string | null {
  if (!name) return null;
  const lower = name.toLowerCase().trim();
  for (const [key, id] of Object.entries(PROF_MAP)) {
    if (lower.startsWith(key) || lower.includes(key)) return id;
  }
  return null;
}

const ImportPage = () => {
  const [rows, setRows] = useState<RawRow[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
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
      const resp = await fetch("/import-data/agendamentos.xlsx");
      const buf = await resp.arrayBuffer();
      const wb = XLSX.read(buf, { type: "array" });
      const sheetName = wb.SheetNames.includes("AGENDAMENTOS") ? "AGENDAMENTOS" : wb.SheetNames[0];
      const ws = wb.Sheets[sheetName];
      const json: RawRow[] = XLSX.utils.sheet_to_json(ws, { defval: "" });
      if (json.length > 0) setHeaders(Object.keys(json[0]));
      setRows(json);
      toast.success(`${json.length} linhas carregadas`);
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

    // Load clients for lookup
    const { data: existingClients } = await supabase
      .from("clients")
      .select("id, full_name")
      .order("full_name");
    const clientMap = new Map<string, string>();
    (existingClients ?? []).forEach((c: any) => {
      clientMap.set(c.full_name.toLowerCase().trim(), c.id);
    });

    // Load services for duration
    const { data: services } = await supabase
      .from("services")
      .select("name, duration_minutes");
    const svcDuration = new Map<string, number>();
    (services ?? []).forEach((s: any) => {
      svcDuration.set(s.name.toLowerCase().trim(), s.duration_minutes);
    });

    // Transform ALL rows first
    let skipped = 0;
    const allAppointments: any[] = [];

    for (const row of rows) {
      const parsed = parseDateStr(row["Data"]);
      if (!parsed) { skipped++; continue; }
      const profId = matchProfessional(row["Profissional"]);
      if (!profId) { skipped++; continue; }

      const status = STATUS_MAP[(row["Status"] || "").toLowerCase().trim()] || "agendado";
      const clientName = (row["Cliente"] || "").trim();
      const phone = (row["Telefone"] || "").trim();
      const serviceName = (row["Serviço"] || "").trim();
      const notes = (row["Observação"] || "").trim();
      const executedBy = (row["Executado por"] || "").trim();

      let duration = 30;
      if (serviceName) {
        const svcLower = serviceName.toLowerCase();
        for (const [svcName, dur] of svcDuration.entries()) {
          if (svcLower.includes(svcName) || svcName.includes(svcLower)) {
            duration = dur;
            break;
          }
        }
      }

      const clientId = clientName ? (clientMap.get(clientName.toLowerCase().trim()) || null) : null;
      const endTime = addMinutes(parsed.time, duration);

      allAppointments.push({
        date: parsed.date,
        start_time: parsed.time,
        end_time: endTime,
        professional_id: profId,
        client_id: clientId,
        client_name: clientName || null,
        client_phone: phone || null,
        status,
        notes: notes || null,
        executed_by: executedBy || null,
      });
    }

    console.log(`Transformed: ${allAppointments.length} appointments, ${skipped} skipped`);

    // Send in chunks to edge function
    let inserted = 0;
    let errors = 0;
    const CHUNK = 500;
    const total = allAppointments.length;

    for (let i = 0; i < total; i += CHUNK) {
      const chunk = allAppointments.slice(i, i + CHUNK);
      
      try {
        const { data, error: fnError } = await supabase.functions.invoke("bulk-import", {
          body: { appointments: chunk },
        });

        if (fnError) {
          console.error(`Chunk ${i} error:`, fnError);
          errors += chunk.length;
        } else if (data) {
          inserted += data.inserted || 0;
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
    <div className="p-8 max-w-7xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold">Importar Agendamentos</h1>
      {loading && <p>Carregando arquivo...</p>}
      {error && <p className="text-destructive text-sm">Erro: {error}</p>}

      {rows.length > 0 && !importing && stats.inserted === 0 && (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">{rows.length} agendamentos prontos para importar</p>
          <Button onClick={doImport} size="lg">
            Importar {rows.length} agendamentos
          </Button>
          <div className="overflow-auto max-h-[400px] border rounded">
            <table className="text-xs w-full">
              <thead className="sticky top-0">
                <tr className="bg-muted">
                  {headers.slice(0, 10).map((h) => (
                    <th key={h} className="p-1 text-left whitespace-nowrap border-r">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.slice(0, 15).map((row, i) => (
                  <tr key={i} className="border-t">
                    {headers.slice(0, 10).map((h) => (
                      <td key={h} className="p-1 whitespace-nowrap border-r">{String(row[h] ?? "")}</td>
                    ))}
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

export default ImportPage;
