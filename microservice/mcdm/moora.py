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
        in_list = False
        
        for line in lines:
            line = line.strip()
            if line == "metric_list = [":
                in_list = True
                continue
            elif line == "]":
                in_list = False
                continue
                
            if in_list and line:
                line = line.rstrip(',').strip('()')
                if line:
                    parts = line.split(',')
                    if len(parts) >= 2:
                        name = parts[0].strip().strip("'\"")
                        value = float(parts[1].strip())
                        metrics.append((name, value))
            elif ':' in line:
                name, value = line.split(':')
                metrics.append((name.strip(), float(value.strip())))
    return metrics

def calculate_moora(metrics):
    # Normalize and calculate weighted sum
    benefit_sum = 0
    cost_sum = 0
    
    for metric in metrics:
        # Normalize
        if metric.is_benefit:
            normalized = (metric.value - metric.min_range) / (metric.max_range - metric.min_range)
            benefit_sum += normalized * metric.weight
        else:
            normalized = (metric.max_range - metric.value) / (metric.max_range - metric.min_range)
            cost_sum += normalized * metric.weight
            
    return benefit_sum - cost_sum

def write_detailed_results(ranked_scores, output_file="moora_results.txt"):
    with open(output_file, 'w') as f:
        f.write("MOORA Analysis Results\n")
        f.write("======================\n\n")
        
        f.write("Metric Interpretations:\n")
        f.write("- ALCOM (Algorithmic Complexity): Lower is better - Measures code complexity\n")
        f.write("- ARQ (Architecture Quality): Lower is better - Measures architectural dependencies\n")
        f.write("- NOO (Number of Operations): Lower is better - Measures API size\n")
        f.write("- CC (Cyclomatic Complexity): Lower is better - Measures code complexity\n")
        f.write("- MI (Maintainability Index): Higher is better - Measures maintainability\n")
        f.write("- SAM (Software Architecture Modularity): Higher is better - Measures modularity\n")
        f.write("- SGM (Structural Gap Metric): Higher is better - Measures structural quality\n")
        f.write("- SIDC (Service Interface Data Cohesion): Higher is better - Measures interface cohesion\n\n")
        
        f.write("Rankings:\n")
        for rank, (microservice, score) in enumerate(ranked_scores, start=1):
            f.write(f"\n{rank}. Microservice {microservice}\n")
            f.write(f"   MOORA Score: {score:.4f}\n")
            f.write("   Interpretation: ")
            if score >= 0.5:
                f.write("Excellent balance of benefits and costs\n")
            elif score >= 0:
                f.write("Good balance of benefits and costs\n")
            elif score >= -0.5:
                f.write("Fair balance of benefits and costs\n")
            else:
                f.write("Needs improvement in benefit-cost ratio\n")

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

# Calculate MOORA scores
file_paths = ["metrics1.txt", "metrics2.txt", "metrics3.txt", "metrics4.txt", "metrics5.txt", "metrics6.txt"]
scores = []

for i, file_path in enumerate(file_paths):
    raw_metrics = read_metrics(file_path)
    metrics = [Metric(name, value, *metric_definitions[name]) for name, value in raw_metrics]
    score = calculate_moora(metrics)
    scores.append((i + 1, score))

# Rank solutions
ranked_scores = sorted(scores, key=lambda x: x[1], reverse=True)

# Write detailed results
write_detailed_results(ranked_scores)

# Print results
print("\nRanking of microservices based on MOORA scores:")
for rank, (microservice, score) in enumerate(ranked_scores, start=1):
    print(f"{rank}. Microservice {microservice} with score: {score:.4f}")