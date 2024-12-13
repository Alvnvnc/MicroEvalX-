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
                # Handle tuple format
                line = line.rstrip(',').strip('()')
                if line:
                    parts = line.split(',')
                    if len(parts) >= 2:
                        name = parts[0].strip().strip("'\"")
                        value = float(parts[1].strip())
                        metrics.append((name, value))
            elif ':' in line:  # Handle key-value format
                name, value = line.split(':')
                metrics.append((name.strip(), float(value.strip())))
    return metrics

def calculateTOPSIS(metrics):
    # Step 1: Normalizing the values
    normalized_values = []
    for metric in metrics:
        if metric.is_benefit:
            normalized = (metric.value - metric.min_range) / (metric.max_range - metric.min_range)
        else:
            normalized = (metric.max_range - metric.value) / (metric.max_range - metric.min_range)
        normalized_values.append(normalized)
    
    # Step 2: Weighting the normalized values
    weighted_normalized = [normalized * metric.weight for normalized, metric in zip(normalized_values, metrics)]
    
    # Step 3: Determining positive and negative ideal solutions
    positive_ideal = max(weighted_normalized)
    negative_ideal = min(weighted_normalized)
    
    # Step 4: Calculating distance to the ideal solutions
    positive_distance = math.sqrt(sum((value - positive_ideal) ** 2 for value in weighted_normalized))
    negative_distance = math.sqrt(sum((value - negative_ideal) ** 2 for value in weighted_normalized))
    
    # Step 5: Calculating the TOPSIS score
    if positive_distance + negative_distance == 0:
        return 0
    return negative_distance / (positive_distance + negative_distance)

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

# Calculate TOPSIS scores
file_paths = ["metrics1.txt", "metrics2.txt", "metrics3.txt", "metrics4.txt", "metrics5.txt", "metrics6.txt"]
scores = []

for i, file_path in enumerate(file_paths):
    raw_metrics = read_metrics(file_path)
    metrics = [Metric(name, value, *metric_definitions[name]) for name, value in raw_metrics]
    score = calculateTOPSIS(metrics)
    scores.append((i + 1, score))

# Rank solutions
ranked_scores = sorted(scores, key=lambda x: x[1], reverse=True)

def write_detailed_results(ranked_scores, metrics_data, output_file="topsis_results.txt"):
    with open(output_file, 'w') as f:
        f.write("TOPSIS Analysis Results\n")
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
            f.write(f"   TOPSIS Score: {score:.4f}\n")
            f.write("   Interpretation: ")
            if score >= 0.7:
                f.write("Excellent overall quality\n")
            elif score >= 0.5:
                f.write("Good overall quality\n")
            elif score >= 0.3:
                f.write("Fair overall quality\n")
            else:
                f.write("Needs improvement\n")

def write_detailed_results(ranked_scores, output_file="topsis_results.txt"):
    with open(output_file, 'w') as f:
        f.write("TOPSIS Analysis Results\n")
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
            f.write(f"   TOPSIS Score: {score:.4f}\n")
            f.write("   Interpretation: ")
            if score >= 0.7:
                f.write("Excellent overall quality\n")
            elif score >= 0.5:
                f.write("Good overall quality\n")
            elif score >= 0.3:
                f.write("Fair overall quality\n")
            else:
                f.write("Needs improvement\n")

# Replace the old function call with:
write_detailed_results(ranked_scores)
# Print results
print("\nRanking of microservices based on TOPSIS scores:")
for rank, (microservice, score) in enumerate(ranked_scores, start=1):
    print(f"{rank}. Microservice {microservice} with score: {score:.4f}")