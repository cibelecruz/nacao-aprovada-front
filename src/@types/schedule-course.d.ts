declare module 'schedule-course' {
  type Topic = {
    id: string
    name: string
    enabled: boolean
    study: boolean
    exercise: boolean
    review: boolean
    law_letter: boolean
  }

  type Subject = {
    id: string
    name: string
    enabled: boolean
    topics: Topic[]
  }

  type Course = {
    id: string
    name: string
    enabled: boolean
    subjects: Subject[]
  }

  type ScheduleCourseProps = {
    name: string
    email: string
    phone: string
    courses: Course[]
  }
}
