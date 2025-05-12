'use client'

import { useEffect, useState } from 'react'
import { Pie, PieChart } from 'recharts'
import { api } from '@/lib/axios'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/app/_components/ui/card'
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/app/_components/ui/chart'

interface TopicBackEnd {
  questions: number
  correct: number
  incorrect: number
  progress: number
}

interface SubjectBackEnd {
  questions: number
  correct: number
  incorrect: number
  progress: number
  topics: Record<string, TopicBackEnd>
}

interface CourseBackEnd {
  questions: number
  correct: number
  incorrect: number
  progress: number
  subjects: Record<string, SubjectBackEnd>
}

interface UserPerformanceBackEnd {
  name: string
  email: string
  phone: string
  courses: Record<string, CourseBackEnd>
}

const chartColors = [
  '#DE9C29', // Amarelo
  '#234472', // Azul
  '#DDDDDE', // Cinza claro
  '#E64A19', // Laranja
  '#4CAF50', // Verde
  '#9C27B0', // Roxo
  '#F44336', // Vermelho
  '#00ACC1', // Ciano
  '#3F51B5', // Indigo
  '#E91E63', // Rosa
]

interface PieChartProps {
  courseName: string
  userId: string
}

export function PieChartComponent({ courseName, userId }: PieChartProps) {
  const [chartData, setChartData] = useState<
    { name: string; value: number; fill: string }[]
  >([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        const response = await api.get(`/users/performance/${userId}`)
        const transformedData = transformUserPerformanceToArray(
          response.data.userPerformance,
        )

        const formattedData = transformedData.courses.flatMap((course) => {
          if (course.courseName === courseName) {
            return course.subjects.map((subject, index) => ({
              name: subject.subjectName,
              value: subject.questions,
              fill: chartColors[index % chartColors.length],
            }))
          } else {
            return []
          }
        })

        setChartData(formattedData)
      } catch (error) {
        console.error('Erro ao buscar dados da API:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [courseName, userId])

  const chartConfig = chartData.reduce(
    (config, item) => ({
      ...config,
      [item.name]: {
        label: item.name,
        color: item.fill,
      },
    }),
    {} as ChartConfig,
  )

  if (isLoading) {
    return (
      <div className="w-full text-center">
        <p>Carregando...</p>
      </div>
    )
  }

  const totalQuestions = chartData.reduce((acc, item) => acc + item.value, 0)

  if (chartData.length === 0 || totalQuestions === 0) {
    return (
      <Card className="flex flex-col bg-transparent border-none text-white">
        <CardHeader className="items-center pb-0 border-transparent">
          <CardTitle hidden>Questões feitas por assuntos</CardTitle>
          <CardDescription />
        </CardHeader>
        <CardContent className="flex-1 text-white border-transparent">
          <p>Não encontramos atividades realizadas para esse curso ainda.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="flex flex-col bg-transparent border-none text-white">
      <CardHeader className="items-center pb-0 border-transparent">
        <CardTitle hidden>Questões feitas por assuntos</CardTitle>
        <CardDescription />
      </CardHeader>
      <CardContent className="flex-1 text-white border-transparent">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px] pb-0 [&_.recharts-pie-label-text]:fill-white"
        >
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            {chartData.length === 0 ? (
              <p>Não encontramos dados o suficiente para montar o gráfico</p>
            ) : (
              <Pie data={chartData} dataKey="value" label nameKey="name" />
            )}
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

function transformUserPerformanceToArray(data: UserPerformanceBackEnd) {
  const transformedCourses = Object.entries(data.courses).map(
    ([courseName, courseData]) => ({
      ...courseData,
      courseName,
      subjects: Object.entries(courseData.subjects).map(
        ([subjectName, subjectData]) => ({
          ...subjectData,
          subjectName,
        }),
      ),
    }),
  )

  return {
    ...data,
    courses: transformedCourses,
  }
}
