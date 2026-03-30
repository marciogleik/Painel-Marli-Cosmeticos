import { useState, useMemo } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { 
  HelpCircle, 
  Search, 
  LayoutDashboard, 
  Calendar, 
  Users, 
  DollarSign, 
  Settings, 
  Zap,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const FAQ_DATA = [
  {
    id: "dashboard",
    category: "Dashboard & Visão Geral",
    icon: LayoutDashboard,
    questions: [
      {
        q: "O que é exibido no Dashboard?",
        a: "O Dashboard exibe um resumo financeiro e de atendimentos do dia, incluindo agendamentos confirmados, pendentes e aniversariantes. Cada profissional vê seus próprios dados, enquanto gestores têm a visão consolidada.",
      },
      {
        q: "Como vejo os aniversariantes do dia?",
        a: "Há um card específico no Dashboard que lista automaticamente todos os clientes que fazem aniversário hoje, permitindo enviar uma mensagem rápida com um clique.",
      },
    ],
  },
  {
    id: "agenda",
    category: "Agenda & Agendamentos",
    icon: Calendar,
    questions: [
      {
        q: "Como funciona a grade de 15 minutos?",
        a: "A agenda é otimizada para clínicas de estética, permitindo encaixes precisos em blocos de 15 minutos. Isso maximiza a utilização das salas e o tempo dos profissionais.",
      },
      {
        q: "O sistema avisa sobre conflitos de horário?",
        a: "Sim. Ao tentar agendar um serviço em um horário já ocupado, o sistema sinaliza o conflito e mostra qual cliente já está naquele slot.",
      },
      {
        q: "Como trocar o status de um atendimento?",
        a: "Basta clicar no agendamento na grade e selecionar o novo status: Agendado, Confirmado, Atendido, Falta ou Cancelado.",
      },
    ],
  },
  {
    id: "clientes",
    category: "Clientes & Prontuários",
    icon: Users,
    questions: [
      {
        q: "Como personalizar fichas para diferentes procedimentos?",
        a: "Nas Configurações > Templates, você pode criar modelos de anamnese específicos (ex: Botox, Preenchimento, Limpeza de Pele). Cada modelo terá os campos exatos que você precisa preencher.",
      },
      {
        q: "Onde vejo as observações técnicas de atendimentos passados?",
        a: "No perfil do cliente, aba 'Anamnese'. O sistema exibe uma linha do tempo com todos os procedimentos, onde você pode clicar para ver fotos, observações técnicas e evolução.",
      },
      {
        q: "Como funciona a assinatura digital?",
        a: "Ao finalizar uma ficha ou contrato, você pode gerar um link de assinatura ou coletar a assinatura diretamente na tela (tablet/celular), que será anexada permanentemente ao prontuário.",
      },
    ],
  },
  {
    id: "financeiro",
    category: "Financeiro & Comissões",
    icon: DollarSign,
    questions: [
      {
        q: "Como consultar a comissão por profissional?",
        a: "No módulo Financeiro, você pode filtrar por data e profissional. O sistema listará todos os serviços executados e calculará o valor a pagar com base na regra de comissão cadastrada.",
      },
      {
        q: "Posso exportar os fechamentos mensais?",
        a: "Sim. Todos os relatórios financeiros podem ser exportados em PDF ou Excel para facilitar o envio para a contabilidade ou conferência externa.",
      },
    ],
  },
  {
    id: "config",
    category: "Configurações & Segurança",
    icon: Settings,
    questions: [
      {
        q: "Como cadastrar novos profissionais?",
        a: "Acesse Configurações > Profissionais. Lá você define o nome, especialidade e o nível de acesso (Gestor, Profissional ou Secretária).",
      },
      {
        q: "Meus dados estão seguros?",
        a: "Sim. Utilizamos criptografia de ponta a ponta e políticas de RLS (Row Level Security), garantindo que um profissional nunca veja os dados financeiros ou clientes de outro, a menos que seja um Gestor.",
      },
    ],
  },
];

const FaqPage = () => {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const filteredFaq = useMemo(() => {
    let results = FAQ_DATA;

    if (activeCategory) {
      results = results.filter(cat => cat.id === activeCategory);
    }

    if (search.trim()) {
      const term = search.toLowerCase();
      return results.map(cat => ({
        ...cat,
        questions: cat.questions.filter(q => 
          q.q.toLowerCase().includes(term) || 
          q.a.toLowerCase().includes(term) ||
          cat.category.toLowerCase().includes(term)
        )
      })).filter(cat => cat.questions.length > 0);
    }

    return results;
  }, [search, activeCategory]);

  const allCategories = FAQ_DATA.map(c => ({ id: c.id, label: c.category, icon: c.icon }));

  return (
    <div className="flex flex-col h-full bg-background overflow-hidden font-sans">
      {/* Header with Search */}
      <div className="relative pt-12 pb-16 px-8 sm:px-12 bg-primary/5 border-b border-border/40 overflow-hidden shrink-0">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-primary/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/4" />
        
        <div className="max-w-4xl mx-auto relative z-10 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-[0.2em] mb-2">
            <Zap className="w-3 h-3" /> Base de Conhecimento
          </div>
          <h1 className="text-4xl sm:text-5xl font-display font-black tracking-tight text-foreground uppercase italic leading-none">
            Como podemos <span className="text-primary italic">ajudar?</span>
          </h1>
          <p className="text-muted-foreground font-medium text-lg max-w-2xl mx-auto pb-4">
            Encontre respostas rápidas sobre agendamentos, prontuários, financeiro e muito mais.
          </p>
          
          <div className="relative max-w-xl mx-auto mt-8 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input 
              placeholder="Pesquise por uma dúvida ou palavra-chave..." 
              className="pl-12 h-14 bg-background border-border/40 shadow-xl shadow-primary/5 rounded-2xl text-base focus-visible:ring-primary/20 transition-all font-medium"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Categories Sidebar */}
        <div className="w-72 shrink-0 border-r border-border/40 bg-muted/30 hidden lg:flex flex-col p-6 space-y-2 overflow-y-auto">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-2 px-4">Categorias</p>
          <button 
            onClick={() => setActiveCategory(null)}
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all duration-300",
              activeCategory === null ? "bg-primary text-white shadow-lg shadow-primary/20" : "text-muted-foreground hover:bg-primary/5 hover:text-primary"
            )}
          >
            <HelpCircle className="w-4 h-4" /> Todas as Dúvidas
          </button>
          
          {allCategories.map(cat => (
            <button 
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all duration-300",
                activeCategory === cat.id ? "bg-primary text-white shadow-lg shadow-primary/20" : "text-muted-foreground hover:bg-primary/5 hover:text-primary"
              )}
            >
              <cat.icon className="w-4 h-4" /> {cat.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8 sm:p-12 scroll-smooth no-scrollbar">
          <div className="max-w-3xl mx-auto space-y-12">
            <AnimatePresence mode="popLayout">
              {filteredFaq.length > 0 ? (
                filteredFaq.map((section) => (
                  <motion.div 
                    key={section.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="space-y-4"
                  >
                    <div className="flex items-center gap-3 pb-2 border-b border-border/40">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <section.icon className="w-5 h-5 text-primary" />
                      </div>
                      <h2 className="text-xl font-display font-black uppercase tracking-tight">{section.category}</h2>
                    </div>

                    <Accordion type="multiple" className="space-y-3">
                      {section.questions.map((item, idx) => (
                        <AccordionItem
                          key={idx}
                          value={`${section.id}-${idx}`}
                          className="group border border-border/40 bg-white/5 backdrop-blur-sm rounded-2xl px-6 transition-all hover:border-primary/30 hover:bg-white/10 overflow-hidden"
                        >
                          <AccordionTrigger className="text-sm sm:text-base font-bold text-left py-5 hover:no-underline transition-all">
                            <span className="flex-1 group-data-[state=open]:text-primary transition-colors pr-4">
                              {item.q}
                            </span>
                          </AccordionTrigger>
                          <AccordionContent className="text-sm sm:text-base text-muted-foreground leading-relaxed pb-6 animate-in fade-in duration-300">
                            <div className="pt-2 border-t border-border/20 mt-2 italic opacity-80 whitespace-pre-wrap">
                              {item.a}
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </motion.div>
                ))
              ) : (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-20 space-y-4"
                >
                  <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto">
                    <Search className="w-8 h-8 text-muted-foreground opacity-20" />
                  </div>
                  <h3 className="text-xl font-bold uppercase tracking-tight">Nenhum resultado encontrado</h3>
                  <p className="text-muted-foreground max-w-xs mx-auto">
                    Tente outras palavras-chave ou explore as categorias na barra lateral.
                  </p>
                  <Button variant="outline" onClick={() => { setSearch(""); setActiveCategory(null); }} className="mt-4 rounded-xl font-bold uppercase tracking-widest text-[10px]">
                    Limpar Filtros
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FaqPage;
