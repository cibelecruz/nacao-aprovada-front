import type { Subject } from './subject'

export interface Course {
  _id: string
  name: string
  subjects: Subject[]
}
