import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import type { RevenueByProfessional, RevenueByService, DailyRevenue } from "@/hooks/useFinanceReport";

const formatCurrency = (v: number) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

interface FinanceData {
  byProfessional: RevenueByProfessional[];
  byService: RevenueByService[];
  daily: DailyRevenue[];
  totalRevenue: number;
  totalAppointments: number;
}

export async function exportToExcel(data: FinanceData, month: Date, professionalName?: string) {
  const XLSX = await import("xlsx");
  const wb = XLSX.utils.book_new();
  const monthLabel = format(month, "MMMM yyyy", { locale: ptBR });
  const filterLabel = professionalName ? ` — ${professionalName}` : "";

  // Summary sheet
  const summaryData = [
    ["Relatório Financeiro"],
    [`Período: ${monthLabel}${filterLabel}`],
    [],
    ["Receita Total", formatCurrency(data.totalRevenue)],
    ["Agendamentos", data.totalAppointments],
    ["Ticket Médio", data.totalAppointments > 0 ? formatCurrency(data.totalRevenue / data.totalAppointments) : "R$ 0,00"],
  ];
  const wsSummary = XLSX.utils.aoa_to_sheet(summaryData);
  XLSX.utils.book_append_sheet(wb, wsSummary, "Resumo");

  // By professional sheet
  if (data.byProfessional.length > 0) {
    const profRows = data.byProfessional.map(p => ({
      Profissional: p.professional_name,
      Atendimentos: p.count,
      Receita: p.total,
      "Ticket Médio": p.count > 0 ? +(p.total / p.count).toFixed(2) : 0,
    }));
    const wsProf = XLSX.utils.json_to_sheet(profRows);
    XLSX.utils.book_append_sheet(wb, wsProf, "Por Profissional");
  }

  // By service sheet
  if (data.byService.length > 0) {
    const svcRows = data.byService.map(s => ({
      Serviço: s.service_name,
      Quantidade: s.count,
      Receita: s.total,
    }));
    const wsSvc = XLSX.utils.json_to_sheet(svcRows);
    XLSX.utils.book_append_sheet(wb, wsSvc, "Por Serviço");
  }

  // Daily sheet
  if (data.daily.length > 0) {
    const dailyRows = data.daily.map(d => ({
      Data: d.date,
      Receita: d.total,
    }));
    const wsDaily = XLSX.utils.json_to_sheet(dailyRows);
    XLSX.utils.book_append_sheet(wb, wsDaily, "Receita Diária");
  }

  const fileName = `relatorio-financeiro-${format(month, "yyyy-MM")}${professionalName ? `-${professionalName.replace(/\s+/g, "-")}` : ""}.xlsx`;
  XLSX.writeFile(wb, fileName);
}

export async function exportToPDF(data: FinanceData, month: Date, professionalName?: string) {
  const { default: jsPDF } = await import("jspdf");
  const { default: autoTable } = await import("jspdf-autotable");

  const doc = new jsPDF();
  const monthLabel = format(month, "MMMM yyyy", { locale: ptBR });
  const filterLabel = professionalName ? ` — ${professionalName}` : "";

  // Title
  doc.setFontSize(18);
  doc.text("Relatório Financeiro", 14, 20);
  doc.setFontSize(11);
  doc.setTextColor(100);
  doc.text(`Período: ${monthLabel}${filterLabel}`, 14, 28);

  // Summary
  doc.setFontSize(12);
  doc.setTextColor(0);
  doc.text(`Receita Total: ${formatCurrency(data.totalRevenue)}`, 14, 40);
  doc.text(`Agendamentos: ${data.totalAppointments}`, 14, 48);
  doc.text(
    `Ticket Médio: ${data.totalAppointments > 0 ? formatCurrency(data.totalRevenue / data.totalAppointments) : "R$ 0,00"}`,
    14,
    56
  );

  let startY = 66;

  // Professional table
  if (data.byProfessional.length > 0) {
    doc.setFontSize(13);
    doc.text("Por Profissional", 14, startY);
    autoTable(doc, {
      startY: startY + 4,
      head: [["Profissional", "Atendimentos", "Receita", "Ticket Médio"]],
      body: data.byProfessional.map(p => [
        p.professional_name,
        p.count,
        formatCurrency(p.total),
        p.count > 0 ? formatCurrency(p.total / p.count) : "—",
      ]),
      styles: { fontSize: 9 },
      headStyles: { fillColor: [43, 43, 43] },
    });
    startY = (doc as any).lastAutoTable.finalY + 12;
  }

  // Service table
  if (data.byService.length > 0) {
    if (startY > 240) {
      doc.addPage();
      startY = 20;
    }
    doc.setFontSize(13);
    doc.text("Por Serviço", 14, startY);
    autoTable(doc, {
      startY: startY + 4,
      head: [["Serviço", "Quantidade", "Receita"]],
      body: data.byService.map(s => [
        s.service_name,
        s.count,
        formatCurrency(s.total),
      ]),
      styles: { fontSize: 9 },
      headStyles: { fillColor: [43, 43, 43] },
    });
  }

  const fileName = `relatorio-financeiro-${format(month, "yyyy-MM")}${professionalName ? `-${professionalName.replace(/\s+/g, "-")}` : ""}.pdf`;
  doc.save(fileName);
}
