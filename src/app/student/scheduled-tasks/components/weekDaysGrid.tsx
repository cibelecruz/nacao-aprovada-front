'use client'

import type { Dayjs } from 'dayjs'

import dayjs from '@/lib/dayjs'

interface WeekDaysGridProps {
  selectedDate: Dayjs
  onDateClick: (date: Dayjs) => void
}

export function WeekDaysGrid({ selectedDate, onDateClick }: WeekDaysGridProps) {
  const daysFullPT = [
    'Segunda-feira',
    'Terça-feira',
    'Quarta-feira',
    'Quinta-feira',
    'Sexta-feira',
    'Sábado',
    'Domingo',
  ]
  const daysShortPT = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom']
  const daysInitialsPT = ['S', 'T', 'Q', 'Q', 'S', 'S', 'D']

  function getWeekDays() {
    const startOfWeek = selectedDate.startOf('isoWeek')
    return Array.from({ length: 7 }).map((_, index) =>
      startOfWeek.add(index, 'day'),
    )
  }

  const days = getWeekDays()

  return (
    <div className="mt-4 w-full flex space-x-2">
      {days.map((day, index) => {
        const isToday = day.isSame(dayjs(), 'day')
        const isSelected = day.isSame(selectedDate, 'day')

        const backgroundClass = isToday
          ? 'dark:bg-yellow-600 bg-yellow-400 dark:text-white text-black hover:bg-yellow-500' 
          : isSelected
            ? 'dark:bg-blue-700 bg-[#f3e3c2] dark:text-white text-black hover:bg-white/10'
            : 'dark:bg-blue-900 bg-white dark:text-white text-black hover:bg-white/10'

        return (
          <button
            key={index}
            onClick={() => onDateClick(day)}
            className={`w-12 h-16 font-bold flex-1 flex flex-col items-center justify-center border border-blue-400/20 ${backgroundClass} rounded-md`}
          >
            <span className="text-sm">{day.format('D')}</span>
            <span className="text-xs">
              <span className="hidden lg:inline">
                {daysFullPT[day.isoWeekday() - 1]}
              </span>
              <span className="hidden md:inline lg:hidden">
                {daysShortPT[day.isoWeekday() - 1]}
              </span>
              <span className="inline md:hidden">
                {daysInitialsPT[day.isoWeekday() - 1]}
              </span>
            </span>
          </button>
        )
      })}
    </div>
  )
}
