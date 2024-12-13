import math

class Metric:
    def __init__(self, name, value, weight, min_range, max_range, is_benefit):
        self.name = name
        self.value = value
        self.weight = weight
        self.min_range = min_range
        self.max_range = max_range
        self.is_benefit = is_benefit

def read_metrics(file_path):
    metrics = []
    with open(file_path, 'r') as f:
        lines = f.readlines()
        for line in lines:
            line = line.strip()
            if ':' in line:
                name, value = line.split(':')
                metrics.append((name.strip(), float(value.strip())))
    return metrics

def calculateEDAS(metrics_list):
    n_alternatives = len(metrics_list)
    n_criteria = len(metrics_list[0])
    
    # Calculate average solution
    avg_values = []
    for j in range(n_criteria):
        avg = sum(metrics[j].value for metrics in metrics_list) / n_alternatives
        avg_values.append(avg)
    
    # Calculate PDA and NDA
    pda = [[0] * n_criteria for _ in range(n_alternatives)]
    nda = [[0] * n_criteria for _ in range(n_alternatives)]
    
    for i in range(n_alternatives):
        for j in range(n_criteria):
            metric = metrics_list[i][j]
            if metric.is_benefit:
                if metric.value >= avg_values[j]:
                    pda[i][j] = (metric.value - avg_values[j]) / avg_values[j]
                else:
                    nda[i][j] = (avg_values[j] - metric.value) / avg_values[j]
            else:
                if metric.value <= avg_values[j]:
                    pda[i][j] = (avg_values[j] - metric.value) / avg_values[j]
                else:
                    nda[i][j] = (metric.value - avg_values[j]) / avg_values[j]
    
    # Calculate weighted sums
    sp = []
    sn = []
    for i in range(n_alternatives):
        sp_i = sum(pda[i][j] * metrics_list[i][j].weight for j in range(n_criteria))
        sn_i = sum(nda[i][j] * metrics_list[i][j].weight for j in range(n_criteria))
        sp.append(sp_i)
        sn.append(sn_i)
    
    # Normalize
    nsp = [s / max(sp) if max(sp) != 0 else 0 for s in sp]
    nsn = [1 - (s / max(sn)) if max(sn) != 0 else 1 for s in sn]
    
    # Calculate appraisal scores
    as_scores = [(nsp[i] + nsn[i]) / 2 for i in range(n_alternatives)]
    
    return as_scores

# Define metric parameters
metric_definitions = {
    "alcom": (0.125, 0, 1, False),
    "arq": (0.125, 0, 0.1, False),
    "noo": (0.125, 1, 1000, False),
    "cc": (0.125, 1, 1000, False),
    "mi": (0.125, 0, 100, True),
    "sam": (0.125, -1, 1, False),
    "sgm": (0.125, 0, 50, True),
    "sidc": (0.125, 0, 1, True)
}

# Read metrics files
file_paths = ["metrics1.txt", "metrics2.txt", "metrics3.txt", "metrics4.txt", "metrics5.txt", "metrics6.txt"]
all_metrics = []

for file_path in file_paths:
    raw_metrics = read_metrics(file_path)
    metrics = [Metric(name, value, *metric_definitions[name]) for name, value in raw_metrics]
    all_metrics.append(metrics)

# Calculate EDAS scores
edas_scores = [(i+1, score) for i, score in enumerate(calculateEDAS(all_metrics))]
ranked_scores = sorted(edas_scores, key=lambda x: x[1], reverse=True)

def write_detailed_results(ranked_scores, output_file="edas_results.txt"):
    with open(output_file, 'w') as f:
        f.write("EDAS Analysis Results\n")
        f.write("===================\n\n")
        
        f.write("Metric Interpretations:\n")
        f.write("- ALCOM (Algorithmic Complexity): Lower is better - Measures code complexity\n")
        f.write("- ARQ (Architecture Quality): Lower is better - Measures architectural dependencies\n")
        f.write("- NOO (Number of Operations): Lower is better - Measures API size\n")
        f.write("- CC (Cyclomatic Complexity): Lower is better - Measures code complexity\n")
        f.write("- MI (Maintainability Index): Higher is better - Measures maintainability\n")
        f.write("- SAM (Software Architecture Modularity): Lower is better - Measures modularity\n")
        f.write("- SGM (Structural Gap Metric): Higher is better - Measures structural quality\n")
        f.write("- SIDC (Service Interface Data Cohesion): Higher is better - Measures interface cohesion\n\n")
        
        f.write("Rankings:\n")
        for rank, (microservice, score) in enumerate(ranked_scores, start=1):
            f.write(f"\n{rank}. Microservice {microservice}\n")
            f.write(f"   EDAS Score: {score:.4f}\n")
            f.write("   Interpretation: ")
            if score >= 0.7:
                f.write("Excellent overall quality\n")
            elif score >= 0.5:
                f.write("Good overall quality\n")
            elif score >= 0.3:
                f.write("Fair overall quality\n")
            else:
                f.write("Needs improvement\n")

# Write results to file and print to console
write_detailed_results(ranked_scores)

print("\nRanking of microservices based on EDAS scores:")
for rank, (ms, score) in enumerate(ranked_scores, start=1):
    print(f"{rank}. Microservice {ms} with score: {score:.4f}")

print("\nDetailed results have been written to 'edas_results.txt'")