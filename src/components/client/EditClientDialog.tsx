import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { z } from "zod";
import { maskPhone, maskCPF } from "@/utils/masks";
import type { DBClient } from "@/hooks/useClinicData";

const clientSchema = z.object({
  full_name: z.string().trim().min(2, "Nome deve ter ao menos 2 caracteres").max(120),
  phone: z.string().trim().max(20).optional().or(z.literal("")),
  phone2: z.string().trim().max(20).optional().or(z.literal("")),
  email: z.string().trim().email("E-mail inválido").max(255).optional().or(z.literal("")),
  cpf: z.string().trim().max(14).optional().or(z.literal("")),
  birth_date: z.string().optional().or(z.literal("")),
  address: z.string().trim().max(255).optional().or(z.literal("")),
  city: z.string().trim().max(100).optional().or(z.literal("")),
  notes: z.string().trim().max(1000).optional().or(z.literal("")),
});

type ClientForm = z.infer<typeof clientSchema>;

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  client: DBClient;
}

const EditClientDialog = ({ open, onOpenChange, client }: Props) => {
  const [form, setForm] = useState<ClientForm>({
    full_name: "",
    phone: "",
    phone2: "",
    email: "",
    cpf: "",
    birth_date: "",
    address: "",
    city: "",
    notes: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof ClientForm, string>>>({});
  const queryClient = useQueryClient();

  useEffect(() => {
    if (open && client) {
      setForm({
        full_name: client.full_name ?? "",
        phone: client.phone ?? "",
        phone2: client.phone2 ?? "",
        email: client.email ?? "",
        cpf: client.cpf ?? "",
        birth_date: client.birth_date ?? "",
        address: (client as any).address ?? "",
        city: (client as any).city ?? "",
        notes: client.notes ?? "",
      });
      setErrors({});
    }
  }, [open, client]);

  const mutation = useMutation({
    mutationFn: async (data: ClientForm) => {
      const payload: Record<string, unknown> = {
        full_name: data.full_name.trim(),
        phone: data.phone?.trim() || null,
        phone2: data.phone2?.trim() || null,
        email: data.email?.trim() || null,
        cpf: data.cpf?.trim() || null,
        birth_date: data.birth_date || null,
        address: data.address?.trim() || null,
        city: data.city?.trim() || null,
        notes: data.notes?.trim() || null,
      };

      const { error } = await supabase
        .from("clients")
        .update(payload as any)
        .eq("id", client.id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Cliente atualizado com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["client", client.id] });
      queryClient.invalidateQueries({ queryKey: ["clients"] });
      onOpenChange(false);
    },
    onError: (err: any) => {
      toast.error(err.message ?? "Erro ao atualizar cliente");
    },
  });

  const handleChange = (key: keyof ClientForm, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = clientSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof ClientForm, string>> = {};
      result.error.errors.forEach((err) => {
        const key = err.path[0] as keyof ClientForm;
        fieldErrors[key] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }
    mutation.mutate(result.data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Cliente</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div>
            <Label htmlFor="edit_full_name">Nome completo *</Label>
            <Input
              id="edit_full_name"
              value={form.full_name}
              onChange={(e) => handleChange("full_name", e.target.value)}
              autoFocus
            />
            {errors.full_name && <p className="text-xs text-destructive mt-1">{errors.full_name}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="edit_phone">Telefone</Label>
              <Input
                id="edit_phone"
                value={form.phone}
                onChange={(e) => handleChange("phone", maskPhone(e.target.value))}
              />
            </div>
            <div>
              <Label htmlFor="edit_phone2">Telefone 2</Label>
              <Input
                id="edit_phone2"
                value={form.phone2}
                onChange={(e) => handleChange("phone2", maskPhone(e.target.value))}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="edit_email">E-mail</Label>
              <Input
                id="edit_email"
                type="email"
                value={form.email}
                onChange={(e) => handleChange("email", e.target.value)}
              />
              {errors.email && <p className="text-xs text-destructive mt-1">{errors.email}</p>}
            </div>
            <div>
              <Label htmlFor="edit_cpf">CPF</Label>
              <Input
                id="edit_cpf"
                value={form.cpf}
                onChange={(e) => handleChange("cpf", maskCPF(e.target.value))}
              />
            </div>
          </div>

          <div className="w-1/2">
            <Label htmlFor="edit_birth_date">Data de nascimento</Label>
            <Input
              id="edit_birth_date"
              type="date"
              value={form.birth_date}
              onChange={(e) => handleChange("birth_date", e.target.value)}
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2">
              <Label htmlFor="edit_address">Endereço</Label>
              <Input
                id="edit_address"
                value={form.address}
                onChange={(e) => handleChange("address", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="edit_city">Cidade</Label>
              <Input
                id="edit_city"
                value={form.city}
                onChange={(e) => handleChange("city", e.target.value)}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="edit_notes">Observações</Label>
            <Textarea
              id="edit_notes"
              value={form.notes}
              onChange={(e) => handleChange("notes", e.target.value)}
              rows={3}
              className="resize-none"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? "Salvando..." : "Salvar"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditClientDialog;
