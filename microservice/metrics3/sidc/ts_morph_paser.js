const { Project, Node } = require('ts-morph');
const fs = require('fs');
const path = require('path');

// Function to calculate the inheritance depth of a class
function getInheritanceDepth(classDeclaration) {
    let depth = 1;
    let currentClass = classDeclaration;

    try {
        while (currentClass.getExtends()) {
            const extendsExpression = currentClass.getExtends().getExpression();
            const baseClassType = extendsExpression.getType();

            const baseClassSymbol = baseClassType.getSymbol();
            if (!baseClassSymbol) break;

            const baseClassDeclaration = baseClassSymbol.getDeclarations()[0];
            if (!Node.isClassDeclaration(baseClassDeclaration)) break;

            currentClass = baseClassDeclaration;
            depth += 1;
        }
    } catch (error) {
        console.error(`Error calculating inheritance depth: ${error.message}`);
    }

    return depth;
}

// Function to analyze TypeScript/JavaScript files and extract the total number of classes and inheritance depth
function analyzeFile(filePath) {
    const project = new Project({
        // Allow JS file analysis
        compilerOptions: {
            allowJs: true
        }
    });
    const sourceFile = project.addSourceFileAtPath(filePath);

    let totalClasses = 0;
    let maxInheritanceDepth = 0;

    sourceFile.forEachDescendant((node) => {
        if (Node.isClassDeclaration(node)) {
            totalClasses += 1;

            const depth = getInheritanceDepth(node);
            if (depth > maxInheritanceDepth) {
                maxInheritanceDepth = depth;
            }
        }
    });

    return { totalClasses, maxInheritanceDepth };
}

// Function to recursively find all relevant files in a directory
function findAllRelevantFiles(directory) {
    let relevantFiles = [];
    const items = fs.readdirSync(directory);

    items.forEach(item => {
        const fullPath = path.join(directory, item);
        const stats = fs.statSync(fullPath);

        if (stats.isDirectory()) {
            relevantFiles = relevantFiles.concat(findAllRelevantFiles(fullPath));
        } else if (item.endsWith('.ts') || item.endsWith('.js') || item.endsWith('.d.ts')) {
            relevantFiles.push(fullPath);
        }
    });

    return relevantFiles;
}

// Main function to analyze all files and calculate SIDC (Service Interface Data Complexity)
function analyzeDirectoryForSIDC(directory) {
    const relevantFiles = findAllRelevantFiles(directory);

    let totalClasses = 0;
    let maxInheritanceDepth = 0;

    relevantFiles.forEach(file => {
        console.log(`Analyzing file: ${file}`);

        try {
            const { totalClasses: classesInFile, maxInheritanceDepth: inheritanceDepthInFile } = analyzeFile(file);
            totalClasses += classesInFile;
            if (inheritanceDepthInFile > maxInheritanceDepth) {
                maxInheritanceDepth = inheritanceDepthInFile;
            }
        } catch (error) {
            console.error(`Error analyzing file ${file}: ${error.message}`);
        }
    });

    const sidc = maxInheritanceDepth / Math.max(totalClasses, 1);

    const finalMetrics = {
        totalClasses,
        maxInheritanceDepth,
        sidc
    };

    fs.writeFileSync('sidc_totals.json', JSON.stringify(finalMetrics, null, 4), 'utf-8');
    console.log('SIDC metric successfully written to sidc_totals.json');
}

const directory = process.argv[2];
if (directory) {
    analyzeDirectoryForSIDC(directory);
} else {
    console.error('Please provide a directory containing TypeScript/JavaScript files.');
}
