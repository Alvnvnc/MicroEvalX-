const { Project } = require('ts-morph');
const fs = require('fs');
const path = require('path');

// Function to analyze TypeScript/JavaScript files and extract the total number of functions/methods (NOO)
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

// Main function to analyze all files and calculate NOO (Number of Operations)
function analyzeDirectoryForNOO(directory) {
    const relevantFiles = findAllRelevantFiles(directory);

    // Initialize variable for NOO calculation
    let totalFunctionsMethods = 0;  // NOO: Total number of functions/methods

    relevantFiles.forEach(file => {
        console.log(`Analyzing file: ${file}`);

        // Extract the total number of functions/methods from the current file
        const functionsMethodsInFile = analyzeFile(file);
        totalFunctionsMethods += functionsMethodsInFile;  // Aggregate the total
    });

    // NOO: Number of Operations is the same as total number of functions/methods
    const noo = totalFunctionsMethods;  // NOO = total number of functions/methods

    // Prepare the final result
    const finalMetrics = {
        noo  // The calculated NOO value
    };

    // Write the final result to a JSON file
    fs.writeFileSync('noo_totals.json', JSON.stringify(finalMetrics, null, 4), 'utf-8');
    console.log('NOO metric successfully written to noo_totals.json');
}

// Get the directory from command line arguments and analyze the files
const directory = process.argv[2];
if (directory) {
    analyzeDirectoryForNOO(directory);
} else {
    console.error('Please provide a directory containing TypeScript/JavaScript files.');
}
