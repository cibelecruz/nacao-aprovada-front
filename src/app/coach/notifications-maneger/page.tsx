'use client'

import { useEffect, useState } from 'react'

import { TitlePage } from '@/app/_components/titlePage'
import { Trash2 } from 'lucide-react'
import { api } from '@/lib/axios'
import { DialogCreateNotification } from './components/dialogCreateNotification'
import { toast } from 'sonner'
import { Loader } from '@/app/_components/loader'
import { NavigationTable } from '@/app/_components/navigationTable'
import { PageContainer } from '@/app/_components/pageContainer'
import { ContentContainer } from '@/app/_components/contentContainer'
import dayjs from 'dayjs'

interface Notification {
  id: string
  title: string
  description: string
  courseId?: string
  target: 'all' | 'one'
  startDate: string
  endDate: string
  active: boolean
}

interface CourseListProps {
  id: string
  institution: string
  jobPosition: string
}

interface items {
  key: string
  check?: boolean
  [key: string]: React.ReactNode
}

export default function NotificationPage() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [notificationsTable, setNotificationsTable] = useState<items[]>([])
  const [courseList, setCourseList] = useState<CourseListProps[]>()

  useEffect(() => {
    let courseList: CourseListProps[]
    api.get('/courses/list').then(({ data: response }) => {
      setCourseList(response.data)
      courseList = response.data
    })

    api.get('/notifications/list').then((response) => {
      const resp = response.data.notifications as Notification[]
      setNotifications(response.data.notifications)
      const notificationsTable = resp.map((item) => {
        let course
        if (item.target === 'one' && courseList.length > 0) {
          course = courseList?.find((course) => course.id === item.courseId)
        }
        return {
          check: item.active,
          key: item.id,
          titulo: item.title,
          description: item.description,
          date: dayjs(item.startDate)
            .format('DD/MM/YYYY')
            .concat(' - ', dayjs(item.endDate).format('DD/MM/YYYY')),
          courseId:
            course?.institution.concat('-').concat(course.jobPosition) ??
            'Todos',
          actions: (
            <button
              disabled={!item.active}
              onClick={function (e) {
                handleDelete(item.id)
                e.stopPropagation()
                setNotificationsTable((prev) =>
                  prev.filter((n) => n.key !== item.id),
                )
              }}
            >
              <Trash2 className="size-5 text-red-700 hover:text-red-500" />
            </button>
          ),
        }
      })
      setNotificationsTable(notificationsTable)
    })
  }, [])

  async function handleUpdateActivate(id: string, checked: boolean) {
    const update = notificationsTable.map((item) =>
      item.key === id ? { ...item, check: checked } : item,
    )

    setNotificationsTable(update)
    api
      .put(`/notifications/change-status`, { active: checked, id })
      .then((response) => {
        if (response.status === 200) {
          toast.success(`Notificação ${checked ? 'ativada' : 'desativada'}.`)
        } else {
          toast.error('Erro ao atualizar notificação.')
        }
      })
  }

  function handleDelete(id: string) {
    api
      .delete(`/notifications/${id}`)
      .then((response) => {
        if (response.status === 200) {
          setNotifications((prev) => prev.filter((n) => n.id !== id))
        } else {
          toast.error('Erro ao deletar notificação.')
        }
      })
      .catch(() => {
        toast.error('Erro ao deletar notificação.')
      })
  }

  if (!notifications) return <Loader />

  return (
    <PageContainer>
      <ContentContainer>
        <div className="flex w-full justify-between">
          <TitlePage
            className="text-yellow-600"
            title="Gerenciamento de Notificações"
          />

          <DialogCreateNotification courseList={courseList ?? []} />
        </div>
        <NavigationTable
          header={[
            'check',
            'Título',
            'Descrição',
            'Período de Exibição',
            'Cursos Atribuidos',
            'actions',
          ]}
          items={notificationsTable}
          link="notifications-maneger/edit/"
          setCheckedItem={handleUpdateActivate}
          label="Notificações criadas"
        />
      </ContentContainer>
    </PageContainer>
  )
}
