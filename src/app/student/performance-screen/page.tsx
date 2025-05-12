'use client'

import { useEffect, useState } from 'react'

import { Loader } from '@/app/_components/loader'
import { TitlePage } from '@/app/_components/titlePage'
import { useAuth } from '@/app/hooks/useAuth'

import silverStar from '@/assets/silver-star.png'
import { api } from '@/lib/axios'
import { formatMinutesToHoursAndMinutes } from '@/utils/formatMinutesToHoursAndMinutes'

import { CardPerformance } from './components/cardPerformance'
import { Chart } from './components/chart'
import { Goal } from './components/goal'
import { ProgressContainer } from './components/progressContainer'
import { SimpleCard } from './components/simpleCard'
import type { UserPerformance } from '@/@types/userPerfomance'
import type { PerfomanceStaticts } from '@/@types/performanceStaticts'
import type { ProgressProps } from '@/@types/progress'
import { useCourseContext } from '@/app/context/coursesSelect'

import dynamic from 'next/dynamic'
import {
  dedicationImages,
  frequencyImages,
  levelImages,
} from '@/utils/contants'
import type { DailyPerformanceProps } from '@/@types/daily-performance'
import { PieChartComponent } from './components/pieChart'
import { TableSubject } from './components/tableSubject'

interface CourseProgress {
  name: string
  id: string
  questionsPerformance: number
  questionsAmount: number
  competitorsPerformance: number
}

interface SimulationPerformance {
  correctQuestions: number
  date: string
  incorrectQuestions: number
  totalQuestions: number
}

const LineChart = dynamic(
  () => import('@/app/_components/dailyPerformanceLineChart'),
  {
    ssr: false,
  },
)

const SimulationLineChart = dynamic(
  () => import('./components/simulationChart'),
  { ssr: false },
)

