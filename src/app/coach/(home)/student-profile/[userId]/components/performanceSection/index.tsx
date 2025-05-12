'use client'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from '@/app/_components/ui/select'
import { useState } from 'react'
import { PerformanceDonutChart } from './performanceDonutChart'
import { SubjectTable } from './subjectDataTable'
import type { Course } from 'course-performance'
import type { DailyPerformanceProps } from '@/@types/daily-performance'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/navigation'

const LineChart = dynamic(
  () => import('@/app/_components/dailyPerformanceLineChart'),
  {
    ssr: false,
  },
)

interface PerformanceSectionProps {
  coursePerformance: Course
  dailyPerformance: DailyPerformanceProps[]
  userId: string
}

export function PerformanceSection({
  coursePerformance,
  dailyPerformance,
  userId,
}: PerformanceSectionProps) {
  const [selectedSubject, setSelectedSubject] = useState('Todas')
  const [searchText, setSearchText] = useState('')
  const subjectsArray = Object.entries(coursePerformance.subjects).map(
    ([subjectName, subjectData]) => ({
      subjectName,
      questions: subjectData.questions,
      correct: subjectData.correct,
      incorrect: subjectData.incorrect,
      progress: subjectData.progress,
      topics: Object.entries(subjectData.topics).map(
        ([topicName, topicData]) => ({
          topicName,
          ...topicData,
        }),
      ),
    }),
  )

  const router = useRouter()

  const filteredSubjects = subjectsArray.filter((subject) => {
    const searchLower = searchText.toLowerCase()

    const matchesSearchText =
      subject.subjectName.toLowerCase().includes(searchLower) ||
      subject.questions.toString().includes(searchLower) ||
      subject.correct.toString().includes(searchLower) ||
      subject.incorrect.toString().includes(searchLower) ||
      (subject.progress * 100).toFixed(2).includes(searchLower)

    const matchesSelectedSubject =
      selectedSubject === 'Todas' || subject.subjectName === selectedSubject

    return matchesSearchText && matchesSelectedSubject
  })

  const aggregatedData = filteredSubjects.reduce(
    (acc, subject) => {
      acc.questions += subject.questions
      acc.correct += subject.correct
      acc.incorrect += subject.incorrect
      acc.progress += subject.progress
      return acc
    },
    { questions: 0, correct: 0, incorrect: 0, progress: 0 },
  )

  function handleSearchTextChange(e: React.ChangeEvent<HTMLInputElement>) {
    setSearchText(e.target.value)
  }

  // Determina os valores a serem exibidos
  const displayQuestions =
    selectedSubject === 'Todas' && searchText === ''
      ? coursePerformance.questions
      : aggregatedData.questions

  const displayCorrect =
    selectedSubject === 'Todas' && searchText === ''
      ? coursePerformance.correct
      : aggregatedData.correct

  const displayIncorrect =
    selectedSubject === 'Todas' && searchText === ''
      ? coursePerformance.incorrect
      : aggregatedData.incorrect

  const displayProgress =
    selectedSubject === 'Todas' && searchText === ''
      ? coursePerformance.progress
      : aggregatedData.progress

  return (
    <div className="space-y-20">
      <header className="flex items-end justify-between">
        <div className="flex items-center gap-4 mt-10 w-1/3">
          <input
            className="w-full bg-transparent border border-yellow-500 rounded-2xl text-gray-300 py-3 px-4 hover:border-yellow-400 hover:shadow hover:shadow-yellow-600 transition-all"
            placeholder="Faça sua pesquisa..."
            type="text"
            onChange={handleSearchTextChange}
            value={searchText}
          />
        </div>

        <div className="flex gap-2 items-center">
          <p>Matéria(s):</p>

          <Select onValueChange={(value: string) => setSelectedSubject(value)}>
            <SelectTrigger>{selectedSubject}</SelectTrigger>
            <SelectContent className="bg-blue-900 text-white">
              <SelectItem key={'Todas'} value="Todas">
                Todas
              </SelectItem>
              {subjectsArray.map((subject) => (
                <SelectItem
                  key={subject.subjectName}
                  value={subject.subjectName}
                >
                  {subject.subjectName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </header>

      <div className="flex gap-10 justify-between">
        <div className="w-1/3 bg-blue-800 rounded-2xl p-3">
          <p className="text-xl">Desempenho</p>
          <p className="text-zinc-400 text-sm">
            {selectedSubject === 'Todas' ? 'Geral' : selectedSubject}
          </p>

          <PerformanceDonutChart
            correct={displayCorrect}
            incorrect={displayIncorrect}
            progress={displayProgress}
            totalQuestions={displayQuestions}
            isStudentProfile
          />

          <PerformanceDonutChart
            correct={displayCorrect}
            incorrect={displayIncorrect}
            totalQuestions={displayQuestions}
            progress={displayProgress}
          />

          <p className="text-zinc-400 text-sm">
            {(
              (displayCorrect / coursePerformance.questions) * 100 || 0
            ).toFixed(2)}
            % de acertos
          </p>

          <p className="text-zinc-400 text-sm">
            {(
              (displayIncorrect / coursePerformance.questions) * 100 || 0
            ).toFixed(2)}
            % de erros
          </p>
        </div>

        <div className="flex-1 bg-blue-800 rounded-2xl p-3">
          <SubjectTable
            onEditClick={() =>
              router.push(`/coach/edit-configuration/schedule/${userId}`)
            }
            subjects={filteredSubjects}
          />
        </div>
      </div>

      <LineChart
        chartId="userPerformanceSection"
        data={dailyPerformance}
        className="flex flex-col max-md:items-center items-end bg-blue-800 rounded-xl p-4"
      />
    </div>
  )
}
