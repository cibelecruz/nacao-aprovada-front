import { useEffect, useState } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select'
import { Loader } from './loader'
import { api } from '@/lib/axios'
import { useCourseContext } from '../context/coursesSelect'
import { Course } from '@/@types/courses'

export function CourseSelector({
  setCourseSelect,
}: {
  setCourseSelect: (arg: string) => void
}) {
  const [courses, setCourses] = useState<Course[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { courseSelected } = useCourseContext()

  useEffect(() => {
    setIsLoading(true)
    api.get('/courses/user-course-info').then((response) => {
      setCourses(response.data)
      setIsLoading(false)
    })
  }, [])

  if (isLoading) {
    return <Loader />
  }

  return (
    <Select
      defaultValue={courseSelected}
      onValueChange={(value) => {
        setCourseSelect(value)
      }}
    >
      <SelectTrigger className="border border-yellow-600 xl:w-full lg:w-52">
        <SelectValue />
      </SelectTrigger>
      <SelectContent className="bg-blue-800 text-white">
        {courses.map((course) => (
          <SelectItem key={course._id} value={course._id}>
            {course.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
