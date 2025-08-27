import { type ReactNode, useState } from 'react'
import { toast } from 'sonner'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/app/_components/ui/dialog'
import { api } from '@/lib/axios'

import AnalogClock from './analogClock'

interface DialogFinishedTaskProps {
  timeInSeconds: number
  taskId: string
  triggerButton: ReactNode
  setTimeInSeconds: (time: number) => void
}

export function DialogFinishedTask({
  timeInSeconds,
  setTimeInSeconds,
  triggerButton,
  taskId,
}: DialogFinishedTaskProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [openClockPicker, setOpenClockPicker] = useState(false)

  const [selectedTime, setSelectedTime] = useState({
    hours: Math.floor(timeInSeconds / 3600),
    minutes: Math.floor((timeInSeconds % 3600) / 60),
  })

  function handleTimeSelection(hours: number, minutes: number) {
    setSelectedTime({ hours, minutes })
    const totalSeconds = hours * 3600 + minutes * 60
    setTimeInSeconds(totalSeconds)
    setOpenClockPicker(false)
  }

  async function handleFinishedTask() {
    if (timeInSeconds <= 0) {
      toast.error('Não é possível concluir uma tarefa com o cronômetro em 0')
      return
    }

    const response = await api.post('/tasks/complete-task', {
      taskId,
      elapsedTimeInSeconds: timeInSeconds,
    })

    if (response.status === 200) {
      toast.success('Tarefa concluída!')
      setTimeout(() => window.location.reload(), 500)
    } else {
      toast.error('Erro ao concluir a tarefa.')
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{triggerButton}</DialogTrigger>

      <DialogContent className="dark:bg-[#050c16] border-none rounded-3xl w-max lg:w-1/4">
        {openClockPicker ? (
          <AnalogClock
            setOpenClockPicker={setOpenClockPicker}
            initialHours={selectedTime.hours}
            initialMinutes={selectedTime.minutes}
            onTimeSelect={handleTimeSelection}
            setIsOpen={setIsOpen}
          />
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="text-yellow-600">
                Tempo gasto na atividade
              </DialogTitle>
              <DialogDescription className="text-black dark:text-zinc-50">
                Confirme abaixo o tempo gasto nessa atividade
              </DialogDescription>
            </DialogHeader>

            <div className="flex justify-center">
              <button
                className="border border-black dark:border-blue-400/30 hover:border-yellow-500 px-4 py-1 rounded-2xl dark:bg-blue-900 text-black dark:text-white transition-all"
                onClick={() => setOpenClockPicker(true)}
              >
                {`${String(selectedTime.hours).padStart(2, '0')}:${String(
                  selectedTime.minutes,
                ).padStart(2, '0')}:00`}
              </button>
            </div>

            <div className="w-full flex justify-evenly text-yellow-600">
              <button
                onClick={() => setIsOpen(false)}
                className="border px-4 rounded-2xl border-transparent hover:border-yellow-600 hover:bg-yellow-600/10 "
              >
                Cancelar
              </button>
              <button
                onClick={handleFinishedTask}
                className="border px-4 rounded-2xl border-transparent hover:border-yellow-600 hover:bg-yellow-600/10 "
              >
                Concluir
              </button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
