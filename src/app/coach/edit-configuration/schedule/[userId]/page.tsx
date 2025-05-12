'use client'

import { useEffect, useState } from 'react'
import { HeaderEditConfiguration } from '../../components/headerEditConfiguration'
import { Loader } from '@/app/_components/loader'
import { useParams } from 'next/navigation'
import { api } from '@/lib/axios'
import {
  Accordion,
  AccordionContent,
  AccordionTrigger,
} from '@/app/_components/ui/accordion'
import type { ScheduleCourseProps, Subject, Topic } from 'schedule-course'
import { transformDataForTypeScheduleCourseProps } from '@/utils/transformDataForTypeScheduleCourseProps'
import { StudyScheduleManager } from '../../components/studyScheduleManager'
import { AccordionItem } from '@radix-ui/react-accordion'
import { Checkbox } from '@/app/_components/ui/checkbox'
import { toast } from 'sonner'
import { PageContainer } from '@/app/_components/pageContainer'
import { ContentContainer } from '@/app/_components/contentContainer'
import { ArrowLeft } from 'lucide-react'
import ConfirmButton from '@/app/_components/confirmButton'

export default function SchedulePage() {
  const { userId } = useParams<{ userId: string }>()
  const [scheduleCourse, setScheduleCourse] = useState<ScheduleCourseProps>()
  const [selectedCourse, setSelectedCourse] = useState('')
  const [subjectsState, setSubjectsState] = useState<Record<string, Subject[]>>(
    {},
  )

  useEffect(() => {
    api.get(`/users/schedule/${userId}`).then((response) => {
      const userInfo = transformDataForTypeScheduleCourseProps(response.data)
      setScheduleCourse(userInfo)
      setSelectedCourse(userInfo.courses[0].name)

      const initialSubjectsState = userInfo.courses.reduce(
        (acc, course) => {
          acc[course.name] = course.subjects
          return acc
        },
        {} as Record<string, Subject[]>,
      )

      setSubjectsState(initialSubjectsState)
    })
  }, [userId])

  const displayCourse = scheduleCourse?.courses.find(
    (course) => course.name === selectedCourse,
  )

  function handleSubjectCheckboxChange(subjectId: string) {
    setSubjectsState((prev) => {
      const updatedSubjects = prev[selectedCourse].map((subject) => {
        if (subject.id === subjectId) {
          return {
            ...subject,
            enabled: !subject.enabled, // Toggle o valor do enabled
          }
        }
        return subject
      })

      return {
        ...prev,
        [selectedCourse]: updatedSubjects, // Garante que o estado seja imutável
      }
    })
  }

  function handleTopicChange(subjectId: string, updatedTopic: Topic) {
    setSubjectsState((prev) => ({
      ...prev,
      [selectedCourse]: prev[selectedCourse].map((subject) =>
        subject.id === subjectId
          ? {
              ...subject,
              topics: subject.topics.map((topic) =>
                topic.id === updatedTopic.id ? updatedTopic : topic,
              ),
            }
          : subject,
      ),
    }))
  }

  async function handleSaveChanges() {
    const payload = {
      userId,
      courseId: displayCourse?.id,
      subjects: subjectsState[selectedCourse]
        ?.filter((subject) => subject.topics.length > 0)
        .map((subject) => ({
          id: subject.id,
          active: subject.enabled,
          topics: subject.topics
            .filter((topic) => topic.id)
            .map((topic) => ({
              id: topic.id,
              active: topic.enabled,
              taskTypes: [
                topic.study ? 'study' : null,
                topic.exercise ? 'exercise' : null,
                topic.review ? 'review' : null,
                topic.law_letter ? 'lawStudy' : null,
              ].filter(Boolean) as string[],
            })),
        })),
    }

    const response = await api.post(
      '/users/register-user-subjects-customizations',
      payload,
    )

    if (response.status === 200) {
      toast.success('Alterações salvas com sucesso.')
    } else {
      toast.error('Erro ao salvar as alteracões')
    }
  }

  if (!scheduleCourse || !displayCourse) {
    return <Loader />
  }

  return (
    <PageContainer>
      <button
        title="voltar"
        className="mb-4"
        onClick={() => window.history.back()}
      >
        <ArrowLeft className="size-5 text-yellow-500" />
      </button>
      <ContentContainer>
        <HeaderEditConfiguration
          titlePage="Cronograma"
          selectedCourse={selectedCourse}
          setSelectedCourse={setSelectedCourse}
          info={scheduleCourse}
        />
        <div className="mt-4">
          <Accordion type="multiple" className="space-y-4">
            {subjectsState[selectedCourse]
              .filter((subject) => subject.topics.length >= 1)
              ?.map((subject) => (
                <AccordionItem key={subject.id} value={subject.id}>
                  <div className="relative flex items-center gap-4 p-4 bg-blue-800 rounded-2xl hover:bg-blue-700">
                    <div onClick={(e) => e.stopPropagation()} className="z-10">
                      <Checkbox
                        checked={subject.enabled}
                        onCheckedChange={() =>
                          handleSubjectCheckboxChange(subject.id)
                        }
                        onClick={(e) => e.stopPropagation()}
                        className="border-yellow-500"
                      />
                    </div>

                    <AccordionTrigger
                      className={`absolute inset-0 flex items-center px-4 hover:underline-offset-2 ${
                        !subject.enabled
                          ? 'opacity-50 cursor-not-allowed hover:no-underline'
                          : ''
                      }`}
                    >
                      <p className="pl-10">{subject.name}</p>
                    </AccordionTrigger>
                  </div>

                  <AccordionContent>
                    {subject.enabled && subject.topics.length >= 1 && (
                      <StudyScheduleManager
                        topics={subject.topics}
                        onTopicChange={(updatedTopic) =>
                          handleTopicChange(subject.id, updatedTopic)
                        }
                      />
                    )}
                  </AccordionContent>
                </AccordionItem>
              ))}
          </Accordion>
        </div>

        <div className="mt-10">
          <ConfirmButton disabled={false} onClick={handleSaveChanges}>
            Salvar
          </ConfirmButton>
        </div>
      </ContentContainer>
    </PageContainer>
  )
}
