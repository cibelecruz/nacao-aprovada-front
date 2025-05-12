interface Progress {
  completed: number
  review: number
  theoreticalStudy: number
}

interface PerformancePeriod {
  competitors: number
  user: number
}

declare module 'course-info' {
  export interface CourseInfo {
    id: string
    name: string
    expectedWeeklyWorkload: number
    weeklyDaysAvailability: number
    registrationDate: string
    expirationDate: string
    progress: Progress
    performance: Record<string, PerformancePeriod>
  }

  export interface UserInfoProps {
    name: string
    email: string
    phone?: string
    courses: CourseInfo[]
  }

  export interface CourseConfig {
    name: string
    id: string
    registrationDate: string
    expirationDate: string
  }

  export interface CourseName {
    institution: string
    jobPosition: string
    id: string
  }
}
