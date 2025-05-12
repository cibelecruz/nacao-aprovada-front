'use client'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from '@/app/_components/ui/select'

interface Course {
  courseId: { _value: string }
  courseName: string
}

interface CourseSelectProps {
  courses: Course[]
  selectedCourse: string | null
  onChange: (courseId: string) => void
}

export function CourseSelect({
  courses,
  selectedCourse,
  onChange,
}: CourseSelectProps) {
  const selectedCourseName = selectedCourse
    ? courses.find((course) => course.courseId._value === selectedCourse)
        ?.courseName
    : 'Selecione um curso'

  return (
    <Select onValueChange={onChange} value={selectedCourse || ''}>
      <SelectTrigger className="w-full border-blue-500/30">
        {selectedCourseName}
      </SelectTrigger>
      <SelectContent className="bg-blue-800 text-white">
        {courses.map((course) => (
          <SelectItem
            key={course.courseId._value}
            value={course.courseId._value}
          >
            {course.courseName}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
