'use client'

import { ChevronRight, NotebookPen, Play, Trash2 } from 'lucide-react'
import { useCallback, useState } from 'react'
import { toast } from 'sonner'

import { Separator } from '@/app/_components/ui/separator'
import { api } from '@/lib/axios'
import { convertMinutesToHours } from '@/utils/convertMinutesToHours'

import { DialogFinishedTask } from './dialogFinishedTask'
import { DialogNote } from './dialogNote'
import { DialogShowTimeRunning } from './dialogShowTimerRunning'
import { TimerButton } from './timerButton'
import DialogInfoRelevance from '@/app/_components/dialogInfoRelevance'

interface TaskCardProps {
  task: {
    id: string
    title: string
    subtitle: string
    relevance: number
    description: string
    finished: boolean
    timeSpent: number
    plannedDate: string
    isExtra: boolean
    taskType: string
    allowFurtherStudy: boolean
    allowQuestionsResultInput: boolean
    minTimeToCompleteInMinutes: number
    taskNote?: {
      correctCount: number
      incorrectCount: number
    }
  }
}

export function TaskCard({ task }: TaskCardProps) {
  const [isRunning, setIsRunning] = useState(false)

  const minTimeToCompleteInHours = convertMinutesToHours(
    task.minTimeToCompleteInMinutes,
  )

  const [timeInSeconds, setTimeInSeconds] = useState<number>(task.timeSpent)

  function handleStartOrStop() {
    setIsRunning((prev) => !prev)
  }

  const correctCount = task.taskNote?.correctCount || 0
  const incorrectCount = task.taskNote?.incorrectCount || 0
  const totalAnswers = correctCount + incorrectCount
  const percentageOfHits =
    totalAnswers > 0 ? Math.round((correctCount / totalAnswers) * 100) : null

  async function handleUncompleteTask() {
    const { status } = await api.put('tasks/uncomplete-task', {
      taskId: task.id,
    })

    if (status === 200) {
      toast.success('Tarefa desconcluída!')
      setTimeout(() => window.location.reload(), 500)
    } else {
      toast.error('Erro ao desconcluir a tarefa.')
    }
  }

  const memoizedSetTimeInSeconds = useCallback(
    (newValue: number | ((prev: number) => number)) => {
      setTimeInSeconds(newValue)
    },
    [setTimeInSeconds],
  )

  async function handleDeleteTaskExtra() {
    const { status } = await api.delete('tasks/remove-task', {
      data: {
        taskId: task.id,
      },
    })

    if (status === 200) {
      toast.success('Tarefa removida.')
    } else {
      toast.error('Erro ao deletar a tarefa.')
    }

    window.location.reload()
  }

  return (
    <div className="rounded-2xl p-3 space-y-4 bg-[#070E17]">
      <div className="flex justify-between items-center">
        <div className="flex gap-4 items-center">
          <h2 className="font-bold">{task.taskType}</h2>
          {task.isExtra && (
            <span className="text-xs border border-gray-600 rounded-xl py0.5 px-2 bg-gray-600/30">
              Extra
            </span>
          )}
        </div>

        {task.isExtra && (
          <button
            onClick={handleDeleteTaskExtra}
            className="text-red-500 hover:text-red-700 transition-all"
          >
            <Trash2 />
          </button>
        )}
      </div>
      <Separator className="w-[60%] rounded mx-auto bg-blue-700 h-[1px]" />

      <div>
        <div className="space-y-5">
          <div>
            <div className="flex justify-between items-center">
              <p className="font-bold">{task.subtitle}</p>
              <span className="text-sm text-zinc-400">
                Tempo sugerido: {minTimeToCompleteInHours}h
              </span>
            </div>

            <div className="flex justify-between items-center">
              <div className="">
                <p className="text-xs w-10/12 text-zinc-400">{task.title}</p>
              </div>
              <div className="flex items-center gap-2">
                <DialogInfoRelevance relevance={task.relevance} />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex justify-between w-full">
              <DialogShowTimeRunning
                timeInSeconds={timeInSeconds}
                setIsRunning={setIsRunning}
                triggerButton={
                  <button
                    onClick={handleStartOrStop}
                    className="flex text-sm items-center gap-2 bg-yellow-600 p-2 rounded-2xl text-black/90 font-bold hover:bg-yellow-500 transition-all"
                  >
                    <Play className="size-4 text-black font-bold" />
                    Iniciar Tarefa
                  </button>
                }
              />
              <TimerButton
                taskId={task.id}
                isRunning={isRunning}
                timeInSeconds={timeInSeconds}
                setTimeInSeconds={memoizedSetTimeInSeconds}
              />
            </div>

            <DialogNote
              taskRelevance={task.relevance}
              taskId={task.id}
              course={task.subtitle}
              topic={task.title}
              triggerButton={
                <button className="w-full flex justify-between border border-blue-300/20 p-4 rounded-2xl">
                  <div className="flex text-sm items-center gap-4">
                    <NotebookPen className="text-yellow-700" />
                    {percentageOfHits ? (
                      <span>{percentageOfHits}%</span>
                    ) : (
                      <span>Anotações</span>
                    )}
                  </div>

                  <ChevronRight className="text-yellow-700" />
                </button>
              }
            />
            <div className="w-full flex justify-center">
              {task.finished ? (
                <button
                  onClick={handleUncompleteTask}
                  className="transition-all px-4 py-1.5 rounded-2xl text-sm text-green-500 hover:bg-yellow-800/10"
                >
                  Tarefa Concluída
                </button>
              ) : (
                <DialogFinishedTask
                  taskId={task.id}
                  setTimeInSeconds={setTimeInSeconds}
                  timeInSeconds={timeInSeconds}
                  triggerButton={
                    <button className="transition-all px-4 py-1.5 rounded-2xl text-sm text-yellow-600 hover:bg-yellow-800/10">
                      Concluir Tarefa
                    </button>
                  }
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
