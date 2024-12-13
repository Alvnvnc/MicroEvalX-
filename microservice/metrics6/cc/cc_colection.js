const { Project } = require('ts-morph');
const fs = require('fs');
const path = require('path');

// Function to calculate CC (Cyclomatic Complexity)
function calculateCC(edges, nodes, connectedComponents) {
    return edges - nodes + (2 * connectedComponents);
}

// Function to recursively find all TypeScript and JavaScript files in a directory
function findAllScriptFiles(directory) {
    let scriptFiles = [];

    // Read all items (files/directories) in the current directory
    const items = fs.readdirSync(directory);

    items.forEach(item => {
        const fullPath = path.join(directory, item);
        const stats = fs.statSync(fullPath);

        // If it's a directory, recursively search it
        if (stats.isDirectory()) {
            scriptFiles = scriptFiles.concat(findAllScriptFiles(fullPath));
        }
        // If it's a TypeScript or JavaScript file, add it to the list
        else if (item.endsWith('.ts') || item.endsWith('.js')) {
            scriptFiles.push(fullPath);
        }
    });

    return scriptFiles;
}

// Function to analyze each file and extract necessary parameters for CC calculation
function analyzeFile(filePath) {
    const project = new Project();
    const sourceFile = project.addSourceFileAtPath(filePath);

    // Initialize variables for edges, nodes, and connected components
    let edges = 0;
    let nodes = 0;
    let connectedComponents = 1;  // Assume at least one connected component per file (adjust logic as needed)

    // Traverse the source file and extract the required data
    sourceFile.forEachDescendant((node) => {
        const nodeKind = node.getKindName();

        // Check for function or method declaration (nodes)
        if (nodeKind === 'FunctionDeclaration' || nodeKind === 'MethodDeclaration') {
            nodes += 1;  // Each function or method represents a node
        }

        // Check for conditionals or loops to count edges
        if (nodeKind === 'IfStatement' || nodeKind === 'ForStatement' || nodeKind === 'WhileStatement' ||
            nodeKind === 'SwitchStatement' || nodeKind === 'DoStatement') {
            edges += 1;  // Each conditional or loop represents an edge
        }
    });

    // Calculate CC for this file using the provided formula
    const cc = calculateCC(edges, nodes, connectedComponents);

    return { edges, nodes, connectedComponents, cc };
}

// Main function to analyze all TypeScript and JavaScript files in the given directory (recursively)
function analyzeDirectory(directory) {
    const scriptFiles = findAllScriptFiles(directory);

    // Initialize cumulative totals
    let totalEdges = 0;
    let totalNodes = 0;
    let totalConnectedComponents = 0;
    let totalCC = 0;

    scriptFiles.forEach(file => {
        console.log(`Analyzing file: ${file}`);

        // Analyze the file and calculate CC
        const metrics = analyzeFile(file);

        // Accumulate the results across all files
        totalEdges += metrics.edges;
        totalNodes += metrics.nodes;
        totalConnectedComponents += metrics.connectedComponents;
        totalCC += metrics.cc;
    });

    // Prepare the final cumulative results
    const finalMetrics = {
        totalEdges,            // Total Edges
        totalNodes,            // Total Nodes
        totalConnectedComponents,  // Total Connected Components
        totalCC                // Total Cyclomatic Complexity (CC)
    };

    // Write the final result to a JSON file
    fs.writeFileSync('cc_totals.json', JSON.stringify(finalMetrics, null, 4), 'utf-8');
    console.log('Cumulative totals successfully written to cc_totals.json');
}

// Get the directory from command line arguments and analyze the files
const directory = process.argv[2];
if (directory) {
    analyzeDirectory(directory);
} else {
    console.error('Please provide a directory containing TypeScript or JavaScript files.');
}
