'use client'

import { ArrowLeft } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'

import type { Course } from '@/@types/courses'
import { api } from '@/lib/axios'

import { TaskName } from './components/taskName'
import { TaskTopic } from './components/taskTopic'
import { TaskType } from './components/taskType'

export default function MoreTask() {
  const [courses, setCourses] = useState<Course[]>()
  const [course, setCourse] = useState<Course>()

  const [showFormTaskType, setShowFormTaskType] = useState(true)
  const [showFormTaskName, setShowFormTaskName] = useState(false)
  const [showFormTaskTopic, setShowFormTaskTopic] = useState(false)
  const [taskType, setTaskType] = useState('')
  const [taskNameId, setTaskNameId] = useState('')

  useEffect(() => {
    api.get('/courses/user-course-info').then((response) => {
      setCourses(response.data)
      setCourse(response.data[0])
    })
  }, [])

  const subject = useMemo(() => {
    if (taskNameId) {
      return course?.subjects.find(
        (subject) => subject.id === taskNameId && subject.active === true,
      )
    }
  }, [course?.subjects, taskNameId])

  function onChangeCourse(value: string) {
    const course = courses?.find((course) => course._id === value)
    setCourse(course)
  }

  return (
    <div className="md:flex md:justify-center sm:p-auto p-4">
      <div className="max-sm:w-full md:w-[calc(50%+200px)] max-md:mt-5 p-4 space-y-8 rounded-lg bg-[#f3e3c2] dark:bg-blue-900">
        <div className="flex items-center justify-between">
          <button
            onClick={() => {
              if (showFormTaskType) {
                window.history.back()
              }
              if (showFormTaskName) {
                setShowFormTaskName(false)
                setShowFormTaskTopic(false)
                setShowFormTaskType(true)
              }

              if (showFormTaskTopic) {
                setShowFormTaskName(true)
                setShowFormTaskTopic(false)
                setShowFormTaskType(false)
              }
            }}
            className="self-start p-2 text-yellow-600 hover:bg-yellow-800/10 rounded-full"
          >
            <ArrowLeft />
          </button>
        </div>

        {showFormTaskType && (
          <TaskType
            course={course ?? null}
            courses={courses ?? null}
            handleOnChangeCourse={onChangeCourse}
            setShowFormTaskName={setShowFormTaskName}
            setShowFormTaskTopic={setShowFormTaskTopic}
            setShowFormTaskType={setShowFormTaskType}
            setTaskType={setTaskType}
          />
        )}

        {!course && !showFormTaskType && (
          <div>
            <h1>Carregando...</h1>
          </div>
        )}
        {showFormTaskName && (
          <TaskName
            course={course ?? null}
            setShowFormTaskName={setShowFormTaskName}
            setShowFormTaskTopic={setShowFormTaskTopic}
            setShowFormTaskType={setShowFormTaskType}
            setTaskNameId={setTaskNameId}
          />
        )}

        {showFormTaskTopic && (
          <TaskTopic
            courseId={course?._id ?? null}
            taskNameId={taskNameId}
            taskType={taskType}
            subject={subject ?? null}
            setShowFormTaskName={setShowFormTaskName}
            setShowFormTaskTopic={setShowFormTaskTopic}
            setShowFormTaskType={setShowFormTaskType}
          />
        )}
      </div>
    </div>
  )
}
