'use client'

import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { api } from '@/lib/axios'

import { ArrowLeft, Trash2 } from 'lucide-react'

import { DialogDeleteSubjectCourse } from '../../components/dialogDeleteSubjectCourse'
import { DialogAddSubject } from './components/dialogAddSubject'
import { DialogImportSubject } from './components/dialogImportSubjects'
import { Loader } from '@/app/_components/loader'
import { EditNameCourse } from './components/editNameCourse'
import { toast } from 'sonner'
import { CoursesProps, SubjectProps } from '../../page'
import { SliderEditSubject } from './components/sliderEditSubject'
import { PageContainer } from '@/app/_components/pageContainer'
import { ContentContainer } from '@/app/_components/contentContainer'

export interface topicProps {
  active: boolean
  id: string
  name: string
  relevance: number
  taskTypes: string[]
}

export interface courseSubjectsProps {
  active: boolean
  id: string
  name: string
  relevance: number
  topics: topicProps[]
}
interface courseProps {
  _id: string
  name: string
  subjects: courseSubjectsProps[]
}

export default function EditCourse() {
  const idCourse = useParams()
  const router = useRouter()

  const [newCourseName, setNewCourseName] = useState('')
  const [courseName, setCourseName] = useState('')
  const [course, setCourse] = useState<courseProps>()
  const [courses, setCourses] = useState<CoursesProps[]>([])
  const [subjects, setSubjects] = useState<SubjectProps[]>([])
  const [courseSubjets, setCourseSubjects] = useState<courseSubjectsProps[]>([])

  const [loaderCourse, setLoaderCourse] = useState(true)
  const [loaderSubjects, setLoaderSubjects] = useState(true)
  const [loaderCourses, setLoaderCourses] = useState(true)

  useEffect(() => {
    setLoaderCourse(true)
    api
      .get(`/courses/course-info/${String(idCourse.course)}`)
      .then((response) => {
        setLoaderCourse(false)
        setCourse(response.data)
        setCourseName(response.data.name)
        setNewCourseName(response.data.name)
        setCourseSubjects(response.data.subjects)
      })
  }, [idCourse.course])

  useEffect(() => {
    setLoaderSubjects(true)
    api.get('/subjects').then((response) => {
      setSubjects(response.data)
      setLoaderSubjects(false)
    })
  }, [])

  useEffect(() => {
    setLoaderCourses(true)
    api.get('/courses/list').then((response) => {
      setCourses(response.data.data)
      setLoaderCourses(false)
    })
  }, [])

  useEffect(() => {
    if (courseName !== newCourseName) {
      setCourseName(newCourseName)
      api
        .put(`/courses/course-name/${String(idCourse.course)}`, {
          courseName: newCourseName,
        })
        .then(() => toast.success('Nome do plano editado com sucesso'))
    }
  }, [newCourseName, courseName, idCourse.course])

  return loaderCourse || loaderSubjects || loaderCourses ? (
    <Loader />
  ) : (
    <PageContainer>
      <button className="text-yellow-700 pt-5" onClick={() => router.back()}>
        <ArrowLeft size={30} />
      </button>
      <ContentContainer>
        <div className="w-full flex justify-between items-center">
          <div>
            <EditNameCourse
              name={newCourseName}
              setName={setNewCourseName}
              className="-7 text-lg font-bold"
            />

            <p className="text-xs text-gray-400">
              {course?.subjects.length} diciplina(s)
            </p>
          </div>
          <DialogDeleteSubjectCourse
            name={newCourseName}
            id={String(idCourse.course)}
            label={<Trash2 className="text-red-600" />}
            className="w-auto px-3 h-8 mt-8 rounded hover:bg-gray-600 hover:border-gray-600 transition-all mb-3"
            route={true}
            isSubject={false}
          />
        </div>
        <DialogAddSubject
          subjects={subjects}
          idCourse={String(idCourse.course)}
        />
        <DialogImportSubject
          idCourse={String(idCourse.course)}
          courses={courses}
        />

        <div>
          {!courseSubjets ? (
            <p className="text-gray-500 py-5">
              Nenhuma disciplina foi encontrada nesse plano.
            </p>
          ) : (
            courseSubjets.map((subject: courseSubjectsProps) => (
              <SliderEditSubject
                key={subject.id}
                subject={subject}
                idCourse={String(idCourse.course)}
              />
            ))
          )}
        </div>
      </ContentContainer>
    </PageContainer>
  )
}
