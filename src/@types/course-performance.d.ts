interface Topic {
  questions: number
  correct: number
  incorrect: number
  progress: number
}

interface Subject {
  questions: number
  correct: number
  incorrect: number
  progress: number
  topics: Record<string, Topic>
}

declare module 'course-performance' {
  export interface Course {
    name: string // Adicionado para facilitar o acesso ao nome do curso
    questions: number
    correct: number
    incorrect: number
    progress: number
    subjects: Record<string, Subject>
  }

  export interface CoursePerformanceProps {
    isSuccess: boolean
    name: string
    email: string
    phone: string
    courses: Course[] // Mudado para um array para armazenar cursos com o nome como propriedade
  }
}
