interface Topic {
  questions: number
  correct: number
  incorrect: number
  progress: number
}

interface Subject {
  subjectName: string
  questions: number
  correct: number
  incorrect: number
  progress: number
  topics: Topic[]
}

interface Course {
  courseName: string
  questions: number
  correct: number
  incorrect: number
  progress: number
  subjects: Subject[]
}

interface UserData {
  name: string
  email: string
  phone: string
  courses: Course[]
}

export interface UserPerformanceInCourse {
  isSuccess: boolean
  data: UserData
}
