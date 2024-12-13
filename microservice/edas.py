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

# Function to normalize and weight metrics based on TOPSIS normalization
def normalize_and_weight_metrics(metrics):
    normalized_metrics = []
    for metric in metrics:
        # Normalize according to benefit or cost
        if metric.is_benefit:
            normalized_value = (metric.value - metric.min_range) / (metric.max_range - metric.min_range)
        else:
            normalized_value = (metric.max_range - metric.value) / (metric.max_range - metric.min_range)
        
        # Apply weight to the normalized value
        weighted_normalized_value = normalized_value * metric.weight
        normalized_metrics.append(Metric(
            metric.name, 
            weighted_normalized_value, 
            metric.weight, 
            metric.min_range, 
            metric.max_range, 
            metric.is_benefit
        ))
        
        print(f"Metric: {metric.name}")
        print(f"Original Value: {metric.value}")
        print(f"Normalized Value: {normalized_value}")
        print(f"Weighted Normalized Value: {weighted_normalized_value}\n")
    
    return normalized_metrics

# Function to calculate the average (reference) solution for EDAS
def calculate_average_solution(metrics_1, metrics_2):
    average_metrics = []
    for metric1, metric2 in zip(metrics_1, metrics_2):
        # Calculate average based on the weighted normalized values
        average_value = (metric1.value + metric2.value) / 2
        average_metrics.append(Metric(
            metric1.name,
            average_value,
            metric1.weight,
            metric1.min_range,
            metric1.max_range,
            metric1.is_benefit
        ))
        print(f"Average for {metric1.name}: {average_value}")
    return average_metrics

# Function to calculate PDA and NDA for each alternative
def calculate_pda_nda(metrics, average_metrics):
    total_pda = 0
    total_nda = 0
    
    for metric, avg_metric in zip(metrics, average_metrics):
        # For all criteria, regardless of benefit/cost
        if metric.value < avg_metric.value:
            nda = avg_metric.value - metric.value
            pda = 0
        else:
            pda = metric.value - avg_metric.value
            nda = 0
            
        print(f"Metric: {metric.name}")
        print(f"Value: {metric.value}")
        print(f"Average: {avg_metric.value}")
        print(f"PDA: {pda}")
        print(f"NDA: {nda}\n")
        
        total_pda += pda
        total_nda += nda
        
    return total_pda, total_nda

# Function to calculate EDAS score for each alternative
def calculate_edas_score(pda_nda_values):
    edas_scores = []
    
    for pda, nda in pda_nda_values:
        # Calculate EDAS score as PDA - NDA (allowing negative values)
        edas_score = pda - nda
        edas_scores.append(edas_score)
    
    return edas_scores

# Example metrics for two microservices
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

def main():
    print("=== Starting EDAS Calculation ===\n")
    
    # Step 1: Normalize and weight the metrics
    print("--- Normalizing and Weighting Metrics for Microservice 1 ---")
    normalized_metrics_1 = normalize_and_weight_metrics(metrics_microservice_1)

    print("--- Normalizing and Weighting Metrics for Microservice 2 ---")
    normalized_metrics_2 = normalize_and_weight_metrics(metrics_microservice_2)

    # Step 2: Calculate average solution
    print("\n--- Calculating Average Solution ---")
    average_metrics = calculate_average_solution(normalized_metrics_1, normalized_metrics_2)

    # Step 3: Calculate PDA and NDA for each alternative
    print("\n--- Calculating PDA and NDA for Microservice 1 ---")
    pda_nda_microservice_1 = calculate_pda_nda(normalized_metrics_1, average_metrics)

    print("--- Calculating PDA and NDA for Microservice 2 ---")
    pda_nda_microservice_2 = calculate_pda_nda(normalized_metrics_2, average_metrics)

    # Group PDA and NDA results
    pda_nda_values = [pda_nda_microservice_1, pda_nda_microservice_2]

    # Step 4: Calculate EDAS scores
    print("\n--- Final EDAS Scores ---")
    edas_scores = calculate_edas_score(pda_nda_values)

    # Display results
    for i, score in enumerate(edas_scores, start=1):
        print(f"EDAS score for Microservice {i}: {score}")

    # Determine which microservice is better
    if edas_scores[0] > edas_scores[1]:
        print("\nMicroservice 1 is preferred based on EDAS.")
    elif edas_scores[1] > edas_scores[0]:
        print("\nMicroservice 2 is preferred based on EDAS.")
    else:
        print("\nBoth Microservices are equally preferred based on EDAS.")

if __name__ == "__main__":
    main()