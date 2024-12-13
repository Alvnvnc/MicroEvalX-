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
    with open(file_path, 'r') as file:
        lines = file.readlines()
        for line in lines:
            line = line.strip()
            if ':' in line:
                name, value = line.split(':')
                metrics.append((name.strip(), float(value.strip())))
    return metrics

def preference_function(diff, threshold):
    if diff <= 0:
        return 0
    return min(1, diff/threshold)

def calculatePROMETHEE(alternatives_metrics):
    n = len(alternatives_metrics)
    leaving_flow = [0] * n  # Phi+
    entering_flow = [0] * n  # Phi-
    
    # Calculate preference indices
    for i in range(n):
        for j in range(n):
            if i != j:
                preference_index = 0
                for k in range(len(alternatives_metrics[i])):
                    metric_i = alternatives_metrics[i][k]
                    metric_j = alternatives_metrics[j][k]
                    
                    # Calculate difference
                    if metric_i.is_benefit:
                        diff = metric_i.value - metric_j.value
                    else:
                        diff = metric_j.value - metric_i.value
                    
                    # Apply preference function with threshold
                    threshold = (metric_i.max_range - metric_i.min_range) * 0.2
                    pref = preference_function(diff, threshold)
                    preference_index += metric_i.weight * pref
                
                leaving_flow[i] += preference_index
                entering_flow[j] += preference_index
    
    # Calculate net flow
    n_alternatives = len(leaving_flow)
    leaving_flow = [f/(n_alternatives-1) for f in leaving_flow]
    entering_flow = [f/(n_alternatives-1) for f in entering_flow]
    net_flow = [leaving_flow[i] - entering_flow[i] for i in range(n_alternatives)]
    
    return net_flow

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

# Read all metrics files
file_paths = ["metrics1.txt", "metrics2.txt", "metrics3.txt", "metrics4.txt", "metrics5.txt", "metrics6.txt"]
all_metrics = []

for file_path in file_paths:
    raw_metrics = read_metrics(file_path)
    metrics = [Metric(name, value, *metric_definitions[name]) for name, value in raw_metrics]
    all_metrics.append(metrics)

# Calculate PROMETHEE scores
net_flows = calculatePROMETHEE(all_metrics)
scores = [(i+1, flow) for i, flow in enumerate(net_flows)]

# Rank solutions
ranked_scores = sorted(scores, key=lambda x: x[1], reverse=True)

# Print results
print("\nRanking of microservices based on PROMETHEE scores:")
for rank, (microservice, score) in enumerate(ranked_scores, start=1):
    print(f"{rank}. Microservice {microservice} with net flow: {score:.4f}")

# Write detailed results to file
with open('promethee_results.txt', 'w') as f:
    f.write("PROMETHEE Analysis Results\n")
    f.write("=========================\n\n")
    
    f.write("Metric Interpretations:\n")
    f.write("- ALCOM (Algorithmic Complexity): Lower is better\n")
    f.write("- ARQ (Architecture Quality): Lower is better\n")
    f.write("- NOO (Number of Operations): Lower is better\n")
    f.write("- CC (Cyclomatic Complexity): Lower is better\n")
    f.write("- MI (Maintainability Index): Higher is better\n")
    f.write("- SAM (Software Architecture Modularity): Lower is better\n")
    f.write("- SGM (Structural Gap Metric): Higher is better\n")
    f.write("- SIDC (Service Interface Data Cohesion): Higher is better\n\n")
    
    f.write("Rankings:\n")
    for rank, (microservice, score) in enumerate(ranked_scores, start=1):
        f.write(f"\n{rank}. Microservice {microservice}\n")
        f.write(f"   Net Flow: {score:.4f}\n")
        f.write("   Interpretation: ")
        if score > 0.3:
            f.write("Strong performer\n")
        elif score > 0:
            f.write("Average performer\n")
        elif score > -0.3:
            f.write("Below average performer\n")
        else:
            f.write("Weak performer\n")