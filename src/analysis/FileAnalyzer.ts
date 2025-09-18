import type { Config } from '../config/types';
import type { FileInfo, ImportDeclarationInfo, JsxElementInfo } from '../types';
import * as path from 'path';
import type { SourceFile, JsxElement, JsxSelfClosingElement } from 'ts-morph';
import { Project, SyntaxKind } from 'ts-morph';

/**
 * Analyzes a single file for component usage
 */
export class FileAnalyzer {
  constructor(private readonly config: Config) {}

  /**
   * Analyzes a single file for component usage and updates the file info
   *
   * @param file - File to analyze
   */
  analyzeFile(file: FileInfo): void {
    const filePath = path.join(this.config.repoPath, file.filePath);

    try {
      // Create a ts-morph project and add the file
      const project = new Project();
      const sourceFile = project.addSourceFileAtPath(filePath);

      // 1. Find component import in file
      const importDeclarationInfo = this.findComponentImport(sourceFile);

      // Early exit if file does not import component
      if (importDeclarationInfo === undefined) {
        return;
      }

      // Import was found - determine the tag name to look for in JSX
      const tagName = importDeclarationInfo.alias ?? this.config.component.name;

      // 2. Find JSX elements with the correct tag name
      const jsxElements = this.findJsxElements(sourceFile, tagName);

      // 3. Update the file with analysis results
      file.importDeclaration = importDeclarationInfo;
      file.jsxElements = jsxElements;
    } catch (error) {
      console.log(`   ⚠️  Error analyzing file ${file.filePath}:`, error);
    }
  }

  /**
   * Finds the import declaration for the target component
   */
  private findComponentImport(
    sourceFile: SourceFile,
  ): ImportDeclarationInfo | undefined {
    const importDeclarations = sourceFile.getImportDeclarations();
    const { component } = this.config;

    for (const importDecl of importDeclarations) {
      const code: string = importDecl.getFullText().trim();
      const moduleSpecifier = importDecl.getModuleSpecifierValue();

      // Check if this import's module specifier matches any of the component's module specifiers
      const matchedModuleSpecifier = this.findMatchingModuleSpecifier(
        moduleSpecifier,
        component.moduleSpecifiers,
        sourceFile.getFilePath(),
      );

      if (matchedModuleSpecifier !== undefined) {
        // Check default imports: import ComponentName from 'package'
        const defaultImport = importDecl.getDefaultImport();
        if (
          defaultImport !== undefined &&
          defaultImport.getText() === component.name
        ) {
          const lineNumber: number = importDecl.getStartLineNumber();
          return {
            line: lineNumber,
            column:
              sourceFile.getLengthFromLineStartAtPos(importDecl.getStart()) + 1,
            code,
          };
        }

        // Check named imports: import { ComponentName } from 'package'
        const namedImports = importDecl.getNamedImports();
        for (const namedImport of namedImports) {
          const importName = namedImport.getName();
          const alias = namedImport.getAliasNode()?.getText();

          if (importName === component.name) {
            const lineNumber: number = importDecl.getStartLineNumber();
            return {
              line: lineNumber,
              column:
                sourceFile.getLengthFromLineStartAtPos(importDecl.getStart()) +
                1,
              code,
              alias,
            };
          }
        }

        // Check namespace imports: import * as Namespace from 'package'
        const namespaceImport = importDecl.getNamespaceImport();
        if (namespaceImport !== undefined) {
          /*
           * For namespace imports, we can't determine if the component is used without analyzing the usage
           * This would require more complex analysis of the namespace usage
           * For now, we'll skip namespace imports
           */
        }
      }
    }

    return undefined;
  }

  /**
   * Finds a matching module specifier from the configured list
   */
  private findMatchingModuleSpecifier(
    actualModuleSpecifier: string,
    configuredSpecifiers: string[],
    currentFilePath: string,
  ): string | undefined {
    for (const configuredSpecifier of configuredSpecifiers) {
      if (
        this.matchesModuleSpecifier(
          actualModuleSpecifier,
          configuredSpecifier,
          currentFilePath,
        )
      ) {
        return configuredSpecifier;
      }
    }
    return undefined;
  }

  /**
   * Checks if an actual module specifier matches a configured specifier (which may be a pattern)
   */
  private matchesModuleSpecifier(
    actualModuleSpecifier: string,
    configuredSpecifier: string,
    currentFilePath: string,
  ): boolean {
    // Exact match
    if (actualModuleSpecifier === configuredSpecifier) {
      return true;
    }

    // Wildcard match (legacy support)
    if (configuredSpecifier === '*') {
      return true;
    }

    // Glob pattern matching
    if (configuredSpecifier.includes('*')) {
      // For relative imports, resolve the actual path and match against pattern
      if (
        actualModuleSpecifier.startsWith('./') ||
        actualModuleSpecifier.startsWith('../')
      ) {
        try {
          const resolvedPath = path.resolve(
            path.dirname(currentFilePath),
            actualModuleSpecifier,
          );
          const pattern = configuredSpecifier
            .replace(/\*\*/g, '.*')
            .replace(/\*/g, '[^/]*');
          return new RegExp(`${pattern}$`).test(resolvedPath);
        } catch {
          // If path resolution fails, fall back to direct pattern matching
          const pattern = configuredSpecifier
            .replace(/\*\*/g, '.*')
            .replace(/\*/g, '[^/]*');
          return new RegExp(`^${pattern}$`).test(actualModuleSpecifier);
        }
      }

      // For package imports, direct pattern matching
      const pattern = configuredSpecifier
        .replace(/\*\*/g, '.*')
        .replace(/\*/g, '[^/]*');
      return new RegExp(`^${pattern}$`).test(actualModuleSpecifier);
    }

    // Regex pattern (if starts with ^)
    if (configuredSpecifier.startsWith('^')) {
      try {
        return new RegExp(configuredSpecifier).test(actualModuleSpecifier);
      } catch {
        // If regex is invalid, no match
        return false;
      }
    }

    return false;
  }

  /**
   * Finds JSX elements with the specified tag name
   */
  private findJsxElements(
    sourceFile: SourceFile,
    tagName: string,
  ): JsxElementInfo[] {
    const jsxElements: JsxElementInfo[] = [];

    // Get all JSX elements contained in the source file (both regular and self-closing)
    const allJsxElements = [
      ...sourceFile.getDescendantsOfKind(SyntaxKind.JsxElement),
      ...sourceFile.getDescendantsOfKind(SyntaxKind.JsxSelfClosingElement),
    ];

    // Check JSX elements for the specified tag name
    for (const jsxElement of allJsxElements) {
      // Handle different JSX element types
      const elementTagName =
        jsxElement.getKind() === SyntaxKind.JsxElement
          ? (jsxElement as JsxElement)
              .getOpeningElement()
              .getTagNameNode()
              .getText()
          : (jsxElement as JsxSelfClosingElement).getTagNameNode().getText();

      if (elementTagName === tagName) {
        // Check if this JSX element has variant="secondary" prop
        const elementCode = jsxElement.getFullText().trim();
        if (
          elementCode.includes('variant="secondary"') ||
          elementCode.includes("variant='secondary'")
        ) {
          const lineNumber: number = jsxElement.getStartLineNumber();
          jsxElements.push({
            line: lineNumber,
            column:
              sourceFile.getLengthFromLineStartAtPos(jsxElement.getStart()) + 1,
            code: elementCode,
          });
        }
      }
    }

    return jsxElements;
  }
}
