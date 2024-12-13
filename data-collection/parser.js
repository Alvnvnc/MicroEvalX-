const ts = require('typescript');
const acorn = require('acorn');
const esprima = require('esprima');
const fs = require('fs');
const path = require('path');
const _ = require('lodash');
const glob = require('glob');

// Function to parse a file and extract metrics
function analyzeFile(filePath) {
    const code = fs.readFileSync(filePath, 'utf-8');
    const isTSFile = filePath.endsWith('.ts');  // Check if the file is TypeScript
    const isJSFile = filePath.endsWith('.js');  // Check if the file is JavaScript
    let sourceFile;

    if (isTSFile) {
        sourceFile = ts.createSourceFile(filePath, code, ts.ScriptTarget.Latest, true);
    } else if (isJSFile) {
        sourceFile = esprima.parseScript(code, { tolerant: true, loc: true });
    } else {
        sourceFile = acorn.parse(code, { ecmaVersion: 2020 });
    }

    let result = {
        filePath: filePath,
        totalFunctions: 0,      // NOO (Number of Operations)
        totalClasses: 0,        // SIDC (Service Interface Data Complexity)
        totalClassesInheritance: 0, // For SIDC: Count classes with inheritance
        externalDependencies: 0, // For SAM: Count external dependencies
        totalServices: 1,       // Total services for SAM (default to 1)
        methodFrequencies: 0,   // Used for LCOM
        uniqueParameters: new Set(), // Track unique parameters (for LCOM)
        totalParameters: 0,     // Total number of parameters (for LCOM)
        totalMethods: 0,        // Number of methods (for ALCOM)
        totalInputParameters: 0, // Used for DGS (SGM)
        totalOutputParameters: 0, // Used for DGS (SGM)
        operationWeights: 0,    // Used for FGS (SGM)
        totalWeights: 0,        // Total weights for FGS (SGM)
        edges: 0,               // Cyclomatic Complexity (CC)
        nodes: 0,               // Cyclomatic Complexity (CC)
        connectedComponents: 0, // Cyclomatic Complexity (CC)
        linesOfCode: 0,         // MI (Maintainability Index)
        commentDensity: 0,      // MI (Maintainability Index)
        serviceConfigTimes: [], // ARQ (Service Configuration Times)
        issueResolvingTimes: [], // ARQ (Issue Resolving Times)
        totalServiceRequests: 0, // ARQ (Total Service Requests)
    };

    // Helper function to traverse AST nodes
    function visit(node, parent) {
        if (isTSFile) {
            switch (node.kind) {
                case ts.SyntaxKind.FunctionDeclaration:
                case ts.SyntaxKind.FunctionExpression:
                    result.totalFunctions += 1;
                    result.connectedComponents += 1;
                    if (node.body) {  // Make sure node has a body
                        countParameters(node);
                    }
                    break;
                case ts.SyntaxKind.MethodDeclaration:
                    result.totalMethods += 1;  // Methods are counted for LCOM
                    if (node.body) {  // Make sure node has a body
                        countParameters(node);
                    }
                    break;
                case ts.SyntaxKind.ClassDeclaration:
                    result.totalClasses += 1;
                    result.connectedComponents += 1;
                    if (node.heritageClauses) {
                        result.totalClassesInheritance += node.heritageClauses.length; // Count inheritance depth for SIDC
                    }
                    if (node.members) {
                        node.members.forEach(member => visit(member));
                    }
                    break;
                case ts.SyntaxKind.ImportDeclaration:
                    result.externalDependencies += 1;  // Count imports as external dependencies for SAM
                    break;
                case ts.SyntaxKind.IfStatement:
                case ts.SyntaxKind.ForStatement:
                case ts.SyntaxKind.WhileStatement:
                case ts.SyntaxKind.SwitchStatement:
                    result.nodes += 1;
                    result.edges += 2;
                    break;
            }
            ts.forEachChild(node, visit);
        } else if (isJSFile) {
            // For JavaScript, use AST traversal with Esprima
            switch (node.type) {
                case 'FunctionDeclaration':
                case 'FunctionExpression':
                case 'ArrowFunctionExpression':
                    result.totalFunctions += 1;
                    result.connectedComponents += 1;
                    if (node.body) {
                        countParameters(node);
                    }
                    break;
                case 'MethodDefinition':
                    result.totalMethods += 1;  // Methods are counted for LCOM
                    if (node.value && node.value.body) {
                        countParameters(node.value);
                    }
                    break;
                case 'ClassDeclaration':
                    result.totalClasses += 1;
                    result.connectedComponents += 1;
                    if (node.superClass) {
                        result.totalClassesInheritance += 1;  // Count inheritance in JavaScript
                    }
                    if (node.body && node.body.body) {
                        node.body.body.forEach(member => visit(member));
                    }
                    break;
                case 'ImportDeclaration':
                    result.externalDependencies += 1;  // Count imports as external dependencies for SAM
                    break;
                case 'IfStatement':
                case 'ForStatement':
                case 'WhileStatement':
                case 'SwitchStatement':
                    result.nodes += 1;
                    result.edges += 2;
                    break;
            }
        }
    }

    function countParameters(node) {
        // Count the number of parameters and their frequencies
        const parameters = node.parameters ? node.parameters : (node.params || []);
        parameters.forEach(param => {
            result.methodFrequencies += 1;
            result.uniqueParameters.add(param.name ? param.name.text : param.name);
            result.totalParameters += 1;

            // Input/output parameter counts for SGM calculation
            if (param.inType === 'input') {
                result.totalInputParameters += 1;
            }
            if (param.outType === 'output') {
                result.totalOutputParameters += 1;
            }

            // Randomly allocate weights for SGM calculation
            result.operationWeights += Math.random(); // Mock weights for individual operations
            result.totalWeights += 1;  // Increment total weights
        });
    }

    // Parse the file and process nodes
    if (isTSFile) {
        visit(sourceFile);  // Visit nodes in TypeScript files
    } else {
        visit(sourceFile);  // Visit nodes in JavaScript files
    }

    // Count comments and lines of code
    const commentRegex = /\/\/.*|\/\*[\s\S]*?\*\//g;
    result.commentDensity = (code.match(commentRegex) || []).length;
    result.linesOfCode = code.split('\n').length;

    // Default values for ARQ calculations
    result.serviceConfigTimes.push(Math.random() * 100); // Mock service configuration time
    result.issueResolvingTimes.push(Math.random() * 50); // Mock issue resolving time
    result.totalServiceRequests = result.totalServiceRequests || 1;  // Ensure service requests are non-zero

    return result;
}

