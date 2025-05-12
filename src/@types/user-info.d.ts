interface Progress {
  completed: number
  review: number
  theoreticalStudy: number
}

interface PerformancePeriod {
  competitors: number
  user: number
}

export interface CourseInfo {
  courseName: string
  expectedWeeklyWorkload: number
  weeklyDaysAvailability: number
  registrationDate: string
  expirationDate: string
  progress: Progress
  performance: Record<string, PerformancePeriod>
}

interface UserInfoProps {
  name: string
  email: string
  courses: CourseInfo[]
}
