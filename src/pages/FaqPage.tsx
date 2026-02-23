import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HelpCircle } from "lucide-react";

const faqItems = [
  {
    category: "Dashboard",
    questions: [
      {
        q: "O que é exibido no Dashboard?",
        a: "O Dashboard exibe um resumo personalizado do dia: saudação com o nome do profissional logado, total de agendamentos, confirmados e pendentes, a agenda do dia com detalhes de cada atendimento, e os aniversariantes do dia.",
      },
      {
        q: "As informações do Dashboard são compartilhadas?",
        a: "Não. Cada profissional visualiza apenas seus próprios dados. Gestores têm acesso a uma visão consolidada de todos os profissionais.",
      },
    ],
  },
  {
    category: "Agenda",
    questions: [
      {
        q: "Como funciona a agenda?",
        a: "A agenda exibe os atendimentos em uma grade semanal com intervalos de 15 minutos, das 8h às 20h. Você pode navegar entre semanas e filtrar por profissional.",
      },
      {
        q: "Quais são os status dos agendamentos?",
        a: "Os status disponíveis são: Agendado (azul), Confirmado (esmeralda), Atendido (violeta), Cancelado (cinza com efeito riscado) e Em Espera (âmbar).",
      },
      {
        q: "Existe validação de conflitos de horário?",
        a: "Sim. O sistema detecta automaticamente conflitos de horário por profissional e exibe visualmente os slots ocupados no seletor de horários, incluindo o nome do cliente correspondente.",
      },
      {
        q: "Posso associar serviços a um agendamento?",
        a: "Sim. Ao criar ou editar um agendamento, você pode adicionar um ou mais serviços. O sistema calcula automaticamente a duração e o valor total com base nos serviços selecionados.",
      },
    ],
  },
  {
    category: "Clientes",
    questions: [
      {
        q: "Como cadastro um novo cliente?",
        a: "Na página de Clientes, clique em 'Novo Cliente' e preencha as informações como nome, telefone, e-mail, CPF, data de nascimento, endereço e cidade.",
      },
      {
        q: "O que é o alerta de 'Cadastro Incompleto'?",
        a: "Clientes sem e-mail ou data de nascimento são sinalizados com uma tag azul 'CADASTRO INCOMPLETO', facilitando a identificação de perfis que precisam ser atualizados.",
      },
      {
        q: "O que posso ver no perfil do cliente?",
        a: "O perfil é organizado em abas: 'Resumo' para edição dos dados cadastrais e 'Histórico' com uma linha do tempo cronológica de todos os agendamentos realizados.",
      },
      {
        q: "É possível preencher fichas de anamnese?",
        a: "Sim. Cada cliente possui uma área de prontuário onde é possível preencher fichas de anamnese dinâmicas, com campos configuráveis e assinatura eletrônica.",
      },
    ],
  },
  {
    category: "Prontuários",
    questions: [
      {
        q: "O que são os prontuários?",
        a: "Os prontuários reúnem o histórico clínico dos pacientes, exibindo todos os atendimentos realizados (status 'Atendido') com data, profissional responsável e informações associadas.",
      },
      {
        q: "Quem pode acessar os prontuários?",
        a: "Cada profissional acessa apenas seus próprios prontuários. Gestores podem visualizar os prontuários de todos os profissionais.",
      },
    ],
  },
  {
    category: "Financeiro",
    questions: [
      {
        q: "Que informações estão no módulo financeiro?",
        a: "O módulo financeiro exibe relatórios com gráficos de faturamento por período, comparativo anual, distribuição por método de pagamento e por profissional. É possível filtrar por data, profissional e período personalizado.",
      },
      {
        q: "É possível exportar os relatórios?",
        a: "Sim. Os relatórios podem ser exportados em formato Excel (.xlsx) ou PDF para uso externo.",
      },
      {
        q: "O financeiro é individualizado?",
        a: "Sim. Cada profissional visualiza apenas seus próprios registros financeiros. Gestores têm acesso ao financeiro consolidado.",
      },
    ],
  },
  {
    category: "Configurações",
    questions: [
      {
        q: "O que posso configurar no sistema?",
        a: "Nas Configurações você gerencia: Profissionais (cadastro e ativação), Serviços (nome, categoria, preço base e duração), Vínculos (associação entre profissionais e serviços com preço personalizado) e Templates de Anamnese (fichas dinâmicas com campos configuráveis).",
      },
      {
        q: "Quem pode acessar as configurações?",
        a: "Apenas usuários com papel de Gestor têm acesso às configurações de profissionais, serviços e vínculos.",
      },
    ],
  },
  {
    category: "Perfis e Permissões",
    questions: [
      {
        q: "Quais são os papéis disponíveis?",
        a: "O sistema possui dois papéis: Gestor (administrador com acesso total) e Profissional (acesso restrito aos seus próprios dados, agendamentos, prontuários e financeiro).",
      },
      {
        q: "Como funciona a conta administradora?",
        a: "A conta principal funciona como administradora (Gestor), permitindo criar e gerenciar contas de profissionais, visualizar todos os dados e configurar o sistema.",
      },
    ],
  },
  {
    category: "Segurança e Acesso",
    questions: [
      {
        q: "Como faço login no sistema?",
        a: "Acesse a página de login com seu e-mail e senha cadastrados. Caso esqueça sua senha, utilize a opção 'Esqueci minha senha' para receber um link de recuperação por e-mail.",
      },
      {
        q: "Os dados são protegidos?",
        a: "Sim. Todas as tabelas possuem políticas de segurança a nível de linha (RLS), garantindo que cada usuário acesse apenas seus próprios dados conforme seu papel no sistema.",
      },
    ],
  },
];

const FaqPage = () => {
  return (
    <div className="flex flex-col h-full overflow-auto">
      <div className="px-8 pt-8 pb-2">
        <h1 className="text-2xl font-display font-bold">Perguntas Frequentes</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Tudo o que você precisa saber sobre os recursos do sistema.
        </p>
      </div>

      <div className="mx-8 h-[1.5px] bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

      <div className="px-8 py-6 max-w-3xl space-y-8">
        {faqItems.map((section) => (
          <div key={section.category}>
            <div className="flex items-center gap-2 mb-3">
              <HelpCircle className="w-4 h-4 text-primary" />
              <h2 className="text-base font-semibold">{section.category}</h2>
            </div>
            <Accordion type="multiple" className="space-y-2">
              {section.questions.map((item, idx) => (
                <AccordionItem
                  key={idx}
                  value={`${section.category}-${idx}`}
                  className="border border-border/60 rounded-lg px-4"
                >
                  <AccordionTrigger className="text-sm font-medium hover:no-underline">
                    {item.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-sm text-muted-foreground leading-relaxed">
                    {item.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FaqPage;