// Traverse directories and subdirectories recursively using glob
function analyzeDirectory(dir) {
    const results = [];
    const files = glob.sync(path.join(dir, '**/*.{ts,js}'));  // Include both .ts and .js files
    files.forEach(file => {
        const metrics = analyzeFile(file);
        if (metrics) results.push(metrics);
    });

    // Combine results across all files
    const totalMetrics = {
        totalFunctions: _.sumBy(results, 'totalFunctions'),           // NOO
        totalClasses: _.sumBy(results, 'totalClasses'),               // SIDC
        totalClassesInheritance: _.sumBy(results, 'totalClassesInheritance'), // SIDC Inheritance Depth
        methodFrequencies: _.sumBy(results, 'methodFrequencies'),     // Used for LCOM
        uniqueParameters: _.sum(results.map(r => r.uniqueParameters.size)), // Count of unique parameters (LCOM)
        totalParameters: _.sumBy(results, 'totalParameters'),         // Total parameters (LCOM)
        totalMethods: _.sumBy(results, 'totalMethods'),               // Used for ALCOM
        totalInputParameters: _.sumBy(results, 'totalInputParameters'), // Used for SGM (DGS)
        totalOutputParameters: _.sumBy(results, 'totalOutputParameters'), // Used for SGM (DGS)
        operationWeights: _.sumBy(results, 'operationWeights'),       // Used for FGS (SGM)
        totalWeights: _.sumBy(results, 'totalWeights'),               // Total weights for FGS
        externalDependencies: _.sumBy(results, 'externalDependencies'), // SAM
        totalServices: results.length,                               // Total services for SAM
        edges: _.sumBy(results, 'edges'),                             // CC
        nodes: _.sumBy(results, 'nodes'),                             // CC
        connectedComponents: _.sumBy(results, 'connectedComponents'), // CC
        linesOfCode: _.sumBy(results, 'linesOfCode'),                 // MI
        commentDensity: _.sumBy(results, 'commentDensity'),           // MI
        serviceConfigTimes: _.flatten(_.map(results, 'serviceConfigTimes')), // ARQ
        issueResolvingTimes: _.flatten(_.map(results, 'issueResolvingTimes')), // ARQ
        totalServiceRequests: _.sumBy(results, 'totalServiceRequests'), // ARQ
        totalFilesProcessed: files.length,                            // Total number of files processed
        filesProcessed: files                                         // List of all files processed
    };

    return totalMetrics;
}

// Parse the directory passed as an argument
const dirPath = process.argv[2];
const metrics = analyzeDirectory(dirPath);

// Return the result as JSON to be read by Ruby, including file tracking
console.log(JSON.stringify(metrics, null, 2));  // Prettified JSON output
