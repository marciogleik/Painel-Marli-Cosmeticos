/**
 * Utilitário centralizado para parsing de fichas de procedimentos legadas (Laser, PMU, etc).
 * Resolve o problema de dados não estruturados vindos do sistema anterior.
 */

export interface TechnicalObservation {
  isStructured: boolean;
  columns?: string[];
  rows: any[];
  notes: string;
}

export const LASER_COLUMNS = ["Sessão", "Data", "Parâmetros", "Disparos", "Observação", "Valor"];
export const PMU_COLUMNS = ["Sessão", "Data", "Técnica", "Cor", "Agulha", "Sensibilidade", "Observação"];

/**
 * Tenta parsear uma string legada para o formato de tabela estruturada.
 * @param text Texto bruto da ficha
 * @param label Nome da ficha (para decidir as colunas padrão)
 */
export function parseLegacyTechnicalObservation(text: string, label?: string): { isTable: boolean, columns: string[], rows: string[][], notes: string } {
  const lwr = (label || "").toLowerCase();
  const contentLwr = (text || "").toLowerCase().substring(0, 50);
  const isLaser = lwr.includes("laser") || contentLwr.includes("laser");
  const targetCols = isLaser ? LASER_COLUMNS : PMU_COLUMNS;

  if (!text?.trim()) {
    return { isTable: false, columns: targetCols, rows: [], notes: "" };
  }

  // 1. Tentar parsear como JSON (Formato Novo)
  try {
    const parsed = JSON.parse(text) as TechnicalObservation;
    if (parsed && typeof parsed === "object" && parsed.isStructured) {
      if (parsed.columns && Array.isArray(parsed.rows[0])) {
        // Formato V2 (já estruturado corretamente)
        return { isTable: parsed.rows.length > 0, columns: parsed.columns, rows: parsed.rows as string[][], notes: parsed.notes || "" };
      } else {
        // Migração de Formato V1 (PMU antigo)
        const migrated = parsed.rows.map((r: any) => [
          r.session || "-", r.date || "-", r.procedure || "-", r.color || "-", r.needle || "-", r.sensitivity || "-", r.obs || "-"
        ]);
        return { isTable: migrated.length > 0, columns: PMU_COLUMNS, rows: migrated, notes: parsed.notes || "" };
      }
    }
  } catch (e) {
    // Não é JSON, seguir para o parsing de texto legado
  }

  // 2. Parsing de Texto Legado via Regex
  // Remove o cabeçalho se ele estiver repetido no texto
  const cleanText = text.replace(/Sess[ãa]o|T[ée]cnica\s+Aplicada|Cor\s+Aplicada|Agulha|Sensibilidade|Observa[çc][ãa]o\s+T[ée]cnicas?\s+sobre\s+o\s+procedimento|Par[âa]metros|Disparos|Valor|Data\s+|Sessão\s+Data/gi, '').trim();

  // Split por data (DD/MM/YYYY, DD/MM/YY ou DD/MM)
  // Usa lookbehind negativo para não quebrar a data no meio (ex: 08/01/26)
  const tokens = text.split(/(?<!\/)(?=\b\d{1,2}[/]\d{1,2}(?:[/:]\d{2,4})?\b)/g);
  
  const parsedRows: string[][] = [];
  let additionalNotes = "";

  tokens.forEach((token, idx) => {
    let trimmedToken = token.trim();
    if (!trimmedToken) return;

    // Tentar capturar: [Data] [Resto]
    const match = trimmedToken.match(/^(\d{1,2}[/:]\d{1,2}(?:[/:]\d{2,4})?)\b\s*(.*)$/s);
    
    if (match) {
      const date = match[1];
      let rest = match[2].trim().replace(/^[|/\s]+|[|/\s]+$/g, '');
      
      // Limpa possível número de sessão do PRÓXIMO registro que ficou no final deste rest
      rest = rest.replace(/\s+\d+(?:[º°]|ª)?$/, '').trim();

      // A sessão pode estar no final do token ANTERIOR
      let session = "-";
      if (idx > 0) {
        const prevToken = tokens[idx - 1].trim();
        const sessionMatch = prevToken.match(/(\d+(?:[º°]|ª)?)\s*$/);
        if (sessionMatch) {
          session = sessionMatch[1];
        }
      }

      const newRow = new Array(targetCols.length).fill("-");
      const sessionIndex = targetCols.findIndex(c => c.toLowerCase().includes('sessão'));
      const dateIndex = targetCols.findIndex(c => c.toLowerCase() === 'data');

      if (sessionIndex !== -1) newRow[sessionIndex] = session;
      if (dateIndex !== -1) newRow[dateIndex] = date;

      if (isLaser) {
        // Lógica específica para Laser: tentar extrair Valor, Disparos e Parâmetros
        const valorMatch = rest.match(/(\d+,\d{2})$/);
        if (valorMatch) {
          newRow[5] = valorMatch[1];
          rest = rest.replace(valorMatch[1], '').trim();
        }

        const parts = rest.split(/\s{2,}/);
        if (parts.length >= 2) {
          newRow[2] = parts[0]; // Parâmetros
          newRow[3] = parts[1]; // Disparos
          if (parts.length > 2) newRow[4] = parts.slice(2).join(' '); // Observação
        } else {
          // Tentar extrair parâmetros via regex se não houver espaços duplos
          // Aceita números seguidos de unidades ou apenas números no início
          const paramMatch = rest.match(/^(\d+(?:\s?mhz|\s?hz|\s?mj|\s?j|\s?j\/cm2|\b))\s*(.*)$/i);
          if (paramMatch && paramMatch[1].trim()) {
            newRow[2] = paramMatch[1].trim();
            newRow[4] = paramMatch[2] ? paramMatch[2].trim() : "-";
          } else {
            newRow[4] = rest || "-";
          }
        }
      } else {
        const techIndex = targetCols.findIndex(c => c.toLowerCase().includes('técnica') || c.toLowerCase().includes('procedimento'));
        if (techIndex !== -1) {
          newRow[techIndex] = rest;
        } else {
          const obsIndex = targetCols.findIndex(c => c.toLowerCase() === 'observação');
          if (obsIndex !== -1) newRow[obsIndex] = rest;
        }
      }
      parsedRows.push(newRow);
    } else {
      // Se não deu match com data, é nota adicional ou prefixo do primeiro registro
      const cleanNote = trimmedToken.replace(/Sess[ãa]o|T[ée]cnica\s+Aplicada|Cor\s+Aplicada|Agulha|Sensibilidade|Observa[çc][ãa]o\s+T[ée]cnicas?\s+sobre\s+o\s+procedimento|Par[âa]metros|Disparos|Valor|Data\s+|Sessão\s+Data/gi, '').trim();
      // Remove números isolados no final que seriam sessões
      const finalNote = cleanNote.replace(/\s+\d+(?:[º°]|ª)?$/, '').trim();
      if (finalNote && finalNote.length > 5) {
        additionalNotes += (additionalNotes ? '\n' : '') + finalNote;
      }
    }
  });

  return { 
    isTable: parsedRows.length > 0, 
    columns: targetCols, 
    rows: parsedRows, 
    notes: additionalNotes 
  };
}
