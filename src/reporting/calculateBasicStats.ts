import type { WorkspaceInfo } from '../types';
import type { BasicStats } from './types';

export function calculateBasicStats(workspaces: WorkspaceInfo[]): BasicStats {
  const workspaceCount = workspaces.length;
  const packageCount = workspaces.reduce(
    (acc, workspace) => acc + workspace.packages.length,
    0,
  );
  const fileCount = workspaces.reduce(
    (acc, workspace) =>
      acc + workspace.packages.reduce((acc, pkg) => acc + pkg.files.length, 0),
    0,
  );

  return {
    workspaceCount,
    packageCount,
    fileCount,
  };
}
