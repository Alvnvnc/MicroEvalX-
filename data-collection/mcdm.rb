require 'matrix'

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

# Apply TOPSIS Method
def topsis(data)
  weights = [0.15, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.15] # Customize weights as needed
  normalized_data = normalize(data)
  ideal_best = normalized_data.map { |v| v == normalized_data.max ? v : 0 }
  ideal_worst = normalized_data.map { |v| v == normalized_data.min ? v : 0 }
  
  distance_to_best = Math.sqrt(ideal_best.map.with_index { |v, i| (v - normalized_data[i]) ** 2 }.sum)
  distance_to_worst = Math.sqrt(ideal_worst.map.with_index { |v, i| (v - normalized_data[i]) ** 2 }.sum)

  performance_score = distance_to_worst / (distance_to_best + distance_to_worst)
  performance_score
end

# Apply MOORA Method
def moora(data)
  weights = [0.15, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.15] # Customize weights as needed
  normalized_data = normalize(data)
  weighted_data = normalized_data.map.with_index { |v, i| v * weights[i] }
  
  sum_benefit = weighted_data.sum # Sum all weighted data for MOORA score
  sum_benefit
end

# Apply COPRAS Method
def copras(data)
  normalized_data = normalize(data)
  sum_normalized = normalized_data.sum
  weights = normalized_data.map { |v| v / sum_normalized }

  score = weights.sum
  score
end

# Apply PROMETHEE Method
def promethee(data)
  normalized_data = normalize(data)
  positive_flow = normalized_data.max
  negative_flow = normalized_data.min
  
  net_flow = positive_flow - negative_flow
  net_flow
end

# Apply EDAS Method
def edas(data)
  normalized_data = normalize(data)
  ideal_solution = normalized_data.max
  positive_distance = normalized_data.map { |v| (v - ideal_solution).abs }
  negative_distance = normalized_data.map { |v| v.abs }
  
  score = 1 - (positive_distance.sum / (positive_distance.sum + negative_distance.sum))
  score
end

# Run all methods and print results
data = metrics.values

puts "TOPSIS Score: #{topsis(data)}"
puts "MOORA Score: #{moora(data)}"
puts "COPRAS Score: #{copras(data)}"
puts "PROMETHEE Net Flow: #{promethee(data)}"
puts "EDAS Score: #{edas(data)}"
