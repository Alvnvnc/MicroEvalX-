const { Project } = require('ts-morph');
const fs = require('fs');

// Function to analyze TypeScript files and extract metrics
function analyzeFile(filePath) {
  const project = new Project();
  const sourceFile = project.addSourceFileAtPath(filePath);

  let totalFunctions = 0;   // m: Total number of methods (or functions)
  let totalClasses = 0;     // Total number of classes
  let inputParameters = 0;  // n: Total number of parameters across all methods
  let uniqueParameters = new Set();  // f: Unique parameters used across methods
  let methodFrequencies = [];  // mf: Track method counts for each class
  let currentClassMethods = 0; // Number of methods in the current class

  // Analyze classes and functions
  sourceFile.forEachDescendant((node) => {
    if (node.getKindName() === 'FunctionDeclaration' || node.getKindName() === 'MethodDeclaration') {
      totalFunctions += 1;  // Count total functions/methods (m)
      inputParameters += node.getParameters().length;  // Count total input parameters (n)

      // Track unique parameters (f)
      node.getParameters().forEach(param => uniqueParameters.add(param.getName()));

      // Track the number of methods within the current class
      currentClassMethods += 1;
    } else if (node.getKindName() === 'ClassDeclaration') {
      if (currentClassMethods > 0) {
        methodFrequencies.push(currentClassMethods); // Push the method count for the class (mf)
        currentClassMethods = 0;  // Reset for next class
      }
      totalClasses += 1;  // Count the total number of classes
    }
  });

  // In case the file ends with an active class
  if (currentClassMethods > 0) {
    methodFrequencies.push(currentClassMethods);
  }

  // Output the metrics
  return {
    totalFunctions,  // m: Total number of methods (or functions)
    totalClasses,    // Total number of classes
    inputParameters, // n: Total number of parameters
    uniqueParameters: Array.from(uniqueParameters),  // f: Unique parameters
    methodFrequencies,  // mf: Method frequencies per class
  };
}

// Main code to execute the analysis
const filePath = process.argv[2];
const result = analyzeFile(filePath);
console.log(JSON.stringify(result, null, 2));
