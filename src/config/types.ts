/**
 * Configuration for the component to find
 */
export interface ComponentConfig {
  /** Component name to search for */
  name: string;

  /** Array of module specifiers (exact strings or patterns) where this component can be imported from */
  moduleSpecifiers: string[];
}

/**
 * Configuration for the component usage analyzer
 */
export interface Config {
  /** Absolute path to the git repository root */
  repoPath: string;

  /** Array of workspace paths relative to repository root (e.g., ["apps", "packages", "libs/ui"]) */
  workspacePaths: string[];

  /** Array of directory/file patterns to exclude from analysis */
  excludePaths: string[];

  /** Array of file extensions to analyze (e.g., [".js", ".jsx", ".ts", ".tsx"]) */
  fileExtensions: string[];

  /** Component to analyze */
  component: ComponentConfig;

  /** Whether to enable verbose output */
  verbose: boolean;
}

/**
 * Validation result for configuration
 */
export interface ConfigValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}
