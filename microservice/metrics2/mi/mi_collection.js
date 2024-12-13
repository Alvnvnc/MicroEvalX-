const { Project } = require('ts-morph');
const fs = require('fs');
const path = require('path');

// Helper function to calculate logarithms with safety for small values
function safeLog(value) {
    return value > 0 ? Math.log(value) : 0;
}

// Function to calculate MI based on the formula
function calculateMI(loc, cyclomaticComplexity, halsteadVolume, commentDensity) {
    const mi = (171 - 5.2 * safeLog(loc) - 0.23 * cyclomaticComplexity - 16.2 * safeLog(halsteadVolume) + 50 * commentDensity) * (100 / 171);
    return mi;
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

// Function to analyze each file and extract necessary metrics for MI calculation
function analyzeFile(filePath) {
    const project = new Project();
    const sourceFile = project.addSourceFileAtPath(filePath);

    // Initialize variables for LOC, Cyclomatic Complexity, Halstead Volume, and Comment Density
    let loc = 0;
    let cyclomaticComplexity = 0;
    let halsteadVolume = 0;
    let commentLines = 0;
    let totalLines = 0;

    // Traverse the source file and extract the required data
    sourceFile.forEachDescendant((node) => {
        const nodeKind = node.getKindName();

        // Calculate LOC (Lines of Code)
        if (nodeKind === 'FunctionDeclaration' || nodeKind === 'MethodDeclaration') {
            loc += node.getEndLineNumber() - node.getStartLineNumber();
            cyclomaticComplexity += 1;  // Add 1 to cyclomatic complexity for each function
        }

        // Check for conditionals or loops to add to cyclomatic complexity
        if (nodeKind === 'IfStatement' || nodeKind === 'ForStatement' || nodeKind === 'WhileStatement' ||
            nodeKind === 'SwitchStatement' || nodeKind === 'DoStatement') {
            cyclomaticComplexity += 1;
        }

        // Calculate comment density
        if (nodeKind === 'SingleLineCommentTrivia' || nodeKind === 'MultiLineCommentTrivia') {
            commentLines += 1;
        }

        // Estimate Halstead Volume (simplified calculation)
        if (nodeKind === 'Identifier' || nodeKind === 'Literal') {
            halsteadVolume += 1;
        }
    });

    totalLines = sourceFile.getEndLineNumber();  // Get total lines in the file
    const commentDensity = totalLines > 0 ? commentLines / totalLines : 0;  // Calculate comment density

    // Calculate MI for this file using the provided formula
    const mi = calculateMI(loc, cyclomaticComplexity, halsteadVolume, commentDensity);

    return { loc, cyclomaticComplexity, halsteadVolume, commentDensity, mi };
}

// Main function to analyze all TypeScript and JavaScript files in the given directory (recursively)
function analyzeDirectory(directory) {
    const scriptFiles = findAllScriptFiles(directory);

    // Initialize cumulative totals
    let totalLoc = 0;
    let totalCyclomaticComplexity = 0;
    let totalHalsteadVolume = 0;
    let totalCommentDensity = 0;
    let totalFiles = 0;
    let totalMI = 0;

    scriptFiles.forEach(file => {
        console.log(`Analyzing file: ${file}`);

        // Analyze the file and calculate MI
        const metrics = analyzeFile(file);

        // Accumulate the results across all files
        totalLoc += metrics.loc;
        totalCyclomaticComplexity += metrics.cyclomaticComplexity;
        totalHalsteadVolume += metrics.halsteadVolume;
        totalCommentDensity += metrics.commentDensity;
        totalFiles += 1;
        totalMI += metrics.mi;
    });

    // Calculate the final average MI
    const avgCommentDensity = totalFiles > 0 ? totalCommentDensity / totalFiles : 0;
    const avgMI = totalFiles > 0 ? totalMI / totalFiles : 0;

    // Prepare the final cumulative results
    const finalMetrics = {
        totalLoc,                // Total Lines of Code (LOC)
        totalCyclomaticComplexity,  // Total Cyclomatic Complexity (CC)
        totalHalsteadVolume,     // Total Halstead Volume
        avgCommentDensity,       // Average Comment Density
        avgMI                    // Average Maintainability Index (MI)
    };

    // Write the final result to a JSON file
    fs.writeFileSync('mi_totals.json', JSON.stringify(finalMetrics, null, 4), 'utf-8');
    console.log('Cumulative totals successfully written to mi_totals.json');
}

// Get the directory from command line arguments and analyze the files
const directory = process.argv[2];
if (directory) {
    analyzeDirectory(directory);
} else {
    console.error('Please provide a directory containing TypeScript or JavaScript files.');
}
