import type { WorkspaceInfo } from '../types';

/**
 * Prints found component instances to the console
 *
 * @param workspaces - Array of workspaces containing analyzed files
 * @param config - Configuration containing output path
 */
export function printInstances(workspaces: WorkspaceInfo[]): void {
  // Calculate total instances first
  let totalInstances = 0;
  for (const workspace of workspaces) {
    for (const pkg of workspace.packages) {
      for (const file of pkg.files) {
        totalInstances += file.jsxElements.length;
      }
    }
  }

  // Print individual instances
  for (const workspace of workspaces) {
    for (const pkg of workspace.packages) {
      for (const file of pkg.files) {
        // Skip files with no JSX elements found
        if (file.jsxElements.length === 0) {
          continue;
        }

        console.log(`\n${file.filePath}`);

        // Print import declaration if present
        if (file.importDeclaration) {
          const alias = file.importDeclaration.alias
            ? ` as ${file.importDeclaration.alias}`
            : '';
          console.log(`${file.importDeclaration.code}${alias}`);
        }

        // Print JSX elements
        for (const jsxElement of file.jsxElements) {
          console.log(
            `----- Line ${jsxElement.line} -----\n${jsxElement.code.trim()}`,
          );
        }
      }
    }
  }

  // Print total count at the top
  console.log(`\nTotal instances found: ${totalInstances}\n`);
}
