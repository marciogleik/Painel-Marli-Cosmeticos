import { useState } from "react";
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
import type { Database } from "@/integrations/supabase/types";

type TablesInsert = Database["public"]["Tables"]["clients"]["Insert"];

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

const emptyForm: ClientForm = {
  full_name: "",
  phone: "",
  phone2: "",
  email: "",
  cpf: "",
  birth_date: "",
  address: "",
  city: "",
  notes: "",
};

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const NewClientDialog = ({ open, onOpenChange }: Props) => {
  const [form, setForm] = useState<ClientForm>(emptyForm);
  const [errors, setErrors] = useState<Partial<Record<keyof ClientForm, string>>>({});
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (data: ClientForm) => {
      const payload: TablesInsert = {
        full_name: data.full_name.trim(),
      };
      if (data.phone) payload.phone = data.phone.trim();
      if (data.phone2) payload.phone2 = data.phone2.trim();
      if (data.email) payload.email = data.email.trim();
      if (data.cpf) payload.cpf = data.cpf.trim();
      if (data.birth_date) payload.birth_date = data.birth_date;
      if (data.address) payload.address = data.address.trim();
      if (data.city) payload.city = data.city.trim();
      if (data.notes) payload.notes = data.notes.trim();

      const { error } = await supabase.from("clients").insert([payload]);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Cliente cadastrado com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["clients"] });
      setForm(emptyForm);
      setErrors({});
      onOpenChange(false);
    },
    onError: (err: Error) => {
      toast.error(err.message ?? "Erro ao cadastrar cliente");
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
          <DialogTitle>Novo Cliente</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          {/* Nome */}
          <div>
            <Label htmlFor="full_name">Nome completo *</Label>
            <Input
              id="full_name"
              value={form.full_name}
              onChange={(e) => handleChange("full_name", e.target.value)}
              placeholder="Nome do cliente"
              autoFocus
            />
            {errors.full_name && <p className="text-xs text-destructive mt-1">{errors.full_name}</p>}
          </div>

          {/* Telefones */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="phone">Telefone</Label>
              <Input
                id="phone"
                value={form.phone}
                onChange={(e) => handleChange("phone", maskPhone(e.target.value))}
                placeholder="(00) 00000-0000"
              />
            </div>
            <div>
              <Label htmlFor="phone2">Telefone 2</Label>
              <Input
                id="phone2"
                value={form.phone2}
                onChange={(e) => handleChange("phone2", maskPhone(e.target.value))}
                placeholder="(00) 00000-0000"
              />
            </div>
          </div>

          {/* Email & CPF */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                value={form.email}
                onChange={(e) => handleChange("email", e.target.value)}
                placeholder="email@exemplo.com"
              />
              {errors.email && <p className="text-xs text-destructive mt-1">{errors.email}</p>}
            </div>
            <div>
              <Label htmlFor="cpf">CPF</Label>
              <Input
                id="cpf"
                value={form.cpf}
                onChange={(e) => handleChange("cpf", maskCPF(e.target.value))}
                placeholder="000.000.000-00"
              />
            </div>
          </div>

          {/* Data de nascimento */}
          <div className="w-1/2">
            <Label htmlFor="birth_date">Data de nascimento</Label>
            <Input
              id="birth_date"
              type="date"
              value={form.birth_date}
              onChange={(e) => handleChange("birth_date", e.target.value)}
            />
          </div>

          {/* Endereço & Cidade */}
          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2">
              <Label htmlFor="address">Endereço</Label>
              <Input
                id="address"
                value={form.address}
                onChange={(e) => handleChange("address", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="city">Cidade</Label>
              <Input
                id="city"
                value={form.city}
                onChange={(e) => handleChange("city", e.target.value)}
              />
            </div>
          </div>

          {/* Observações */}
          <div>
            <Label htmlFor="notes">Observações</Label>
            <Textarea
              id="notes"
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
              {mutation.isPending ? "Salvando..." : "Cadastrar"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default NewClientDialog;
