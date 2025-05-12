import { Moon, Pause } from 'lucide-react'
import type { ReactNode } from 'react'

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from '@/app/_components/ui/dialog'
import { formatSecondsToTime } from '@/utils/formatSecondsToTimer'

interface DialogShowTimeRunningProps {
  triggerButton: ReactNode
  timeInSeconds: number
  setIsRunning: React.Dispatch<React.SetStateAction<boolean>>
}

export function DialogShowTimeRunning({
  triggerButton,
  timeInSeconds,
  setIsRunning,
}: DialogShowTimeRunningProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>{triggerButton}</DialogTrigger>
      <DialogContent className="h-screen w-screen border-none bg-black/20 flex flex-col justify-center items-center space-y-8">
        <DialogTitle hidden>Cronometro</DialogTitle>
        <button className="bg-gray-900 h-14 w-14 flex justify-center items-center rounded-xl">
          <Moon className="size-8" />
        </button>
        <div className="text-center space-y-8">
          <p className="text-8xl font-bold text-yellow-600">
            {formatSecondsToTime(timeInSeconds)}
          </p>

          <p>Tempo recomendado paraesta atividade: 2 horas</p>

          <p>Garantia dos DIreitos Individuais e coletivos (art. 5°)</p>
          <p>DIreito constitucional</p>
        </div>

        <DialogClose asChild>
          <button
            onClick={() => setIsRunning(false)}
            className="h-14 w-14 border-[5px] border-yellow-600 rounded-full flex justify-center items-center"
          >
            <Pause className="size-8 text-yellow-600" />
          </button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  )
}
