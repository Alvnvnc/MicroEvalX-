class Metric:
    def __init__(self, name, value, min_range, max_range, is_benefit, weight):
        self.name = name
        self.value = value
        self.min_range = min_range
        self.max_range = max_range
        self.is_benefit = is_benefit
        self.weight = weight

def read_metrics(file_path):
    """Fungsi untuk membaca data metrik dari file teks"""
    metrics = []
    with open(file_path, 'r') as f:
        lines = f.readlines()
        for line in lines:
            line = line.strip()
            if ':' in line:
                name, value = line.split(':')
                metrics.append((name.strip(), float(value.strip())))
    return metrics

def normalize_metrics_with_benefit_cost(metrics_list):
    """Fungsi untuk menghitung normalisasi metrics dengan benefit dan cost terpisah"""
    n_alternatives = len(metrics_list)
    n_criteria = len(metrics_list[0])

    weighted_metrics = []
    for i in range(n_alternatives):
        weighted_row = []
        for j in range(n_criteria):
            metric = metrics_list[i][j]
            if metric.is_benefit:
                normalized_value = (metric.value - metric.min_range) / (metric.max_range - metric.min_range)
            else:
                normalized_value = (metric.max_range - metric.value) / (metric.max_range - metric.min_range)
            weighted_value = normalized_value * metric.weight
            weighted_row.append(weighted_value)
        weighted_metrics.append(weighted_row)

    print("Weighted Metrics (after applying weights):")
    for row in weighted_metrics:
        print(row)

    return weighted_metrics

def calculate_edas(normalized_metrics, is_benefit_list):
    """
    Calculate EDAS based on spreadsheet implementation
    """
    n_alternatives = len(normalized_metrics)
    n_criteria = len(normalized_metrics[0])
    
    # Calculate average solution (AV)
    averages = []
    for j in range(n_criteria):
        column_sum = sum(normalized_metrics[i][j] for i in range(n_alternatives))
        averages.append(column_sum / n_alternatives)
    
    print("\nAverage Solution (AV):")
    print(averages)
    
    # Calculate PDA and NDA
    pda = [[0] * n_criteria for _ in range(n_alternatives)]
    nda = [[0] * n_criteria for _ in range(n_alternatives)]
    
    for i in range(n_alternatives):
        for j in range(n_criteria):
            value = normalized_metrics[i][j]
            avg = averages[j]
            
            if is_benefit_list[j]:
                if value >= avg:
                    pda[i][j] = (value - avg) / avg if avg != 0 else 0
                else:
                    nda[i][j] = (avg - value) / avg if avg != 0 else 0
            else:
                if value <= avg:
                    pda[i][j] = (avg - value) / avg if avg != 0 else 0
                else:
                    nda[i][j] = (value - avg) / avg if avg != 0 else 0
    
    print("\nPDA (Positive Distance from Average):")
    for row in pda:
        print(row)
        
    print("\nNDA (Negative Distance from Average):")
    for row in nda:
        print(row)
    
    # Calculate SP and SN
    sp = []
    sn = []
    for i in range(n_alternatives):
        sp_sum = sum(pda[i])  # Weight already applied in normalization
        sn_sum = sum(nda[i])  # Weight already applied in normalization
        sp.append(sp_sum)
        sn.append(sn_sum)
    
    print("\nSP (Sum of PDA):", sp)
    print("SN (Sum of NDA):", sn)
    
    # Calculate NSP and NSN
    max_sp = max(sp)
    max_sn = max(sn)
    
    nsp = [sp_i / max_sp if max_sp != 0 else 0 for sp_i in sp]
    nsn = [1 - (sn_i / max_sn) if max_sn != 0 else 1 for sn_i in sn]
    
    # Calculate Appraisal Score (AS)
    as_scores = [(nsp[i] + nsn[i]) / 2 for i in range(n_alternatives)]
    
    # Calculate Rankings (lower rank number is better)
    rankings = list(range(len(as_scores)))
    rankings.sort(key=lambda x: as_scores[x], reverse=True)
    final_ranks = [0] * len(rankings)
    for rank, pos in enumerate(rankings, 1):
        final_ranks[pos] = rank
    
    return {
        'SP': sp,
        'SN': sn,
        'NSP': nsp,
        'NSN': nsn,
        'AS': as_scores,
        'Rankings': final_ranks
    }

# Define metric parameters
metric_definitions = {
    "mi": (0, 100, True, 0.125),
    "noo": (1, 1000, False, 0.125),
    "alcom": (0, 1, False, 0.125),
    "cc": (1, 1000, False, 0.125),
    "arq": (0, 0.1, False, 0.125),
    "sidc": (0, 1, True, 0.125),
    "sgm": (0, 50, True, 0.125),
    "sam": (-1, 1, False, 0.125)
}

is_benefit_list = [
    True,   # MI
    False,  # NOO
    False,  # ALCOM
    False,  # CC
    False,  # ARQ
    True,   # SIDC
    True,   # SGM
    False   # SAM
]

# File paths untuk microservices
file_paths = ["metrics1.txt", "metrics2.txt", "metrics3.txt", "metrics4.txt", "metrics5.txt", "metrics6.txt"]
all_metrics = []

# Membaca data dari setiap file
for file_path in file_paths:
    raw_metrics = read_metrics(file_path)
    metrics = [Metric(name, value, *metric_definitions[name]) for name, value in raw_metrics]
    all_metrics.append(metrics)

# Normalisasi metrics dengan Benefit/Cost dan Weight
normalized_metrics = normalize_metrics_with_benefit_cost(all_metrics)

# Calculate EDAS
results = calculate_edas(normalized_metrics, is_benefit_list)

# Print final results
print("\nFinal Results for each microservice:")
for i in range(len(all_metrics)):
    print(f"\nMicroservice {i+1}:")
    print(f"SP: {results['SP'][i]:.4f}")
    print(f"SN: {results['SN'][i]:.4f}")
    print(f"NSP: {results['NSP'][i]:.4f}")
    print(f"NSN: {results['NSN'][i]:.4f}")
    print(f"Appraisal Score: {results['AS'][i]:.4f}")
    print(f"Rank: {results['Rankings'][i]}")

# Save results to file
with open("edas_results.txt", "w") as f:
    f.write("EDAS Results\n\n")
    for i in range(len(all_metrics)):
        f.write(f"Microservice {i+1}:\n")
        f.write(f"SP: {results['SP'][i]:.4f}\n")
        f.write(f"SN: {results['SN'][i]:.4f}\n")
        f.write(f"NSP: {results['NSP'][i]:.4f}\n")
        f.write(f"NSN: {results['NSN'][i]:.4f}\n")
        f.write(f"Appraisal Score: {results['AS'][i]:.4f}\n")
        f.write(f"Rank: {results['Rankings'][i]}\n\n")