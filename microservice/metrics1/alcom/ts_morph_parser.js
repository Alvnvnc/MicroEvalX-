const { Project } = require('ts-morph');
const fs = require('fs');
const path = require('path');

// Function to analyze TypeScript files and extract metrics for LCOM/ALCOM calculation
function analyzeFile(filePath) {
    const project = new Project();
    const sourceFile = project.addSourceFileAtPath(filePath);

    // Initialize variables to capture the necessary data for LCOM/ALCOM
    let totalFunctions = 0;   // m: Total number of methods (or functions)
    let totalClasses = 0;     // Total number of classes
    let inputParameters = 0;  // n: Total number of parameters across all methods
    let uniqueParameters = new Set();  // f: Unique parameters used across methods
    let methodFrequencies = [];  // Track the number of methods in each class
    let currentClassMethods = 0; // Count the number of methods in the current class

    // Traverse the source file to analyze functions and classes
    sourceFile.forEachDescendant((node) => {
        const nodeKind = node.getKindName();  // Get the kind of node

        // Check for all kinds of function declarations (Function, Method, Arrow, FunctionExpression)
        if (nodeKind === 'FunctionDeclaration' || nodeKind === 'MethodDeclaration' || 
            nodeKind === 'ArrowFunction' || nodeKind === 'FunctionExpression') {
            
            totalFunctions += 1;  // Count this function or method
            
            // Count the total input parameters for this function
            node.getParameters().forEach(param => {
                inputParameters += 1;
                uniqueParameters.add(param.getName());  // Add parameter name to the unique set
            });

            // Track method frequencies per class
            currentClassMethods += 1;

        } else if (nodeKind === 'ClassDeclaration') {
            totalClasses += 1;

            // If this class has methods, store the count for this class and reset the method counter
            if (currentClassMethods > 0) {
                methodFrequencies.push(currentClassMethods);
                currentClassMethods = 0;  // Reset for the next class
            }
        }
    });

    // If there were methods in the last class, track them
    if (currentClassMethods > 0) {
        methodFrequencies.push(currentClassMethods);
    }

    // Calculate LCOM for each class (if there are classes and methods)
    let lcom = 0;
    if (totalClasses > 0 && uniqueParameters.size > 0) {
        const avgMethodsPerClass = methodFrequencies.reduce((a, b) => a + b, 0) / totalClasses;
        lcom = 1 - ((avgMethodsPerClass / inputParameters) / (totalFunctions * uniqueParameters.size));
    }

    // Return the final extracted metrics for this file
    return {
        totalFunctions,  // Total number of methods in the file
        totalClasses,    // Total number of classes in the file
        inputParameters, // Total number of parameters across methods in the file
        uniqueParameters: Array.from(uniqueParameters),  // Unique parameters in the file
        methodFrequencies,  // Method frequencies (methods per class) in the file
        lcom  // LCOM value for this file
    };
}

// Function to recursively find all TypeScript files in a directory
function findAllTypeScriptFiles(directory) {
    let tsFiles = [];

    // Read all items (files/directories) in the current directory
    const items = fs.readdirSync(directory);

    items.forEach(item => {
        const fullPath = path.join(directory, item);
        const stats = fs.statSync(fullPath);

        // If it's a directory, recursively search it
        if (stats.isDirectory()) {
            tsFiles = tsFiles.concat(findAllTypeScriptFiles(fullPath));
        }
        // If it's a file, check if it's a TypeScript file and add it to the list
        else if (item.endsWith('.ts') || item.endsWith('.d.ts')) {
            tsFiles.push(fullPath);
        }
    });

    return tsFiles;
}

// Main function to analyze all TypeScript files in the given directory (recursively)
function analyzeDirectory(directory) {
    const tsFiles = findAllTypeScriptFiles(directory);

    // Initialize the total sums across all files
    let totalFunctions = 0;   // Σm: Total number of methods across all files
    let totalClasses = 0;     // ΣtotalClasses: Total number of classes across all files
    let totalInputParameters = 0;  // Σn: Total number of parameters across all files
    let uniqueParameters = new Set();  // Σf: Unique parameters across all files
    let totalMethodFrequencies = 0;  // Σmf: Total method frequencies across all files
    let sumLcom = 0;  // ΣLCOM for all classes

    tsFiles.forEach(file => {
        console.log(`Analyzing file: ${file}`);

        // Extract metrics from the current file
        const metrics = analyzeFile(file);

        // Aggregate the totals across all files
        totalFunctions += metrics.totalFunctions;
        totalClasses += metrics.totalClasses;
        totalInputParameters += metrics.inputParameters;
        totalMethodFrequencies += metrics.methodFrequencies.reduce((a, b) => a + b, 0);  // Sum of all methods in classes
        sumLcom += metrics.lcom;  // Add up LCOM for this file

        // Add unique parameters from this file to the global set
        metrics.uniqueParameters.forEach(param => uniqueParameters.add(param));
    });

    // Calculate the overall ALCOM
    const alcom = totalClasses > 0 ? (sumLcom / totalClasses) : 0;

    // Prepare the final sigma (Σ) results for output
    const finalMetrics = {
        totalFunctions,  // Σm: Total number of methods across all files
        totalClasses,    // ΣtotalClasses: Total number of classes across all files
        totalInputParameters,  // Σn: Total number of parameters across all files
        uniqueParameters: uniqueParameters.size,  // Σf: Total unique parameters across all files
        totalMethodFrequencies,  // Σmf: Total method frequencies across all files
        lcom: sumLcom,  // ΣLCOM: Total sum of LCOM across all classes
        alcom  // ALCOM: Overall ALCOM value
    };

    // Write the final result to a JSON file
    fs.writeFileSync('lcom_totals.json', JSON.stringify(finalMetrics, null, 4), 'utf-8');
    console.log('Total metrics including LCOM and ALCOM successfully written to lcom_totals.json');
}

// Get the directory from command line arguments and analyze the files
const directory = process.argv[2];
if (directory) {
    analyzeDirectory(directory);
} else {
    console.error('Please provide a directory containing TypeScript files.');
}
