import type { ReactNode } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import DialogInfoRelevance from '@/app/_components/dialogInfoRelevance'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/app/_components/ui/dialog'
import { api } from '@/lib/axios'
import { DialogDescription } from '@radix-ui/react-dialog'
import CancelButton from '@/app/_components/cancelButton'
import ConfirmButton from '@/app/_components/confirmButton'

interface DialogNoteProps {
  triggerButton: ReactNode
  taskId: string
  taskRelevance: number
  course: string
  topic: string
}

const formSchemaNote = z.object({
  hits: z.coerce.number(),
  errors: z.coerce.number(),
  comment: z.string(),
})

type FormSchemaNote = z.infer<typeof formSchemaNote>

export function DialogNote({
  triggerButton,
  taskId,
  taskRelevance,
  course,
  topic,
}: DialogNoteProps) {
  const { register, handleSubmit } = useForm<FormSchemaNote>()

  async function handleSaveNote(data: FormSchemaNote) {
    const { status } = await api.post('/task-note/register-note', {
      correctCount: Number(data.hits),
      incorrectCount: Number(data.errors),
      note: data.comment,
      taskId,
    })

    if (status === 200) {
      window.location.reload()
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>{triggerButton}</DialogTrigger>
      <DialogContent className="bg-white dark:bg-[#050c16] text-black dark:text-white border-none rounded-3xl md:w-2/5 max-md:w-4/5">
        <DialogHeader className="text-left">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-yellow-600">Anotações</DialogTitle>
            <DialogInfoRelevance relevance={taskRelevance} />
          </div>
          <DialogDescription className="text-zinc-50 text-sm font-bold">
            {course}
          </DialogDescription>
          <div>
            <p className="text-xs text-zinc-500">{topic}</p>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleSaveNote)}>
          <h2 className="font-bold text-base">Desempenho:</h2>
          <div className="flex justify-between">
            <fieldset className="border border-blue-400/30 pl-2 w-20 rounded-lg">
              <legend>Acertos</legend>
              <div className="flex flex-col">
                <input
                  {...register('hits')}
                  defaultValue={0}
                  type="number"
                  className="bg-transparent focus:outline-none w-20 rounded-lg p-2 "
                />
              </div>
            </fieldset>

            <fieldset className="border border-blue-400/30 pl-2 w-20 rounded-lg">
              <legend>Erros</legend>
              <div className="flex flex-col">
                <input
                  {...register('errors')}
                  defaultValue={0}
                  type="number"
                  className="bg-transparent focus:outline-none w-20 rounded-lg p-2"
                />
              </div>
            </fieldset>
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-bold text-base mt-4" htmlFor="comment">
              Comentários:
            </label>
            <textarea
              {...register('comment')}
              className="bg-transparent w-full rounded-lg p-2 border border-blue-400/30 placeholder:text-xs"
              placeholder="Faça suas anotações aqui..."
              id="comment"
            />
          </div>

          <div className="flex justify-between gap-8 mt-4">
            <DialogClose className="flex justify-center gap-8" asChild>
              <CancelButton>Cancelar</CancelButton>
            </DialogClose>
            <ConfirmButton className="text-black font-bold" type="submit">
              Concluir
            </ConfirmButton>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
