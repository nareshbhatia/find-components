import type { WorkspaceInfo } from '../types';

/**
 * Prints found component instances to the console
 *
 * @param workspaces - Array of workspaces containing analyzed files
 * @param config - Configuration containing output path
 */
export function printInstances(workspaces: WorkspaceInfo[]): void {
  for (const workspace of workspaces) {
    for (const pkg of workspace.packages) {
      for (const file of pkg.files) {
        // Skip files with no JSX elements that have variant="secondary"
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

        // Print JSX elements (all elements in jsxElements now have variant="secondary")
        for (const jsxElement of file.jsxElements) {
          console.log(
            `----- Line ${jsxElement.line} -----\n${jsxElement.code.trim()}`,
          );
        }
      }
    }
  }

  console.log('\n');
}
