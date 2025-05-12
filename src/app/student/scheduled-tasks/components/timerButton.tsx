import { useEffect } from 'react'

import { formatSecondsToTime } from '@/utils/formatSecondsToTimer'

import { DialogFinishedTask } from './dialogFinishedTask'

interface TimerButtonProps {
  isRunning: boolean
  timeInSeconds: number
  taskId: string
  setTimeInSeconds: React.Dispatch<React.SetStateAction<number>>
}

export function TimerButton({
  setTimeInSeconds,
  timeInSeconds,
  isRunning,
  taskId,
}: TimerButtonProps) {
  useEffect(() => {
    if (!isRunning) return

    const timer = setInterval(() => {
      setTimeInSeconds((prev) => prev + 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [isRunning, setTimeInSeconds])

  return (
    <DialogFinishedTask
      taskId={taskId}
      setTimeInSeconds={setTimeInSeconds}
      timeInSeconds={timeInSeconds}
      triggerButton={
        <button className="flex text-sm items-center gap-2 bg-black/50 py-2 px-4 rounded-2xl text-yellow-600 font-bold border border-transparent hover:border-yellow-800 transition-all">
          <p>{formatSecondsToTime(timeInSeconds)}</p>
        </button>
      }
    />
  )
}
