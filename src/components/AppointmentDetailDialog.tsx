import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useProfessionals, statusConfig, type DBAppointment } from "@/hooks/useClinicData";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  Clock,
  User,
  Phone,
  FileText,
  Loader2,
  CheckCircle2,
  XCircle,
  Trash2,
  CalendarCheck,
  AlertCircle,
  Scissors,
  Pencil,
  ExternalLink,
  AlertTriangle,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import AppointmentEditForm from "@/components/AppointmentEditForm";

interface AppointmentDetailDialogProps {
  appointment: DBAppointment | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const statusActions: Record<string, { label: string; icon: React.ReactNode; next: string }[]> = {
  agendado: [
    { label: "Confirmar", icon: <CalendarCheck className="w-4 h-4" />, next: "confirmado" },
    { label: "Atendendo", icon: <CheckCircle2 className="w-4 h-4" />, next: "atendendo" },
    { label: "Atendido", icon: <CheckCircle2 className="w-4 h-4" />, next: "atendido" },
    { label: "Cancelar", icon: <XCircle className="w-4 h-4" />, next: "cancelado" },
    { label: "Faltou", icon: <XCircle className="w-4 h-4" />, next: "falta" },
  ],
  confirmado: [
    { label: "Atendendo", icon: <CheckCircle2 className="w-4 h-4" />, next: "atendendo" },
    { label: "Atendido", icon: <CheckCircle2 className="w-4 h-4" />, next: "atendido" },
    { label: "Cancelar", icon: <XCircle className="w-4 h-4" />, next: "cancelado" },
    { label: "Faltou", icon: <XCircle className="w-4 h-4" />, next: "falta" },
  ],
  espera: [
    { label: "Confirmar", icon: <CalendarCheck className="w-4 h-4" />, next: "confirmado" },
    { label: "Atendendo", icon: <CheckCircle2 className="w-4 h-4" />, next: "atendendo" },
    { label: "Atendido", icon: <CheckCircle2 className="w-4 h-4" />, next: "atendido" },
    { label: "Cancelar", icon: <XCircle className="w-4 h-4" />, next: "cancelado" },
  ],
  atendendo: [
    { label: "Atendido", icon: <CheckCircle2 className="w-4 h-4" />, next: "atendido" },
  ],
  atendido: [],
  cancelado: [
    { label: "Reagendar", icon: <CalendarCheck className="w-4 h-4" />, next: "agendado" },
  ],
  atrasado: [
    { label: "Atendendo", icon: <CheckCircle2 className="w-4 h-4" />, next: "atendendo" },
    { label: "Atendido", icon: <CheckCircle2 className="w-4 h-4" />, next: "atendido" },
    { label: "Cancelar", icon: <XCircle className="w-4 h-4" />, next: "cancelado" },
    { label: "Faltou", icon: <XCircle className="w-4 h-4" />, next: "falta" },
  ],
  falta: [
    { label: "Reagendar", icon: <CalendarCheck className="w-4 h-4" />, next: "agendado" },
  ],
};

const statusLabel: Record<string, string> = {
  agendado: "Agendado",
  confirmado: "Confirmado",
  espera: "Em Espera",
  atendendo: "Atendendo",
  atendido: "Atendido",
  cancelado: "Cancelado",
  atrasado: "Atrasado",
  falta: "Faltou",
  removido: "Removido",
};

const AppointmentDetailDialog = ({
  appointment,
  open,
  onOpenChange,
}: AppointmentDetailDialogProps) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: professionals = [] } = useProfessionals();
  const [cancellationReason, setCancellationReason] = useState("");
  const [showCancelForm, setShowCancelForm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [editing, setEditing] = useState(false);

  const { data: appointmentServices = [] } = useQuery({
    queryKey: ["appointment_services", appointment?.id],
    queryFn: async () => {
      if (!appointment?.id) return [];
      const { data, error } = await supabase
        .from("appointment_services")
        .select("*")
        .eq("appointment_id", appointment.id);
      if (error) throw error;
      return data ?? [];
    },
    enabled: !!appointment?.id && open,
  });

  const professional = professionals.find(
    (p) => p.id === appointment?.professional_id
  );

  const statusMutation = useMutation({
    mutationFn: async ({
      id,
      newStatus,
      reason,
    }: {
      id: string;
      newStatus: string;
      reason?: string;
    }) => {
      const updateData: Record<string, unknown> = { status: newStatus };

      if (newStatus === "cancelado") {
        updateData.cancellation_reason = reason || null;
        updateData.cancelled_at = new Date().toISOString();
      }

      if (newStatus === "agendado") {
        updateData.cancellation_reason = null;
        updateData.cancelled_at = null;
      }

      const { error } = await supabase
        .from("appointments")
        .update(updateData)
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
      const label = statusLabel[vars.newStatus] || vars.newStatus;
      toast({ title: `Status alterado para "${label}"` });
      setShowCancelForm(false);
      setCancellationReason("");
      onOpenChange(false);
    },
    onError: (err: Error) => {
      toast({
        title: "Erro ao atualizar status",
        description: err.message,
        variant: "destructive",
      });
    },
  });

  const handleStatusChange = (newStatus: string) => {
    if (!appointment) return;

    if (newStatus === "cancelado") {
      setShowCancelForm(true);
      return;
    }

    statusMutation.mutate({ id: appointment.id, newStatus });
  };

  const handleConfirmCancel = () => {
    if (!appointment) return;
    statusMutation.mutate({
      id: appointment.id,
      newStatus: "cancelado",
      reason: cancellationReason.trim() || undefined,
    });
  };

  if (!appointment) return null;

  const cfg = statusConfig[appointment.status as keyof typeof statusConfig] || statusConfig.agendado;
  const actions = statusActions[appointment.status] || [];
  const dateFormatted = format(parseISO(appointment.date), "EEEE, dd 'de' MMMM", { locale: ptBR });

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (!v) {
          setShowCancelForm(false);
          setCancellationReason("");
          setEditing(false);
        }
        onOpenChange(v);
      }}
    >
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="font-display">
              {editing ? "Editar Agendamento" : "Detalhes do Agendamento"}
            </DialogTitle>
            {!editing && appointment.status !== "cancelado" && appointment.status !== "atendido" && (
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setEditing(true)}>
                <Pencil className="w-4 h-4" />
              </Button>
            )}
          </div>
        </DialogHeader>

        {editing ? (
          <AppointmentEditForm
            appointment={appointment}
            initialServices={appointmentServices}
            onSaved={() => { setEditing(false); onOpenChange(false); }}
            onCancel={() => setEditing(false)}
          />
        ) : (
          <div className="space-y-4 pt-1">
            {/* Status Badge */}
            <div className="flex items-center gap-2">
              <Badge
                className={cn(
                  "text-xs font-semibold px-3 py-1",
                  cfg.color,
                  appointment.status !== "cancelado" && "text-white"
                )}
              >
                {statusLabel[appointment.status] || appointment.status}
              </Badge>
            </div>

            {/* Client info */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between gap-2.5">
                <div className="flex items-center gap-2.5">
                  <User className="w-4 h-4 text-muted-foreground shrink-0" />
                  <span className="text-sm font-medium">{appointment.client_name || "Sem nome"}</span>
                </div>
                {appointment.client_id && (
                  <Button
                    variant="link"
                    size="sm"
                    className="h-auto p-0 text-xs text-primary"
                    onClick={() => {
                      onOpenChange(false);
                      navigate(`/clientes/${appointment.client_id}`);
                    }}
                  >
                    Ver Perfil
                    <ExternalLink className="w-3 h-3 ml-1" />
                  </Button>
                )}
              </div>
              {appointment.client_phone && (
                <div className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-muted-foreground shrink-0" />
                  <span className="text-sm text-muted-foreground">{appointment.client_phone}</span>
                </div>
              )}
              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-muted-foreground shrink-0" />
                <span className="text-sm text-muted-foreground capitalize">
                  {dateFormatted} — {appointment.start_time?.slice(0, 5)} até {appointment.end_time?.slice(0, 5)}
                </span>
              </div>
              {professional && (
                <div className="flex items-center gap-2.5">
                  <User className="w-4 h-4 text-muted-foreground shrink-0" />
                  <span className="text-sm text-muted-foreground">
                    {professional.name} — {professional.role_description}
                  </span>
                </div>
              )}
            </div>

            {/* Services */}
            {appointmentServices.length > 0 ? (
              <div className="space-y-1.5">
                <div className="flex items-center gap-2.5">
                  <Scissors className="w-4 h-4 text-muted-foreground shrink-0" />
                  <span className="text-sm font-medium">Serviços</span>
                </div>
                <div className="ml-6.5 space-y-1">
                  {appointmentServices.map((svc) => (
                    <div key={svc.id} className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">{svc.service_name} <span className="text-xs">({svc.duration_minutes} min)</span></span>
                      {svc.price != null && (
                        <span className="text-xs text-muted-foreground">R$ {Number(svc.price).toFixed(2).replace(".", ",")}</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-1.5">
                <div className="flex items-center gap-2.5">
                  <Scissors className="w-4 h-4 text-muted-foreground shrink-0" />
                  <span className="text-sm font-medium text-primary">Serviço</span>
                </div>
                <div className="ml-6.5">
                  <span className="text-sm text-muted-foreground">{appointment.notes || "Sem serviço registrado"}</span>
                </div>
              </div>
            )}

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
            {actions.length > 0 && (
              <>
                <Separator />

                {showCancelForm ? (
                  <div className="space-y-3">
                    <Label>Motivo do cancelamento (opcional)</Label>
                    <Textarea
                      value={cancellationReason}
                      onChange={(e) => setCancellationReason(e.target.value)}
                      placeholder="Ex: cliente não compareceu, remarcou..."
                      rows={2}
                      maxLength={300}
                    />
                    <div className="flex gap-2">
                      <Button
                        variant="destructive"
                        className="flex-1"
                        onClick={handleConfirmCancel}
                        disabled={statusMutation.isPending}
                      >
                        {statusMutation.isPending && (
                          <Loader2 className="w-4 h-4 animate-spin mr-2" />
                        )}
                        Confirmar Cancelamento
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setShowCancelForm(false)}
                      >
                        Voltar
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {actions.map((action) => (
                      <Button
                        key={action.next}
                        variant={action.next === "cancelado" ? "destructive" : "outline"}
                        size="sm"
                        className="gap-1.5"
                        onClick={() => handleStatusChange(action.next)}
                        disabled={statusMutation.isPending}
                      >
                        {statusMutation.isPending ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          action.icon
                        )}
                        {action.label}
                      </Button>
                    ))}

                    <Separator className="my-2 w-full" />
                    <Button
                      variant="ghost"
                      size="sm"
                      className="gap-1.5 text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={() => setShowDeleteConfirm(true)}
                      disabled={statusMutation.isPending}
                    >
                      <Trash2 className="w-4 h-4" />
                      Excluir da Agenda
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </DialogContent>

      {/* Delete confirmation dialog */}
      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-destructive" />
              Excluir da Agenda
            </AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este agendamento da visão da agenda?
              Ele continuará no histórico, mas não aparecerá mais aqui.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive hover:bg-destructive/90"
              onClick={() => {
                statusMutation.mutate({ id: appointment.id, newStatus: "removido" });
                setShowDeleteConfirm(false);
              }}
            >
              Sim, Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Dialog>
  );
};

export default AppointmentDetailDialog;
