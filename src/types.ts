/**
 * Information about a matched import declaration
 */
export interface ImportDeclarationInfo {
  /** Line number where usage occurs */
  line: number;

  /** Column number where usage occurs */
  column: number;

  /** The actual code snippet */
  code: string;

  /** Alias name if the imported component is aliased (e.g., `import { ButtonDeprecated as Button }`) */
  alias?: string;
}

/**
 * Information about a matched JSX element
 */
export interface JsxElementInfo {
  /** Line number where usage occurs */
  line: number;

  /** Column number where usage occurs */
  column: number;

  /** The actual code snippet */
  code: string;
}

/**
 * Information about a matched file
 */
export interface FileInfo {
  /** File name*/
  name: string;

  /** Relative path from the repository root */
  filePath: string;

  /** Matching import declaration in the file */
  importDeclaration?: ImportDeclarationInfo;

  /** Matching JSX elements in the file */
  jsxElements: JsxElementInfo[];
}

/**
 * Information about a discovered package
 */
export interface PackageInfo {
  /** Package name*/
  name: string;

  /** Relative path from the repository root */
  relativePath: string;

  /** Whether the package has a package.json file */
  hasPackageJson: boolean;

  /** Whether the package has a src directory */
  hasSrcDirectory: boolean;

  /** Matching files in the package */
  files: FileInfo[];
}

/**
 * Information about a configured workspace
 */
export interface WorkspaceInfo {
  /** Workspace name */
  name: string;

  /** Relative path from the repository root */
  relativePath: string;

  /** Packages in the workspace */
  packages: PackageInfo[];
}
