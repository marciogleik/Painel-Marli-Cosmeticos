import { useState } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { 
  Calendar, 
  Clock, 
  User, 
  Settings, 
  Trash2, 
  CheckCircle2, 
  XCircle, 
  AlertCircle,
  FileText,
  Phone,
  MessageSquare,
  Scissors,
  Check,
  Smartphone,
  ClipboardList,
  ExternalLink,
  History
} from "lucide-react";
import { Link } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DBAppointment } from "@/hooks/useClinicData";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import AppointmentEditForm from "./AppointmentEditForm";
import AppointmentAuditDialog from "./AppointmentAuditDialog";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface AppointmentDetailDialogProps {
  appointment: DBAppointment | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const statusLabel: Record<string, string> = {
  agendado: "Agendado",
  confirmado: "Confirmado",
  espera: "Em Espera",
  atendendo: "Atendendo",
  atendido: "Atendido",
  cancelado: "Cancelado",
  atrasado: "Atrasado",
  falta: "Faltou",
};

const statusColors: Record<string, string> = {
  agendado: "bg-blue-100 text-blue-700 border-blue-200",
  confirmado: "bg-indigo-100 text-indigo-700 border-indigo-200",
  espera: "bg-orange-100 text-orange-700 border-orange-200",
  atendendo: "bg-purple-100 text-purple-700 border-purple-200",
  atendido: "bg-green-100 text-green-700 border-green-200",
  cancelado: "bg-slate-100 text-slate-700 border-slate-200",
  atrasado: "bg-yellow-100 text-yellow-700 border-yellow-200",
  falta: "bg-red-100 text-red-700 border-red-200",
};

export default function AppointmentDetailDialog({
  appointment,
  open,
  onOpenChange,
}: AppointmentDetailDialogProps) {
  const [editing, setEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [auditOpen, setAuditOpen] = useState(false);
  const queryClient = useQueryClient();

  if (!appointment) return null;

  const handleUpdateStatus = async (status: string) => {
    try {
      const { error } = await supabase
        .from("appointments")
        .update({ status })
        .eq("id", appointment.id);

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ["appointments"] });
      toast.success(`Status atualizado para ${statusLabel[status]}`);
      onOpenChange(false);
    } catch (error: any) {
      toast.error("Erro ao atualizar status: " + error.message);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from("appointments")
        .delete()
        .eq("id", appointment.id);

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ["appointments"] });
      toast.success("Agendamento excluído com sucesso");
      onOpenChange(false);
    } catch (error: any) {
      toast.error("Erro ao excluir agendamento: " + error.message);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleWhatsApp = () => {
    if (!appointment.client_phone) return;
    const phone = appointment.client_phone.replace(/\D/g, "");
    
    // Fix date timezone issue by adding time suffix
    const dateObj = new Date(appointment.date + "T12:00:00");
    const dateFormatted = format(dateObj, "dd/MM");
    const timeFormatted = appointment.start_time.slice(0, 5);
    
    const servicesLabel = appointment.appointment_services && appointment.appointment_services.length > 0
      ? appointment.appointment_services.map(s => s.service_name).join(", ")
      : "procedimento";
      
    const profName = appointment.professionals?.name || "nossa profissional";

    const firstName = appointment.client_name.split(" ")[0];
    const messageText = `${firstName}, Por gentileza confirmar sua presença. ${servicesLabel}, na Marli Cosméticos com a profissional - ${profName} está marcado para ${dateFormatted} às ${timeFormatted}. Posso confirmar sua presença?`;
    
    const message = encodeURIComponent(messageText);
    window.open(`https://wa.me/55${phone}?text=${message}`, "_blank");
  };

  return (
    <Dialog 
      open={open} 
      onOpenChange={(v) => {
        if (!v) setEditing(false);
        onOpenChange(v);
      }}
    >
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto" translate="no">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="font-display">
              {editing ? "Editar Agendamento" : "Detalhes do Agendamento"}
            </DialogTitle>
            {!editing && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setEditing(true)}
                className="h-8 gap-1.5"
              >
                <Settings className="w-4 h-4" />
                Editar
              </Button>
            )}
          </div>
        </DialogHeader>

        {editing ? (
          <AppointmentEditForm
            appointment={appointment}
            initialServices={appointment.appointment_services || []}
            onSaved={() => {
              setEditing(false);
              onOpenChange(false);
            }}
            onCancel={() => setEditing(false)}
          />
        ) : (
          <div className="space-y-4 pt-1" translate="no">
            {/* Status Badge */}
            <div className="flex items-center gap-2">
              <Badge 
                variant="outline" 
                className={cn("px-3 py-1 font-bold uppercase tracking-wider text-[10px]", statusColors[appointment.status])}
              >
                {statusLabel[appointment.status]}
              </Badge>
              <span className="text-xs text-muted-foreground">
                ID: {appointment.id.slice(0, 8)}
              </span>
            </div>

            {/* Main Info */}
            <div className="space-y-3 bg-muted/30 p-4 rounded-xl border border-border/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <Link 
                      to={`/clientes/${appointment.client_id}`}
                      className="font-bold text-foreground leading-tight hover:text-primary hover:underline transition-colors flex items-center gap-1.5 group"
                      translate="no"
                    >
                      {appointment.client_name}
                      <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                    <Phone className="w-3 h-3" />
                    {appointment.client_phone || "Sem telefone"}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2 border-t border-border/50">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium">
                    {format(new Date(appointment.date + "T12:00:00"), "dd 'de' MMMM", { locale: ptBR })}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium">
                    {appointment.start_time.slice(0, 5)} - {appointment.end_time.slice(0, 5)}
                  </span>
                </div>
              </div>
            </div>

            {/* Professional & Services */}
            <div className="space-y-3">
              <div className="flex items-center gap-2.5">
                <Scissors className="w-4 h-4 text-muted-foreground shrink-0" />
                <span className="text-sm font-bold text-foreground/80">
                  {appointment.professionals?.name || "Profissional não definida"}
                </span>
              </div>
              
              <div className="pl-6 space-y-1">
                {appointment.appointment_services && appointment.appointment_services.length > 0 ? (
                  appointment.appointment_services.map((s, idx) => (
                    <div key={idx} className="flex items-center justify-between text-sm py-1 border-b border-border/30 last:border-0">
                      <span className="text-muted-foreground font-medium">{s.service_name}</span>
                      <span className="font-bold text-foreground/70">R$ {s.price?.toFixed(2)}</span>
                    </div>
                  ))
                ) : (
                  <span className="text-sm text-muted-foreground italic">Nenhum serviço registrado</span>
                )}
              </div>
            </div>

            {appointment.notes && (
              <div className="flex items-start gap-2.5">
                <FileText className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                <span className="text-sm text-muted-foreground">{appointment.notes}</span>
              </div>
            )}

            {/* Executed by */}
            {appointment.executed_by && (
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-muted-foreground shrink-0" />
                <span className="text-sm text-muted-foreground">
                  Atendido por: {appointment.executed_by}
                </span>
              </div>
            )}

            {/* Cancellation reason */}
            {appointment.status === "cancelado" && appointment.cancellation_reason && (
              <div className="flex items-start gap-2.5 p-3 bg-muted rounded-lg">
                <AlertCircle className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                <span className="text-sm text-muted-foreground">
                  Motivo: {appointment.cancellation_reason}
                </span>
              </div>
            )}

            {/* Actions */}
            <div className="pt-4 space-y-2">
              {!["atendido", "cancelado", "falta"].includes(appointment.status) && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleUpdateStatus("confirmado")}
                    className="h-9 gap-1.5 text-[10px] font-bold uppercase tracking-wider border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                  >
                    <Check className="w-3.5 h-3.5" />
                    Confirmar
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleUpdateStatus("espera")}
                    className="h-9 gap-1.5 text-[10px] font-bold uppercase tracking-wider border-orange-200 hover:bg-orange-50 hover:text-orange-700"
                  >
                    <Clock className="w-3.5 h-3.5" />
                    Em Espera
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleUpdateStatus("atrasado")}
                    className="h-9 gap-1.5 text-[10px] font-bold uppercase tracking-wider border-yellow-200 hover:bg-yellow-50 hover:text-yellow-700"
                  >
                    <AlertCircle className="w-3.5 h-3.5" />
                    Atrasado
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleUpdateStatus("atendendo")}
                    className="h-9 gap-1.5 text-[10px] font-bold uppercase tracking-wider border-purple-200 hover:bg-purple-50 hover:text-purple-700"
                  >
                    <Scissors className="w-3.5 h-3.5" />
                    Atendendo
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleUpdateStatus("atendido")}
                    className="h-9 gap-1.5 text-[10px] font-bold uppercase tracking-wider border-green-200 hover:bg-green-50 hover:text-green-700"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Atendido
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleUpdateStatus("cancelado")}
                    className="h-9 gap-1.5 text-[10px] font-bold uppercase tracking-wider"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    Cancelar
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleUpdateStatus("falta")}
                    className="h-9 gap-1.5 text-[10px] font-bold uppercase tracking-wider border-red-200 hover:bg-red-50 hover:text-red-700"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    Faltou
                  </Button>
                </div>
              )}

              <div className="flex gap-2 pt-2">
                {appointment.client_phone && (
                <Button
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold gap-2"
                  onClick={handleWhatsApp}
                >
                  <Smartphone className="w-4 h-4" />
                  WhatsApp ✅
                </Button>
                )}
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" className="text-destructive hover:bg-destructive/10 border-destructive/20 font-bold uppercase tracking-widest text-[10px]">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        {appointment.status === "bloqueado" ? "Excluir bloqueio de horário?" : "Excluir agendamento?"}
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        {appointment.status === "bloqueado" 
                          ? "Esta ação não pode ser desfeita. O horário voltará a ficar disponível para novos agendamentos." 
                          : `Esta ação não pode ser desfeita. O agendamento de ${appointment.client_name} será removido permanentemente.`}
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
                        Excluir
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>

                <Button
                  variant="outline"
                  size="icon"
                  className="w-10 h-10 border-primary/20 hover:bg-primary/5 text-primary"
                  onClick={() => setAuditOpen(true)}
                  title="Ver Auditoria"
                >
                  <History className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
      <AppointmentAuditDialog 
        recordId={appointment.id}
        open={auditOpen}
        onOpenChange={setAuditOpen}
      />
    </Dialog>
  );
}
