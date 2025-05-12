'use client'

import ConfirmButton from '@/app/_components/confirmButton'
import { ContentContainer } from '@/app/_components/contentContainer'
import { InputInfo } from '@/app/_components/inputInfo'
import { PageContainer } from '@/app/_components/pageContainer'
import { TitlePage } from '@/app/_components/titlePage'
import { RadioGroup, RadioGroupItem } from '@/app/_components/ui/radio-group'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from '@/app/_components/ui/select'
import { api } from '@/lib/axios'
import { ArrowLeft } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

interface CourseListProps {
  id: string
  institution: string
  jobPosition: string
}

interface Notification {
  id: string
  title: string
  description: string
  courseId?: string
  target: 'all' | 'one'
  endDate: string
  startDate: string
  active: boolean
}

export default function NewNotificationPage() {
  const router = useRouter()
  const { notificationId } = useParams<{ notificationId: string }>()

  const [notification, setNotification] = useState<Notification>()
  const [courseList, setCourseList] = useState<CourseListProps[]>([])

  const [title, setTitle] = useState<string>('')
  const [description, setDescription] = useState<string>('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [selectedCourse, setSelectedCourse] = useState<CourseListProps | null>(
    null,
  )
  const [notificationTarget, setNotificationTarget] = useState('')

  useEffect(() => {
    api.get('/courses/list').then(({ data: response }) => {
      setCourseList(response.data)
    })

    api.get('/notifications/list').then((response) => {
      const notifications: Notification[] = response.data.notifications
      setNotification(
        notifications.find(
          (notification) => notification.id === notificationId,
        ),
      )
    })
  }, [notificationId])

  useEffect(() => {
    if (notification) {
      setTitle(notification?.title)
      setDescription(notification.description)
      setStartDate(notification.startDate)
      setEndDate(notification.endDate)
      setNotificationTarget(notification.target)

      if (notification.target === 'one' && courseList) {
        setSelectedCourse(
          courseList?.find((course) => course.id === notification.courseId) ||
            null,
        )
      }
    }
  }, [notification, courseList])

  function handleSave() {
    const today = new Date().toISOString().split('T')[0]

    if (String(endDate) < today || String(startDate) < today) {
      return toast.error('Selecione uma data válida.')
    }

    if (!selectedCourse && notificationTarget === 'one') {
      return toast.error('Selecione um curso.')
    }

    const payload = {
      courseId: notificationTarget === 'all' ? null : selectedCourse?.id,
      startDate,
      endDate,
      title,
      description,
      target: notificationTarget,
      active: true,
      id: notificationId,
    }

    api.patch('/notifications', payload).then((response) => {
      if (response.status !== 204) {
        return toast.error('Erro ao atualizar notificação.')
      } else {
        toast.success(`Notificação atualizada.`)
        setTimeout(() => router.push('..'), 500)
      }
    })
  }

  return (
    <PageContainer>
      <button
        className="text-yellow-700 pt-5"
        onClick={() => router.push('..')}
      >
        <ArrowLeft size={30} />
      </button>
      <ContentContainer>
        <header className="p-6 border-b border-gray-800">
          <TitlePage className="text-yellow-600" title="Editar Notificação" />
        </header>
        <div className="p-6 space-y-6">
          <InputInfo
            label="Título"
            value={title}
            onChange={(e) => setTitle(e)}
            placeholder="Digite o título da notificação"
            type="text"
          />

          <div className="space-y-2">
            <label htmlFor="description">Descrição:</label>
            <textarea
              id="description"
              placeholder="Digite a descrição da notificação"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 bg-transparent border border-gray-800 rounded-md text-white min-h-[100px] focus:outline-none focus:ring-2 focus:ring-yellow-600 focus:border-transparent"
            />
          </div>

          <div className="space-y-2">
            <p>Você deseja notificar para:</p>
            <RadioGroup
              value={notificationTarget}
              onValueChange={(value: 'all' | 'one') =>
                setNotificationTarget(value)
              }
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
              <label htmlFor="course" className="text-gray-300">
                Selecione o curso que deseja notificar:
              </label>
              <Select
                defaultValue={selectedCourse?.id}
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

          <div>
            <p>Período:</p>
            <div className="w-full flex justify-between gap-4">
              <div className="w-1/2 flex items-center gap-3">
                <label htmlFor="startDate">Data Inicial</label>
                <input
                  id="startDate"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="flex-grow px-3 py-2 bg-transparent border border-gray-800 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-yellow-600 focus:border-transparent"
                />
              </div>
              <div className="w-1/2 flex items-center gap-3">
                <label htmlFor="endDate">Data final</label>
                <input
                  id="endDate"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className=" flex-grow px-3 py-2 bg-transparent border border-gray-800 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-yellow-600 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          <ConfirmButton onClick={() => handleSave()}>Salvar</ConfirmButton>
        </div>
      </ContentContainer>
    </PageContainer>
  )
}
