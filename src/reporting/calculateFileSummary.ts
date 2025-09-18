import type { FileInfo } from '../types';
import type { FileSummary } from './types';

export function calculateFileSummary(file: FileInfo): FileSummary {
  return {
    instanceCount: file.jsxElements.length,
    hasImportDeclaration: file.importDeclaration !== undefined,
    alias: file.importDeclaration?.alias,
  };
}
