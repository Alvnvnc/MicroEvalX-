const { Project } = require('ts-morph');
const fs = require('fs');
const path = require('path');

// Function to calculate SGM based on the formula
function calculateSGM(ipr, fp, opr, cp, ot, total_weights) {
    // Calculate DGS (Data Granularity of Service)
    const dgs = (ipr / fp) + (opr / cp);
    
    // Calculate FGS (Functional Granularity of Service)
    const fgs = ot / total_weights;

    // Calculate final SGM
    return { dgs, fgs, sgm: dgs * fgs };
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

// Function to analyze each file and extract necessary parameters for SGM calculation
function analyzeFile(filePath) {
    const project = new Project();
    const sourceFile = project.addSourceFileAtPath(filePath);

    // Initialize variables for the calculation
    let ipr = 0;  // Input parameters (ipr)
    let fp = 0;   // Function parameters (fp)
    let opr = 0;  // Output parameters (opr)
    let cp = 0;   // Class parameters (cp)
    let ot = 0;   // Operation time (ot)
    let totalWeights = 0;  // Total weights (total_weights)

    // Traverse the source file and extract the required data
    sourceFile.forEachDescendant((node) => {
        const nodeKind = node.getKindName();

        // Check for function or method declaration
        if (nodeKind === 'FunctionDeclaration' || nodeKind === 'MethodDeclaration') {
            // Count input parameters for this function
            ipr += node.getParameters().length;
            fp += node.getParameters().length;  // Function parameters are the same as input in this context
            
            // Simulate an output parameter and operation time (ot)
            opr += 1;  // Assuming each function has 1 output (adjust as needed)
            ot += 10;  // Simulating an arbitrary operation time for this example
        }

        // Check for class declaration to count class parameters
        if (nodeKind === 'ClassDeclaration') {
            cp += 1;  // Simulating class having 1 parameter (adjust as needed)
        }
    });

    // Simulate total_weights based on the number of functions/methods found
    totalWeights = fp + cp;  // Adjust this logic based on real data extraction

    // Calculate SGM using the extracted parameters
    const { dgs, fgs, sgm } = calculateSGM(ipr, fp, opr, cp, ot, totalWeights);

    return { ipr, fp, opr, cp, ot, totalWeights, dgs, fgs, sgm };
}

// Main function to analyze all TypeScript and JavaScript files in the given directory (recursively)
function analyzeDirectory(directory) {
    const scriptFiles = findAllScriptFiles(directory);

    // Initialize cumulative totals
    let totalIpr = 0;
    let totalFp = 0;
    let totalOpr = 0;
    let totalCp = 0;
    let totalOt = 0;
    let totalWeights = 0;

    scriptFiles.forEach(file => {
        console.log(`Analyzing file: ${file}`);

        // Analyze the file and calculate SGM
        const metrics = analyzeFile(file);

        // Accumulate the results across all files
        totalIpr += metrics.ipr;
        totalFp += metrics.fp;
        totalOpr += metrics.opr;
        totalCp += metrics.cp;
        totalOt += metrics.ot;
        totalWeights += metrics.totalWeights;
    });

    // Calculate the cumulative DGS, FGS, and SGM
    const totalDgs = (totalIpr / totalFp) + (totalOpr / totalCp);
    const totalFgs = totalOt / totalWeights;
    const totalSgm = totalDgs * totalFgs;

    // Prepare the final cumulative results
    const finalMetrics = {
        totalIpr,      // Total Input Parameters
        totalFp,       // Total Function Parameters
        totalOpr,      // Total Output Parameters
        totalCp,       // Total Class Parameters
        totalOt,       // Total Operation Time
        totalWeights,  // Total Weights
        totalDgs,      // Total Data Granularity of Service (DGS)
        totalFgs,      // Total Functional Granularity of Service (FGS)
        totalSgm       // Total Service Granularity Metric (SGM)
    };

    // Write the final result to a JSON file
    fs.writeFileSync('sgm_totals.json', JSON.stringify(finalMetrics, null, 4), 'utf-8');
    console.log('Cumulative totals including DGS, FGS, and SGM successfully written to sgm_totals.json');
}

// Get the directory from command line arguments and analyze the files
const directory = process.argv[2];
if (directory) {
    analyzeDirectory(directory);
} else {
    console.error('Please provide a directory containing TypeScript or JavaScript files.');
}
