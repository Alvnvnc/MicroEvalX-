import json
import csv

# Load the JSON data from 'combined.json' file
with open('combined.json', 'r') as file:
    data = json.load(file)

# Create a dictionary to map block names to their corresponding indices in the JSON data
block_indices = {
    "block1": 3,
    "block2": 4,
    "block3": 7,
    "block4": 0,
    "block5": 1,
    "block6": 2,
    "block7": 5,
    "block8": 6
}

# Prepare data for each block, arranged in vertical format but side-by-side with one empty column between blocks
rows = []

# Organize data for each block in columns
blocks = [
    [
        ["alcom", f"{data[block_indices['block1']].get('alcom', 0):.10f}".replace('.', ',')],
        ["totalFunctions", data[block_indices['block1']].get("totalFunctions", "")],
        ["totalClasses", data[block_indices['block1']].get("totalClasses", "")],
        ["totalInputParameters", data[block_indices['block1']].get("totalInputParameters", "")],
        ["uniqueParameters", data[block_indices['block1']].get("uniqueParameters", "")],
        ["totalMethodFrequencies", data[block_indices['block1']].get("totalMethodFrequencies", "")],
        ["lcom", f"{data[block_indices['block1']].get('lcom', 0):.7f}".replace('.', ',')]
    ],
    [
        ["arq", f"{data[block_indices['block2']].get('arq', 0):.15f}".replace('.', ',')],
        ["totalFunctionsMethods", data[block_indices['block2']].get("totalFunctionsMethods", "")],
        ["total_service_requests", data[block_indices['block2']].get("total_service_requests", "")]
    ],
    [
        ["totalEdges", data[block_indices['block3']].get("totalEdges", "")],
        ["totalNodes", data[block_indices['block3']].get("totalNodes", "")],
        ["totalConnectedComponents", data[block_indices['block3']].get("totalConnectedComponents", "")],
        ["totalCC", data[block_indices['block3']].get("totalCC", "")]
    ],
    [
        ["totalLoc", data[block_indices['block4']].get("totalLoc", "")],
        ["totalCyclomaticComplexity", data[block_indices['block4']].get("totalCyclomaticComplexity", "")],
        ["totalHalsteadVolume", data[block_indices['block4']].get("totalHalsteadVolume", "")],
        ["avgCommentDensity", data[block_indices['block4']].get("avgCommentDensity", "")],
        ["avgMI", f"{data[block_indices['block4']].get('avgMI', 0):.10f}".replace('.', ',')]
    ],
    [
        ["noo", data[block_indices['block5']].get("noo", "")]
    ],
    [
        ["totalClasses", data[block_indices['block6']].get("totalClasses", "")],
        ["externalDependencies", data[block_indices['block6']].get("externalDependencies", "")],
        ["sam", f"{data[block_indices['block6']].get('sam', 0):.10f}".replace('.', ',')]
    ],
    [
        ["totalIpr", data[block_indices['block7']].get("totalIpr", "")],
        ["totalFp", data[block_indices['block7']].get("totalFp", "")],
        ["totalOpr", data[block_indices['block7']].get("totalOpr", "")],
        ["totalCp", data[block_indices['block7']].get("totalCp", "")],
        ["totalOt", data[block_indices['block7']].get("totalOt", "")],
        ["totalWeights", data[block_indices['block7']].get("totalWeights", "")],
        ["totalDgs", f"{data[block_indices['block7']].get('totalDgs', 0):.10f}".replace('.', ',')],
        ["totalFgs", f"{data[block_indices['block7']].get('totalFgs', 0):.10f}".replace('.', ',')],
        ["totalSgm", f"{data[block_indices['block7']].get('totalSgm', 0):.10f}".replace('.', ',')]
    ],
    [
        ["totalClasses", data[block_indices['block8']].get("totalClasses", "")],
        ["maxInheritanceDepth", data[block_indices['block8']].get("maxInheritanceDepth", "")],
        ["sidc", f"{data[block_indices['block8']].get('sidc', 0):.10f}".replace('.', ',')]
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