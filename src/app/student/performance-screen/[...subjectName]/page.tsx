'use client'

import { TitlePage } from '@/app/_components/titlePage'
import { Card, CardContent } from '@/app/_components/ui/card'
import { useCourseContext } from '@/app/context/coursesSelect'
import { useAuth } from '@/app/hooks/useAuth'
import { api } from '@/lib/axios'
import { ArrowLeft } from 'lucide-react'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'

interface TopicBackEnd {
  questions: number
  correct: number
  incorrect: number
  progress: number
}

interface SubjectBackEnd {
  questions: number
  correct: number
  incorrect: number
  progress: number
  topics: Record<string, TopicBackEnd>
}

interface CourseBackEnd {
  questions: number
  correct: number
  incorrect: number
  progress: number
  subjects: Record<string, SubjectBackEnd>
}

interface UserPerformanceBackEnd {
  name: string
  email: string
  phone: string
  courses: Record<string, CourseBackEnd>
}

interface Topic {
  questions: number
  correct: number
  incorrect: number
  progress: number
  topicName: string
}

interface Subject {
  questions: number
  correct: number
  incorrect: number
  progress: number
  topics: Topic[]
  subjectName: string
}

interface Course {
  questions: number
  correct: number
  incorrect: number
  progress: number
  subjects: Subject[]
  courseName: string
}

interface UserPerformanceFormatted {
  name: string
  email: string
  phone: string
  courses: Course[]
}

function transformUserPerformanceToArray(data: UserPerformanceBackEnd) {
  const transformedCourses = Object.entries(data.courses).map(
    ([courseName, courseData]) => ({
      ...courseData,
      courseName,
      subjects: Object.entries(courseData.subjects).map(
        ([subjectName, subjectData]) => ({
          ...subjectData,
          subjectName,
          topics: Object.entries(subjectData.topics || {}).map(
            ([topicName, topicData]) => ({
              ...topicData,
              topicName,
            }),
          ),
        }),
      ),
    }),
  )

  return {
    ...data,
    courses: transformedCourses,
  }
}

