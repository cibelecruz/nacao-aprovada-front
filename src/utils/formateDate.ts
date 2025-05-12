import dayjs from 'dayjs'
import isoWeekDay from 'dayjs/plugin/isoWeek'

dayjs.extend(isoWeekDay)

export function formatDate(date: dayjs.Dayjs): string {
  const year = date.year().toString()
  const month = date.month() + 1
  const day = date.date()

  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

export function getWeekdayName(date: dayjs.Dayjs): string {
  const weekdays = [
    'Segunda-feira',
    'Terça-feira',
    'Quarta-feira',
    'Quinta-feira',
    'Sexta-feira',
    'Sábado',
    'Domingo',
  ]

  const dayOfWeek = date.isoWeekday()
  return weekdays[dayOfWeek - 1]
}

export function formatDateForDisplay(date: dayjs.Dayjs): string {
  const months = [
    'Janeiro',
    'Fevereiro',
    'Março',
    'Abril',
    'Maio',
    'Junho',
    'Julho',
    'Agosto',
    'Setembro',
    'Outubro',
    'Novembro',
    'Dezembro',
  ]

  const day = date.date().toString()
  const month = months[date.month()]

  return `${day} de ${month}`
}
