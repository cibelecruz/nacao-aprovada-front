'use client'
import { useEffect, useState } from 'react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { TitlePage } from '@/app/_components/titlePage'
import { api } from '@/lib/axios'
import { Loader } from '@/app/_components/loader'
import { PageContainer } from '@/app/_components/pageContainer'
import { ContentContainer } from '@/app/_components/contentContainer'
import { NavigationTable } from '@/app/_components/navigationTable'
import { Trash2 } from 'lucide-react'
import { DialogDeleteSubjectCourse } from './components/dialogDeleteSubjectCourse'
import { DialogCreateSubjectCourse } from './components/dialogCreateSubjectCourse'

type TaskType = 'study' | 'lawStudy' | 'exercise' | 'review'

export interface SubjectProps {
  _id: string
  name: string
  topics: {
    name: string
    id: string
    active: boolean
    taskTypes: TaskType[]
  }[]
  createdAt: string
  updatedAt: string
  deleted: boolean
}

export interface CoursesProps {
  institution: string
  jobPosition: string
  id: string
}

export default function ContentManagement() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [loaderSubject, setLoaderSubject] = useState(true)
  const [loaderCourse, setLoaderCourse] = useState(true)
  const [subjects, setSubjects] = useState<SubjectProps[]>([])
  const [courses, setCourses] = useState<CoursesProps[]>([])

  const tab = searchParams.get('tab') || 'subjects'
  const [activeTab, setActiveTab] = useState(tab === 'courses')

  useEffect(() => {
    setLoaderSubject(true)
    api.get('/subjects').then((response) => {
      setSubjects(response.data)
      setLoaderSubject(false)
    })
  }, [])

  useEffect(() => {
    setLoaderCourse(true)
    api.get('/courses/list').then((response) => {
      setCourses(response.data.data)
      setLoaderCourse(false)
    })
  }, [])

  // Função para alternar entre as abas e atualizar a URL
  function handleTabChange(isCourse: boolean) {
    setActiveTab(isCourse)
    const newTab = isCourse ? 'courses' : 'subjects'
    const params = new URLSearchParams(searchParams.toString())
    params.set('tab', newTab)
    router.replace(`${pathname}?${params.toString()}`)
  }

  const subjectTable = subjects.map((subject) => {
    return {
      key: subject._id,
      name: subject.name,
      actions: (
        <DialogDeleteSubjectCourse
          className=""
          label={<Trash2 className="size-5 text-red-500 hover:text-red-400" />}
          id={subject._id}
          isSubject={!activeTab}
          name={subject.name}
          route={false}
        />
      ),
    }
  })

  const courseTable = courses.map((course) => {
    const name = course.institution.concat('-').concat(course.jobPosition)
    return {
      key: course.id,
      name,
      actions: (
        <DialogDeleteSubjectCourse
          className=""
          label={<Trash2 className="size-5 text-red-500 hover:text-red-400" />}
          id={course.id}
          isSubject={!activeTab}
          name={name}
          route={false}
        />
      ),
    }
  })

  if (loaderCourse || loaderSubject) {
    return (
      <PageContainer>
        <Loader />
      </PageContainer>
    )
  }

  return (
    <PageContainer>
      <ContentContainer>
        <TitlePage
          className="text-yellow-600"
          title="Gerenciamento de conteúdo"
        />
        <div className="flex justify-between">
          <div className="flex gap-4">
            <button
              onClick={() => handleTabChange(false)}
              className={
                !activeTab
                  ? 'text-yellow-500 dark:text-yellow-700'
                  : 'text-zinc-600 dark:text-white'
              }
            >
              Disciplinas
            </button>
            <button
              onClick={() => handleTabChange(true)}
              className={
                activeTab
                  ? 'text-yellow-500 dark:text-yellow-700'
                  : 'text-zinc-600 dark:text-white'
              }
            >
              Planos de Estudo
            </button>
          </div>
          <DialogCreateSubjectCourse isSubject={!activeTab} />
        </div>
        <NavigationTable
          header={activeTab ? ['Plano de estudos'] : ['Disciplinas']}
          items={activeTab ? courseTable : subjectTable}
          link={
            activeTab
              ? 'content-management/edit-plan/'
              : 'content-management/edit-topic/'
          }
          label={
            activeTab
              ? 'Planos de estudos cadastrados'
              : 'Disciplinas cadastradas'
          }
        />
      </ContentContainer>
    </PageContainer>
  )
}
