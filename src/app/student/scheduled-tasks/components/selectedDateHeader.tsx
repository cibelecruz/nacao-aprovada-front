import { Plus } from 'lucide-react'
import { useRouter } from 'next/navigation'

import dayjs from '@/lib/dayjs'

interface SelectedDateProps {
  selectedDate: dayjs.Dayjs
}

export function SelectedDateHeader({ selectedDate }: SelectedDateProps) {
  const formattedDate = selectedDate.format('dddd | D [de] MMMM')
  const router = useRouter()
  return (
    <div className="flex justify-between w-full px-1">
      <div>
        <p className="font-bold dark:text-white text-black">
          {formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1)}
        </p>
        <p className="text-zinc-400 text-sm">Lista de tarefas:</p>
      </div>

      <button
        onClick={() => router.push('/student/scheduled-tasks/more-tasks')}
        className="text-white border md:px-4 text-sm gap-2 sm:px-4  border-yellow-600 rounded-full max-sm:h-10 max-sm:w-10 flex items-center justify-center hover:border-yellow-500 transition-all"
      >
        <Plus className="text-yellow-600" />
        <span className="max-sm:hidden dark:text-white text-black">Adicionar Atividade</span>
      </button>
    </div>
  )
}
