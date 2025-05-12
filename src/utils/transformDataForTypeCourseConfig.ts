import type { CourseConfig, CourseInfo } from 'course-info'

export function transformDataForTypeCourseConfig(data: CourseInfo[]) {
  const courseConfig = data.map((course) => ({
    name: course.name,
    id: course.id,
    registrationDate: course.registrationDate,
    expirationDate: course.expirationDate,
  })) as CourseConfig[]

  return courseConfig
}
