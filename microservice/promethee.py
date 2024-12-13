import math

# Class untuk mendefinisikan struktur data untuk setiap metrik
class Metric:
    def __init__(self, name, value, weight, min_range, max_range, is_benefit):
        self.name = name
        self.value = value
        self.weight = weight
        self.min_range = min_range
        self.max_range = max_range
        self.is_benefit = is_benefit

# Fungsi untuk melakukan normalisasi dan pembobotan seperti pada TOPSIS
def normalize_and_weight_metrics(metrics):
    normalized_metrics = []
    for metric in metrics:
        # Normalisasi nilai sesuai dengan kriteria benefit atau cost
        if metric.is_benefit:
            normalized = (metric.value - metric.min_range) / (metric.max_range - metric.min_range)
        else:
            normalized = (metric.max_range - metric.value) / (metric.max_range - metric.min_range)
        
        # Mengalikan dengan bobot
        weighted_normalized = normalized * metric.weight
        normalized_metrics.append(Metric(metric.name, weighted_normalized, metric.weight, metric.min_range, metric.max_range, metric.is_benefit))
    return normalized_metrics

# Fungsi untuk menghitung PROMETHEE
def calculate_promethee(metrics_1, metrics_2):
    # Step 1: Calculate preference for each metric
    preferences_positive = []
    preferences_negative = []

    for metric1, metric2 in zip(metrics_1, metrics_2):
        # Hitung preferensi positif (Microservice 1 lebih baik dari Microservice 2)
        preference_positive = metric1.value if metric1.value > metric2.value else 0
        preferences_positive.append(preference_positive)
        
        # Hitung preferensi negatif (Microservice 2 lebih baik dari Microservice 1)
        preference_negative = metric2.value if metric2.value > metric1.value else 0
        preferences_negative.append(preference_negative)
    
    # Step 2: Sum up all positive and negative preferences
    phi_positive = sum(preferences_positive)
    phi_negative = sum(preferences_negative)
    
    # Step 3: Calculate the final Phi (Φ) values
    phi_1 = phi_positive - phi_negative  # Φ untuk Microservice 1
    phi_2 = phi_negative - phi_positive  # Φ untuk Microservice 2
    
    return phi_1, phi_2

# Contoh data untuk dua microservice (dengan nilai belum dinormalisasi dan bobot ditambahkan)
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

# Langkah 1: Normalisasi dan pembobotan data
normalized_metrics_1 = normalize_and_weight_metrics(metrics_microservice_1)
normalized_metrics_2 = normalize_and_weight_metrics(metrics_microservice_2)

# Tampilkan hasil normalisasi
print("Weighted Normalized Metrics for Microservice 1:")
for metric in normalized_metrics_1:
    print(f"{metric.name}: {metric.value}")

print("\nWeighted Normalized Metrics for Microservice 2:")
for metric in normalized_metrics_2:
    print(f"{metric.name}: {metric.value}")

# Langkah 2: Hitung nilai PROMETHEE
phi_1, phi_2 = calculate_promethee(normalized_metrics_1, normalized_metrics_2)

# Menampilkan hasil
print(f"\nPhi (Φ) untuk Microservice 1: {phi_1}")
print(f"Phi (Φ) untuk Microservice 2: {phi_2}")

# Menentukan peringkat
if phi_1 > phi_2:
    print("Microservice 1 lebih baik berdasarkan metode PROMETHEE.")
elif phi_2 > phi_1:
    print("Microservice 2 lebih baik berdasarkan metode PROMETHEE.")
else:
    print("Kedua Microservice memiliki preferensi yang seimbang berdasarkan metode PROMETHEE.")
