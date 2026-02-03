import sqlite3
import os

# Check for database file
db_file = 'sql_app.db'
if not os.path.exists(db_file):
    print(f"Error: {db_file} not found in {os.getcwd()}")
    # Try looking for sql_main.db just in case
    if os.path.exists('sql_main.db'):
        db_file = 'sql_main.db'
        print(f"Found {db_file} instead.")
    else:
        exit(1)

def inspect_db():
    try:
        conn = sqlite3.connect(db_file)
        cursor = conn.cursor()
        
        # Get all tables
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
        tables = cursor.fetchall()
        
        if not tables:
            print(f"No tables found in {db_file}.")
            return

        print(f"Found {len(tables)} tables in '{db_file}':\n")
        
        for table in tables:
            table_name = table[0]
            print(f"=== Table: {table_name} ===")
            
            # Get columns
            cursor.execute(f"PRAGMA table_info({table_name})")
            columns = cursor.fetchall()
            # col[1] is name, col[2] is type
            col_names = [col[1] for col in columns]
            col_details = [f"{col[1]} ({col[2]})" for col in columns]
            print(f"Columns: {', '.join(col_details)}")
            
            # Get row count
            cursor.execute(f"SELECT COUNT(*) FROM {table_name}")
            count = cursor.fetchone()[0]
            print(f"Total Rows: {count}")
            
            # Get first 5 rows
            if count > 0:
                print("Sample Data (First 5 rows):")
                cursor.execute(f"SELECT * FROM {table_name} LIMIT 5")
                rows = cursor.fetchall()
                
                # Print header
                print(f"  {str(col_names)}")
                for row in rows:
                    print(f"  {row}")
            else:
                print("  (Table is empty)")
                
            print("-" * 30)
            
        conn.close()
    except Exception as e:
        print(f"Error inspecting database: {e}")

if __name__ == "__main__":
    inspect_db()
