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
        // Check if file has JSX elements with variant="secondary"
        const hasVariantSecondary = file.jsxElements.some(
          (jsxElement) =>
            jsxElement.code.includes('variant="secondary"') ||
            jsxElement.code.includes("variant='secondary'"),
        );

        // Skip files with no relevant instances
        if (!hasVariantSecondary && !file.importDeclaration) {
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

        // Print JSX elements that have variant="secondary"
        for (const jsxElement of file.jsxElements) {
          // Check if the JSX element has variant="secondary"
          if (
            jsxElement.code.includes('variant="secondary"') ||
            jsxElement.code.includes("variant='secondary'")
          ) {
            console.log(
              `----- Line ${jsxElement.line} -----\n${jsxElement.code.trim()}`,
            );
          }
        }
      }
    }
  }

  console.log('\n');
}
