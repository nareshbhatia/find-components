import type { Config } from '../config/types';

/**
 * Prints config information
 */
export function printConfig(config: Config): void {
  console.log(`🔍 Scanning repository: ${config.repoPath}`);
  console.log(`📁 Workspaces: ${config.workspacePaths.join(', ')}`);
  console.log(`📄 File extensions: ${config.fileExtensions.join(', ')}`);
  console.log(`🚫 Excluded paths: ${config.excludePaths.join(', ')}`);
  console.log(`🎯 Target component: ${config.component.name}`);
}
