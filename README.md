# Marli Cosméticos - Sistema de Gestão e Agendamento Automatizado

Uma solução enterprise full-stack desenvolvida para otimizar as operações clínicas da Marli Cosméticos. O sistema integra um dashboard administrativo de alta performance com uma recepcionista virtual orientada a IA, capaz de gerenciar lógicas complexas de agendamento via WhatsApp.

## Arquitetura do Sistema

O ecossistema foi construído sobre uma arquitetura distribuída para garantir escalabilidade, integridade de dados e sincronização em tempo real:

1.  **Frontend (React & TypeScript)**:
    *   Desenvolvido com Vite para otimização de performance de build.
    *   Dashboard administrativo completo para gestão de agenda em tempo real.
    *   Implementação de gerenciamento de estado complexo para disponibilidade profissional, mapeamento de serviços e bloqueios visuais de agenda.
    *   Utiliza Tailwind CSS e shadcn/ui para uma interface responsiva e de alto padrão estético.

2.  **Backend & Persistência (Supabase)**:
    *   **PostgreSQL**: Atua como fonte única de verdade para todos os dados clínicos, incluindo agendamentos, perfis de clientes e configurações profissionais.
    *   **Recursos em Tempo Real**: Utiliza subscrições real-time do Supabase para manter o dashboard sincronizado entre múltiplas sessões.
    *   **Segurança**: Implementa Row Level Security (RLS) para garantir isolamento de dados e acesso seguro.

3.  **Automação & Integração de IA (n8n)**:
    *   **Agendamento Automatizado**: Um workflow hospedado no n8n atua como ponte entre o WhatsApp e o banco de dados.
    *   **Agente de IA (Marcia)**: Hospedado em uma VPS dedicada e orquestrado via n8n, responsável por processar intenções em linguagem natural recebidas pelo WhatsApp e executar operações de agendamento no Supabase.
    *   **Regras de Negócio**: O sistema impõe regras estritas, incluindo bloqueios específicos por profissional, ancoragem de fuso horário (Brasília) e verificação de disponibilidade multi-especialista.

## Diferenciais Técnicos

*   **Motor de Resolução de Conflitos**: Utilitário customizado para validação de sobreposição de horários, respeitando bloqueios de indisponibilidade fixa.
*   **Mapeamento Dinâmico Serviço-Profissional**: Lógica inteligente que identifica o profissional adequado com base nos requisitos do serviço e disponibilidade em tempo real.
*   **Integridade de Dados**: Transição de dependências de calendários externos para uma abordagem centralizada em banco de dados, eliminando latência de sincronização.
*   **Experiência do Usuário**: Otimizado para ambientes de alto fluxo, com rastreamento intuitivo de status (Confirmado, Em Atendimento, Cancelado, etc.).

## Stack Tecnológica

*   **Linguagens**: TypeScript, JavaScript.
*   **Frameworks**: React 18, Vite.
*   **Estilização**: Tailwind CSS, PostCSS.
*   **Banco de Dados**: Supabase / PostgreSQL.
*   **Automação**: n8n, LangChain, Integração com API do WhatsApp.

## Desenvolvimento Local

1.  Instalar dependências:
    ```bash
    npm install
    ```
2.  Iniciar servidor de desenvolvimento:
    ```bash
    npm run dev
    ```

## Configuração de Ambiente

A aplicação requer variáveis de ambiente para integração com o Supabase (`VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY`). Certifique-se de configurar estas chaves em um arquivo `.env` pra garantir a funcionalidade completa.

---
Sistema desenvolvido para automação de gestão clínica, agendamento inteligente e atendimento automatizado via WhatsApp.
