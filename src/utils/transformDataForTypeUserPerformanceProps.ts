import type { CoursePerformanceProps } from 'course-performance'

export function transformDataForTypeUserPerformanceProps(
  rawData: CoursePerformanceProps,
): CoursePerformanceProps {
  const coursesArray = Object.entries(rawData.courses).map(
    ([name, course]) => ({
      ...course,
      name,
    }),
  )

  return {
    ...rawData,
    courses: coursesArray,
  }
}
