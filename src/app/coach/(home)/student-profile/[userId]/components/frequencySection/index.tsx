import {
  BookOpenText,
  LaptopMinimalCheck,
  ListChecks,
  LogOut,
} from 'lucide-react'
import { CardInfo } from '../generalInfoSection/cardInfo'

import type { UserFrequencyProps } from '@/@types/user-frequency'

import { FrequencyRadio } from './frequencyRadio'
import { useState } from 'react'
import { FrequencyLineChart } from './frequencyLineChart'

interface FrequencySectionProps {
  userFrequency: UserFrequencyProps
  selectedCourse: string
}

type SelectedPeriodProps = '30 dias' | '60 dias' | '90 dias'

export function FrequencySection({
  userFrequency,
  selectedCourse,
}: FrequencySectionProps) {
  const [selectedPeriod, setSelectedPeriod] =
    useState<SelectedPeriodProps>('30 dias')
  const periodLabels = [
    {
      label: '30 dias',
      value: '30 dias',
    },
    {
      label: '60 dias',
      value: '60 dias',
    },
    {
      label: '90 dias',
      value: '90 dias',
    },
  ]

  const periodData = userFrequency.courses[selectedCourse][selectedPeriod]

  return (
    <div className="space-y-10">
      <div className="mt-10 space-y-6">
        <div className="flex gap-6 justify-between">
          <CardInfo
            icon={<LogOut className="size-5" />}
            title="Acessou"
            label={`${periodData.accesses}/${periodData.expectedAccesses}`}
            subtitle="dias planejados"
          />
          <CardInfo
            icon={<BookOpenText className="size-5" />}
            title="Estudou"
            label={`${periodData.completedWorkload}/${periodData.expectedWorkload}`}
            subtitle="horas planejadas"
          />
          <CardInfo
            icon={<ListChecks className="size-5" />}
            title="Concluiu"
            label={`${periodData.completedTasks}/${periodData.expectedTasks.toFixed(0)}`}
            subtitle="atividades"
          />
          <CardInfo
            icon={<LaptopMinimalCheck className="size-5" />}
            title="Frequentou"
            label={`${(periodData.averageFrequency * 100).toFixed(2)} %`}
            subtitle="a mais que outros alunos"
          />
        </div>

        <div className="flex justify-end w-full">
          <FrequencyRadio
            chartId="userFrequency"
            value={selectedPeriod}
            items={periodLabels}
            onChange={(value: string) =>
              setSelectedPeriod(value as SelectedPeriodProps)
            }
          />
        </div>
      </div>

      <div className="bg-blue-800 px-4 rounded-2xl pt-8">
        <p>Frequência</p>
        <FrequencyLineChart
          selectedPeriod={selectedPeriod}
          data={userFrequency.courses[selectedCourse].performance}
        />
      </div>
    </div>
  )
}
