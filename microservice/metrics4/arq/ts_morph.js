const { Project } = require('ts-morph');
const fs = require('fs');
const path = require('path');

// Function to analyze TypeScript/JavaScript files and extract the total number of functions/methods (service requests)
function analyzeFile(filePath) {
    const project = new Project();
    const sourceFile = project.addSourceFileAtPath(filePath);

    // Initialize variable to capture the number of functions/methods
    let totalFunctionsMethods = 0;

    // Traverse the source file to count functions and methods
    sourceFile.forEachDescendant((node) => {
        const nodeKind = node.getKindName();  // Get the kind of node

        // Check for all kinds of function declarations (Function, Method, Arrow, FunctionExpression)
        if (nodeKind === 'FunctionDeclaration' || nodeKind === 'MethodDeclaration' || 
            nodeKind === 'ArrowFunction' || nodeKind === 'FunctionExpression') {
            totalFunctionsMethods += 1;  // Count this function or method
        }
    });

    // Return the total number of functions/methods for this file
    return totalFunctionsMethods;
}

// Function to recursively find all relevant files in a directory
function findAllRelevantFiles(directory) {
    let relevantFiles = [];

    // Read all items (files/directories) in the current directory
    const items = fs.readdirSync(directory);

    items.forEach(item => {
        const fullPath = path.join(directory, item);
        const stats = fs.statSync(fullPath);

        // If it's a directory, recursively search it
        if (stats.isDirectory()) {
            relevantFiles = relevantFiles.concat(findAllRelevantFiles(fullPath));
        }
        // If it's a file, check if it's a TypeScript or JavaScript file and add it to the list
        else if (item.endsWith('.ts') || item.endsWith('.js') || item.endsWith('.d.ts')) {
            relevantFiles.push(fullPath);
        }
    });

    return relevantFiles;
}

// Main function to analyze all files and calculate the ARQ
function analyzeDirectoryForARQ(directory) {
    const relevantFiles = findAllRelevantFiles(directory);

    // Initialize variables for ARQ calculation
    let totalFunctionsMethods = 0;  // Total number of functions/methods (total_service_requests)
    const total_service_config_time = 1;  // Placeholder value
    const total_issue_resolving_time = 1;  // Placeholder value

    relevantFiles.forEach(file => {
        console.log(`Analyzing file: ${file}`);

        // Extract the total number of functions/methods from the current file
        const functionsMethodsInFile = analyzeFile(file);
        totalFunctionsMethods += functionsMethodsInFile;  // Aggregate the total
    });

    // Calculate ARQ: Availability and Reliability Quotient
    const total_service_requests = Math.max(totalFunctionsMethods, 1);  // Ensure at least 1 request
    const arq = (total_service_config_time + total_issue_resolving_time) / total_service_requests;

    // Prepare the final result
    const finalMetrics = {
        totalFunctionsMethods,  // Total number of functions/methods (service requests)
        total_service_requests, // Total service requests
        arq  // The calculated ARQ value
    };

    // Write the final result to a JSON file
    fs.writeFileSync('arq_totals.json', JSON.stringify(finalMetrics, null, 4), 'utf-8');
    console.log('ARQ metrics successfully written to arq_totals.json');
}

// Get the directory from command line arguments and analyze the files
const directory = process.argv[2];
if (directory) {
    analyzeDirectoryForARQ(directory);
} else {
    console.error('Please provide a directory containing TypeScript/JavaScript files.');
}
