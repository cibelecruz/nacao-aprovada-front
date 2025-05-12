'use client'

import type { Dayjs } from 'dayjs'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useEffect, useState } from 'react'

import { Loader } from '@/app/_components/loader'
import { useAuth } from '@/app/hooks/useAuth'
import { api } from '@/lib/axios'
import dayjs from '@/lib/dayjs'

import { NotTasksForDay } from './components/noTasksForDay'
import { NotFinishedTaskToDay } from './components/notFinishedTaskToDay'
import { SelectedDateHeader } from './components/selectedDateHeader'
import { TaskCard } from './components/taskCard'
import { WeekDaysGrid } from './components/weekDaysGrid'
import { TitlePage } from '@/app/_components/titlePage'
import { useCourseContext } from '@/app/context/coursesSelect'

interface Task {
  id: string
  title: string
  subtitle: string
  courseId?: string
  relevance: number
  description: string
  finished: boolean
  timeSpent: number
  plannedDate: string
  isExtra: boolean
  taskType: string
  allowFurtherStudy: boolean
  allowQuestionsResultInput: boolean
  minTimeToCompleteInMinutes: number
  taskNote?: {
    correctCount: number
    incorrectCount: number
    note?: string
  }
}

interface CourseTaskResponse {
  courseId: { _value: string }
  courseName: string
  tasks: Task[]
}

export default function ScheduledTasks() {
  const [selectedDate, setSelectedDate] = useState(dayjs())
  const [loading, setLoading] = useState(false)
  const [tasksByCourse, setTasksByCourse] = useState<CourseTaskResponse[]>([])
  const { courseSelected } = useCourseContext()

  const { preferedStartDate } = useAuth()

  const goToPreviousWeek = () =>
    setSelectedDate((prev) => prev.subtract(1, 'week'))
  const goToNextWeek = () => setSelectedDate((prev) => prev.add(1, 'week'))
  const handleDateClick = (date: Dayjs) => setSelectedDate(date)

  const isPastDate = selectedDate.isBefore(dayjs(), 'day')

  useEffect(() => {
    const startDate = selectedDate
      .startOf('isoWeek')
      .format('YYYY-MM-DDT00:00:00.000')
    const endDate = selectedDate
      .endOf('isoWeek')
      .format('YYYY-MM-DDT23:59:59.999')

    async function fetchTasks(startDate: string, endDate: string) {
      try {
        setLoading(true)
        const response = await api.get<CourseTaskResponse[]>(`/tasks`, {
          params: { startDate, endDate },
        })

        setTasksByCourse(response.data)
      } catch (error) {
        console.error('Erro ao buscar tarefas:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchTasks(startDate, endDate)
  }, [selectedDate])

  if (loading || !tasksByCourse.length) {
    return <Loader />
  }

  const selectedCourseData = tasksByCourse.find(
    (course) => course.courseId._value === courseSelected,
  )

  const filteredTasks = selectedCourseData
    ? selectedCourseData.tasks
        .filter((task) => task.title.length > 0)
        .filter((task) => dayjs(task.plannedDate).isSame(selectedDate, 'day'))
    : []

  const completedTasks = filteredTasks.filter((task) => task.finished)

  return (
    <div className="md:flex md:justify-center sm:p-auto min-h-max p-4 pb-36 overflow-y-scroll scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent active:scrollbar-thumb-yellow-600">
      <div className="max-sm:w-full md:w-1/2 lg:w-3/5 mt-5">
        <TitlePage title="Cronograma" className="text-yellow-600" />
        <div className="w-full p-2 mt-8 rounded-lg flex flex-col items-center bg-[#070E17]">
          <div className="flex items-end gap-2 justify-center">
            <button onClick={goToPreviousWeek}>
              <ChevronLeft className="text-yellow-600 size-6" />
            </button>
            <p className="font-bold">
              {`Semana ${
                selectedDate.diff(dayjs(preferedStartDate), 'week') + 1
              }`}
            </p>
            <button onClick={goToNextWeek}>
              <ChevronRight className="text-yellow-600 size-6" />
            </button>
          </div>

          <WeekDaysGrid
            selectedDate={selectedDate}
            onDateClick={handleDateClick}
          />
        </div>

        <div className="mt-4"></div>

        <div className="mt-4 space-y-4">
          <SelectedDateHeader selectedDate={selectedDate} />

          {!filteredTasks.length ? (
            <NotTasksForDay />
          ) : isPastDate && completedTasks.length === 0 ? (
            <NotFinishedTaskToDay />
          ) : (
            filteredTasks.map((task) => {
              return <TaskCard key={`task-${task.id}`} task={task} />
            })
          )}
        </div>
      </div>
    </div>
  )
}
