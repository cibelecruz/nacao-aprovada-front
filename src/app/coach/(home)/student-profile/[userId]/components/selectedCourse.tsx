import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from '@/app/_components/ui/select'
import type { CoursePerformanceProps } from 'course-performance'

interface SelectedCourseProps {
  selectedCourse: string
  userPerformance: CoursePerformanceProps
  setSelectedCourse: (courseName: string) => void
}

export function SelectedCourse({
  selectedCourse,
  userPerformance,
  setSelectedCourse,
}: SelectedCourseProps) {
  return (
    <Select onValueChange={(value: string) => setSelectedCourse(value)}>
      <SelectTrigger className="w-max">{selectedCourse}</SelectTrigger>
      <SelectContent className="w-max bg-blue-900 text-white">
        {userPerformance.courses.map((course) => (
          <SelectItem key={course.name} value={course.name}>
            {course.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
