class Metric:
    def __init__(self, name, value, weight, min_range, max_range, is_benefit):
        self.name = name
        self.value = value
        self.weight = weight
        self.min_range = min_range
        self.max_range = max_range
        self.is_benefit = is_benefit

# Function to normalize and weight metrics
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
    return normalized_metrics

# Function to calculate COPRAS
def calculate_copras(alternatives):
    # Step 1: Calculate total benefit and cost for each alternative
    total_benefits = []
    total_costs = []

    for alt in alternatives:
        benefit_sum = sum(metric.value for metric in alt if metric.is_benefit)
        cost_sum = sum(metric.value for metric in alt if not metric.is_benefit)
        total_benefits.append(benefit_sum)
        total_costs.append(cost_sum)

    # Step 2: Calculate total benefit and cost across all alternatives
    sum_total_benefit = sum(total_benefits)
    sum_total_cost = sum(total_costs)

    # Step 3: Calculate relative utility for each alternative
    utility_scores = []
    for benefit, cost in zip(total_benefits, total_costs):
        utility = (benefit / sum_total_benefit) - (cost / sum_total_cost)
        utility_scores.append(utility)

    return utility_scores

# Example metrics for two microservices (raw values, with weights, min/max range, and type)
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
normalized_metrics_1 = normalize_and_weight_metrics(metrics_microservice_1)
normalized_metrics_2 = normalize_and_weight_metrics(metrics_microservice_2)

# Group normalized metrics for COPRAS calculation
alternatives = [normalized_metrics_1, normalized_metrics_2]

# Step 2: Calculate COPRAS scores
copras_scores = calculate_copras(alternatives)

# Display results
for i, score in enumerate(copras_scores, start=1):
    print(f"COPRAS score for Microservice {i}: {score}")

# Determine which microservice is better
if copras_scores[0] > copras_scores[1]:
    print("Microservice 1 is preferred based on COPRAS.")
elif copras_scores[1] > copras_scores[0]:
    print("Microservice 2 is preferred based on COPRAS.")
else:
    print("Both Microservices are equally preferred based on COPRAS.")
