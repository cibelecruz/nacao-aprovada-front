'use client'

import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from 'recharts'

import { Card, CardContent } from '@/app/_components/ui/card'
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/app/_components/ui/chart'
import { formatMinutesToHoursAndMinutes } from '@/utils/formatMinutesToHoursAndMinutes'

interface StudyAvailability {
  sunday: number
  monday: number
  tuesday: number
  wednesday: number
  thursday: number
  friday: number
  saturday: number
}

interface ChartProps {
  studyAvailability: StudyAvailability
}

interface DayShortNamesType {
  Domingo: string
  Segunda: string
  Terça: string
  Quarta: string
  Quinta: string
  Sexta: string
  Sábado: string
}

const chartConfig = {
  hora: {
    label: 'Horas',
    color: 'hsl(var(--chart-1))',
  },
} satisfies ChartConfig

export function Chart({ studyAvailability }: ChartProps) {
  const chartData = [
    { dayOfWeek: 'Domingo', hora: studyAvailability.sunday },
    { dayOfWeek: 'Segunda', hora: studyAvailability.monday },
    { dayOfWeek: 'Terça', hora: studyAvailability.tuesday },
    { dayOfWeek: 'Quarta', hora: studyAvailability.wednesday },
    { dayOfWeek: 'Quinta', hora: studyAvailability.thursday },
    { dayOfWeek: 'Sexta', hora: studyAvailability.friday },
    { dayOfWeek: 'Sábado', hora: studyAvailability.saturday },
  ]

  const dayShortNames: DayShortNamesType = {
    Domingo: 'dom',
    Segunda: 'seg',
    Terça: 'ter',
    Quarta: 'qua',
    Quinta: 'qui',
    Sexta: 'sex',
    Sábado: 'sab',
  }

  return (
    <Card className="border-none bg-transparent">
      <CardContent>
        <ChartContainer className="bg-transparent" config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={chartData}
            margin={{
              top: 20,
            }}
          >
            <CartesianGrid vertical={false} horizontal={false} />
            <XAxis
              dataKey="dayOfWeek"
              tickLine={false}
              tickMargin={10}
              color="white"
              className="text-white"
              axisLine={false}
              tickFormatter={(day: keyof typeof dayShortNames) =>
                window.innerWidth < 768 ? dayShortNames[day] : day
              }
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  formatter={(value) => formatMinutesToHoursAndMinutes(value)}
                />
              }
            />
            <Bar
              dataKey="hora"
              barSize={50}
              fill="#0d3d86"
              radius={[10, 10, 0, 0]}
            >
              <LabelList
                dataKey="hora"
                position="top"
                formatter={(value: number) =>
                  formatMinutesToHoursAndMinutes(value)
                }
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                content={({ x, y, value }: any) => (
                  <text
                    x={x}
                    y={y}
                    dy={-4}
                    fill="#fff"
                    fontSize={12}
                    className="max-sm:text-[11px] md:text-base"
                  >
                    {formatMinutesToHoursAndMinutes(Number(value))}
                  </text>
                )}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
