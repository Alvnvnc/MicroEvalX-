# Metrics data
metrics = {
  mi: 62.38,
  noo: 696,
  lcom: 52.04,
  alcom: 0.279,
  cc: 456,
  arq: 0.0029,
  sidc: 0.0093,
  sgm: 10.90,
  sam: -1.0234
}

# Normalization using min-max method
def normalize(values)
  min = values.min
  max = values.max
  values.map { |v| (v - min) / (max - min) }
end

# Ranking helper function
def rank(metrics_scores)
  metrics_scores.map.with_index.sort_by { |score, _| -score }.map.with_index { |(_, metric_index), rank| [metric_index, rank + 1] }.to_h
end

# Apply TOPSIS Method
def topsis(data)
  normalized_data = normalize(data)
  ideal_best = normalized_data.max
  ideal_worst = normalized_data.min
  
  distance_to_best = normalized_data.map { |v| (v - ideal_best)**2 }
  distance_to_worst = normalized_data.map { |v| (v - ideal_worst)**2 }
  
  scores = distance_to_worst.map.with_index { |dist_worst, i| dist_worst / (dist_worst + distance_to_best[i]) }
  scores
end

# Apply MOORA Method
def moora(data)
  weights = Array.new(data.size, 1.0 / data.size)
  normalized_data = normalize(data)
  weighted_data = normalized_data.map.with_index { |v, i| v * weights[i] }
  
  weighted_data
end

# Apply COPRAS Method
def copras(data)
  normalized_data = normalize(data)
  normalized_data
end

# Apply PROMETHEE Method
def promethee(data)
  normalized_data = normalize(data)
  positive_flow = normalized_data.max
  negative_flow = normalized_data.min
  
  net_flows = normalized_data.map { |v| v - negative_flow }
  net_flows
end

# Apply EDAS Method
def edas(data)
  normalized_data = normalize(data)
  ideal_solution = normalized_data.max
  positive_distance = normalized_data.map { |v| (v - ideal_solution).abs }
  negative_distance = normalized_data.map(&:abs)
  
  scores = positive_distance.map.with_index { |pos_dist, i| 1 - (pos_dist / (pos_dist + negative_distance[i])) }
  scores
end

# Calculate all MCDM methods for each metric and return scores and rankings
def calculate_mcdm(metrics)
  metrics_data = metrics.values
  
  # Calculate scores for each method
  topsis_scores = topsis(metrics_data)
  moora_scores = moora(metrics_data)
  copras_scores = copras(metrics_data)
  promethee_scores = promethee(metrics_data)
  edas_scores = edas(metrics_data)

  # Rank each set of scores
  {
    topsis: {scores: topsis_scores, ranking: rank(topsis_scores)},
    moora: {scores: moora_scores, ranking: rank(moora_scores)},
    copras: {scores: copras_scores, ranking: rank(copras_scores)},
    promethee: {scores: promethee_scores, ranking: rank(promethee_scores)},
    edas: {scores: edas_scores, ranking: rank(edas_scores)}
  }
end

# Calculate total scores for each MCDM method (across all metrics)
def calculate_total_scores(mcdm_results)
  total_scores = {}

  # Sum the scores for each MCDM method
  mcdm_results.each do |method, result|
    total_scores[method] = result[:scores].sum
  end

  total_scores
end

# Aggregating ranks to analyze
def aggregate_ranks(metrics)
  mcdm_results = calculate_mcdm(metrics)

  # Combine rankings and calculate total ranking per metric
  combined_rankings = Hash.new(0)
  metrics.keys.each_with_index do |metric, i|
    combined_rankings[metric] += mcdm_results[:topsis][:ranking][i]
    combined_rankings[metric] += mcdm_results[:moora][:ranking][i]
    combined_rankings[metric] += mcdm_results[:copras][:ranking][i]
    combined_rankings[metric] += mcdm_results[:promethee][:ranking][i]
    combined_rankings[metric] += mcdm_results[:edas][:ranking][i]
  end

  # Divide each combined rank by 5 to get the average ranking
  combined_rankings.each do |metric, total_rank|
    combined_rankings[metric] = total_rank.to_f / 5
  end
  
  # Sort metrics by combined rankings (lower score = better ranking)
  combined_rankings.sort_by { |_, rank| rank }
end

# Run the program to display individual rankings, scores, total scores, and overall analysis
def metrics_need_attention(metrics)
  mcdm_results = calculate_mcdm(metrics)
  total_scores = calculate_total_scores(mcdm_results)
  ranked_metrics = aggregate_ranks(metrics)
  metric_names = metrics.keys

  # Write the output to a file
  File.open("metrics_rankings.txt", "w") do |file|
    file.puts "Individual MCDM Scores and Rankings:\n\n"

    # Write the scores and rankings for each method
    mcdm_results.each do |method, result|
      file.puts "#{method.to_s.upcase} Scores and Rankings:"
      metric_names.each_with_index do |metric, i|
        file.puts "#{metric}: Score = #{result[:scores][i]}, Rank = #{result[:ranking][i]}"
      end
      file.puts "\n"
    end

    # Write total MCDM scores (across all metrics)
    file.puts "Total MCDM Scores (Sum of Scores Across All Metrics):\n"
    total_scores.each do |method, total|
      file.puts "#{method.to_s.upcase} Total Score: #{total}"
    end
    file.puts "\n"

    # Write overall combined averaged rankings
    file.puts "Overall Combined (Averaged) Rankings:\n"
    ranked_metrics.each do |metric, rank|
      file.puts "#{metric} needs attention. Combined average rank: #{rank}"
    end
  end

  puts "Results have been written to 'metrics_rankings.txt'."
end

# Run the program
metrics_need_attention(metrics)
