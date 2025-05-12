import { api } from '@/lib/axios'
import React, { createContext, useState, useContext, useEffect } from 'react'

interface CourserSelectContextProps {
  courseSelected: string
  setCourseSelected: (arg: string) => void
}

const CourseContext = createContext<CourserSelectContextProps>(
  {} as CourserSelectContextProps,
)

export function CourseSelected({ children }: { children: React.ReactNode }) {
  const [courseSelected, setCourseSelected] = useState<string>('')

  useEffect(() => {
    api.get('/courses/user-course-info').then((response) => {
      setCourseSelected(response.data[0]._id)
    })
  }, [])

  return (
    <CourseContext.Provider value={{ courseSelected, setCourseSelected }}>
      {children}
    </CourseContext.Provider>
  )
}

export const useCourseContext = (): CourserSelectContextProps => {
  const context = useContext(CourseContext)
  if (!context) {
    throw new Error(
      'useCourseContext deve ser usado dentro de um StringProvider',
    )
  }
  return context
}
