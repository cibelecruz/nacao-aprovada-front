import type { ValueType } from 'recharts/types/component/DefaultTooltipContent'

export function formatMinutesToHoursAndMinutes(
  totalMinutes: number | ValueType,
): string {
  // Certifique-se de que o valor é um número
  const totalMinutesAsNumber =
    typeof totalMinutes === 'number' ? totalMinutes : Number(totalMinutes)

  if (isNaN(totalMinutesAsNumber) || totalMinutesAsNumber < 0) {
    return '0h00m'
  }

  const hours = Math.floor(totalMinutesAsNumber / 60)
  const minutes = Math.round(totalMinutesAsNumber % 60)

  return `${hours}h${minutes.toString().padStart(2, '0')}m`
}
