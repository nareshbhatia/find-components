import type { PackageInfo } from '../types';
import { calculateAverageInstancesPerFile } from './calculateAverageInstancesPerFile';
import type { PackageSummary } from './types';

export function calculatePackageSummary(
  packageInfo: PackageInfo,
): PackageSummary {
  const fileCount = packageInfo.files.length;

  const fileWithInstanceCount = packageInfo.files.filter(
    (file) => file.jsxElements.length > 0,
  ).length;

  const instanceCount = packageInfo.files.reduce(
    (acc, file) => acc + file.jsxElements.length,
    0,
  );

  const averageInstancesPerFile = calculateAverageInstancesPerFile(
    instanceCount,
    fileWithInstanceCount,
  );

  const importDeclarationCount = packageInfo.files.filter(
    (file) => file.importDeclaration !== undefined,
  ).length;

  const importDeclarationWithAliasCount = packageInfo.files.filter(
    (file) => file.importDeclaration?.alias !== undefined,
  ).length;

  return {
    fileCount,
    fileWithInstanceCount,
    instanceCount,
    averageInstancesPerFile,
    importDeclarationCount,
    importDeclarationWithAliasCount,
  };
}
