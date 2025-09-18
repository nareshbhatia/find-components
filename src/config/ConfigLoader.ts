import type { Config, ConfigValidationResult } from './types';
import expandTilde from 'expand-tilde';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Configuration loader and validator for the component usage analyzer
 */
export class ConfigLoader {
  /**
   * Loads configuration from a JSON file
   *
   * @param configPath - Path to the configuration JSON file
   * @returns Parsed configuration object
   * @throws Error if file cannot be read or parsed
   *
   * @example
   * ```typescript
   * const config = ConfigLoader.load('./fc-config.json');
   * console.log(config.componentName); // "ButtonDeprecated"
   * ```
   */
  static load(configPath: string): Config {
    try {
      const configContent = fs.readFileSync(configPath, 'utf-8');
      const config = JSON.parse(configContent) as Config;

      // Expand tilde in repoPath if present
      if (config.repoPath) {
        config.repoPath = expandTilde(config.repoPath);
      }

      const validation = this.validate(config);
      if (!validation.isValid) {
        throw new Error(
          `Invalid configuration:\n${validation.errors.join('\n')}`,
        );
      }

      // Log warnings if any
      validation.warnings.forEach((warning) => {
        console.warn(`Warning: ${warning}`);
      });

      return config;
    } catch (error) {
      if (error instanceof SyntaxError) {
        throw new Error(
          `Invalid JSON in config file ${configPath}: ${error.message}`,
        );
      }
      throw new Error(
        `Failed to load config file ${configPath}: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  /**
   * Validates a configuration object
   *
   * @param config - Configuration object to validate
   * @returns Validation result with errors and warnings
   */
  static validate(config: Config): ConfigValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Check required fields
    const required: (keyof Config)[] = [
      'repoPath',
      'workspacePaths',
      'excludePaths',
      'fileExtensions',
      'component',
      'verbose',
    ];

    for (const field of required) {
      if (
        !(field in config) ||
        config[field] === undefined ||
        config[field] === null
      ) {
        errors.push(`Missing required field: ${field}`);
      }
    }

    // Check that component is provided
    if (config.component === undefined || config.component === null) {
      errors.push('"component" must be provided');
    }

    // Validate specific field types and values
    if (config.repoPath && !fs.existsSync(config.repoPath)) {
      errors.push(`Repository path does not exist: ${config.repoPath}`);
    }

    if (
      config.workspacePaths !== undefined &&
      config.workspacePaths !== null &&
      (!Array.isArray(config.workspacePaths) ||
        config.workspacePaths.length === 0)
    ) {
      errors.push('workspacePaths must be a non-empty array');
    }

    if (
      config.excludePaths !== undefined &&
      config.excludePaths !== null &&
      !Array.isArray(config.excludePaths)
    ) {
      errors.push('excludePaths must be an array');
    }

    if (
      config.fileExtensions !== undefined &&
      config.fileExtensions !== null &&
      (!Array.isArray(config.fileExtensions) ||
        config.fileExtensions.length === 0)
    ) {
      errors.push('fileExtensions must be a non-empty array');
    }

    // Validate component object
    if (config.component !== undefined && config.component !== null) {
      if (!config.component.name || typeof config.component.name !== 'string') {
        errors.push('component.name must be a non-empty string');
      }
      if (
        !Array.isArray(config.component.moduleSpecifiers) ||
        config.component.moduleSpecifiers.length === 0
      ) {
        errors.push('component.moduleSpecifiers must be a non-empty array');
      } else {
        config.component.moduleSpecifiers.forEach((spec, specIndex) => {
          if (typeof spec !== 'string' || spec.trim() === '') {
            errors.push(
              `component.moduleSpecifiers[${specIndex}] must be a non-empty string`,
            );
          }
        });
      }
    }

    if (
      config.verbose !== undefined &&
      config.verbose !== null &&
      typeof config.verbose !== 'boolean'
    ) {
      errors.push('verbose must be a boolean');
    }

    // Validate workspace paths exist
    if (
      config.repoPath !== undefined &&
      config.repoPath !== null &&
      config.workspacePaths !== undefined &&
      config.workspacePaths !== null &&
      Array.isArray(config.workspacePaths)
    ) {
      for (const workspace of config.workspacePaths) {
        const workspacePath = path.resolve(config.repoPath, workspace);
        if (!fs.existsSync(workspacePath)) {
          warnings.push(`Workspace path does not exist: ${workspacePath}`);
        }
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  }

  /**
   * Creates an example configuration file
   */
  static createExample(): void {
    const outputPath = './fc-config.json';

    const config: Config = {
      repoPath: '/path/to/your/repo',
      workspacePaths: ['apps', 'packages'],
      excludePaths: ['node_modules', 'dist', 'build'],
      fileExtensions: ['.js', '.jsx', '.ts', '.tsx'],
      component: {
        name: 'Button',
        moduleSpecifiers: ['@sample/ui', '**/Button'],
      },
      verbose: false,
    };

    fs.writeFileSync(outputPath, JSON.stringify(config, undefined, 2));
    console.log(`Created example configuration file: ${outputPath}`);
  }
}
