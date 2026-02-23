import { useState } from "react";
import * as XLSX from "xlsx";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

/**
 * Temporary page to import clients from the XLS file.
 * Can be removed after import is complete.
 */
const ImportClientsPage = () => {
  const [status, setStatus] = useState<string>("Pronto para importar");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const parseDateBR = (val: string | number | undefined): string | null => {
    if (!val) return null;
    const str = String(val).trim();
    // DD/MM/YYYY format
    const match = str.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
    if (match) {
      const [, d, m, y] = match;
      const year = parseInt(y);
      const month = parseInt(m);
      const day = parseInt(d);
      if (year > 1900 && year < 2100 && month >= 1 && month <= 12 && day >= 1 && day <= 31) {
        return `${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`;
      }
    }
    // Excel serial date
    if (typeof val === "number" && val > 10000 && val < 100000) {
      try {
        const date = XLSX.SSF.parse_date_code(val);
        if (date && date.y > 1900 && date.y < 2100) {
          return `${date.y}-${String(date.m).padStart(2, "0")}-${String(date.d).padStart(2, "0")}`;
        }
      } catch { /* ignore */ }
    }
    return null;
  };

  const extractPhone = (contacts: string | undefined): string | null => {
    if (!contacts) return null;
    const str = String(contacts).trim();
    if (str.length >= 8) return str;
    return null;
  };

  const extractEmail = (contacts: string | undefined, extra: string | undefined): string | null => {
    // Check extra column first
    const all = [extra, contacts].filter(Boolean).join(" ");
    const emailMatch = all.match(/[\w.+-]+@[\w.-]+\.\w+/);
    return emailMatch ? emailMatch[0].replace(/\\/g, "") : null;
  };

  const runImport = async () => {
    setLoading(true);
    setStatus("Carregando planilha...");

    try {
      const response = await fetch("/data/clientes-import.xls");
      const arrayBuffer = await response.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer, { type: "array" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json<any>(sheet, { defval: "" });

      setStatus(`Planilha carregada: ${rows.length} linhas. Processando...`);

      const clients = rows
        .map((row: any) => {
          const name = String(row["Nome do Cliente"] || "").trim();
          if (!name || name.length < 2) return null;
          // Skip entries that are just phone numbers
          if (/^\+?\d[\d\s-]+$/.test(name)) return null;

          const cpf = String(row["CPF"] || "").trim() || null;
          const birthDate = parseDateBR(row["Data Nascimento"]);
          
          // Build address from parts
          const addr = String(row["Endereço"] || "").trim();
          const num = String(row["Número"] || "").trim();
          const bairro = String(row["Bairro"] || "").trim();
          const addressParts = [addr, num ? `nº ${num}` : "", bairro].filter(Boolean);
          const address = addressParts.length > 0 ? addressParts.join(", ") : null;

          const city = String(row["Cidade"] || "").trim() || null;
          const notes = String(row["Observação do Cliente"] || "").trim() || null;

          // Contacts column has phone, extra column may have email
          const contactsCol = String(row["Contatos"] || "").trim();
          const extraCol = String(row["__EMPTY"] || row[""] || "").trim();
          
          const phone = extractPhone(contactsCol);
          const email = extractEmail(contactsCol, extraCol);

          return {
            full_name: name,
            cpf,
            birth_date: birthDate,
            address,
            city,
            phone,
            email,
            notes,
          };
        })
        .filter(Boolean);

      setStatus(`${clients.length} clientes válidos. Enviando em lotes...`);

      // Send in batches of 500 to the edge function
      let totalInserted = 0;
      let totalSkipped = 0;
      let totalErrors = 0;
      const batchSize = 500;

      for (let i = 0; i < clients.length; i += batchSize) {
        const batch = clients.slice(i, i + batchSize);
        setStatus(`Enviando lote ${Math.floor(i / batchSize) + 1}/${Math.ceil(clients.length / batchSize)}...`);

        const { data, error } = await supabase.functions.invoke("import-clients", {
          body: { clients: batch },
        });

        if (error) {
          console.error("Batch error:", error);
          totalErrors += batch.length;
        } else if (data) {
          totalInserted += data.inserted || 0;
          totalSkipped += data.skipped_duplicates || 0;
          totalErrors += data.errors || 0;
        }
      }

      setResult({ totalInserted, totalSkipped, totalErrors, total: clients.length });
      setStatus("Importação concluída!");
    } catch (err: any) {
      setStatus(`Erro: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full gap-6 p-8">
      <h1 className="text-2xl font-bold">Importar Clientes</h1>
      <p className="text-muted-foreground text-center max-w-md">
        Importa todos os clientes da planilha exportada do Simples Agenda para o banco de dados. 
        Clientes com nomes já existentes serão ignorados (sem duplicatas).
      </p>
      <p className="text-sm font-medium">{status}</p>
      
      <Button onClick={runImport} disabled={loading} size="lg">
        {loading && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
        {loading ? "Importando..." : "Iniciar Importação"}
      </Button>

      {result && (
        <div className="bg-card border rounded-xl p-6 space-y-2 text-sm">
          <p><strong>Total processado:</strong> {result.total}</p>
          <p className="text-primary"><strong>Inseridos:</strong> {result.totalInserted}</p>
          <p className="text-muted-foreground"><strong>Duplicatas ignoradas:</strong> {result.totalSkipped}</p>
          {result.totalErrors > 0 && <p className="text-destructive"><strong>Erros:</strong> {result.totalErrors}</p>}
        </div>
      )}
    </div>
  );
};

export default ImportClientsPage;
