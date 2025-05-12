'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useMemo } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

import type { AllFormProps } from '@/@types/more-task'
import type { Subject } from '@/@types/subject'
import { Radio } from '@/app/_components/radioGroup'
import { TitlePage } from '@/app/_components/titlePage'
import { api } from '@/lib/axios'
import ConfirmButton from '@/app/_components/confirmButton'

const formTaskTopicSchema = z.object({
  taskTopic: z.string({ message: 'Escolha uma opção.' }),
})

type FormTaskTopicSchema = z.infer<typeof formTaskTopicSchema>

interface TaskTopicProps extends AllFormProps {
  subject: Subject | null
  taskNameId: string
  taskType: string
  courseId: string | null
}
export function TaskTopic({
  courseId,
  subject,
  taskNameId,
  taskType,
}: TaskTopicProps) {
  const { control, handleSubmit, formState } = useForm<FormTaskTopicSchema>({
    resolver: zodResolver(formTaskTopicSchema),
    mode: 'onChange',
  })

  const router = useRouter()

  async function onSubmit({ taskTopic }: FormTaskTopicSchema) {
    if (!taskNameId || !taskType || !taskTopic || !courseId) {
      return toast.error('Preencha todos os campos.')
    } else {
      const date = new Date()
      const formattedDate = date.toISOString().replace('Z', '')
      const { status } = await api.post('/tasks/create-extra-task', {
        topicId: taskTopic,
        type: taskType,
        date: formattedDate,
        courseId,
      })

      if (status === 200) {
        toast.success('Tarefa criada com sucesso.')
        setTimeout(() => router.push('/student/scheduled-tasks'), 600)
      } else {
        toast.error('Erro ao criar a tarefa.')
      }
    }
  }
  const topicsActive = useMemo(() => {
    return subject?.topics.filter(
      (topic) => topic.active === true && topic.name.length > 0,
    )
  }, [subject])

  const itemsForRadio = topicsActive?.map((topic) => {
    return { value: topic.id, label: topic.name }
  })

  return (
    <>
      <TitlePage title="Qual o tópico da disciplina selecionada você quer estudar?" />
      <form
        id="taskTopic"
        name="taskTopic"
        onSubmit={handleSubmit(onSubmit)}
        className="w-full flex flex-col justify-between max-md:h-[calc(50vh)] space-y-10"
      >
        <Controller
          name="taskTopic"
          control={control}
          render={({ field }) => (
            <Radio
              value={field.value}
              onChange={field.onChange}
              items={itemsForRadio ?? []}
            />
          )}
        />
        <ConfirmButton
          disabled={!formState.isValid}
          type="submit"
          className="max-md:w-full text-black font-bold disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Adicionar Tarefa
        </ConfirmButton>
      </form>
    </>
  )
}
