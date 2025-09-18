import type { Config } from '../config/types';
import type { FileInfo } from '../types';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Checks if a path should be excluded based on configuration
 *
 * @param fullPath - Full path to check
 * @param packageRoot - Root path of the package
 * @returns True if path should be excluded
 */
function shouldExcludePath(
  config: Config,
  fullPath: string,
  packageRoot: string,
): boolean {
  const relativePath = path.relative(packageRoot, fullPath);

  return config.excludePaths.some(
    (excludePath) =>
      // Handle both exact matches and path prefixes
      relativePath === excludePath ||
      relativePath.startsWith(excludePath + path.sep) ||
      fullPath.includes(path.sep + excludePath + path.sep) ||
      fullPath.endsWith(path.sep + excludePath),
  );
}

/**
 * Checks if a file has one of the target extensions
 *
 * @param fileName - Name of the file to check
 * @returns True if file has a target extension
 */
function hasTargetExtension(config: Config, fileName: string): boolean {
  return config.fileExtensions.some((ext) => fileName.endsWith(ext));
}

/**
 * Gets matching files within a package
 *
 * @param packageInfo - Package to scan for files
 * @returns Array of file information objects for this package
 */
export function getPackageFiles(
  config: Config,
  packageName: string,
  packagePath: string,
): FileInfo[] {
  const { verbose } = config;
  if (verbose) {
    console.log(`   🔍 Scanning package: ${packageName}`);
  }

  const files: FileInfo[] = [];
  const absolutePackagePath = path.join(config.repoPath, packagePath);

  const walkDirectory = (dir: string) => {
    try {
      const entries = fs.readdirSync(dir, { withFileTypes: true });

      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);

        // Check if this path should be excluded
        if (shouldExcludePath(config, fullPath, absolutePackagePath)) {
          continue;
        }

        if (entry.isDirectory()) {
          walkDirectory(fullPath);
        } else if (entry.isFile() && hasTargetExtension(config, entry.name)) {
          // Calculate relative path from repository root
          const relativePath = path.relative(config.repoPath, fullPath);

          files.push({
            name: entry.name,
            filePath: relativePath,
            jsxElements: [],
          });
        }
      }
    } catch (error) {
      console.warn(
        `Warning: Could not read directory ${dir}: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  };

  walkDirectory(absolutePackagePath);
  return files;
}
