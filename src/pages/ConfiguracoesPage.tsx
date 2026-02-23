import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProfissionaisTab from "@/components/settings/ProfissionaisTab";
import ServicosTab from "@/components/settings/ServicosTab";
import VinculosTab from "@/components/settings/VinculosTab";

const ConfiguracoesPage = () => {
  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="px-8 pt-8 pb-2 shrink-0">
        <h1 className="text-2xl font-display font-bold">Configurações</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Gerencie profissionais, serviços e vínculos</p>
      </div>

      <div className="flex-1 overflow-auto px-8 py-4">
        <Tabs defaultValue="profissionais" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="profissionais">Profissionais</TabsTrigger>
            <TabsTrigger value="servicos">Serviços</TabsTrigger>
            <TabsTrigger value="vinculos">Vínculos</TabsTrigger>
          </TabsList>

          <TabsContent value="profissionais">
            <ProfissionaisTab />
          </TabsContent>

          <TabsContent value="servicos">
            <ServicosTab />
          </TabsContent>

          <TabsContent value="vinculos">
            <VinculosTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ConfiguracoesPage;
