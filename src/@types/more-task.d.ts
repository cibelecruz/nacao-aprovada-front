import type { Dispatch, SetStateAction } from 'react'

export interface AllFormProps {
  setShowFormTaskType: Dispatch<SetStateAction<boolean>>
  setShowFormTaskName: Dispatch<SetStateAction<boolean>>
  setShowFormTaskTopic: Dispatch<SetStateAction<boolean>>
}
