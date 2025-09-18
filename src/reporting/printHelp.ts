/**
 * Prints help information
 */
export function printHelp(): void {
  console.log(`
  🔍 Component Usage Analyzer
  
  Usage:
    fc [options]
  
  Options:
    --config=<path>          Specify config file path (default: fc-config.json)
    --create-config  Create an example configuration file
    --help, -h               Show this help message
  
  Examples:
    fc --config=my-fc-config.json
    fc --create-config
    fc --help
  `);
}
