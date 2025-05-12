import { Button } from '@/app/_components/button'
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
import { Edit } from 'lucide-react'
import { api } from '@/lib/axios'

interface CourseListProps {
  id: string
  institution: string
  jobPosition: string
}

interface DialogEditNotificationProps {
  courseList: CourseListProps[]
  courseSelected?: string
  target: 'all' | 'one'
  title: string
  description: string
  date: string
  id: string
}

const formSchema = z.object({
  title: z.string().min(4),
  description: z.string().min(4),
  date: z.date(),
})

type FormSchema = z.infer<typeof formSchema>

export function DialogEditNotification({
  courseList,
  date,
  description,
  target,
  title,
  id,
  courseSelected,
}: DialogEditNotificationProps) {
  const [selectedCourse, setSelectedCourse] = useState<CourseListProps>(
    courseSelected
      ? courseList.find((course) => course.id === courseSelected)!
      : {
          id: '',
          institution: 'Selecione um curso',
          jobPosition: '',
        },
  )
  const [notificationTarget, setNotificationTarget] = useState<'all' | 'one'>(
    target,
  )

  const [, setSelectedDate] = useState<string>('')

  const { register, handleSubmit } = useForm<FormSchema>()

  useEffect(() => {
    if (courseSelected && courseList.length >= 1) {
      const course = courseList.find((course) => {
        const courseName = course.institution
          .concat('-')
          .concat(course.jobPosition)
        return courseName === courseSelected
      })

      if (course) {
        setSelectedCourse(course)
      }
    }
    if (!courseSelected && courseList.length >= 1) {
      setSelectedCourse(courseList[0])
    }
  }, [courseList, courseSelected])

  function handleDateChange(e: React.ChangeEvent<HTMLInputElement>) {
    const inputDate = e.target.value
    const today = new Date().toISOString().split('T')[0]

    if (inputDate < today) {
      toast.warning('Você não pode selecionar uma data anterior a hoje.')
      setSelectedDate('')
    } else {
      setSelectedDate(inputDate)
    }
  }

  async function handleCreateNotification({
    date,
    description,
    title,
  }: FormSchema) {
    const today = new Date().toISOString().split('T')[0]

    if (String(date) < today) {
      return toast.error('Selecione uma data válida.')
    }

    if (!selectedCourse && notificationTarget === 'one') {
      return toast.error('Selecione um curso.')
    }

    const payload = {
      courseId: selectedCourse.id ?? null,
      date,
      title,
      description,
      target: notificationTarget,
      active: true,
      id,
    }

    api.patch('/notifications', payload).then((response) => {
      if (response.status !== 204) {
        return toast.error('Erro ao atualizar notificação.')
      } else {
        toast.success(`Notificação atualizada.`)
        setTimeout(() => window.location.reload(), 500)
      }
    })
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button>
          <Edit className="size-5" />
        </button>
      </DialogTrigger>
      <DialogContent
        onInteractOutside={(e) => {
          e.preventDefault()
        }}
        className="bg-[#050c16] text-white space-y-6"
      >
        <DialogHeader>
          <DialogTitle>Nova Notificação</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={handleSubmit(handleCreateNotification)}
          id="add-notification"
          className="space-y-8"
        >
          <div className="flex flex-col gap-2">
            <label htmlFor="title" className="text-yellow-500 font-bold">
              Título:
            </label>
            <input
              {...register('title')}
              defaultValue={title}
              required
              className="bg-transparent w-full border-b px-2 py-1 focus:border-yellow-500 transition-all outline-none"
              placeholder="Título"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="description" className="text-yellow-500 font-bold">
              Descrição:
            </label>
            <input
              defaultValue={description}
              {...register('description')}
              required
              className="bg-transparent w-full border-b px-2 py-1 focus:border-yellow-500 transition-all outline-none"
              placeholder="Descrição"
            />
          </div>

          <div className="space-y-2">
            <p className="text-yellow-500">Você deseja notificar para:</p>
            <RadioGroup
              value={notificationTarget} // Controla o valor selecionado
              onValueChange={(value: 'all' | 'one') =>
                setNotificationTarget(value)
              } // Atualiza o estado
              className="text-white flex"
            >
              <div className="flex gap-2 items-center text-xs">
                <RadioGroupItem id="all" value="all" />
                <label htmlFor="all">Todos os cursos</label>
              </div>
              <div className="flex gap-2 items-center text-xs">
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
                  {selectedCourse
                    ? selectedCourse.institution
                        .concat('-')
                        .concat(selectedCourse.jobPosition)
                    : 'Selecione um curso'}
                </SelectTrigger>

                <SelectContent className="bg-blue-800 text-white">
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
            <label htmlFor="date" className="text-yellow-500 font-bold">
              Data de exibição:
            </label>
            <input
              required
              value={date}
              {...register('date')}
              id="date"
              onChange={handleDateChange}
              type="date"
              className="bg-transparent border-b px-2 py-0.5 w-1/2 outline-none focus:border-yellow-500 transition-all"
            />
          </div>
        </form>
        <DialogFooter className="max-sm:gap-4 max-sm:flex-row md:gap-32 lg:gap-52">
          <DialogClose asChild>
            <Button label="Cancelar" disabled={false} />
          </DialogClose>
          <DialogClose asChild>
            <ButtonFill
              disabled={false}
              label="Salvar"
              type="submit"
              form="add-notification"
              className="text-white"
            />
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
