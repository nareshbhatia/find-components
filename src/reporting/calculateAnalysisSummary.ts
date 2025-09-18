import type { WorkspaceInfo } from '../types';
import { calculateWorkspaceSummary } from './calculateWorkspaceSummary';
import type { AnalysisSummary } from './types';

export function calculateAnalysisSummary(
  workspaces: WorkspaceInfo[],
): AnalysisSummary {
  const workspaceCount = workspaces.length;

  // Calculate workspace summary and spread all its properties
  const workspaceSummary = calculateWorkspaceSummary(workspaces);

  return {
    workspaceCount,
    ...workspaceSummary,
  };
}
