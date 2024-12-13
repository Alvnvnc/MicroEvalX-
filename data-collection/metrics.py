import numpy as np

# Metrics data
metrics = {
    'mi': 62.38,
    'noo': 696,
    'lcom': 52.04,
    'alcom': 0.279,
    'cc': 456,
    'arq': 0.0029,
    'sidc': 0.0093,
    'sgm': 10.90,
    'sam': -1.0234
}

# Normalization using min-max method
def normalize(values):
    min_val = min(values)
    max_val = max(values)
    return [(v - min_val) / (max_val - min_val) for v in values]

# Ranking helper function
def rank(metrics_scores, metric_names):
    sorted_scores = sorted(zip(metric_names, metrics_scores), key=lambda x: -x[1])
    return {name: rank + 1 for rank, (name, _) in enumerate(sorted_scores)}

# Apply TOPSIS Method
def topsis(data):
    normalized_data = normalize(data)
    ideal_best = max(normalized_data)
    ideal_worst = min(normalized_data)

    distance_to_best = [(v - ideal_best)**2 for v in normalized_data]
    distance_to_worst = [(v - ideal_worst)**2 for v in normalized_data]

    scores = [dist_worst / (dist_worst + distance_to_best[i]) for i, dist_worst in enumerate(distance_to_worst)]
    return scores

# Apply MOORA Method
def moora(data):
    weights = [1.0 / len(data)] * len(data)
    normalized_data = normalize(data)
    weighted_data = [v * weights[i] for i, v in enumerate(normalized_data)]
    return weighted_data

# Apply COPRAS Method
def copras(data):
    normalized_data = normalize(data)
    return normalized_data

# Apply PROMETHEE Method
def promethee(data):
    normalized_data = normalize(data)
    positive_flow = max(normalized_data)
    negative_flow = min(normalized_data)

    net_flows = [v - negative_flow for v in normalized_data]
    return net_flows

# Apply EDAS Method
def edas(data):
    normalized_data = normalize(data)
    ideal_solution = max(normalized_data)
    positive_distance = [abs(v - ideal_solution) for v in normalized_data]
    negative_distance = [abs(v) for v in normalized_data]

    scores = [1 - (pos_dist / (pos_dist + negative_distance[i])) for i, pos_dist in enumerate(positive_distance)]
    return scores

# Calculate all MCDM methods for each metric and return scores and rankings
def calculate_mcdm(metrics):
    metric_names = list(metrics.keys())
    metrics_data = list(metrics.values())

    # Calculate scores for each method
    topsis_scores = topsis(metrics_data)
    moora_scores = moora(metrics_data)
    copras_scores = copras(metrics_data)
    promethee_scores = promethee(metrics_data)
    edas_scores = edas(metrics_data)

    # Rank each set of scores using metric names
    return {
        'topsis': {'scores': topsis_scores, 'ranking': rank(topsis_scores, metric_names)},
        'moora': {'scores': moora_scores, 'ranking': rank(moora_scores, metric_names)},
        'copras': {'scores': copras_scores, 'ranking': rank(copras_scores, metric_names)},
        'promethee': {'scores': promethee_scores, 'ranking': rank(promethee_scores, metric_names)},
        'edas': {'scores': edas_scores, 'ranking': rank(edas_scores, metric_names)}
    }


# Calculate total scores for each MCDM method (across all metrics)
def calculate_total_scores(mcdm_results):
    total_scores = {}

    # Sum the scores for each MCDM method
    for method, result in mcdm_results.items():
        total_scores[method] = sum(result['scores'])

    return total_scores

# Aggregating ranks to analyze
def aggregate_ranks(metrics):
    mcdm_results = calculate_mcdm(metrics)
    metric_names = list(metrics.keys())

    # Combine rankings and calculate total ranking per metric
    combined_rankings = {metric: 0 for metric in metric_names}
    for metric in metric_names:
        combined_rankings[metric] += mcdm_results['topsis']['ranking'][metric]
        combined_rankings[metric] += mcdm_results['moora']['ranking'][metric]
        combined_rankings[metric] += mcdm_results['copras']['ranking'][metric]
        combined_rankings[metric] += mcdm_results['promethee']['ranking'][metric]
        combined_rankings[metric] += mcdm_results['edas']['ranking'][metric]

    # Divide each combined rank by 5 to get the average ranking
    for metric in combined_rankings:
        combined_rankings[metric] /= 5.0

    # Sort metrics by combined rankings (lower score = better ranking)
    return sorted(combined_rankings.items(), key=lambda x: x[1])

def metrics_need_attention(metrics):
    mcdm_results = calculate_mcdm(metrics)
    total_scores = calculate_total_scores(mcdm_results)
    ranked_metrics = aggregate_ranks(metrics)
    metric_names = list(metrics.keys())

    # Write the output to a file
    with open("metrics_rankings.txt", "w") as file:
        file.write("Individual MCDM Scores and Rankings:\n\n")

        # Write the scores and rankings for each method
        for method, result in mcdm_results.items():
            file.write(f"{method.upper()} Scores and Rankings:\n")
            for metric in metric_names:
                file.write(f"{metric}: Score = {result['scores'][metric_names.index(metric)]}, "
                           f"Rank = {result['ranking'][metric]}\n")
            file.write("\n")

        # Write total MCDM scores (across all metrics)
        file.write("Total MCDM Scores (Sum of Scores Across All Metrics):\n")
        for method, total in total_scores.items():
            file.write(f"{method.upper()} Total Score: {total}\n")
        file.write("\n")

        # Write overall combined averaged rankings
        file.write("Overall Combined (Averaged) Rankings:\n")
        for metric, rank in ranked_metrics:
            file.write(f"{metric} needs attention. Combined average rank: {rank}\n")

    print("Results have been written to 'metrics_rankings.txt'.")

# Run the program
metrics_need_attention(metrics)
