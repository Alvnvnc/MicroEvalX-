import json
import csv

# Load the JSON data from 'combined.json' file
with open('combined.json', 'r') as file:
    data = json.load(file)

# Prepare data for each block, arranged in vertical format but side-by-side with one empty column between blocks
rows = []

# Organize data for each block in columns
blocks = [
    [
        ["alcom", f"{data[0].get('alcom', 0):.10f}".replace('.', ',')],
        ["totalFunctions", data[0].get("totalFunctions", "")],
        ["totalClasses", data[0].get("totalClasses", "")],
        ["totalInputParameters", data[0].get("totalInputParameters", "")],
        ["uniqueParameters", data[0].get("uniqueParameters", "")],
        ["totalMethodFrequencies", data[0].get("totalMethodFrequencies", "")],
        ["lcom", f"{data[0].get('lcom', 0):.7f}".replace('.', ',')]
    ],
    [
        ["arq", f"{data[1].get('arq', 0):.15f}".replace('.', ',')],
        ["totalFunctionsMethods", data[1].get("totalFunctionsMethods", "")],
        ["total_service_requests", data[1].get("total_service_requests", "")]
    ],
    [
        ["totalEdges", data[2].get("totalEdges", "")],
        ["totalNodes", data[2].get("totalNodes", "")],
        ["totalConnectedComponents", data[2].get("totalConnectedComponents", "")],
        ["totalCC", data[2].get("totalCC", "")]
    ],
    [
        ["totalLoc", data[3].get("totalLoc", "")],
        ["totalCyclomaticComplexity", data[3].get("totalCyclomaticComplexity", "")],
        ["totalHalsteadVolume", data[3].get("totalHalsteadVolume", "")],
        ["avgCommentDensity", data[3].get("avgCommentDensity", "")],
        ["avgMI", f"{data[3].get('avgMI', 0):.10f}".replace('.', ',')]
    ],
    [
        ["noo", data[4].get("noo", "")]
    ],
    [
        ["totalClasses", data[5].get("totalClasses", "")],
        ["externalDependencies", data[5].get("externalDependencies", "")],
        ["sam", f"{data[5].get('sam', 0):.10f}".replace('.', ',')]
    ],
    [
        ["totalIpr", data[6].get("totalIpr", "")],
        ["totalFp", data[6].get("totalFp", "")],
        ["totalOpr", data[6].get("totalOpr", "")],
        ["totalCp", data[6].get("totalCp", "")],
        ["totalOt", data[6].get("totalOt", "")],
        ["totalWeights", data[6].get("totalWeights", "")],
        ["totalDgs", f"{data[6].get('totalDgs', 0):.10f}".replace('.', ',')],
        ["totalFgs", f"{data[6].get('totalFgs', 0):.10f}".replace('.', ',')],
        ["totalSgm", f"{data[6].get('totalSgm', 0):.10f}".replace('.', ',')]
    ],
    [
        ["totalClasses", data[7].get("totalClasses", "")],
        ["maxInheritanceDepth", data[7].get("maxInheritanceDepth", "")],
        ["sidc", f"{data[7].get('sidc', 0):.10f}".replace('.', ',')]
    ]
]

# Determine the maximum number of rows in any block to balance the layout
max_rows = max(len(block) for block in blocks)

# Align blocks side-by-side with empty columns between
for i in range(max_rows):
    row = []
    for block in blocks:
        if i < len(block):
            row.extend(block[i])  # Add key-value pair
        else:
            row.extend(["", ""])  # Empty cells if the block is shorter
        row.append("")  # Add an empty column between blocks
    rows.append(row)

# Write the output to a CSV file
with open('structured_output_side_by_side.csv', 'w', newline='') as file:
    writer = csv.writer(file)
    writer.writerows(rows)  # Write each row to the CSV

print("Data has been successfully written to structured_output_side_by_side.csv in a side-by-side vertical format.")
