# Painel Marli Cosméticos - Sistema de Gestão de Agenda

Este projeto é uma plataforma personalizada para a clínica **Marli Cosméticos**, integrando um painel administrativo para gestão de consultas e uma IA recepcionista (Marcia) que atende via WhatsApp.

## 🚀 Arquitetura do Sistema

O ecossistema é composto por três pilares principais:

1.  **Frontend (React + Vite)**:
    *   Painel administrativo para visualização da agenda em tempo real.
    *   Gestão de profissionais, serviços e bloqueios de horário.
    *   Interface premium com design focado em experiência do usuário.
2.  **Backend & Banco de Dados (Supabase)**:
    *   **PostgreSQL**: Armazenamento central de agendamentos, clientes e configurações.
    *   **Edge Functions & Auth**: Segurança e lógica de servidor.
3.  **Automação & IA (n8n + Marcia)**:
    *   Fluxo de atendimento automático via WhatsApp.
    *   A IA **Marcia** consulta a disponibilidade diretamente no Supabase e realiza os agendamentos sem intervenção humana.

## 🛠️ Tecnologias Utilizadas

*   **Core**: React 18, TypeScript, Vite.
*   **Styling**: Tailwind CSS, shadcn/ui.
*   **Banco de Dados**: Supabase (PostreSQL).
*   **IA/Automação**: n8n, LangChain (Agente de Calendário).

## 📅 Funcionalidades Principais

*   **Agenda Dinâmica**: Visualização por dia/semana com status coloridos.
*   **Bloqueios de Agenda**: Sistema de ausência profissional (exibido em preto) que impede agendamentos indevidos.
*   **IA Recepcionista**: Atendimento humano, validação de horários passados e priorização de especialistas.
*   **Gestão de Clientes**: Histórico de consultas e base de dados integrada.

## 💻 Desenvolvimento Local

1.  Instale as dependências:
    ```sh
    npm install
    ```
2.  Inicie o servidor de desenvolvimento:
    ```sh
    npm run dev
    ```

## 🔒 Segurança

O projeto utiliza variáveis de ambiente para conexão com o Supabase. Certifique-se de configurar o arquivo `.env` com suas credenciais para que o painel funcione corretamente.

---
*Projeto proprietário desenvolvido para Marli Cosméticos.*
