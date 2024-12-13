import os
import json
import glob
import ast
import subprocess
import logging
from datetime import datetime
from collections import defaultdict
from typing import Dict, Any
import math

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class CodeMetrics:
    def __init__(self, directory: str, node_script_dir: str):
        self.directory = directory
        self.node_script_dir = node_script_dir
        self.history = defaultdict(list)
        self.log_data = []

    def scan_files(self) -> Dict[str, Any]:
        """Scan directory for JavaScript, TypeScript, and Python files"""
        files = {
            'js_files': glob.glob(os.path.join(self.directory, "**/*.js"), recursive=True),
            'ts_files': glob.glob(os.path.join(self.directory, "**/*.ts"), recursive=True),
            'dts_files': glob.glob(os.path.join(self.directory, "**/*.d.ts"), recursive=True),
            'py_files': glob.glob(os.path.join(self.directory, "**/*.py"), recursive=True)
        }
        return files

    def log_event(self, event: str, details: str):
        """Log events to both the logger and internal log data for JSON export"""
        timestamp = datetime.now().isoformat()
        log_entry = {'timestamp': timestamp, 'event': event, 'details': details}
        self.log_data.append(log_entry)
        logger.info(f"{event}: {details}")

    def analyze_js_ts_dts(self, file_path: str) -> Dict[str, Any]:
        """Analyze JavaScript, TypeScript, and TypeScript Declaration files using external tools"""
        try:
            if file_path.endswith('.js'):
                parser = 'esprima_parser.js'
                parser_path = os.path.join(self.node_script_dir, parser)
                self.log_event("Analyzing", f"JavaScript file with {parser}: {file_path}")
                process = subprocess.run(
                    ['node', parser_path, file_path], capture_output=True, text=True
                )
            elif file_path.endswith('.ts') and not file_path.endswith('.d.ts'):
                parser = 'ts_morph_parser.js'
                parser_path = os.path.join(self.node_script_dir, parser)
                self.log_event("Analyzing", f"TypeScript file with {parser}: {file_path}")
                process = subprocess.run(
                    ['node', parser_path, file_path], capture_output=True, text=True
                )
            elif file_path.endswith('.d.ts'):
                parser = 'ts_morph_parser.js'
                parser_path = os.path.join(self.node_script_dir, parser)
                self.log_event("Analyzing", f"TypeScript Declaration file with {parser}: {file_path}")
                process = subprocess.run(
                    ['node', parser_path, file_path], capture_output=True, text=True
                )
            else:
                self.log_event("Unsupported File", f"Unsupported file type for analysis: {file_path}")
                return {'error': 'Unsupported file type'}

            if process.returncode != 0:
                raise ValueError(f"Error processing {file_path}: {process.stderr}")

            return json.loads(process.stdout)  # Assuming JSON output from Node.js script
        except Exception as e:
            self.log_event("Error", f"Error analyzing file {file_path}: {str(e)}")
            return {'error': str(e)}

    def analyze_python(self, file_path: str) -> Dict[str, Any]:
        """Analyze Python files using AST"""
        try:
            with open(file_path, 'r', encoding='utf-8') as file:
                content = file.read()
                ast_tree = ast.parse(content)

            return {
                'file_path': file_path,
                'ast_nodes': len(list(ast.walk(ast_tree))),
                'timestamp': datetime.now().isoformat()
            }
        except Exception as e:
            self.log_event("Error", f"Error analyzing Python file {file_path}: {str(e)}")
            return {'error': str(e)}

    def analyze_file(self, file_path: str) -> Dict[str, Any]:
        """Analyze a single file based on its type"""
        if file_path.endswith('.js') or file_path.endswith('.ts') or file_path.endswith('.d.ts'):
            return self.analyze_js_ts_dts(file_path)
        elif file_path.endswith('.py'):
            return self.analyze_python(file_path)
        else:
            self.log_event("Unsupported File", f"Unsupported file type: {file_path}")
            return {'error': 'Unsupported file type'}

    def generate_report(self) -> Dict[str, Any]:
        """Generate a comprehensive analysis report"""
        files = self.scan_files()
        results = []

        for file_type, file_list in files.items():
            for file_path in file_list:
                try:
                    result = self.analyze_file(file_path)
                    results.append(result)
                except Exception as e:
                    self.log_event("Error", f"Error processing file {file_path}: {str(e)}")
                    results.append({
                        'file_path': file_path,
                        'error': str(e),
                        'timestamp': datetime.now().isoformat()
                    })

        return {
            'summary': {
                'total_files': sum(len(files_list) for files_list in files.values()),
                'files_analyzed': len(results),
                'analysis_timestamp': datetime.now().isoformat()
            },
            'results': results
        }

    def calculate_metrics(self, code_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Calculate various code metrics based on the extracted code data.
        Assumptions are made in calculating these metrics, and placeholders are used for some calculations.
        """
        # Metrics collection: initial analysis data
        total_functions_methods = len(code_data.get('functions', []))
        total_classes = len(code_data.get('classes', []))
        unique_parameters = len(set(code_data.get('unique_parameters', [])))
        method_frequencies = code_data.get('method_frequencies', [])
        inheritance_depth = 1  # Assumed depth
        external_dependencies = code_data.get('dependencies', 0)

        # ARQ: Availability and Reliability Quotient
        total_service_config_time = 1  # Placeholder
        total_issue_resolving_time = 1  # Placeholder
        total_service_requests = max(total_functions_methods, 1)
        arq = (total_service_config_time + total_issue_resolving_time) / total_service_requests

        # NOO: Number of Operations Per Microservice
        noo = total_functions_methods

        # SIDC: Service Interface Data Complexity
        sidc = inheritance_depth / max(total_classes, 1)

        # SAM: Service Autonomy Metric
        sam = 1 - (external_dependencies / max(total_classes, 1))

        # SGM: Service Granularity Metric
        dgs = self.calculate_dgs(code_data)
        fgs = self.calculate_fgs(code_data)
        sgm = dgs * fgs

        # LCOM: Lack of Cohesion of Methods
        lcom = self.calculate_lcom(code_data)

        # ALCOM: Average LCOM
        alcom = lcom / max(total_classes, 1)

        # CC: Cyclomatic Complexity
        cc = self.calculate_cyclomatic_complexity(code_data)

        # MI: Maintainability Index
        loc = code_data.get('lines_of_code', 1)
        halstead_volume = self.calculate_halstead_volume(code_data)
        mi = max(0, (171 - 5.2 * math.log(halstead_volume) - 0.23 * cc - 16.2 * math.log(loc)) * 100 / 171)

        return {
            'metrics': {
                'ARQ': arq,
                'NOO': noo,
                'SIDC': sidc,
                'SAM': sam,
                'SGM': sgm,
                'LCOM': lcom,
                'ALCOM': alcom,
                'CC': cc,
                'MI': mi
            },
            'data_used_for_calculation': {
                'total_functions_methods': total_functions_methods,
                'total_classes': total_classes,
                'unique_parameters': unique_parameters,
                'method_frequencies': method_frequencies,
                'external_dependencies': external_dependencies,
                'inheritance_depth': inheritance_depth
            }
        }

    def calculate_dgs(self, code_data: Dict[str, Any]) -> float:
        """Calculate Data Granularity of Service (DGS)"""
        ipr = len(code_data.get('unique_parameters', [])) / max(len(code_data.get('functions', [])), 1)
        opr = len(code_data.get('method_frequencies', [])) / max(len(code_data.get('classes', [])), 1)
        return ipr + opr

    def calculate_fgs(self, code_data: Dict[str, Any]) -> float:
        """Calculate Functional Granularity of Service (FGS)"""
        operation_types = len(set([f.get('name') for f in code_data.get('functions', [])]))
        return operation_types / max(len(code_data.get('classes', [])), 1)

    def calculate_lcom(self, code_data: Dict[str, Any]) -> float:
        """Calculate Lack of Cohesion of Methods (LCOM)"""
        mf = sum(code_data.get('method_frequencies', []))
        n = code_data.get('total_parameters', 1)
        m = len(code_data.get('functions', []))
        f = len(set(code_data.get('unique_parameters', [])))
        return 1 - ((mf / n) / (m * f))

    def calculate_cyclomatic_complexity(self, code_data: Dict[str, Any]) -> int:
        """Calculate Cyclomatic Complexity (CC)"""
        edges = code_data.get('edges', 0)
        nodes = code_data.get('nodes', 0)
        connected_components = 1  # Assuming one connected component
        return edges - nodes + 2 * connected_components

    def calculate_halstead_volume(self, code_data: Dict[str, Any]) -> float:
        """Calculate Halstead Volume"""
        n1 = len(set([node for node in ast.walk(code_data) if isinstance(node, ast.Name)]))
        n2 = len([node for node in ast.walk(code_data) if isinstance(node, ast.Constant)])
        n = n1 + n2
        n_hat = n1 * math.log(n2 + 1)  # Number of unique operands and operators
        return n_hat

    def save_report(self, report: Dict[str, Any], output_file: str):
        """Save the analysis report and data used for calculation to a JSON file"""
        try:
            with open(output_file, 'w', encoding='utf-8') as f:
                json.dump(report, f, indent=2)
            self.log_event("Report Saved", f"Report saved to {output_file}")
        except Exception as e:
            self.log_event("Error", f"Error saving report: {str(e)}")

    def save_log(self, log_file: str):
        """Save the log data to a JSON file"""
        try:
            with open(log_file, 'w', encoding='utf-8') as f:
                json.dump(self.log_data, f, indent=2)
            logger.info(f"Log saved to {log_file}")
        except Exception as e:
            logger.error(f"Error saving log: {str(e)}")

def get_node_script_directory() -> str:
    """Returns the directory where the Node.js parser scripts are located."""
    return '/home/alvn/Documents/Playground/rsbp_testing/data-collection/'

def main():
    """Main entry point for the code quality analyzer"""
    try:
        directory = input("\nMasukkan path direktori yang akan dianalisis: ").strip()
        directory = os.path.abspath(directory)

        if not os.path.isdir(directory):
            print("Error: Path yang dimasukkan bukan direktori yang valid.")
            return

        node_script_dir = get_node_script_directory()
        if not os.path.isdir(node_script_dir):
            print(f"Error: Direktori skrip Node.js tidak ditemukan: {node_script_dir}")
            return

        esprima_parser = os.path.join(node_script_dir, 'esprima_parser.js')
        ts_morph_parser = os.path.join(node_script_dir, 'ts_morph_parser.js')

        if not os.path.isfile(esprima_parser):
            print(f"Error: Skrip parser JavaScript tidak ditemukan: {esprima_parser}")
            return
        if not os.path.isfile(ts_morph_parser):
            print(f"Error: Skrip parser TypeScript tidak ditemukan: {ts_morph_parser}")
            return

        print("\nMemulai analisis kode...")

        analyzer = CodeMetrics(directory, node_script_dir)
        report = analyzer.generate_report()

        # Collect data and calculate metrics for all results
        complete_data = {
            'summary': report['summary'],
            'results': []
        }

        for result in report['results']:
            if 'error' not in result:
                metrics_data = analyzer.calculate_metrics(result)
                complete_data['results'].append(metrics_data)

        analyzer.save_report(complete_data, 'code_analysis.json')
        analyzer.save_log('code_analysis_log.json')

        print("\n=== Ringkasan Analisis Kode ===")
        print(f"Directory yang dianalisis: {directory}")
        print(f"Total file yang dianalisis: {report['summary']['total_files']}")
        print(f"File yang dianalisis: {report['summary']['files_analyzed']}")
        print(f"\nLaporan lengkap disimpan di: code_analysis.json")
        print(f"Log aktivitas disimpan di: code_analysis_log.json")

    except KeyboardInterrupt:
        print("\n\nProgram dihentikan oleh pengguna.")
    except Exception as e:
        print(f"\nTerjadi error: {str(e)}")
        logger.error(f"Unexpected error: {str(e)}", exc_info=True)
    finally:
        print("\nProgram selesai.")

if __name__ == '__main__':
    main()
