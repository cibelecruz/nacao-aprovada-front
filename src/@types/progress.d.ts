export interface ProgressProps {
  courses: {
    name: string
    id: string
    questionsAmount: number
    questionsPerformance: number
    competitorsPerformance: number
  }[]
}
