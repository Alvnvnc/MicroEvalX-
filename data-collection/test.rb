require 'json'

class ServiceAnalysis
  attr_accessor :variables, :results, :calculation_history

  def initialize(root_directory)
    @root_directory = root_directory
    @variables = {}
    @results = {}
    @calculation_history = {}
  end

  def handle_nan(value)
    return 0 if value.nil? || value.to_f.nan? || value.to_f.infinite?
    value
  end

  # Extract variables from the entire directory
  def extract_variables_from_files
    metrics = parse_directory_with_node(@root_directory)
    process_content(metrics)
  end

  # Invoke the Node.js parser and capture the result
  def parse_directory_with_node(dir)
    output = `node parser.js #{dir}`
    parsed_output = JSON.parse(output) rescue {}

    # Capture the number of files and directories processed
    @results[:files_checked] = parsed_output['totalFilesProcessed'] || 0
    @results[:files_processed] = parsed_output['filesProcessed'] || []
    @variables = parsed_output  # Save all extracted variables in the JSON file

    parsed_output  # Return the parsed metrics
  end

  # Process metrics returned from Node.js and calculate relevant metrics
  def process_content(metrics)
    total_functions = metrics['totalFunctions'] || 0
    total_classes = metrics['totalClasses'] || 0
    total_imports = metrics['totalImports'] || 0
    inheritance_depth = metrics['inheritanceDepth'] || 0
    ipr = metrics['inputParameters'] || 0
    fp = metrics['totalInputParameters'] || 1
    opr = metrics['outputParameters'] || 0
    cp = metrics['totalOutputParameters'] || 1
    ot = metrics['operationWeights'] || 0
    total_weights = metrics['totalWeights'] || 1
    total_operations = metrics['totalOperations'] || 1
    mf = metrics['methodFrequencies'] || 0
    f = metrics['uniqueParameters'] || 1
    n = metrics['totalParameters'] || 1
    edges = metrics['edges'] || 0
    nodes = metrics['nodes'] || 0
    connected_components = metrics['connectedComponents'] || total_functions
    loc = metrics['linesOfCode'] || 1
    comment_density = metrics['commentDensity'] || 0
    service_config_times = metrics['serviceConfigTimes'] || []
    issue_resolving_times = metrics['issueResolvingTimes'] || []
    total_service_requests = metrics['totalServiceRequests'] || 1
    shared_variables = metrics['totalSharedVariables'] || 0
    methods_in_class = metrics['totalMethodsInClasses'] || 0

    # Calculate ARQ
    calculate_arq(service_config_times, issue_resolving_times, total_service_requests)

    # Calculate NOO (Number of Operations Per Microservice)
    calculate_noo(total_functions)

    # Calculate SIDC (Service Interface Data Complexity)
    calculate_sidc(inheritance_depth, total_classes)
    
    # Calculate SAM (Service Autonomy Metric)
    calculate_sam(total_imports, total_classes)

    # Calculate SGM (Service Granularity Metric)
    calculate_sgm(ipr, fp, opr, cp, ot, total_weights)

    # Calculate LCOM and ALCOM (Lack of Cohesion of Methods)
    calculate_alcom(mf, n, total_functions, f)

    # Calculate Cyclomatic Complexity (CC)
    calculate_cc(edges, nodes, connected_components)

    # Calculate Maintainability Index (MI)
    calculate_mi(loc, nodes, loc, comment_density)
  end

  # LCOM and ALCOM Calculation
  def calculate_alcom(mf, n, m, f)
    if m == 0 || f == 0 || n == 0
      lcom = 1  # Default value if parameters are missing
    else
      lcom = 1 - ((mf.to_f / n) / (m * f))
    end

    @results[:LCOM] ||= []
    @results[:LCOM] << handle_nan(lcom)  # Store LCOM for each microservice

    # Calculate ALCOM as the average of all LCOM values
    alcom = @results[:LCOM].sum / @results[:LCOM].size.to_f
    @results[:ALCOM] = handle_nan(alcom)

    log_calculation(:LCOM, "LCOM = 1 - ((∑MF/n) / (M × F))", mf, n, m, f, lcom)
    log_calculation(:ALCOM, "ALCOM = (∑LCOM) / NS", @results[:LCOM].sum, @results[:LCOM].size, alcom)
  end

  # SGM Calculation (Service Granularity Metric)
  def calculate_sgm(ipr, fp, opr, cp, ot, total_weights)
    # Calculate DGS (Data Granularity of Service)
    dgs = (ipr.to_f / fp) + (opr.to_f / cp)
    
    # Calculate FGS (Functional Granularity of Service)
    fgs = ot.to_f / total_weights

    # Calculate final SGM
    sgm = dgs * fgs

    @results[:SGM] = handle_nan(sgm)
    log_calculation(:SGM, "SGM = DGS × FGS", dgs, fgs, sgm)
  end

  # NOO Calculation (Number of Operations Per Microservice)
  def calculate_noo(total_functions)
    noo = total_functions
    @results[:NOO] = handle_nan(noo)

    # Add warning if NOO exceeds 10
    if noo > 10
      puts "Warning: NOO exceeds the recommended limit (10). Consider splitting the microservice."
    end

    log_calculation(:NOO, "NOO = Total Number of Operations", noo)
  end

  # ARQ Calculation
  def calculate_arq(service_config_times, issue_resolving_times, total_service_requests)
    total_config_time = service_config_times.sum
    total_issue_time = issue_resolving_times.sum
    total_service_requests = total_service_requests.to_f

    arq = (total_config_time + total_issue_time) / total_service_requests
    @results[:ARQ] = handle_nan(arq)
    log_calculation(:ARQ, "ARQ = (Total Service Configuration Time + Total Issue Resolving Time) / Total Service Requests", total_config_time, total_issue_time, total_service_requests, arq)
  end

  # SAM Calculation
  def calculate_sam(external_dependencies, total_services)
    external_dependencies ||= 0
    total_services ||= 1
    sam = 1 - (external_dependencies.to_f / total_services)
    @results[:SAM] = handle_nan(sam)
    log_calculation(:SAM, "SAM = 1 - (Number of External Dependencies / Total Services)", external_dependencies, total_services, sam)
  end

  # SIDC Calculation
  def calculate_sidc(max_inheritance_depth, total_classes)
    total_classes ||= 0
    sidc = if total_classes.zero?
             0
           else
             max_inheritance_depth.to_f / total_classes
           end
    @results[:SIDC] = handle_nan(sidc)
    log_calculation(:SIDC, "SIDC = Max Inheritance Depth / Total Classes", max_inheritance_depth, total_classes, sidc)
  end

  # Cyclomatic Complexity (CC) Calculation
  def calculate_cc(edges, nodes, connected_components)
    cc = edges - nodes + (2 * connected_components)
    @results[:CC] = handle_nan(cc)
    log_calculation(:CC, "CC = Edges - Nodes + (2 * Connected Components)", edges, nodes, connected_components, cc)
  end

  # Maintainability Index (MI) Calculation
  def calculate_mi(loc, cyclomatic_complexity, halstead_volume, comment_density)
    mi = (171 - 5.2 * Math.log(loc) - 0.23 * cyclomatic_complexity - 16.2 * Math.log(halstead_volume) + 50 * comment_density) * (100 / 171.0)
    @results[:MI] = handle_nan(mi)
    log_calculation(:MI, "MI = (171 - 5.2 * ln(LOC) - 0.23 * CC - 16.2 * ln(Halstead Volume) + 50 * Comment Density) * (100 / 171)", loc, cyclomatic_complexity, halstead_volume, comment_density, mi)
  end

  # Generic logging of calculation history
  def log_calculation(metric, formula, *params)
    @calculation_history[metric] = {
      formula: formula,
      parameters: params
    }
  end

  # Sanitize the hash to remove invalid values (e.g., NaN, Infinity)
  def sanitize_hash(hash)
    hash.transform_values do |value|
      case value
      when Hash
        sanitize_hash(value)
      when Array
        value.map { |v| v.is_a?(Hash) ? sanitize_hash(v) : sanitize_value(v) }
      else
        sanitize_value(value)
      end
    end
  end

  def sanitize_value(value)
    case value
    when Float
      value.nan? || value.infinite? ? nil : value
    else
      value
    end
  end

  # Output results to JSON format with more organized structure
  def output_results_to_json
    final_output = {
      analysis_summary: {
        total_files_checked: @results[:files_checked],
        total_functions_analyzed: @results[:NOO],
        total_classes_analyzed: @results[:SIDC],
        service_granularity_metric: @results[:SGM],
        alcom: @results[:ALCOM],
        maintainability_index: @results[:MI]
      },
      detailed_metrics: sanitize_hash(@results),
      calculation_history: sanitize_hash(@calculation_history)
    }

    File.open("analysis_results.json", "w") do |f|
      f.write(JSON.pretty_generate(final_output))
    end
    puts "Results have been saved to analysis_results.json"
  end

  # Run the entire analysis
  def run_analysis
    extract_variables_from_files
    output_results_to_json
  end
end

# Example usage
root_directory = '/home/alvn/Documents/Playground/rsbp_testing/booking-microservices-expressjs/src'  # Replace with your directory path
analyzer = ServiceAnalysis.new(root_directory)
analyzer.run_analysis
