interface StudyAvailability {
  sunday: number
  monday: number
  tuesday: number
  wednesday: number
  thursday: number
  friday: number
  saturday: number
}

interface TopicData {
  topic: string
  percentageCompleted: number
}

export interface PerfomanceStaticts {
  studyAvailability: StudyAvailability
  averageTimePerDay: number
  topicsData: TopicData[]
}
