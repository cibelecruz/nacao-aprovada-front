'use client'

import { Trash2 } from 'lucide-react'
import dayjs from '@/lib/dayjs'
import { NavigationTable } from '@/app/_components/navigationTable'

interface SubjectsInSimulationProps {
  id: string
  name: string
  totalQuestions: number
  correctQuestions: number
}

interface SimulationProps {
  id: string
  name: string
  date: string
  subjects: SubjectsInSimulationProps[]
}

interface ResponsiveTableProps {
  data: SimulationProps[]
  handleDeleteSimulation: (id: string) => void
}

export function TableSimulation({
  data,
  handleDeleteSimulation,
}: ResponsiveTableProps) {
  const formattedItems = data.map((item) => {
    const data = {
      totalQuestions: 0,
      correctQuestions: 0,
      totalSubject: item.subjects.length,
    }
    for (const subject of item.subjects) {
      data.totalQuestions += Number(subject.totalQuestions)
      data.correctQuestions += Number(subject.correctQuestions)
    }
    return {
      key: item.id,
      name: item.name.length > 7 ? `${item.name.slice(0, 7)}...` : item.name,
      date: dayjs(item.date).format('DD/MM/YYYY'),
      totalSubject: data.totalSubject,
      totalQuestions: data.totalQuestions,
      correctQuestions: data.correctQuestions,
      actions: (
        <button onClick={() => handleDeleteSimulation(item.id)}>
          <Trash2 className="size-4 text-red-600 hover:text-red-500" />
        </button>
      ),
    }
  })

  return (
    <NavigationTable
      header={['Simulado', 'Data', 'Matérias', 'Questões', 'Acertos']}
      items={formattedItems}
      link="/student/simulations/edit/"
    />
  )
}
