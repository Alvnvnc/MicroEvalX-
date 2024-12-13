import json

def extract_main_metrics(file_path):
    with open(file_path, 'r') as file:
        data = json.load(file)
    
    # Initialize a dictionary to store the metrics
    metrics_dict = {
        "alcom": None,
        "arq": None,
        "noo": None,
        "cc": None,
        "mi": None,
        "sam": None,
        "sgm": None,
        "sidc": None
    }
    
    # Iterate through each item in the data list and update the metrics_dict
    for item in data:
        if isinstance(item, dict):
            metrics_dict["alcom"] = item.get("alcom", metrics_dict["alcom"])
            metrics_dict["arq"] = item.get("arq", metrics_dict["arq"])
            metrics_dict["noo"] = item.get("noo", metrics_dict["noo"])
            metrics_dict["cc"] = item.get("totalCC", metrics_dict["cc"])
            metrics_dict["mi"] = item.get("avgMI", metrics_dict["mi"])
            metrics_dict["sam"] = item.get("sam", metrics_dict["sam"])
            metrics_dict["sgm"] = item.get("totalSgm", metrics_dict["sgm"])
            metrics_dict["sidc"] = item.get("sidc", metrics_dict["sidc"])
    
    # Convert the dictionary to a list of tuples
    metrics = list(metrics_dict.items())
    
    return metrics

def write_metrics_to_file(metrics, output_file_path):
    with open(output_file_path, 'w') as file:
        for metric, value in metrics:
            file.write(f"{metric}: {value}\n")

if __name__ == "__main__":
    combined_json_path = "combined.json"
    output_file_path = "metrics_output.txt"
    
    metrics_array = extract_main_metrics(combined_json_path)
    write_metrics_to_file(metrics_array, output_file_path)
