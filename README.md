# Marli Cosméticos - Management and Automated Scheduling System

A full-stack enterprise solution developed to streamline clinical operations for Marli Cosméticos. The system integrates a high-performance administrative dashboard with an automated AI-driven receptionist capable of managing complex scheduling logic via WhatsApp.

## System Architecture

The ecosystem is built upon a distributed architecture to ensure scalability, data integrity, and real-time synchronization:

1.  **Frontend (React & TypeScript)**:
    *   Developed with Vite for optimized build performance.
    *   Features a comprehensive administrative dashboard for real-time agenda management.
    *   Implements complex UI state management for professional availability, service mapping, and visual scheduling blocks.
    *   Utilizes Tailwind CSS and shadcn/ui for a highly responsive and professional interface.

2.  **Backend & Persistence (Supabase)**:
    *   **PostgreSQL**: Serves as the single source of truth for all clinical data, including appointments, client profiles, and professional configurations.
    *   **Real-time Capabilities**: Leverages Supabase real-time subscriptions to keep the administrative dashboard synchronized across multiple sessions.
    *   **Security**: Implements Row Level Security (RLS) to ensure data isolation and secure access.

3.  **Automation & AI Integration (n8n & LangChain)**:
    *   **Automated Scheduling**: An n8n-hosted workflow acts as the bridge between WhatsApp and the database.
    *   **AI Agent (Marcia)**: Built using LangChain, the agent processes natural language intent to perform CRUD operations on the appointment table.
    *   **Business Logic**: The system enforces strict scheduling rules, including professional-specific blocking, time-zone anchoring (Brasília), and multi-specialist availability checks.

## Key Technical Features

*   **Conflict Resolution Engine**: A custom-built utility that validates overlapping appointments and respects predefined professional unavailability blocks.
*   **Dynamic Service-Professional Mapping**: Intelligent logic that identifies the correct professional based on service requirements and real-time availability.
*   **Data Integrity**: Transitioned from third-party calendar dependencies to a centralized database-first approach to eliminate synchronization latency.
*   **User Experience**: Optimized for high-traffic environments with intuitive status tracking (Confirmed, In-Progress, Cancelled, etc.).

## Technology Stack

*   **Languages**: TypeScript, JavaScript.
*   **Frameworks**: React 18, Vite.
*   **Styles**: Tailwind CSS, PostCSS.
*   **Database**: Supabase / PostgreSQL.
*   **Automation**: n8n, LangChain, WhatsApp API integration.

## Local Development

1.  Install dependencies:
    ```bash
    npm install
    ```
2.  Launch development server:
    ```bash
    npm run dev
    ```

## Environment Configuration

The application requires environment variables for Supabase integration (`VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`). Ensure these are correctly set in a `.env` file for full functionality.

---
*Proprietary project developed for clinical orchestration and automated customer engagement.*
