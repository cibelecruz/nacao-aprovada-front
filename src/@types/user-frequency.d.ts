interface PerformanceData {
  competitors: number
  user: number
}

interface PeriodData {
  expectedAccesses: number
  accesses: number
  expectedWorkload: number
  completedWorkload: number
  expectedTasks: number
  completedTasks: number
  averageFrequency: number
}

interface CourseFrequencyData {
  '30 dias': PeriodData
  '60 dias': PeriodData
  '90 dias': PeriodData
  performance: Record<string, PerformanceData>
}

export interface UserFrequencyProps {
  name: string
  email: string
  courses: Record<string, CourseFrequencyData>
}
