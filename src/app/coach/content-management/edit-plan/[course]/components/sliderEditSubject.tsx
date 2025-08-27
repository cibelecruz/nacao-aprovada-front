import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/app/_components/ui/accordion'
import { courseSubjectsProps } from '../page'
import { Checkbox } from '@/app/_components/ui/checkbox'
import { useEffect, useState } from 'react'
import { DropDownRelevance } from './dropDownRelevance'
import { EditTopics } from './editTopics'
import { api } from '@/lib/axios'
import { toast } from 'sonner'

export function SliderEditSubject({
  subject,
  idCourse,
}: {
  subject: courseSubjectsProps
  idCourse: string
}) {
  const [subjectIsActive, setSubjectIsActive] = useState(subject.active)
  const [relevanceSubject, setRelevanceSubject] = useState(subject.relevance)

  useEffect(() => {
    if (subjectIsActive !== subject.active) {
      const subjectActivePut = {
        active: subjectIsActive,
        courseId: idCourse,
        subjectId: subject.id,
      }
      api
        .put('/courses/subject', subjectActivePut)
        .then(() => toast.success('alterações salvas com sucesso'))
        .catch(() => toast.error('Erro ao salvar alterações'))
    }
  }, [subjectIsActive, idCourse, subject.id, subject.active])

  useEffect(() => {
    if (relevanceSubject !== subject.relevance) {
      const relevanceSubjectPut = {
        courseId: idCourse,
        relevance: relevanceSubject,
        subjectId: subject.id,
      }
      api
        .put('/courses/subject/relevance', relevanceSubjectPut)
        .then(() => toast.success('alterações salvas com sucesso'))
        .catch(() => toast.error('Erro ao salvar alterações'))
    }
  }, [relevanceSubject, subject.relevance, idCourse, subject.id])

  return (
    <Accordion type="single" collapsible>
      <AccordionItem
        className="w-full border border-black dark:border-none bg-[#F2E2C1] dark:bg-blue-800/60 dark:hover:bg-blue-800/90 rounded-2xl mt-8 px-3"
        value="item-1"
      >
        <div className="relative flex items-center gap-2 p-2 mt-2">
          <div onClick={(e) => e.stopPropagation()} className="z-10">
            <Checkbox
              checked={subjectIsActive}
              onCheckedChange={() => setSubjectIsActive(!subjectIsActive)}
              onClick={(e) => e.stopPropagation()}
              className="bg-gray-700 size-6 mt-1 border-gray-400 data-[state=checked]:bg-yellow-600 data-[state=checked]:border-yellow-600"
            />
          </div>
            <DropDownRelevance
              relevance={relevanceSubject}
              setRelevance={setRelevanceSubject}
            />
          <AccordionTrigger onClick={(e) => e.stopPropagation()}  className="text-lg absolute inset-0 flex items-center">
            <p className="pl-24 text-black dark:text-white">{subject.name}</p>
          </AccordionTrigger>
        </div>

        <AccordionContent>
          {subject.topics.map((topic) => (
            <EditTopics key={topic.id} topic={topic} idCourse={idCourse} />
          ))}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}
