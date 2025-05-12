import type { UserInfoProps } from 'course-info'

export function transformDataForTypeUserInfoProps(
  data: UserInfoProps,
): UserInfoProps {
  const courses = Object.entries(data.courses).map(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ([courseName, courseData]): any => ({
      name: courseName,
      id: courseData.id,
      expectedWeeklyWorkload: courseData.expectedWeeklyWorkload,
      weeklyDaysAvailability: courseData.weeklyDaysAvailability,
      registrationDate: courseData.registrationDate,
      expirationDate: courseData.expirationDate,
      progress: courseData.progress,
      performance: courseData.performance,
    }),
  )

  return {
    name: data.name,
    email: data.email,
    phone: data.phone,
    courses,
  }
}
