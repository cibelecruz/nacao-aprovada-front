export type UserLevel =
  | 'Novato'
  | 'Determinado'
  | 'Profissional'
  | 'Mestre'
  | 'Imbativel'
export type UserFrequency = 'Regular' | 'Esforçado' | 'Engajado'
export type UserDedication =
  | 'Iniciante'
  | 'Disciplinado'
  | 'Comprometido'
  | '100% focado'

export interface UserPerformance {
  percentageCompleted: number
  weeksCompleted: number
  totalStudyHours: number
  consecutiveDays: number
  totalTaskToday: number
  totalTasksCompletedToday: number
  emblems: {
    userLevel: UserLevel
    userFrequency: UserFrequency
    userDedication: UserDedication
  }
}
