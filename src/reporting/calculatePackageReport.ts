import type { WorkspaceInfo } from '../types';
import { calculatePackageSummary } from './calculatePackageSummary';
import type { PackageMetaSummary } from './types';

export function calculatePackageReport(
  workspaces: WorkspaceInfo[],
): PackageMetaSummary[] {
  const packageMetaSummaries: PackageMetaSummary[] = [];

  for (const workspace of workspaces) {
    for (const pkg of workspace.packages) {
      const packageSummary = calculatePackageSummary(pkg);
      if (packageSummary.instanceCount > 0) {
        packageMetaSummaries.push({
          workspaceName: workspace.name,
          packageName: pkg.name,
          summary: packageSummary,
        });
      }
    }
  }

  // Sort by instance count descending
  packageMetaSummaries.sort(
    (a, b) => b.summary.instanceCount - a.summary.instanceCount,
  );

  return packageMetaSummaries;
}
