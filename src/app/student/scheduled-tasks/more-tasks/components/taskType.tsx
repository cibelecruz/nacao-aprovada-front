import { zodResolver } from '@hookform/resolvers/zod'
import type { Dispatch, SetStateAction } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'

import type { Course } from '@/@types/courses'
import type { AllFormProps } from '@/@types/more-task'
import { Radio } from '@/app/_components/radioGroup'
import { TitlePage } from '@/app/_components/titlePage'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from '@/app/_components/ui/select'
import ConfirmButton from '@/app/_components/confirmButton'

const formTaskTypeSchema = z.object({
  taskType: z.enum(['study', 'lawStudy', 'exercise', 'review']),
})

type FormTaskTypeSchema = z.infer<typeof formTaskTypeSchema>

interface TaskTypeProps extends AllFormProps {
  setTaskType: Dispatch<SetStateAction<string>>
  courses: Course[] | null
  course: Course | null
  handleOnChangeCourse: (value: string) => void
}
export function TaskType({
  setShowFormTaskName,
  setShowFormTaskTopic,
  setShowFormTaskType,
  setTaskType,
  course,
  courses,
  handleOnChangeCourse,
}: TaskTypeProps) {
  const { control, handleSubmit, formState } = useForm<FormTaskTypeSchema>({
    resolver: zodResolver(formTaskTypeSchema),
    mode: 'onChange',
  })

  function onSubmit({ taskType }: FormTaskTypeSchema) {
    setShowFormTaskName(true)
    setShowFormTaskTopic(false)
    setShowFormTaskType(false)
    setTaskType(taskType)
  }

  const itemsForRadio = [
    { label: 'Estudo Teórico', value: 'study' },
    { label: 'Letra da Lei', value: 'lawStudy' },
    { label: 'Exercícios', value: 'exercise' },
    { label: 'Revisão', value: 'review' },
  ]
  return (
    <>
      <TitlePage title="Que tipo de atividade deseja adicionar no seu dia?" className='dark:text-white text-black' />
      <Select onValueChange={handleOnChangeCourse}>
        <SelectTrigger className="w-max border-blue-500/30 flex gap-4 dark:text-white text-black">
          {course?.name}
        </SelectTrigger>
        <SelectContent className="dark:bg-blue-800 dark:text-white text-black">
          {courses?.map((course) => (
            <SelectItem key={course._id} value={course._id}>
              {course.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full flex flex-col justify-between h-max space-y-10"
      >
        <Controller
          name="taskType"
          control={control}
          render={({ field }) => {
            return (
              <Radio
                value={field.value}
                onChange={field.onChange}
                items={itemsForRadio ?? []}
              />
            )
          }}
        />
        <ConfirmButton
          disabled={!formState.isValid}
          type="submit"
          className="max-md:w-full text-black font-bold disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Próximo
        </ConfirmButton>
      </form>
    </>
  )
}
