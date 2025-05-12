import { CalendarDays, Clock2Icon, Timer, Trophy } from 'lucide-react'
import { CardInfo } from './cardInfo'
import { formatWorkload } from '@/utils/formatWorkload'
import { DonutChart } from './donutChart'
import { LineChart } from './lineChart'
import type { Course } from 'course-performance'
import type { CourseInfo } from 'course-info'

interface GeneralInformationProps {
  selectedCourse: string
  coursePerformance: Course
  courseInfo: CourseInfo
}

export function GeneralInformation({
  courseInfo,
  coursePerformance,
  selectedCourse,
}: GeneralInformationProps) {
  function formatDate(dateString: string) {
    const year = dateString.substring(0, 4)
    const month = dateString.substring(5, 7)
    const day = dateString.substring(8, 10)
    return `${day}/${month}/${year}`
  }

  return (
    <div className="space-y-20">
      <div className="mt-10 flex gap-6 justify-between">
        <CardInfo
          icon={<Trophy className="size-5" />}
          label={selectedCourse}
          subtitle={`${(coursePerformance.progress ?? 0 * 100).toFixed(2)}% do edital concluído`}
          title="Concursos"
        />

        <CardInfo
          icon={<Clock2Icon className="size-5" />}
          label={formatWorkload(courseInfo.expectedWeeklyWorkload)}
          subtitle="dedicação semanal"
          title="Meta de horas"
        />

        <CardInfo
          icon={<CalendarDays className="size-5" />}
          label={`${courseInfo.weeklyDaysAvailability} dias`}
          subtitle="por semana"
          title="Disponibilidade"
        />

        <CardInfo
          icon={<Timer className="size-5" />}
          label={formatDate(courseInfo.expirationDate)}
          subtitle="-"
          title="Vencimento"
        />
      </div>

      <div className="flex justify-around">
        <div className="w-1/3 bg-blue-800 p-3 rounded-2xl">
          <p>Progresso do Edital</p>

          <DonutChart value={courseInfo.progress.completed * 100} />

          <p className="text-sm text-zinc-400">
            Revisão: {courseInfo.progress.review} assuntos
          </p>
          <p className="text-sm text-zinc-400">
            Estudo teórico: {courseInfo.progress.theoreticalStudy}
          </p>
        </div>

        <div className="w-1/2 flex flex-col bg-blue-800 p-3 rounded-2xl">
          <p>Comparação de Progresso do Edital</p>

          <LineChart data={courseInfo.performance} />
        </div>
      </div>
    </div>
  )
}
