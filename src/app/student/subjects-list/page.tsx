'use client'

import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'

import type { Course } from '@/@types/courses'
import { Loader } from '@/app/_components/loader'
import { TitlePage } from '@/app/_components/titlePage'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/app/_components/ui/accordion'

import { api } from '@/lib/axios'

import { useCourseContext } from '@/app/context/coursesSelect'

export default function SubjectsList() {
  const [courses, setCourses] = useState<Course[]>([])
  const [course, setCourse] = useState<Course>()
  const DialogInfoRelevance = dynamic(
    () => import('@/app/_components/dialogInfoRelevance'),
    { ssr: false },
  )
  const { courseSelected } = useCourseContext()
  useEffect(() => {
    api.get('/courses/user-course-info').then((response) => {
      setCourses(response.data)
    })
  }, [])

  useEffect(() => {
    if (courses?.length > 0) {
      setCourse(courses?.find((course) => course._id === courseSelected))
    }
  }, [courseSelected, courses])

  if (!course && !courses) {
    return <Loader />
  }

  return (
    <div className="md:flex md:justify-center sm:p-auto min-h-max p-4 pb-36">
      <div className="mt-10 max-sm:w-full md:w-1/2 lg:w-3/5 space-y-8">
        <TitlePage title="Edital" className="text-yellow-600" />

        <Accordion
          onChange={(e) => e.stopPropagation()}
          type="multiple"
          className="border-8 border-[#070E17] rounded-xl bg-[#070E17] space-y-4 "
        >
          {course?.subjects
            .filter((subject) => subject.active === true)
            .map((subject) => (
              <AccordionItem
                key={subject.id}
                value={subject.id}
                className="space-y-4 border-zinc-700"
              >
                <AccordionTrigger
                  key={subject.id}
                  className="flex justify-between w-full data-[state=open]:bg-blue-800 p-2 rounded-lg no-underline hover:no-underline"
                >
                  <div className="flex w-full justify-between pr-4 font-bold">
                    <p className="no-underline">{subject.name}</p>
                    <div className="flex gap-1">
                      <DialogInfoRelevance relevance={subject.relevance} />
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="w-full font-bold px-2 space-y-4">
                  {subject.topics
                    .filter((topic) => topic.active === true)
                    .map((topic) => (
                      <div
                        key={topic.id}
                        className="flex justify-between items-start"
                      >
                        <p className="text-sm text-left font-normal">
                          {topic.name}
                        </p>
                        <DialogInfoRelevance relevance={topic.relevance} />
                      </div>
                    ))}
                </AccordionContent>
              </AccordionItem>
            ))}
        </Accordion>
      </div>
    </div>
  )
}
