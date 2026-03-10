import subprocess
import os
import sys

def run_sql_batch(batch_sql, batch_num):
    print(f"Executing batch {batch_num}...")
    try:
        # Use npx supabase db execute "SQL"
        # We need to escape double quotes in the SQL if any, but our INSERTs use single quotes.
        # However, it's safer to use a temporary file and redirect if the CLI supports it, 
        # or just pass the string.
        
        # Let's try passing directly
        process = subprocess.Popen(
            ['npx', 'supabase', 'db', 'execute', batch_sql],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True
        )
        stdout, stderr = process.communicate()
        if process.returncode != 0:
            print(f"Error in batch {batch_num}: {stderr}")
            # Optionally write failed batch to a file
            with open(f"failed_batch_{batch_num}.sql", "w") as f:
                f.write(batch_sql)
        else:
            print(f"Batch {batch_num} successful.")
    except Exception as e:
        print(f"Exception in batch {batch_num}: {e}")

def main():
    sql_file = "update_missing_services_v2.sql"
    if not os.path.exists(sql_file):
        print(f"File {sql_file} not found.")
        return

    with open(sql_file, "r") as f:
        lines = f.readlines()

    batch_size = 200
    current_batch = []
    batch_count = 0

    for i, line in enumerate(lines):
        current_batch.append(line.strip())
        if len(current_batch) >= batch_size or i == len(lines) - 1:
            batch_count += 1
            batch_sql = "\n".join(current_batch)
            run_sql_batch(batch_sql, batch_count)
            current_batch = []

    print("Batch execution finished.")

if __name__ == "__main__":
    main()
