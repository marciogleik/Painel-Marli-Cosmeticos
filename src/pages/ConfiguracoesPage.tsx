import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import ProfissionaisTab from "@/components/settings/ProfissionaisTab";
import ServicosTab from "@/components/settings/ServicosTab";
import VinculosTab from "@/components/settings/VinculosTab";
import AnamnesesTab from "@/components/settings/AnamnesesTab";
import ConvitesTab from "@/components/settings/ConvitesTab";
import MinhaContaTab from "@/components/settings/MinhaContaTab";
import GeneralTab from "@/components/settings/GeneralTab";
import { User, Users, Scissors, Link2, FileText, Mail, Sparkles, Settings } from "lucide-react";

const ConfiguracoesPage = () => {
  const { user } = useAuth();

  const { data: isGestor } = useQuery({
    queryKey: ["is-gestor", user?.id],
    queryFn: async () => {
      if (!user) return false;
      const { data } = await supabase.rpc("has_role", {
        _user_id: user.id,
        _role: "gestor",
      });
      return !!data;
    },
    enabled: !!user,
  });

  return (
    <div className="flex flex-col h-full overflow-hidden bg-background">
      <div className="px-4 sm:px-8 pt-6 sm:pt-10 pb-6 shrink-0 bg-gradient-to-b from-primary/[0.02] to-transparent">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-sm shadow-primary/10 border border-primary/20">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-display font-bold tracking-tight text-foreground/90">Configurações</h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 font-medium opacity-70">
              {isGestor
                ? "Personalize sua experiência e gerencie os recursos da clínica"
                : "Gerencie seus dados pessoais e preferências de acesso"}
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto px-4 sm:px-8 py-2">
        <Tabs defaultValue={isGestor ? "geral" : "minha-conta"} className="w-full h-full flex flex-col">
          <div className="relative mb-8 shrink-0">
            <div className="flex overflow-x-auto scrollbar-hide -mx-1 px-1 pb-1 pt-1">
              <TabsList className="inline-flex h-12 w-max items-center justify-center rounded-2xl bg-muted/40 p-1.5 text-muted-foreground border border-border/40 shadow-sm backdrop-blur-sm">
                {isGestor && (
                  <>
                    <TabsTrigger 
                      value="geral" 
                      className="rounded-xl px-5 py-2 text-xs font-bold transition-all data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-md data-[state=active]:ring-1 data-[state=active]:ring-primary/10 gap-2"
                    >
                      <Settings className="w-3.5 h-3.5" />
                      Geral
                    </TabsTrigger>
                    <TabsTrigger 
                      value="profissionais" 
                      className="rounded-xl px-5 py-2 text-xs font-bold transition-all data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-md data-[state=active]:ring-1 data-[state=active]:ring-primary/10 gap-2"
                    >
                      <Users className="w-3.5 h-3.5" />
                      Profissionais
                    </TabsTrigger>
                    <TabsTrigger 
                      value="servicos"
                      className="rounded-xl px-5 py-2 text-xs font-bold transition-all data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-md data-[state=active]:ring-1 data-[state=active]:ring-primary/10 gap-2"
                    >
                      <Scissors className="w-3.5 h-3.5" />
                      Serviços
                    </TabsTrigger>
                    <TabsTrigger 
                      value="vinculos"
                      className="rounded-xl px-5 py-2 text-xs font-bold transition-all data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-md data-[state=active]:ring-1 data-[state=active]:ring-primary/10 gap-2"
                    >
                      <Link2 className="w-3.5 h-3.5" />
                      Vínculos
                    </TabsTrigger>
                    <TabsTrigger 
                      value="anamneses"
                      className="rounded-xl px-5 py-2 text-xs font-bold transition-all data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-md data-[state=active]:ring-1 data-[state=active]:ring-primary/10 gap-2"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      Anamneses
                    </TabsTrigger>
                    <TabsTrigger 
                      value="convites"
                      className="rounded-xl px-5 py-2 text-xs font-bold transition-all data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-md data-[state=active]:ring-1 data-[state=active]:ring-primary/10 gap-2"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      Convites
                    </TabsTrigger>
                    <div className="w-[1px] h-6 bg-border/40 mx-2" />
                  </>
                )}
                <TabsTrigger 
                  value="minha-conta"
                  className="rounded-xl px-5 py-2 text-xs font-bold transition-all data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-md data-[state=active]:ring-1 data-[state=active]:ring-primary/10 gap-2"
                >
                  <User className="w-3.5 h-3.5" />
                  Minha Conta
                </TabsTrigger>
              </TabsList>
            </div>
          </div>

          <div className="flex-1 animate-in fade-in duration-500">
            {isGestor && (
              <>
                <TabsContent value="geral" className="mt-0 focus-visible:outline-none">
                  <GeneralTab />
                </TabsContent>

                <TabsContent value="profissionais" className="mt-0 focus-visible:outline-none">
                  <ProfissionaisTab />
                </TabsContent>

                <TabsContent value="servicos" className="mt-0 focus-visible:outline-none">
                  <ServicosTab />
                </TabsContent>

                <TabsContent value="vinculos" className="mt-0 focus-visible:outline-none">
                  <VinculosTab />
                </TabsContent>

                <TabsContent value="anamneses" className="mt-0 focus-visible:outline-none">
                  <AnamnesesTab />
                </TabsContent>

                <TabsContent value="convites" className="mt-0 focus-visible:outline-none">
                  <ConvitesTab />
                </TabsContent>
              </>
            )}

            <TabsContent value="minha-conta" className="mt-0 focus-visible:outline-none">
              <MinhaContaTab />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default ConfiguracoesPage;
