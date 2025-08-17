import { ButtonFill } from '@/app/_components/buttonFill'
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/app/_components/ui/dialog'
import { RadioGroup, RadioGroupItem } from '@/app/_components/ui/radio-group'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from '@/app/_components/ui/select'
import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'
import dayjs from '@/lib/dayjs'
import { api } from '@/lib/axios'
import CancelButton from '@/app/_components/cancelButton'
import ConfirmButton from '@/app/_components/confirmButton'

interface CourseListProps {
  id: string
  institution: string
  jobPosition: string
}

interface DialogCreateNotificationProps {
  courseList: CourseListProps[]
}

const formSchema = z.object({
  title: z.string().min(4),
  description: z.string().min(4),
  startDate: z.date(),
  endDate: z.date(),
})

type FormSchema = z.infer<typeof formSchema>

export function DialogCreateNotification({
  courseList,
}: DialogCreateNotificationProps) {
  const [selectedCourse, setSelectedCourse] = useState<CourseListProps>({
    id: '',
    institution: 'Selecione um curso',
    jobPosition: '',
  })
  const [notificationTarget, setNotificationTarget] = useState<'all' | 'one'>(
    'all',
  )

  const { register, handleSubmit } = useForm<FormSchema>()

  useEffect(() => {
    if (courseList.length >= 1) {
      setSelectedCourse(courseList[0])
    }
  }, [courseList])

  async function handleCreateNotification({
    startDate,
    endDate,
    description,
    title,
  }: FormSchema) {
    const today = new Date().setHours(0, 0, 0, 0)
    const timeStartDate = new Date(startDate + 'T00:00:00').getTime()
    const timeEndDate = new Date(endDate + 'T00:00:00').getTime()

    if (timeEndDate < timeStartDate) {
      return toast.error('Data final menor que a inicial')
    }

    if (timeStartDate < today) {
      return toast.error('Selecione uma data depois do dia atual.')
    }

    if (!selectedCourse && notificationTarget === 'one') {
      return toast.error('Selecione um curso.')
    }

    const payload = {
      courseId: selectedCourse.id ?? null,
      startDate,
      endDate,
      title,
      description,
      target: notificationTarget,
      active: true,
    }

    await api.post('/notifications', payload).then((response) => {
      if (response.status === 200) {
        toast.success(
          `Notificação agendada para: ${dayjs(startDate).format('DD/MM/YYYY')}`,
        )
        setTimeout(() => window.location.reload(), 500)
      } else {
        toast.error('Erro ao criar notificação.')
      }
    })
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <ConfirmButton>Criar noticação</ConfirmButton>
      </DialogTrigger>
      <DialogContent
        onInteractOutside={(e) => {
          e.preventDefault()
        }}
        className="bg-white dark:bg-[#050c16] text-black dark:text-white space-y-6"
      >
        <DialogHeader>
          <DialogTitle className="text-yellow-600">
            Nova Notificação
          </DialogTitle>
        </DialogHeader>
        <form
          onSubmit={handleSubmit(handleCreateNotification)}
          id="add-notification"
          className="space-y-8"
        >
          <div className="flex flex-col gap-2">
            <label htmlFor="title" className="text-zinc-600 dark:text-white font-bold">
              Título:
            </label>
            <input
              {...register('title')}
              required
              className="bg-transparent w-full border-b px-2 py-1 focus:border-yellow-500 transition-all outline-none"
              placeholder="Título"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="description" className="text-zinc-600 dark:text-white font-bold">
              Descrição:
            </label>
            <input
              {...register('description')}
              required
              className="bg-transparent w-full border-b px-2 py-1 focus:border-yellow-500 transition-all outline-none"
              placeholder="Descrição"
            />
          </div>

          <div className="space-y-2">
            <p className="text-black dark:text-white text-bold">Você deseja notificar para:</p>
            <RadioGroup
              required
              onValueChange={(value: 'all' | 'one') =>
                setNotificationTarget(value)
              }
              className="text-black dark:text-white flex"
            >
              <div className="flex gap-2 items-center justify-between text-sm">
                <RadioGroupItem id="all" value="all" />
                <label htmlFor="all">Todos os cursos</label>
              </div>
              <div className="flex gap-2 items-center text-sm">
                <RadioGroupItem id="one" value="one" />
                <label htmlFor="one">Apenas um curso</label>
              </div>
            </RadioGroup>
          </div>

          {notificationTarget === 'one' && (
            <div className="flex flex-col gap-2">
              <label htmlFor="course" className="text-yellow-500 font-bold">
                Selecione o curso que deseja notificar:
              </label>
              <Select
                onValueChange={(value: string) => {
                  const course = courseList.find(
                    (course) => course.id === value,
                  )

                  if (course) {
                    setSelectedCourse(course)
                  }
                }}
              >
                <SelectTrigger>
                  {selectedCourse.institution
                    .concat('-')
                    .concat(selectedCourse.jobPosition)}
                </SelectTrigger>

                <SelectContent className="bg-white dark:bg-[#050c16] text-black dark:text-white">
                  {courseList.map((course) => (
                    <SelectItem key={course.id} value={course.id}>
                      {course.institution
                        .concat('-')
                        .concat(course.jobPosition)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="flex flex-col gap-2">
            <label htmlFor="date" className="text-zinc-600 dark:text-white font-bold">
              Período de exibição:
            </label>
            <div className="flex justify-between items-center">
              <input
                required
                {...register('startDate')}
                id="startDate"
                type="date"
                className="bg-transparent border-b px-2 py-0.5 w-5/12 outline-none focus:border-yellow-500 transition-all"
              />
              Até
              <input
                required
                {...register('endDate')}
                id="endDate"
                type="date"
                className="bg-transparent border-b px-2 py-0.5 w-5/12 outline-none focus:border-yellow-500 transition-all"
              />
            </div>
          </div>
        </form>
        <DialogFooter className="max-sm:gap-4 max-sm:flex-row md:gap-32 lg:gap-52">
          <DialogClose asChild>
            <CancelButton>Cancelar</CancelButton>
          </DialogClose>
          <ButtonFill
            disabled={false}
            label="Salvar"
            type="submit"
            form="add-notification"
            className="text-white"
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
