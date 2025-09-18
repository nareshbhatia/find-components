export interface BasicStats {
  workspaceCount: number;
  packageCount: number;
  fileCount: number;
}

export interface AnalysisSummary {
  workspaceCount: number;
  packageCount: number;
  fileCount: number;
  fileWithInstanceCount: number;
  instanceCount: number;
  averageInstancesPerFile: number;
  importDeclarationCount: number;
  importDeclarationWithAliasCount: number;
}

export interface WorkspaceSummary {
  packageCount: number;
  fileCount: number;
  fileWithInstanceCount: number;
  instanceCount: number;
  averageInstancesPerFile: number;
  importDeclarationCount: number;
  importDeclarationWithAliasCount: number;
}

export interface PackageSummary {
  fileCount: number;
  fileWithInstanceCount: number;
  instanceCount: number;
  averageInstancesPerFile: number;
  importDeclarationCount: number;
  importDeclarationWithAliasCount: number;
}

export interface PackageMetaSummary {
  workspaceName: string;
  packageName: string;
  summary: PackageSummary;
}

export interface FileSummary {
  instanceCount: number;
  hasImportDeclaration: boolean;
  alias?: string;
}
