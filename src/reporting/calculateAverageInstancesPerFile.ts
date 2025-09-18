export function calculateAverageInstancesPerFile(
  totalInstances: number,
  fileCount: number,
): number {
  // Round to one decimal place
  return fileCount > 0 ? Math.round((totalInstances / fileCount) * 10) / 10 : 0;
}
