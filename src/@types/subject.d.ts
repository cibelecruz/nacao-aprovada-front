import type { Topic } from './topic'

export interface Subject {
  id: string
  name: string
  relevance: number
  active: boolean
  topics: Topic[]
}
