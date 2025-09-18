import type { Config } from '../config/types';
import type { PackageInfo, WorkspaceInfo } from '../types';
import { getPackageFiles } from './getPackageFiles';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Discovers all valid packages within the configured workspace
 *
 * @param config - Configuration
 * @param workspacePath - Path to the workspace
 * @returns WorkspaceInfo containing array of PackageInfo objects
 */
function exploreWorkspace(
  config: Config,
  workspacePath: string,
): WorkspaceInfo {
  // Create empty workspace to return
  const packages: PackageInfo[] = [];
  const workspace: WorkspaceInfo = {
    name: path.basename(workspacePath),
    relativePath: workspacePath,
    packages,
  };

  const absoluteWorkspacePath = path.resolve(config.repoPath, workspacePath);

  if (!fs.existsSync(absoluteWorkspacePath)) {
    console.warn(`Warning: Workspace path does not exist: ${workspacePath}`);
    return workspace;
  }

  // Try getting packages from the workspace
  try {
    const entries = fs.readdirSync(absoluteWorkspacePath, {
      withFileTypes: true,
    });

    for (const entry of entries) {
      if (entry.isDirectory()) {
        const packageName = entry.name;
        const packagePath = path.join(workspacePath, entry.name);
        const absolutePackagePath = path.resolve(config.repoPath, packagePath);

        const hasPackageJson = fs.existsSync(
          path.join(absolutePackagePath, 'package.json'),
        );

        const hasSrcDirectory = fs.existsSync(
          path.join(absolutePackagePath, 'src'),
        );

        const files = getPackageFiles(config, packageName, packagePath);

        const packageInfo: PackageInfo = {
          name: packageName,
          relativePath: packagePath,
          hasPackageJson,
          hasSrcDirectory,
          files,
        };

        packages.push(packageInfo);
      }
    }
  } catch (error) {
    console.warn(
      `Warning: Could not read workspace directory ${workspacePath}: ${error instanceof Error ? error.message : String(error)}`,
    );
  }

  return {
    name: path.basename(workspacePath),
    relativePath: workspacePath,
    packages,
  };
}

/**
 * Explores all the configured workspaces
 *
 * @param config - application configuration
 * @returns WorkspaceInfo[] - Array of workspace information objects
 */
export function exploreWorkspaces(config: Config): WorkspaceInfo[] {
  const { verbose } = config;
  if (verbose) {
    console.log(`\n🔍 Scanning workspaces...`);
  }

  return config.workspacePaths.map((workspacePath) =>
    exploreWorkspace(config, workspacePath),
  );
}