export default function Page() {
  const { subjectName } = useParams<{ subjectName: string[] }>()
  const { currentUser } = useAuth()
  const { courseSelected } = useCourseContext()
  const [courseName, setCourseName] = useState<string>('')

  const [userPerformance, setUserPerformance] =
    useState<UserPerformanceFormatted>()
  const [competitionPerformance, setCompetitionPerformance] =
    useState<UserPerformanceFormatted>()

  useEffect(() => {
    api.get(`/courses/course-name/${courseSelected}`).then((response) => {
      setCourseName(response.data.body)
    })

    api.get(`/users/performance/${currentUser?.uid}`).then((response) => {
      const userFormattedData = transformUserPerformanceToArray(
        response.data.userPerformance,
      )
      const competitionFormattedData = transformUserPerformanceToArray(
        response.data.allStudentPerformance,
      )

      setUserPerformance(userFormattedData)
      setCompetitionPerformance(competitionFormattedData)
    })
  }, [subjectName, currentUser, courseSelected])

  const formattedSubjectName = decodeURIComponent(subjectName[0])

  const userCourse = userPerformance?.courses.find(
    (c) => c.courseName === courseName,
  )
  const userSubject = userCourse?.subjects.find(
    (s) => s.subjectName === formattedSubjectName,
  )

  const competitorCourse = competitionPerformance?.courses.find(
    (c) => c.courseName === courseName,
  )
  const competitorSubject = competitorCourse?.subjects.find(
    (s) => s.subjectName === formattedSubjectName,
  )

  if (!userSubject) {
    return (
      <div className="md:flex md:justify-center sm:p-auto min-h-max overflow-y-auto p-4 pb-36">
        <div className="mt-5 max-sm:w-full max-md:w-full w-3/5 space-y-8">
          <h1 className="text-2xl font-bold text-center">
            Matéria não encontrada
          </h1>
          <div className="w-full flex justify-center">
            <button
              className="flex items-center gap-2 text-yellow-500"
              onClick={() => window.history.back()}
            >
              <ArrowLeft className="size-5" />
              Voltar
            </button>
          </div>
        </div>
      </div>
    )
  }

  const sortedTopics = userSubject.topics
    .slice()
    .sort((a, b) => b.progress - a.progress)

  return (
    <div className="md:flex md:justify-center sm:p-auto min-h-max overflow-y-auto p-4 pb-36">
      <div className="mt-5 md:mt-1 max-sm:w-full max-md:w-full w-3/5 space-y-8">
        <button onClick={() => window.history.back()}>
          <ArrowLeft className="size-5 text-yellow-500" />
        </button>
        <div className="border-3 rounded-xl border-[#070E17] p-5 bg-[#070E17] space-y-8">
          <div className="space-y-2">
            <TitlePage
              className="text-yellow-600"
              title={`Informações do assunto:`}
            />
            <p>{formattedSubjectName}</p>
          </div>
          {/* Tabela para Desktop */}
          <table className="max-md:hidden w-full min-w-[500px] border-collapse">
            <thead>
              <tr className="text-left text-gray-400">
                <th className="whitespace-nowrap px-4 py-2">TÓPICO</th>
                <th className="whitespace-nowrap px-4 py-2">QUESTÕES</th>
                <th className="whitespace-nowrap px-4 py-2">ACERTOS</th>
                <th className="whitespace-nowrap px-4 py-2">ERROS</th>
                <th className="whitespace-nowrap px-4 py-2">% ACERTO</th>
                <th className="whitespace-nowrap px-4 py-2">
                  % ACERTO CONCORRÊNCIA
                </th>
              </tr>
            </thead>
            <tbody className="text-white">
              {sortedTopics.map((topic) => {
                // Cálculo do percentual do aluno
                const studentProgressNum = topic.progress * 100
                const studentProgressDisplay = studentProgressNum.toFixed(1)
                // Busca o tópico correspondente na concorrência (pelo mesmo nome)
                const competitorTopic = competitorSubject?.topics.find(
                  (t) => t.topicName === topic.topicName,
                )
                const competitorProgressNum = competitorTopic
                  ? competitorTopic.progress * 100
                  : 0
                const competitorProgressDisplay =
                  competitorProgressNum.toFixed(1)

                let competitorColor = ''
                if (competitorProgressNum > studentProgressNum) {
                  competitorColor = 'text-red-500'
                } else if (competitorProgressNum === studentProgressNum) {
                  competitorColor = 'text-orange-500'
                } else {
                  competitorColor = 'text-green-500'
                }

                return (
                  <tr
                    key={topic.topicName}
                    className="border-b border-slate-800 last:border-none cursor-pointer hover:bg-slate-700/50 transition-all"
                  >
                    <td className="px-4 py-3">{topic.topicName}</td>
                    <td className="px-4 py-3">{topic.questions}</td>
                    <td className="px-4 py-3">{topic.correct}</td>
                    <td className="px-4 py-3">{topic.incorrect}</td>
                    <td className="px-4 py-3">{studentProgressDisplay}%</td>
                    <td className={`px-4 py-3 ${competitorColor}`}>
                      {competitorProgressDisplay}%
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>

          {/* Exibição para Mobile */}
          <div className="md:hidden space-y-6">
            {sortedTopics.map((topic) => {
              const studentProgressNum = topic.progress * 100
              const studentProgressDisplay = studentProgressNum.toFixed(1)
              const competitorTopic = competitorSubject?.topics.find(
                (t) => t.topicName === topic.topicName,
              )
              const competitorProgressNum = competitorTopic
                ? competitorTopic.progress * 100
                : 0
              const competitorProgressDisplay = competitorProgressNum.toFixed(1)

              let competitorColor = ''
              if (competitorProgressNum > studentProgressNum) {
                competitorColor = 'text-red-500'
              } else if (competitorProgressNum === studentProgressNum) {
                competitorColor = 'text-orange-500'
              } else {
                competitorColor = 'text-green-500'
              }

              return (
                <Card
                  key={topic.topicName}
                  className="bg-slate-800 border-slate-700 hover:bg-slate-700 cursor-pointer"
                >
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h2 className="text-white font-medium">
                          {topic.topicName}
                        </h2>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="space-y-1">
                          <p className="text-slate-400">Questões</p>
                          <p className="text-white font-medium">
                            {topic.questions}
                          </p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-slate-400">Acertos</p>
                          <p className="text-emerald-400 font-medium">
                            {topic.correct}
                          </p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-slate-400">Erros</p>
                          <p className="text-red-400 font-medium">
                            {topic.incorrect}
                          </p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-slate-400">% Acerto</p>
                          <p className="text-white font-medium">
                            {studentProgressDisplay}%
                          </p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-slate-400">
                            % Acerto Concorrência
                          </p>
                          <p className={`font-medium ${competitorColor}`}>
                            {competitorProgressDisplay}%
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
