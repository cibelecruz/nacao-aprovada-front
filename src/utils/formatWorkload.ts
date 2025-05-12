export function formatWorkload(workload: number) {
  const hours = Math.floor(workload)
  const minutes = Math.round((workload - hours) * 60)
  return minutes > 0 ? `${hours} hrs ${minutes} min` : `${hours} hrs`
}
