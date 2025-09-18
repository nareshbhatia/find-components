import type { WorkspaceInfo } from '../types';
import { calculateAverageInstancesPerFile } from './calculateAverageInstancesPerFile';
import { calculatePackageSummary } from './calculatePackageSummary';
import type { WorkspaceSummary } from './types';

export function calculateWorkspaceSummary(
  workspaces: WorkspaceInfo[],
): WorkspaceSummary {
  // Get all packages from all workspaces
  const allPackages = workspaces.flatMap((workspace) => workspace.packages);

  const packageCount = allPackages.length;

  // Calculate summaries for each package and aggregate
  const packageSummaries = allPackages.map(calculatePackageSummary);

  const fileCount = packageSummaries.reduce(
    (acc, summary) => acc + summary.fileCount,
    0,
  );

  const fileWithInstanceCount = packageSummaries.reduce(
    (acc, summary) => acc + summary.fileWithInstanceCount,
    0,
  );

  const instanceCount = packageSummaries.reduce(
    (acc, summary) => acc + summary.instanceCount,
    0,
  );

  const averageInstancesPerFile = calculateAverageInstancesPerFile(
    instanceCount,
    fileWithInstanceCount,
  );

  const importDeclarationCount = packageSummaries.reduce(
    (acc, summary) => acc + summary.importDeclarationCount,
    0,
  );

  const importDeclarationWithAliasCount = packageSummaries.reduce(
    (acc, summary) => acc + summary.importDeclarationWithAliasCount,
    0,
  );

  return {
    packageCount,
    fileCount,
    fileWithInstanceCount,
    instanceCount,
    averageInstancesPerFile,
    importDeclarationCount,
    importDeclarationWithAliasCount,
  };
}
