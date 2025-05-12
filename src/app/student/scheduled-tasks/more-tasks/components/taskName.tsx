'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import type { Dispatch, SetStateAction } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'

import type { Course } from '@/@types/courses'
import type { AllFormProps } from '@/@types/more-task'
import { Radio } from '@/app/_components/radioGroup'
import { TitlePage } from '@/app/_components/titlePage'
import ConfirmButton from '@/app/_components/confirmButton'

const formTaskNameSchema = z.object({
  taskName: z.string({ message: 'Escolha uma opção.' }),
})

type FormTaskNameSchema = z.infer<typeof formTaskNameSchema>

interface TaskNameProps extends AllFormProps {
  setTaskNameId: Dispatch<SetStateAction<string>>
  course: Course | null
}
export function TaskName({
  setShowFormTaskName,
  setShowFormTaskTopic,
  setShowFormTaskType,
  setTaskNameId,
  course,
}: TaskNameProps) {
  const { control, handleSubmit, formState } = useForm<FormTaskNameSchema>({
    resolver: zodResolver(formTaskNameSchema),
    mode: 'onChange',
  })

  function onSubmit({ taskName }: FormTaskNameSchema) {
    setShowFormTaskName(false)
    setShowFormTaskTopic(true)
    setShowFormTaskType(false)
    setTaskNameId(taskName)
  }

  const itemsForRadio = course?.subjects.map((subject) => {
    return { value: subject.id, label: subject.name }
  })

  return (
    <>
      <TitlePage title="Selecione a disciplina que deseja estudar" />
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full flex flex-col justify-between gap-6"
      >
        <Controller
          name="taskName"
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
          Proximo
        </ConfirmButton>
      </form>
    </>
  )
}
