import os
import json

def combine_json_files(output_file="combined.json"):
    combined_data = []
    current_directory = os.getcwd()  # Mendapatkan direktori saat ini

    # Loop melalui semua file di direktori saat ini
    for root, dirs, files in os.walk(current_directory):
        for file in files:
            if file.endswith(".json"):
                file_path = os.path.join(root, file)
                
                # Membaca dan memuat data JSON dari setiap file
                with open(file_path, 'r', encoding='utf-8') as f:
                    try:
                        data = json.load(f)
                        combined_data.append(data)
                    except json.JSONDecodeError:
                        print(f"Skipping invalid JSON file: {file_path}")

    # Menulis data JSON gabungan ke file output
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(combined_data, f, ensure_ascii=False, indent=4)

    print(f"Combined JSON data saved to {output_file}")

# Jalankan fungsi
combine_json_files()

