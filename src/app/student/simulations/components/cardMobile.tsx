'use client'

import { Card } from '@/app/_components/ui/card'
import dayjs from '@/lib/dayjs'
import { Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'

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

interface CardMobileProps {
  item: SimulationProps
  handleDeleteSimulation: (itemId: string) => void
}

export function CardMobile({ item, handleDeleteSimulation }: CardMobileProps) {
  const data: {
    totalQuestions: number
    correctQuestions: number
    totalSubject: number
  } = {
    correctQuestions: 0,
    totalQuestions: 0,
    totalSubject: item.subjects.length,
  }
  for (const subject of item.subjects) {
    data.totalQuestions += Number(subject.totalQuestions)
    data.correctQuestions += Number(subject.correctQuestions)
  }

  const router = useRouter()

  return (
    <Card
      onClick={() => router.push(`/student/simulations/edit/${item.id}`)}
      className="lg:hidden bg-blue-800 border-[#2a334a] hover:bg-[#1e2739] transition-colors p-4 rounded-xl"
    >
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="flex gap-3 items-center">
            <p className="text-amber-500 font-semibold text-base line-clamp-1">
              {item.name.length > 7 ? `${item.name.slice(0, 7)}...` : item.name}
            </p>
          </div>

          <div className="flex items-center justify-end w-full gap-2">
            <p className="text-xs text-zinc-200">
              {dayjs(item.date).format('DD/MM/YYYY')}
            </p>
            <button
              onClick={(e) => {
                e.stopPropagation()
                handleDeleteSimulation(item.id)
              }}
            >
              <Trash2 className="size-6 text-red-600" />
            </button>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-blue-900/80 p-2 rounded-lg">
            <p className="text-gray-400 text-sm">Total de matérias</p>
            <p className="text-white font-semibold">{data.totalSubject}</p>
          </div>
          <div />
          <div className="bg-blue-900/80 p-2 rounded-lg">
            <p className="text-gray-400 text-sm">Total de questões</p>
            <p className="text-white font-semibold">{data.totalQuestions}</p>
          </div>
          <div className="bg-blue-900/80 p-2 rounded-lg">
            <p className="text-gray-400 text-sm">Questões corretas</p>
            <p className="text-white font-semibold">{data.correctQuestions}</p>
          </div>
        </div>
      </div>
    </Card>
  )
}
