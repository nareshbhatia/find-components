import { analyzeFiles } from './analysis/analyzeFiles';
import { ConfigLoader } from './config/ConfigLoader';
import { exploreWorkspaces } from './discovery/exploreWorkSpaces';
import { calculateAnalysisSummary } from './reporting/calculateAnalysisSummary';
import { calculateBasicStats } from './reporting/calculateBasicStats';
import { printConfig } from './reporting/printConfig';
import { printHelp } from './reporting/printHelp';
import { printInstances } from './reporting/printInstances';

/**
 * Main entry point for the component usage analyzer
 */
function main() {
  try {
    // Default config path
    let configPath = 'fc-config.json';

    // Get command line arguments
    const args = process.argv.slice(2);

    // Parse command line arguments
    for (let i = 0; i < args.length; i++) {
      if (args[i].startsWith('--config=')) {
        [, configPath] = args[i].split('=');
      } else if (args[i] === '--create-config') {
        ConfigLoader.createExample();
        return;
      } else if (args[i] === '--help' || args[i] === '-h') {
        printHelp();
        return;
      }
    }

    try {
      // Load configuration
      const config = ConfigLoader.load(configPath);
      const { verbose } = config;
      if (verbose) {
        printConfig(config);
      }

      // Explore workspaces to discover packages and files
      const workspaces = exploreWorkspaces(config);

      // Calculate basic stats
      const basicStats = calculateBasicStats(workspaces);
      const { workspaceCount, packageCount, fileCount } = basicStats;
      if (verbose) {
        console.log(
          `\n📦 Found ${workspaceCount} workspaces, ${packageCount} packages, ${fileCount} files`,
        );
      }

      // Analyze files
      analyzeFiles(workspaces, config);
      if (verbose) {
        console.log(`\n✅ Analysis completed successfully!`);
      }

      // Calculate analysis summary
      const analysisSummary = calculateAnalysisSummary(workspaces);
      const { fileWithInstanceCount, instanceCount } = analysisSummary;
      if (verbose) {
        console.log(
          `\n📊 Found ${instanceCount} usages of '${config.component.name}' across ${fileWithInstanceCount} files.`,
        );
        console.log();
      }

      // Print instances
      printInstances(workspaces);
    } catch (error) {
      if (error instanceof Error && error.message.includes('ENOENT')) {
        console.error(`❌ Config file not found: ${configPath}`);
        console.log('\n💡 Create an example config file with:');
        console.log('   fc --create-config');
      } else {
        console.error(
          `❌ Error: ${error instanceof Error ? error.message : String(error)}`,
        );
      }
      process.exit(1);
    }
  } catch (error) {
    console.error(
      `❌ Unexpected error: ${error instanceof Error ? error.message : String(error)}`,
    );
    process.exit(1);
  }
}

main();
