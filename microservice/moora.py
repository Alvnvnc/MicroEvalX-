import math

# Definition of Metric class for structured metric data
class Metric:
    def __init__(self, name, value, weight, min_range, max_range, is_benefit):
        self.name = name
        self.value = value
        self.weight = weight
        self.min_range = min_range
        self.max_range = max_range
        self.is_benefit = is_benefit

# Function to normalize and weight metrics as per the approach used in TOPSIS
def normalize_and_weight_metrics(metrics):
    normalized_metrics = []
    for metric in metrics:
        # Normalizing according to benefit or cost
        if metric.is_benefit:
            normalized_value = (metric.value - metric.min_range) / (metric.max_range - metric.min_range)
        else:
            normalized_value = (metric.max_range - metric.value) / (metric.max_range - metric.min_range)
        
        # Applying the weight
        weighted_normalized_value = normalized_value * metric.weight
        normalized_metrics.append(Metric(metric.name, weighted_normalized_value, metric.weight, metric.min_range, metric.max_range, metric.is_benefit))
        
        # Display normalized and weighted values for debugging
        print(f"Metric: {metric.name}, Original Value: {metric.value}, "
              f"Normalized Value: {normalized_value}, Weighted Normalized Value: {weighted_normalized_value}")
        
    return normalized_metrics

# Function to calculate MOORA scores
def calculate_moora(alternatives):
    moora_scores = []
    for alt in alternatives:
        # Sum up the benefit values and cost values
        benefit_sum = sum(metric.value for metric in alt if metric.is_benefit)
        cost_sum = sum(metric.value for metric in alt if not metric.is_benefit)
        
        # Calculate the MOORA score as the difference between benefit and cost
        moora_score = benefit_sum - cost_sum
        moora_scores.append(moora_score)
    return moora_scores

# Define example metrics for two microservices (raw values, with weights, min/max range, and type)
metrics_microservice_1 = [
    Metric("mi", 54.02750229640081, 0.125, 0, 100, True),
    Metric("noo", 713, 0.125, 1, 1000, False),
    Metric("alcom", 0.6849018705821985, 0.125, 0, 1, False),
    Metric("cc", 98, 0.125, 1, 1000, False),
    Metric("arq", 0.002805049088359046, 0.125, 0, 0.1, False),
    Metric("sidc", 0.02857142857142857, 0.125, 0, 1, True),
    Metric("sgm", 35.79445581981415, 0.125, 0, 50, True),
    Metric("sam", -0.19999999999999996, 0.125, -1, 1, False)
]

metrics_microservice_2 = [
    Metric("mi", 64, 0.125, 0, 100, True),
    Metric("noo", 687, 0.125, 1, 1000, False),
    Metric("alcom", 0.704870582198, 0.125, 0, 1, False),
    Metric("cc", 112, 0.125, 1, 1000, False),
    Metric("arq", 0.003205049088, 0.125, 0, 0.1, False),
    Metric("sidc", 0.02967142857, 0.125, 0, 1, True),
    Metric("sgm", 37.79445582, 0.125, 0, 50, True),
    Metric("sam", -0.17999999999999, 0.125, -1, 1, False)
]

# Step 1: Normalize and weight the metrics
print("Normalized and Weighted Metrics for Microservice 1:")
normalized_metrics_1 = normalize_and_weight_metrics(metrics_microservice_1)

print("\nNormalized and Weighted Metrics for Microservice 2:")
normalized_metrics_2 = normalize_and_weight_metrics(metrics_microservice_2)

# Group normalized metrics for MOORA calculation
alternatives = [normalized_metrics_1, normalized_metrics_2]

# Step 2: Calculate MOORA scores
moora_scores = calculate_moora(alternatives)

# Display results
print("\nMOORA Scores:")
for i, score in enumerate(moora_scores, start=1):
    print(f"MOORA score for Microservice {i}: {score}")

# Determine which microservice is better
if moora_scores[0] > moora_scores[1]:
    print("Microservice 1 is preferred based on MOORA.")
elif moora_scores[1] > moora_scores[0]:
    print("Microservice 2 is preferred based on MOORA.")
else:
    print("Both Microservices are equally preferred based on MOORA.")
