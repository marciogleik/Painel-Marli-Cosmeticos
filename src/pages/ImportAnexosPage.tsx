import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import * as XLSX from "xlsx";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";
import { Upload, FileUp, CheckCircle2, AlertCircle } from "lucide-react";

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

type Step = "metadata" | "upload";

const ImportAnexosPage = () => {
  const [step, setStep] = useState<Step>("metadata");

  // Step 1: Metadata
  const [rows, setRows] = useState<AttachmentRow[]>([]);
  const [metaLoading, setMetaLoading] = useState(false);
  const [metaImporting, setMetaImporting] = useState(false);
  const [metaProgress, setMetaProgress] = useState(0);
  const [metaStats, setMetaStats] = useState({ inserted: 0, skipped: 0, errors: 0 });
  const [metaDone, setMetaDone] = useState(false);
  const [skippedClients, setSkippedClients] = useState<string[]>([]);
  const [skippedProfs, setSkippedProfs] = useState<string[]>([]);
  const [diagnosing, setDiagnosing] = useState(false);

  // Step 2: File upload
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStats, setUploadStats] = useState({ uploaded: 0, linked: 0, notLinked: 0, errors: 0 });
  const [dragOver, setDragOver] = useState(false);

  // --- STEP 1: Metadata import ---
  const handleMetaUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setMetaLoading(true);
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
      toast.error(err.message);
    }
    setMetaLoading(false);
  };

  const runDiagnosis = async () => {
    if (rows.length === 0) return;
    setDiagnosing(true);
    setSkippedClients([]);
    setSkippedProfs([]);
    const allSkippedClients = new Set<string>();
    const allSkippedProfs = new Set<string>();
    const CHUNK = 500;
    for (let i = 0; i < rows.length; i += CHUNK) {
      try {
        const { data } = await supabase.functions.invoke("import-attachments", {
          body: { records: rows.slice(i, i + CHUNK), dryRun: true },
        });
        data?.skippedClients?.forEach((c: string) => allSkippedClients.add(c));
        data?.skippedProfs?.forEach((p: string) => allSkippedProfs.add(p));
      } catch (e) { console.error(e); }
    }
    setSkippedClients(Array.from(allSkippedClients).sort());
    setSkippedProfs(Array.from(allSkippedProfs).sort());
    setDiagnosing(false);
    toast.success(`Diagnóstico concluído`);
  };

  const doMetaImport = async () => {
    if (rows.length === 0) return;
    setMetaImporting(true);
    setMetaProgress(0);
    setMetaStats({ inserted: 0, skipped: 0, errors: 0 });
    let inserted = 0, skipped = 0, errors = 0;
    const CHUNK = 500;
    for (let i = 0; i < rows.length; i += CHUNK) {
      const chunk = rows.slice(i, i + CHUNK);
      try {
        const { data, error: fnError } = await supabase.functions.invoke("import-attachments", {
          body: { records: chunk },
        });
        if (fnError) { errors += chunk.length; }
        else if (data) { inserted += data.inserted || 0; skipped += data.skipped || 0; errors += data.errors || 0; }
      } catch { errors += chunk.length; }
      setMetaProgress(Math.min(100, Math.round(((i + chunk.length) / rows.length) * 100)));
      setMetaStats({ inserted, skipped, errors });
    }
    setMetaImporting(false);
    setMetaDone(true);
    toast.success(`Metadados importados! ${inserted} inseridos`);
  };

  // --- STEP 2: File upload ---
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const dropped = Array.from(e.dataTransfer.files).filter(f =>
      /\.(png|jpe?g|pdf|webp|gif)$/i.test(f.name)
    );
    setFiles(prev => [...prev, ...dropped]);
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const selected = Array.from(e.target.files);
    setFiles(prev => [...prev, ...selected]);
  };

  const doUpload = async () => {
    if (files.length === 0) return;
    setUploading(true);
    setUploadProgress(0);
    let uploaded = 0, linked = 0, notLinked = 0, errors = 0;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const storagePath = `uploads/${file.name}`;
      try {
        const { error: uploadErr } = await supabase.storage
          .from("client-attachments")
          .upload(storagePath, file, { upsert: true });

        if (uploadErr) {
          console.error("Upload error:", uploadErr);
          errors++;
        } else {
          uploaded++;
          // Try to link: find matching client_attachments by file_path containing the filename
          const fileName = file.name;
          const { data: matches, error: matchErr } = await supabase
            .from("client_attachments")
            .select("id, file_path")
            .or(`file_path.ilike.%${fileName}%,file_path.ilike.%${fileName.replace(/\.[^.]+$/, '')}%`)
            .is("patient_record_id", null)
            .limit(10);

          if (!matchErr && matches && matches.length > 0) {
            // Update the first match with the storage path
            const { data: urlData } = supabase.storage
              .from("client-attachments")
              .getPublicUrl(storagePath);

            await supabase
              .from("client_attachments")
              .update({ file_path: storagePath })
              .eq("id", matches[0].id);
            linked++;
          } else {
            notLinked++;
          }
        }
      } catch {
        errors++;
      }
      setUploadProgress(Math.round(((i + 1) / files.length) * 100));
      setUploadStats({ uploaded, linked, notLinked, errors });
    }
    setUploading(false);
    toast.success(`Upload concluído! ${uploaded} enviados, ${linked} vinculados`);
  };

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Importar Anexos de Clientes</h1>

      {/* Step tabs */}
      <div className="flex gap-2">
        <Button
          variant={step === "metadata" ? "default" : "outline"}
          onClick={() => setStep("metadata")}
          className="gap-2"
        >
          <FileUp className="h-4 w-4" /> 1. Importar Metadados (XLSX)
        </Button>
        <Button
          variant={step === "upload" ? "default" : "outline"}
          onClick={() => setStep("upload")}
          className="gap-2"
        >
          <Upload className="h-4 w-4" /> 2. Upload de Arquivos
        </Button>
      </div>

      {/* STEP 1 */}
      {step === "metadata" && (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Primeiro, importe os metadados do XLSX para criar os registros no banco. Depois, envie os arquivos físicos na etapa 2.
          </p>
          <input
            type="file"
            accept=".xlsx,.xls"
            onChange={handleMetaUpload}
            className="block w-full text-sm border rounded p-2"
            disabled={metaImporting}
          />
          {metaLoading && <p>Carregando...</p>}

          {rows.length > 0 && !metaImporting && !metaDone && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">{rows.length} anexos no arquivo</p>
              <div className="flex gap-2">
                <Button onClick={runDiagnosis} variant="outline" disabled={diagnosing}>
                  {diagnosing ? "Analisando..." : "🔍 Diagnóstico"}
                </Button>
                <Button onClick={doMetaImport} size="lg">
                  Importar {rows.length} metadados
                </Button>
              </div>

              {(skippedClients.length > 0 || skippedProfs.length > 0) && (
                <div className="space-y-4">
                  {skippedProfs.length > 0 && (
                    <div className="p-4 border rounded-lg bg-orange-50">
                      <p className="font-medium text-orange-800 mb-2">⚠️ Profissionais não encontrados ({skippedProfs.length}):</p>
                      <ul className="text-sm space-y-1">
                        {skippedProfs.map((p, i) => <li key={i} className="text-orange-700">• {p || "(vazio)"}</li>)}
                      </ul>
                    </div>
                  )}
                  {skippedClients.length > 0 && (
                    <div className="p-4 border rounded-lg bg-yellow-50 max-h-[300px] overflow-auto">
                      <p className="font-medium text-yellow-800 mb-2">⚠️ Clientes não encontrados ({skippedClients.length}):</p>
                      <ul className="text-sm space-y-1 columns-2">
                        {skippedClients.map((c, i) => <li key={i} className="text-yellow-700">• {c || "(vazio)"}</li>)}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              <div className="overflow-auto max-h-[300px] border rounded">
                <table className="text-xs w-full">
                  <thead className="sticky top-0">
                    <tr className="bg-muted">
                      <th className="p-1 text-left border-r">Cliente</th>
                      <th className="p-1 text-left border-r">Profissional</th>
                      <th className="p-1 text-left border-r">Ficha</th>
                      <th className="p-1 text-left">Caminho</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.slice(0, 20).map((row, i) => (
                      <tr key={i} className="border-t">
                        <td className="p-1 whitespace-nowrap border-r">{row.cliente}</td>
                        <td className="p-1 whitespace-nowrap border-r">{row.profissional}</td>
                        <td className="p-1 whitespace-nowrap border-r">{row.ficha}</td>
                        <td className="p-1 max-w-[200px] truncate">{row.caminho}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {metaImporting && (
            <div className="space-y-3">
              <Progress value={metaProgress} className="w-full" />
              <p className="text-sm">{metaProgress}% — {metaStats.inserted} inseridos, {metaStats.skipped} pulados, {metaStats.errors} erros</p>
            </div>
          )}

          {metaDone && (
            <div className="p-4 bg-muted rounded-lg flex items-center gap-3">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              <div>
                <p className="font-medium">Metadados importados!</p>
                <p className="text-sm text-muted-foreground">{metaStats.inserted} inseridos • {metaStats.skipped} pulados • {metaStats.errors} erros</p>
                <Button variant="link" className="p-0 h-auto mt-1" onClick={() => setStep("upload")}>
                  Ir para upload de arquivos →
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* STEP 2 */}
      {step === "upload" && (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Arraste os arquivos (PNG, JPEG, PDF) para a área abaixo. O sistema vai enviar para o storage e tentar vincular automaticamente pelo nome do arquivo com os metadados importados.
          </p>

          {/* Drop zone */}
          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors cursor-pointer ${
              dragOver ? "border-primary bg-primary/5" : "border-muted-foreground/30"
            }`}
            onClick={() => document.getElementById("file-upload-input")?.click()}
          >
            <Upload className="h-10 w-10 mx-auto mb-3 text-muted-foreground" />
            <p className="text-sm font-medium">Arraste arquivos aqui ou clique para selecionar</p>
            <p className="text-xs text-muted-foreground mt-1">PNG, JPEG, PDF, WebP, GIF</p>
            <input
              id="file-upload-input"
              type="file"
              multiple
              accept="image/*,.pdf"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>

          {files.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">{files.length} arquivos selecionados</p>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => setFiles([])}>Limpar</Button>
                  <Button onClick={doUpload} disabled={uploading} size="lg">
                    {uploading ? "Enviando..." : `Enviar ${files.length} arquivos`}
                  </Button>
                </div>
              </div>

              {/* File list preview */}
              <div className="max-h-[300px] overflow-auto border rounded p-2 space-y-1">
                {files.slice(0, 50).map((f, i) => (
                  <div key={i} className="text-xs flex items-center gap-2 py-0.5">
                    <span className="text-muted-foreground">{i + 1}.</span>
                    <span className="truncate">{f.name}</span>
                    <span className="text-muted-foreground ml-auto">{(f.size / 1024).toFixed(0)} KB</span>
                  </div>
                ))}
                {files.length > 50 && <p className="text-xs text-muted-foreground">...e mais {files.length - 50} arquivos</p>}
              </div>
            </div>
          )}

          {uploading && (
            <div className="space-y-3">
              <Progress value={uploadProgress} className="w-full" />
              <p className="text-sm">
                {uploadProgress}% — {uploadStats.uploaded} enviados, {uploadStats.linked} vinculados, {uploadStats.notLinked} sem vínculo, {uploadStats.errors} erros
              </p>
            </div>
          )}

          {!uploading && uploadStats.uploaded > 0 && (
            <div className="p-4 bg-muted rounded-lg flex items-center gap-3">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              <div>
                <p className="font-medium">Upload concluído!</p>
                <p className="text-sm text-muted-foreground">
                  {uploadStats.uploaded} enviados • {uploadStats.linked} vinculados • {uploadStats.notLinked} sem vínculo • {uploadStats.errors} erros
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ImportAnexosPage;
