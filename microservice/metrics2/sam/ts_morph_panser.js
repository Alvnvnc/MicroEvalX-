const { Project, Node } = require('ts-morph');
const fs = require('fs');
const path = require('path');

// Function to analyze TypeScript/JavaScript files and extract total number of classes and external dependencies
function analyzeFile(filePath) {
    const project = new Project();
    const sourceFile = project.addSourceFileAtPath(filePath);

    // Initialize variables to capture total classes and external dependencies
    let totalClasses = 0;
    let externalDependencies = 0;

    // Traverse the source file to analyze classes and imports
    sourceFile.forEachDescendant((node) => {
        // Count classes
        if (Node.isClassDeclaration(node)) {
            totalClasses += 1;
        }

        // Count external imports (dependencies)
        if (Node.isImportDeclaration(node)) {
            const importPath = node.getModuleSpecifierValue();
            if (isExternalDependency(importPath)) {
                externalDependencies += 1;
            }
        }
    });

    // Return the total number of classes and external dependencies for this file
    return { totalClasses, externalDependencies };
}

// Helper function to determine if an import is an external dependency
function isExternalDependency(importPath) {
    // Check if the import path is a relative path (internal dependency)
    return !importPath.startsWith('.') && !importPath.startsWith('/');
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

// Main function to analyze all files and calculate SAM (Service Autonomy Metric)
function analyzeDirectoryForSAM(directory) {
    const relevantFiles = findAllRelevantFiles(directory);

    // Initialize variables for SAM calculation
    let totalClasses = 0;
    let externalDependencies = 0;

    relevantFiles.forEach(file => {
        console.log(`Analyzing file: ${file}`);

        // Extract the total number of classes and external dependencies from the current file
        const { totalClasses: classesInFile, externalDependencies: dependenciesInFile } = analyzeFile(file);
        
        totalClasses += classesInFile;  // Aggregate total classes
        externalDependencies += dependenciesInFile;  // Aggregate external dependencies
    });

    // Calculate SAM: Service Autonomy Metric
    const sam = 1 - (externalDependencies / Math.max(totalClasses, 1));  // Ensure we don't divide by zero

    // Prepare the final result
    const finalMetrics = {
        totalClasses,  // Total number of classes
        externalDependencies,  // Total number of external dependencies
        sam  // The calculated SAM value
    };

    // Write the final result to a JSON file
    fs.writeFileSync('sam_totals.json', JSON.stringify(finalMetrics, null, 4), 'utf-8');
    console.log('SAM metric successfully written to sam_totals.json');
}

// Get the directory from command line arguments and analyze the files
const directory = process.argv[2];
if (directory) {
    analyzeDirectoryForSAM(directory);
} else {
    console.error('Please provide a directory containing TypeScript/JavaScript files.');
}
