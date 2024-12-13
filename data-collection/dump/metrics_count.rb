require 'json'
require 'pathname'
require 'find'
require 'logger'

class EnhancedMicroserviceAnalyzer
  IGNORED_DIRS = [
    'node_modules', 
    'dist', 
    'build', 
    'coverage', 
    'test', 
    '.git'
  ].freeze

  FILE_PATTERNS = {
    javascript: /\.(js|jsx|ts|tsx)$/,
    config: /\.(json|yaml|yml|env)$/,
    documentation: /\.(md|txt)$/
  }.freeze

  def initialize(project_path)
    @project_path = Pathname.new(project_path)
    @files = {
      services: [],
      controllers: [],
      routes: [],
      models: [],
      middleware: [],
      configs: [],
      utils: []
    }
    @dependencies = {}
    @metrics = {}
    @logger = setup_logger
    @file_contents = {}
  end

  def analyze
    @logger.info("Starting analysis of project: #{@project_path}")
    scan_project_structure
    process_all_files
    calculate_all_metrics
    generate_detailed_report
  rescue StandardError => e
    @logger.error("Error during analysis: #{e.message}")
    @logger.error(e.backtrace.join("\n"))
    nil
  end

  private

  def setup_logger
    logger = Logger.new(STDOUT)
    logger.level = Logger::INFO
    logger.formatter = proc do |severity, datetime, progname, msg|
      "#{severity} [#{datetime}]: #{msg}\n"
    end
    logger
  end

  def scan_project_structure
    @logger.info("Scanning project structure...")
    
    Find.find(@project_path) do |path|
      next if skip_directory?(path)
      
      if File.file?(path)
        categorize_file(path)
      end
    end
  end

  def skip_directory?(path)
    IGNORED_DIRS.any? { |dir| path.include?("/#{dir}/") }
  end

  def categorize_file(path)
    return unless path.match?(FILE_PATTERNS[:javascript])

    content = File.read(path)
    @file_contents[path] = content

    case content
    when /class.*Service|\.service\./i, /module\.exports.*=.*function/i
      @files[:services] << path
    when /class.*Controller|\.controller\./i, /app\.(get|post|put|delete|patch)/i
      @files[:controllers] << path
    when /express\.Router|\.routes\./i, /app\.use\(['"].*['"]/i
      @files[:routes] << path
    when /mongoose\.model|sequelize\.define|class.*Model/i
      @files[:models] << path
    when /middleware|function.*\(req,\s*res,\s*next\)/i
      @files[:middleware] << path
    when /module\.exports|export\s+default|export\s+const/i
      @files[:utils] << path
    end

    if path.match?(FILE_PATTERNS[:config])
      @files[:configs] << path
    end
  end

  def process_all_files
    @logger.info("Processing all files...")
    
    @file_contents.each do |path, content|
      analyze_dependencies(path, content)
      analyze_complexity_metrics(path, content)
    end
  end

  def analyze_dependencies(path, content)
    deps = extract_dependencies(content)
    @dependencies[path] = deps
  end

  def extract_dependencies(content)
    requires = content.scan(/require\(['"]([^'"]+)['"]\)/).flatten
    imports = content.scan(/import.*from\s+['"]([^'"]+)['"]/).flatten
    (requires + imports).uniq
  end

  def analyze_complexity_metrics(path, content)
    @metrics[path] = {
      loc: count_lines_of_code(content),
      cc: calculate_cyclomatic_complexity(content),
      halstead: calculate_halstead_metrics(content),
      dependencies: @dependencies[path]&.length || 0,
      functions: analyze_functions(content),
      classes: analyze_classes(content)
    }
  end

  def calculate_all_metrics
    @logger.info("Calculating comprehensive metrics...")
    
    calculate_arq
    calculate_sam
    calculate_maintainability_index
    calculate_service_metrics
    calculate_complexity_metrics
    calculate_cohesion_metrics
  end

  def calculate_arq
    @metrics[:arq] = {
      total_response_time: calculate_total_response_time,
      average_response_time: calculate_average_response_time,
      service_configuration_time: estimate_service_configuration_time
    }
  end

  def calculate_total_response_time
    # Simplified calculation
    @files[:routes].size * 100  # Assuming 100ms per route as an example
  end

  def calculate_average_response_time
    total_endpoints = count_total_endpoints
    return 0 if total_endpoints == 0
    
    @metrics[:arq][:total_response_time] / total_endpoints.to_f
  end

  def count_total_endpoints
    @files[:routes].sum do |route_file|
      content = @file_contents[route_file]
      content.scan(/\.(get|post|put|delete|patch)\(/).size
    end
  end

  def estimate_service_configuration_time
    # Simplified estimation
    @files[:configs].size * 50  # Assuming 50ms per config file as an example
  end

  def calculate_sam
    total_services = @files[:services].size
    return 0 if total_services == 0

    external_deps = count_external_dependencies
    internal_deps = count_internal_dependencies

    @metrics[:sam] = {
      value: 1 - (external_deps.to_f / (external_deps + internal_deps)),
      external_dependencies: external_deps,
      internal_dependencies: internal_deps,
      total_services: total_services
    }
  end

  def count_external_dependencies
    @dependencies.values.flatten.count { |dep| !dep.start_with?('.') }
  end

  def count_internal_dependencies
    @dependencies.values.flatten.count { |dep| dep.start_with?('.') }
  end

  def calculate_maintainability_index
    @metrics[:maintainability] = @file_contents.map do |path, content|
      loc = count_lines_of_code(content)
      cc = calculate_cyclomatic_complexity(content)
      halstead = calculate_halstead_metrics(content)
      comments = count_comments(content)

      # Improved MI calculation
      mi = 171 - 
           5.2 * Math.log(loc) - 
           0.23 * cc - 
           16.2 * Math.log(halstead[:volume]) + 
           50 * (comments.to_f / loc)

      [path, mi]
    end.to_h
  end

  def calculate_service_metrics
    @metrics[:service] = {
      total_services: @files[:services].size,
      average_size: calculate_average_service_size,
      complexity_distribution: calculate_complexity_distribution,
      dependency_graph: build_dependency_graph
    }
  end

  def calculate_complexity_metrics
    @metrics[:complexity] = {
      cyclomatic: calculate_average_cyclomatic_complexity,
      cognitive: calculate_cognitive_complexity,
      halstead: calculate_average_halstead_metrics
    }
  end

  def calculate_cohesion_metrics
    @metrics[:cohesion] = {
      lcom: calculate_average_lcom,
      coupling: calculate_coupling_metrics,
      modularity: calculate_modularity_metrics
    }
  end

  def count_lines_of_code(content)
    content.lines.count { |line| line.strip != '' && !line.strip.start_with?('//') }
  end

  def count_comments(content)
    content.lines.count { |line| line.strip.start_with?('//') || line.strip.start_with?('/*') }
  end

  def calculate_cyclomatic_complexity(content)
    decision_points = content.scan(
      /if|else|for|while|do|switch|case|catch|return|throw|break|continue|&&|\|\||[?]|:|try/
    ).size
    decision_points + 1
  end

  def calculate_halstead_metrics(content)
    operators = content.scan(/[\+\-\*\/\=\>\<\!\&\|\%\?\:\^\~]/).size
    operands = content.scan(/[a-zA-Z_]\w*/).size
    
    n1 = operators
    n2 = operands
    n1_count = operators
    n2_count = operands
    
    vocabulary = n1 + n2
    length = n1_count + n2_count
    volume = length * Math.log2([vocabulary, 2].max)
    difficulty = (n1 * n2_count) / (2.0 * [n2, 1].max)
    effort = difficulty * volume
    
    {
      vocabulary: vocabulary,
      length: length,
      volume: volume,
      difficulty: difficulty,
      effort: effort
    }
  end

  def analyze_functions(content)
    functions = content.scan(/function\s+(\w+)\s*\([^)]*\)|\(([^)]*)\)\s*=>/)
    {
      count: functions.size,
      parameters: functions.map { |f| f.join.scan(/\w+/).size }
    }
  end

  def analyze_classes(content)
    classes = content.scan(/class\s+(\w+)/)
    {
      count: classes.size,
      names: classes.flatten
    }
  end

  def calculate_average_service_size
    return 0 if @files[:services].empty?
    
    total_size = @files[:services].sum do |service_file|
      @metrics[service_file][:loc]
    end
    
    total_size / @files[:services].size.to_f
  end

  def calculate_complexity_distribution
    @files[:services].map do |service_file|
      {
        name: File.basename(service_file),
        complexity: @metrics[service_file][:cc]
      }
    end
  end

  def build_dependency_graph
    @dependencies.transform_keys { |k| File.basename(k) }
  end

  def calculate_average_cyclomatic_complexity
    cc_values = @metrics.values.map { |m| m[:cc] }.compact
    return 0 if cc_values.empty?
    
    cc_values.sum / cc_values.size.to_f
  end

  def calculate_cognitive_complexity
    @file_contents.map do |path, content|
      nesting = content.scan(/\{/).size - content.scan(/\}/).size
      loops = content.scan(/for|while|do/).size
      conditions = content.scan(/if|else|switch|case/).size
      
      [path, (nesting + loops * 2 + conditions)]
    end.to_h
  end

  def calculate_average_halstead_metrics
    return {} if @metrics.empty?
    
    total_metrics = @metrics.values.map { |m| m[:halstead] }.compact
    return {} if total_metrics.empty?
    
    keys = total_metrics.first.keys
    
    keys.each_with_object({}) do |key, avg|
      avg[key] = total_metrics.sum { |m| m[key] } / total_metrics.size.to_f
    end
  end

  def calculate_average_lcom
    @files[:services].map do |service_file|
      content = @file_contents[service_file]
      shared_vars = count_shared_variables(content)
      methods = analyze_functions(content)[:count]
      
      next [service_file, 0] if methods == 0
      
      [service_file, 1 - (shared_vars.to_f / methods)]
    end.to_h
  end

  def count_shared_variables(content)
    vars = content.scan(/(?:let|const|var)\s+(\w+)/).flatten
    vars.select { |var| content.scan(/\b#{var}\b/).size > 1 }.size
  end

  def calculate_coupling_metrics
    @dependencies.transform_values do |deps|
      {
        incoming: deps.count { |d| d.start_with?('.') },
        outgoing: deps.count { |d| !d.start_with?('.') }
      }
    end
  end

  def calculate_modularity_metrics
    total_files = @file_contents.size
    total_dependencies = @dependencies.values.flatten.size
    
    {
      modularity_ratio: total_files.to_f / (total_dependencies + 1),
      average_dependencies: total_dependencies.to_f / total_files
    }
  end

  def generate_detailed_report
    @logger.info("Generating detailed report...")
  
    report = {
      project_info: {
        path: @project_path.to_s,
        analyzed_at: Time.now.strftime("%Y-%m-%dT%H:%M:%S%z"),
        file_count: @file_contents.size
      },
      file_structure: @files,
      metrics: @metrics,
      summary: generate_summary
    }
  
    save_report(report)
    report
  end
  
  def generate_summary
    total_services = @files[:services].size
    total_endpoints = count_total_endpoints
    average_complexity = calculate_average_cyclomatic_complexity
    maintainability_score = calculate_average_maintainability
    service_autonomy = @metrics[:sam]&.[](:value) || 0
    overall_health = calculate_overall_health
  
    {
      total_services: total_services,
      total_endpoints: total_endpoints,
      average_complexity: average_complexity,
      maintainability_score: maintainability_score,
      service_autonomy: service_autonomy,
      overall_health: overall_health
    }
  end
  
  def calculate_average_maintainability
    maintainability_values = @metrics[:maintainability]&.values
    return 0 if maintainability_values.nil? || maintainability_values.empty?
    maintainability_values.sum / maintainability_values.size.to_f
  end

  def calculate_overall_health
    maintainability = calculate_average_maintainability
    complexity = calculate_average_cyclomatic_complexity
    autonomy = @metrics[:sam]&.[](:value) || 0
    
    # Normalize each metric to 0-1 range and calculate weighted average
    maintainability_score = maintainability / 171 * 0.4
    complexity_score = (1 - [complexity / 50, 1].min) * 0.3
    autonomy_score = autonomy * 0.3
  
    maintainability_score + complexity_score + autonomy_score
  end
  
  def save_report(report)
    report_file = "#{@project_path}/microservice_analysis_#{Time.now.strftime('%Y%m%d_%H%M%S')}.json"
    File.write(report_file, JSON.pretty_generate(report))
    @logger.info("Report saved to: #{report_file}")
  end
end

if __FILE__ == $0
    if ARGV.empty?
      puts "Usage: ruby #{File.basename($0)} <path-to-express-project>"
      puts "Example: ruby #{File.basename($0)} /path/to/your/express/project"
      exit 1
    end
  
    project_path = ARGV[0]
    unless Dir.exist?(project_path)
      puts "Error: Project directory not found: #{project_path}"
      exit 1
    end
  
    analyzer = EnhancedMicroserviceAnalyzer.new(project_path)
    results = analyzer.analyze
  end
  