export default function PerformanceScreenPage() {
  const { currentUser } = useAuth()
  const [userPerformance, setUserPerformance] = useState<UserPerformance>()
  const [progress, setProgress] = useState<ProgressProps | null>(null)
  const [performanceStaticts, setPerformanceStaticts] =
    useState<PerfomanceStaticts>()
  const [courseProgress, setCourseProgress] = useState<CourseProgress>()
  const [dailyPerformance, setDailyPerformance] = useState<
    DailyPerformanceProps[]
  >([])
  const [simulationPerformance, setSimulationPerformance] = useState<
    SimulationPerformance[]
  >([])

  const [courseName, setCourseName] = useState('')

  const [questionPerfomance, setQuestionPerformance] = useState(
    courseProgress ? Number(courseProgress.questionsPerformance) : 0,
  )

  const [questionsAmount, setQuestionsAmount] = useState(
    courseProgress ? Number(courseProgress.questionsAmount) : 0,
  )

  const [competitorsPerformance, setCompetitorsPerformance] = useState(
    courseProgress ? Number(courseProgress.competitorsPerformance) : 0,
  )

  const { courseSelected } = useCourseContext()
  useEffect(() => {
    api.get('/users/user-performance').then((response) => {
      setUserPerformance(response.data)
    })

    api.get('/users/progress').then((response) => {
      setProgress(response.data)
    })

    api.get('/users/user-performance-statistic').then((response) => {
      setPerformanceStaticts(response.data)
    })

    api.get(`/users/daily-performance/${currentUser?.uid}`).then((response) => {
      setDailyPerformance(response.data.notes)
    })

    api.get(`/simulations/performance`).then((response) => {
      setSimulationPerformance(response.data.simulationPerformance)
    })
  }, [currentUser])

  useEffect(() => {
    if (!courseSelected) return

    api
      .get(`/courses/course-name/${courseSelected}`)
      .then((response) => {
        setCourseName(response.data.body)
      })
      .catch((error) => {
        console.error(error)
      })
  }, [courseSelected])

  useEffect(() => {
    if (progress) {
      const courseData =
        progress.courses.find((course) => course.id === courseSelected) ??
        progress.courses[0]

      if (courseData) {
        setQuestionPerformance(Number(courseData.questionsPerformance) * 100)
        setQuestionsAmount(courseData.questionsAmount)
        setCompetitorsPerformance(
          Number(courseData.competitorsPerformance) * 100,
        )
        setCourseProgress(courseData)
      }
    }
  }, [progress, courseSelected])

  if (
    !courseProgress ||
    !currentUser ||
    !userPerformance ||
    !progress ||
    !performanceStaticts ||
    dailyPerformance.length === 0 ||
    simulationPerformance.length === 0
  ) {
    return <Loader />
  }

  const averageTimePerDay = formatMinutesToHoursAndMinutes(
    performanceStaticts.averageTimePerDay,
  )
  const userLevelImage = levelImages[userPerformance.emblems.userLevel]
  const userFrequencyImage =
    frequencyImages[userPerformance.emblems.userFrequency]
  const userDedicationImage =
    dedicationImages[userPerformance.emblems.userDedication]

  return (
    <div className="md:flex md:justify-center sm:p-auto min-h-max overflow-y-auto p-4 pb-36">
      <div className="mt-5 max-sm:w-full max-md:w-full w-3/5 space-y-8">
        <TitlePage className="text-yellow-600" title="Desempenho" />

        <div className="border-3 rounded-xl border-[#070E17] p-5 bg-[#070E17] space-y-8">
          <div className="flex justify-between items-center">
            <h1 className="ml-2 text-xl">{currentUser?.displayName}</h1>
          </div>

          <div className="w-full max-md:grid grid-cols-2 gap-4 md:flex md:flex-wrap md:justify-between">
            <CardPerformance
              title="Concurseiro nível"
              label={userPerformance.emblems.userLevel}
              icon={userLevelImage}
              key="Concurseiro nivel"
            />

            <CardPerformance
              title="Frequência"
              label={userPerformance.emblems.userFrequency}
              icon={userFrequencyImage}
              key="Frequência"
            />

            <CardPerformance
              title="Dedicação"
              label={userPerformance.emblems.userDedication}
              icon={userDedicationImage}
              key="Dedicação"
            />

            {/* O backend não retorna essa informação */}
            <CardPerformance
              title="Comprometimento"
              label={'-'}
              icon={silverStar}
              key="Comprometimento"
            />
          </div>

          <div className="w-full flex max-sm:flex-col gap-4">
            <Goal
              title="Edital"
              label={`Você já estudou ${userPerformance.percentageCompleted ? userPerformance.percentageCompleted.toFixed(2) : 0}% do edital`}
              value={userPerformance.percentageCompleted}
            />
            <Goal
              label={`Tarefas de hoje concluídas: ${userPerformance.totalTasksCompletedToday} de ${userPerformance.totalTaskToday}`}
              title="Meta do Dia"
              value={
                userPerformance.totalTaskToday > 0
                  ? (userPerformance.totalTasksCompletedToday /
                      userPerformance.totalTaskToday) *
                    100
                  : 0
              }
            />
          </div>

          <div className="space-y-10 p-4 flex-1 rounded-xl border border-blue-400/50">
            <p className="font-bold text-lg">Estatística</p>

            <div className="max-sm:grid max-sm:grid-cols-2 md:flex gap-4">
              <SimpleCard label="Assuntos revisados" value={0} />

              <SimpleCard
                label="Metas Diarias Seguidas"
                value={userPerformance.consecutiveDays}
              />
              <SimpleCard
                label="Metas Semanais Concluídas"
                value={userPerformance.weeksCompleted}
              />
              <SimpleCard
                label="Horas Totais de Estudo"
                value={Number(userPerformance.totalStudyHours.toFixed(2))}
              />
            </div>
          </div>

          <div className="space-y-5 p-4 flex-1 rounded-xl border border-blue-400/50">
            <p className="font-bold text-lg">Índice de acertos</p>

            <ProgressContainer
              indicatorColor="bg-yellow-600"
              value={questionPerfomance}
            />

            <ProgressContainer
              indicatorColor="bg-blue-600"
              value={competitorsPerformance}
            />

            <div className="flex gap-4">
              <div className="flex gap-2 items-center">
                <div className="h-4 w-4 rounded bg-yellow-600" />
                <p className="text-xs">Meu desempenho</p>
              </div>

              <div className="flex gap-2 items-center">
                <div className="h-4 w-4 rounded bg-blue-600" />
                <p className="text-xs">Concorrentes</p>
              </div>
            </div>

            <div className="flex gap-4">
              <SimpleCard
                label="Questões respondidas"
                value={questionsAmount}
              />
              <SimpleCard
                label="Média de acertos"
                isPercentag
                value={Number(questionPerfomance.toFixed(2))}
              />
            </div>
          </div>

          <div className="space-y-5 p-4 flex-1 rounded-xl border border-blue-400/50">
            <div className="w-full flex justify-between items-center">
              <p className="font-bold text-lg">Frequência</p>
              <p className="text-xs">Média diária: {averageTimePerDay}</p>
            </div>
            <p className="text-gray-300 max-md:text-xs">
              Seu tempo de estudo semanal está muito baixo.
            </p>

            <div className="text-white w-full">
              <Chart
                studyAvailability={performanceStaticts.studyAvailability}
              />
            </div>
          </div>

          <div className="space-y-5 p-4 flex-1 rounded-xl border border-blue-400/50">
            <p className="font-bold text-lg">Histórico das tarefas</p>
            <div className="w-full flex lg:justify-end"></div>

            <LineChart
              chartId="dailyPerformance"
              data={dailyPerformance}
              className="flex flex-col max-md:items-center items-end"
            />
          </div>

          <div className="space-y-5 p-4 flex-1 rounded-xl border border-blue-400/50">
            <p className="font-bold text-lg">Histórico dos simulados</p>
            <div className="w-full flex lg:justify-end"></div>

            <SimulationLineChart
              chartId="simulationPerformance"
              data={simulationPerformance}
              className="flex flex-col max-md:items-center items-end"
            />
          </div>

          <div className="space-y-5 p-4 flex-1 rounded-xl border border-blue-400/50">
            <p className="font-bold text-lg">{courseName}</p>
            <p className="font-normal text-base">
              Questões feitas por disciplina
            </p>
            <PieChartComponent
              userId={currentUser.uid}
              courseName={courseName}
            />
          </div>

          <div className="space-y-5 p-4 flex-1 rounded-xl border border-blue-400/50">
            <p className="font-bold text-lg">{courseName}</p>
            <p className="font-normal text-base">
              Questões feitas por disciplina
            </p>

            <TableSubject userId={currentUser.uid} courseName={courseName} />
          </div>
        </div>
      </div>
    </div>
  )
}
