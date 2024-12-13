import os
import ast
import json
import glob
import math

# Fungsi untuk mengambil semua file dalam direktori dan subdirektorinya berdasarkan ekstensi yang diberikan
def get_files(directory, extensions):
    files = []
    for ext in extensions:
        files.extend(glob.glob(os.path.join(directory, '**', ext), recursive=True))
    return files

# Fungsi untuk membaca dan parsing kode dari file
def parse_code(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        try:
            code = f.read()
            tree = ast.parse(code)
            return extract_ast_data(tree, file_path)
        except Exception as e:
            print(f"Failed to parse {file_path}: {e}")
            return None

# Fungsi untuk mengekstrak data AST berdasarkan tipe file (JS atau TS)
def extract_ast_data(tree, file_path):
    functions = [node for node in ast.walk(tree) if isinstance(node, ast.FunctionDef)]
    classes = [node for node in ast.walk(tree) if isinstance(node, ast.ClassDef)]
    method_frequencies = [len(f.body) for f in functions]
    unique_parameters = list(set(arg.arg for f in functions for arg in f.args.args))
    total_parameters = sum(len(f.args.args) for f in functions)
    
    if file_path.endswith('.js'):
        file_type = 'JavaScript'
    elif file_path.endswith('.ts'):
        file_type = 'TypeScript'
    else:
        file_type = 'Unknown'

    return {
        'file_type': file_type,
        'functions': functions,
        'classes': classes,
        'lines_of_code': sum(1 for node in ast.walk(tree) if isinstance(node, ast.Expr)),
        'method_frequencies': method_frequencies,
        'total_parameters': total_parameters,
        'unique_parameters': unique_parameters,
        'edges': calculate_edges(tree),
        'nodes': calculate_nodes(tree),
        'dependencies': extract_dependencies(tree)
    }

# Fungsi untuk menghitung edges dalam control flow graph untuk cyclomatic complexity
def calculate_edges(tree):
    # Hitung edges dari AST
    return len([node for node in ast.walk(tree) if isinstance(node, (ast.If, ast.For, ast.While))])

# Fungsi untuk menghitung nodes dalam control flow graph
def calculate_nodes(tree):
    # Hitung nodes dari AST
    return len([node for node in ast.walk(tree) if isinstance(node, (ast.FunctionDef, ast.ClassDef, ast.Module))])

# Fungsi untuk mengekstrak dependensi eksternal dari AST (contoh sederhana)
def extract_dependencies(tree):
    imports = [node for node in ast.walk(tree) if isinstance(node, ast.Import) or isinstance(node, ast.ImportFrom)]
    return len(imports)

# Fungsi untuk menghitung berbagai metrik kualitas kode
def calculate_metrics(code_data):
    total_functions_methods = len(code_data['functions'])
    total_classes = len(code_data['classes'])
    inheritance_depth = 1  # Hitung dari hubungan antar kelas
    external_dependencies = code_data['dependencies']

    # ARQ: Availability and Reliability Quotient (asumsi semua request dan times diambil)
    total_service_config_time = 1
    total_issue_resolving_time = 1
    total_service_requests = max(total_functions_methods, 1)
    arq = (total_service_config_time + total_issue_resolving_time) / total_service_requests

    # NOO: Number of Operations Per Microservice
    noo = total_functions_methods

    # SIDC: Service Interface Data Complexity
    sidc = inheritance_depth / max(total_classes, 1)

    # SAM: Service Autonomy Metric
    sam = 1 - (external_dependencies / max(total_classes, 1))

    # SGM: Service Granularity Metric
    dgs = calculate_dgs(code_data)
    fgs = calculate_fgs(code_data)
    sgm = dgs * fgs

    # LCOM: Lack of Cohesion of Methods
    lcom = calculate_lcom(code_data)

    # ALCOM: Average LCOM
    alcom = lcom / max(total_classes, 1)

    # CC: Cyclomatic Complexity
    cc = calculate_cyclomatic_complexity(code_data)

    # MI: Maintainability Index
    loc = code_data.get('lines_of_code', 1)
    halstead_volume = calculate_halstead_volume(code_data)
    mi = max(0, (171 - 5.2 * math.log(halstead_volume) - 0.23 * cc - 16.2 * math.log(loc)) * 100 / 171)

    return {
        'ARQ': arq,
        'NOO': noo,
        'SIDC': sidc,
        'SAM': sam,
        'SGM': sgm,
        'LCOM': lcom,
        'ALCOM': alcom,
        'CC': cc,
        'MI': mi
    }

# Fungsi untuk menghitung Data Granularity of Service
def calculate_dgs(code_data):
    ipr = len(code_data['unique_parameters']) / max(len(code_data['functions']), 1)
    opr = len(code_data['method_frequencies']) / max(len(code_data['classes']), 1)
    return ipr + opr

# Fungsi untuk menghitung Functional Granularity of Service
def calculate_fgs(code_data):
    operation_types = len(set([f.name for f in code_data['functions']]))  # Hitung jenis operasi unik
    return operation_types / max(len(code_data['classes']), 1)

# Fungsi untuk menghitung LCOM (Lack of Cohesion of Methods)
def calculate_lcom(code_data):
    mf = sum(code_data.get('method_frequencies', []))
    n = code_data.get('total_parameters', 1)
    m = len(code_data['functions'])
    f = len(set(code_data.get('unique_parameters', [])))
    return 1 - ((mf / n) / (m * f))

# Fungsi untuk menghitung Cyclomatic Complexity
def calculate_cyclomatic_complexity(code_data):
    edges = code_data['edges']
    nodes = code_data['nodes']
    connected_components = 1  # Misalnya kita hanya memiliki 1 komponen terhubung
    return edges - nodes + 2 * connected_components

# Fungsi untuk menghitung Halstead Volume
def calculate_halstead_volume(code_data):
    # Kalkulasi Halstead volume berdasarkan token dalam AST
    n1 = len(set([node for node in ast.walk(code_data) if isinstance(node, ast.Name)]))
    n2 = len([node for node in ast.walk(code_data) if isinstance(node, ast.Constant)])
    n = n1 + n2
    n_hat = n1 * math.log(n2 + 1)  # Jumlah operand dan operator
    return n_hat

# Fungsi untuk menyimpan hasil analisis ke dalam file JSON
def save_results_to_json(results, output_file):
    with open(output_file, 'w') as f:
        json.dump(results, f, indent=4)
    print(f"Analysis results saved to {output_file}")

# Fungsi utama untuk menganalisis direktori
def analyze_directory(directory):
    extensions = ['*.js', '*.ts']  # Ekstensi yang ingin dianalisis
    files = get_files(directory, extensions)

    results = []
    for file in files:
        print(f"Analyzing {file}...")
        code_data = parse_code(file)
        if code_data:
            metrics = calculate_metrics(code_data)
            results.append({
                'file': file,
                'metrics': metrics
            })

    return results

if __name__ == '__main__':
    directory = input("Enter the directory to analyze: ")
    results = analyze_directory(directory)
    save_results_to_json(results, 'analysis_results.json')
