const esprima = require('esprima');
const estraverse = require('estraverse');
const fs = require('fs');

// Function to analyze the AST and extract relevant metrics
function analyzeFile(content) {
  const ast = esprima.parseScript(content, { loc: true, comment: true });

  let metrics = {
    totalFunctions: 0,
    totalClasses: 0,
    totalImports: 0,
    inputParameters: 0,
    uniqueParameters: new Set(),  // Store unique parameters
    methodFrequencies: [],
    currentClassMethods: 0,
  };

  // Traverse AST to count functions, classes, imports, and other metrics
  estraverse.traverse(ast, {
    enter: function (node) {
      switch (node.type) {
        case 'FunctionDeclaration':
        case 'FunctionExpression':
        case 'ArrowFunctionExpression':
          metrics.totalFunctions += 1;
          metrics.inputParameters += node.params.length;
          
          // Track unique parameters
          node.params.forEach(param => metrics.uniqueParameters.add(param.name));
          metrics.currentClassMethods += 1;
          break;
        case 'ClassDeclaration':
          if (metrics.currentClassMethods > 0) {
            metrics.methodFrequencies.push(metrics.currentClassMethods);
            metrics.currentClassMethods = 0;
          }
          metrics.totalClasses += 1;
          break;
        case 'ImportDeclaration':
          metrics.totalImports += 1;
          break;
      }
    },
    leave: function (node) {
      if (node.type === 'ClassDeclaration' && metrics.currentClassMethods > 0) {
        metrics.methodFrequencies.push(metrics.currentClassMethods);
        metrics.currentClassMethods = 0;
      }
    }
  });

  // Convert Set to Array for unique parameters
  metrics.uniqueParameters = Array.from(metrics.uniqueParameters);

  return metrics;
}

// Main code to execute the analysis
const filePath = process.argv[2];
const content = fs.readFileSync(filePath, 'utf8');
const result = analyzeFile(content);
console.log(JSON.stringify(result, null, 2));
