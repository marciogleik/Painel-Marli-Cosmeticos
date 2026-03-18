# Supabase Import Blocked by RLS

The import of 57,767 records from `FichasDosClientes.csv` is blocked by Row Level Security policies.

## How to resolve

Please choose one of the following:

1.  **Service Role Key**: Provide the Project API Service Role Key. I will add it to `.env` as `VITE_SUPABASE_SERVICE_ROLE_KEY`.
2.  **Disable RLS**: Run this command in your Supabase SQL Editor:
    ```sql
    ALTER TABLE patient_records DISABLE ROW LEVEL SECURITY;
    ```
    *(Tell me when done, and I will re-enable it after the import)*.
