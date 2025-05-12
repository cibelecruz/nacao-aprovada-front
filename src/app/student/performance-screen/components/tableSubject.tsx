'use client'

import { Card, CardContent } from '@/app/_components/ui/card'
import { useCourseContext } from '@/app/context/coursesSelect'
import { useAuth } from '@/app/hooks/useAuth'
import { api } from '@/lib/axios'
import { ChevronRight } from 'lucide-react'
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
}

interface Subject {
  questions: number
  correct: number
  incorrect: number
  progress: number
  topics: Record<string, Topic>
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
        }),
      ),
    }),
  )

  return {
    ...data,
    courses: transformedCourses,
  }
}

interface TableSubjectProps {
  courseName: string
  userId: string
}

export function TableSubject({ courseName, userId }: TableSubjectProps) {
  const [userPerformance, setUserPerformance] =
    useState<UserPerformanceFormatted>()
  const [allStudentPerformance, setAllStudentPerformance] =
    useState<UserPerformanceFormatted>()
  const [isLoading, setIsLoading] = useState(false)
  const { courseSelected } = useCourseContext()
  const { currentUser } = useAuth()

  useEffect(() => {
    setIsLoading(true)

    api
      .get(`/users/performance/${userId}`)
      .then((response) => {
        const formattedUserPerformance = transformUserPerformanceToArray(
          response.data.userPerformance,
        )

        const formattedAllStudentPerformance = transformUserPerformanceToArray(
          response.data.allStudentPerformance,
        )

        setUserPerformance(formattedUserPerformance)
        setAllStudentPerformance(formattedAllStudentPerformance)
      })
      .finally(() => setIsLoading(false))
  }, [courseSelected, userId])

  if (!userPerformance && !allStudentPerformance && isLoading) {
    return <p>carregando...</p>
  }

  const subjectsByCourse = userPerformance?.courses.find(
    (course) => course.courseName === courseName,
  )

  const allStudentPerformanceByCourse = allStudentPerformance?.courses.find(
    (course) => course.courseName === courseName,
  )

  if (!subjectsByCourse || !allStudentPerformanceByCourse) {
    return (
      <div className="w-full overflow-x-auto text-center rounded-lg ">
        <h1>Não encontramos nenhum dado sobre o curso: {courseName}</h1>
      </div>
    )
  }

  const sortedSubjectsByCourse = subjectsByCourse.subjects
    .slice()
    .sort((a, b) => b.progress - a.progress)

  const sortedAllStudentSubjectsByCourse =
    allStudentPerformanceByCourse.subjects
      .slice()
      .sort((a, b) => b.progress - a.progress)

  return (
    <>
      <p className="text-center">
        {currentUser?.displayName ?? 'carregando...'}
      </p>

      <div className="w-full overflow-x-auto rounded-lg p-4">
        {isLoading ? (
          <p>carregando...</p>
        ) : (
          <>
            {!userPerformance ? (
              <div className="w-full overflow-x-auto rounded-lg ">
                <h1>
                  Não encontramos nenhum dado sobre a sua performance nos
                  assuntos
                </h1>
              </div>
            ) : (
              <table className="max-md:hidden w-full min-w-[500px] border-collapse">
                <thead>
                  <tr className="text-left text-gray-400">
                    <th className="whitespace-nowrap px-4 py-2">ASSUNTOS</th>
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
                  {sortedSubjectsByCourse.map((subject) => {
                    const studentProgressNum = subject.progress * 100
                    const competitorSubject =
                      sortedAllStudentSubjectsByCourse.find(
                        (s) => s.subjectName === subject.subjectName,
                      )
                    const competitorProgressNum = competitorSubject
                      ? competitorSubject.progress * 100
                      : 0

                    let competitorColor = ''
                    if (competitorProgressNum > studentProgressNum) {
                      competitorColor = 'text-red-500'
                    } else if (competitorProgressNum === studentProgressNum) {
                      competitorColor = 'text-orange-500'
                    } else {
                      competitorColor = 'text-green-500'
                    }

                    const studentProgressDisplay = studentProgressNum.toFixed(1)
                    const competitorProgressDisplay =
                      competitorProgressNum.toFixed(1)

                    const subjectSlug = encodeURIComponent(subject.subjectName)

                    return (
                      <tr
                        key={subject.subjectName}
                        className="border-b border-slate-800 last:border-none hover:bg-slate-700/50 cursor-pointer transition-all"
                        onClick={() =>
                          (window.location.href = `/student/performance-screen/${subjectSlug}/student`)
                        }
                      >
                        <td className="px-4 py-3">{subject.subjectName}</td>
                        <td className="px-4 py-3">{subject.questions}</td>
                        <td className="px-4 py-3">{subject.correct}</td>
                        <td className="px-4 py-3">{subject.incorrect}</td>
                        <td className="px-4 py-3">{studentProgressDisplay}%</td>
                        <td className={`px-4 py-3 ${competitorColor}`}>
                          {competitorProgressDisplay}%
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            )}
          </>
        )}
      </div>

      <div className="space-y-3 md:hidden">
        {isLoading ? (
          <p>carregando...</p>
        ) : (
          sortedSubjectsByCourse.map((subject, index) => {
            const subjectSlug = encodeURIComponent(subject.subjectName)
            const studentProgressNum = subject.progress * 100
            const competitorSubject = sortedAllStudentSubjectsByCourse.find(
              (s) => s.subjectName === subject.subjectName,
            )
            const competitorProgressNum = competitorSubject
              ? competitorSubject.progress * 100
              : 0

            let competitorColor = ''
            if (competitorProgressNum > studentProgressNum) {
              competitorColor = 'text-red-500'
            } else if (competitorProgressNum === studentProgressNum) {
              competitorColor = 'text-orange-500'
            } else {
              competitorColor = 'text-green-500'
            }

            const studentProgressDisplay = studentProgressNum.toFixed(1)
            const competitorProgressDisplay = competitorProgressNum.toFixed(1)

            return (
              <Card
                key={index}
                onClick={() =>
                  (window.location.href = `/student/performance-screen/${subjectSlug}/student`)
                }
                className="bg-slate-800 border-slate-700 hover:bg-slate-700"
              >
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h2 className="text-white font-medium">
                        {subject.subjectName}
                      </h2>
                      <ChevronRight className="text-gray-400" />
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="space-y-1">
                        <p className="text-slate-400">Questões</p>
                        <p className="text-white font-medium">
                          {subject.questions}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-slate-400">Acertos</p>
                        <p className="text-emerald-400 font-medium">
                          {subject.correct}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-slate-400">Erros</p>
                        <p className="text-red-400 font-medium">
                          {subject.incorrect}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-slate-400">Taxa de Acerto</p>
                        <p className="text-white font-medium">
                          {studentProgressDisplay}%
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-slate-400">Concorrência</p>
                        <p className={`font-medium ${competitorColor}`}>
                          {competitorProgressDisplay}%
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })
        )}
      </div>
    </>
  )
}
