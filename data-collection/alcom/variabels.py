import os
import subprocess
import json
import glob

def analyze_js_ts_file(file_path):
    """Use Acorn via Node.js to parse a JavaScript/TypeScript file and extract relevant metrics"""
    
    try:
        # Use subprocess to run Acorn as a Node.js command
        result = subprocess.run(
            ['node', '-e', f'''
                const acorn = require('acorn');
                const fs = require('fs');
                const content = fs.readFileSync("{file_path}", 'utf-8');
                const ast = acorn.parse(content, {{ ecmaVersion: "latest", sourceType: "module" }});
                let metrics = {{
                    totalFunctions: 0,
                    totalClasses: 0,
                    inputParameters: 0,
                    uniqueParameters: new Set(),
                    methodFrequencies: [],
                    currentClassMethods: 0
                }};

                function traverse(node, parent) {{
                    if (node.type === 'FunctionDeclaration' || node.type === 'MethodDefinition') {{
                        metrics.totalFunctions += 1;
                        if (node.params) {{
                            metrics.inputParameters += node.params.length;
                            node.params.forEach(param => {{
                                if (param.name) {{
                                    metrics.uniqueParameters.add(param.name);
                                }}
                            }});
                        }}
                        metrics.currentClassMethods += 1;
                    }} else if (node.type === 'ClassDeclaration') {{
                        metrics.totalClasses += 1;
                        if (metrics.currentClassMethods > 0) {{
                            metrics.methodFrequencies.push(metrics.currentClassMethods);
                            metrics.currentClassMethods = 0;
                        }}
                    }}
                }}

                function walkAST(node, parent) {{
                    traverse(node, parent);
                    for (const key in node) {{
                        const child = node[key];
                        if (Array.isArray(child)) {{
                            child.forEach(c => walkAST(c, node));
                        }} else if (child && typeof child.type === 'string') {{
                            walkAST(child, node);
                        }}
                    }}
                }}

                walkAST(ast, null);

                // In case the file ends with an active class
                if (metrics.currentClassMethods > 0) {{
                    metrics.methodFrequencies.push(metrics.currentClassMethods);
                }}

                // Convert the unique parameters set to an array
                metrics.uniqueParameters = Array.from(metrics.uniqueParameters);

                console.log(JSON.stringify(metrics));
            '''],
            capture_output=True,
            text=True
        )

        if result.returncode == 0:
            return json.loads(result.stdout)  # Return the parsed metrics as a dictionary
        else:
            print(f"Error parsing file {file_path}: {result.stderr}")
            return None

    except Exception as e:
        print(f"Error while analyzing file {file_path}: {str(e)}")
        return None

def analyze_directory(directory):
    """Analyze all JavaScript/TypeScript files in a directory and save the result to lcom.json"""
    js_ts_files = glob.glob(os.path.join(directory, '**/*.js'), recursive=True) + \
                  glob.glob(os.path.join(directory, '**/*.ts'), recursive=True)

    all_metrics = []

    # Analyze each file and collect the metrics
    for file_path in js_ts_files:
        file_metrics = analyze_js_ts_file(file_path)
        if file_metrics:
            all_metrics.append({
                'file_path': file_path,
                'metrics': file_metrics
            })

    # Save the results to lcom.json
    with open('lcom.json', 'w', encoding='utf-8') as f:
        json.dump(all_metrics, f, indent=4)

    print(f"Analysis complete. Results saved to lcom.json.")

if __name__ == '__main__':
    directory = input("Enter the directory to analyze: ").strip()
    if os.path.isdir(directory):
        analyze_directory(directory)
    else:
        print(f"Error: {directory} is not a valid directory.")
