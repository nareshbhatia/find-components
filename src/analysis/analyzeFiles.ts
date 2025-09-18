import type { Config } from '../config/types';
import type { WorkspaceInfo } from '../types';
import { FileAnalyzer } from './FileAnalyzer';

/**
 * Analyzes files in the supplied workspaces and stores results back into the workspaces
 *
 * @param config - Configuration
 * @param workspaces - Array of workspaces with files to analyze
 */
export function analyzeFiles(workspaces: WorkspaceInfo[], config: Config) {
  const { verbose } = config;
  if (verbose) {
    console.log(`\n🔍 Analyzing files...`);
  }

  // Analyze each file in place
  const fileAnalyzer = new FileAnalyzer(config);
  for (const workspace of workspaces) {
    for (const pkg of workspace.packages) {
      for (const file of pkg.files) {
        fileAnalyzer.analyzeFile(file);
      }
    }
  }
}
