import { useState } from 'react'

import { Switch } from '@/app/_components/ui/switch'

import { DialogShowTimerPicker } from './dialogShowTimerPicker'

interface StudyAvailability {
  monday: number
  tuesday: number
  wednesday: number
  thursday: number
  friday: number
  saturday: number
  sunday: number
}

interface SwitchGoalOfStudyProps {
  label: string
  dayOfWeek: keyof StudyAvailability
  initalTime: number
  isActive: boolean
  onUpdateDay: (value: number) => void
}

export function SwitchGoalOfStudy({
  label,
  initalTime,
  dayOfWeek,
  isActive,
  onUpdateDay,
}: SwitchGoalOfStudyProps) {
  const [switchChecked, setSwitchChecked] = useState(isActive)
  const [time, setTime] = useState(initalTime)

  const handleToggleSwitch = () => {
    const newState = !switchChecked
    setSwitchChecked(newState)
    onUpdateDay(newState ? time : 0)
  }

  const handleTimeChange = (newTime: number) => {
    setTime(newTime)
    onUpdateDay(newTime)
  }

  return (
    <div className="flex items-center justify-between">
      <div className="space-x-3">
        <Switch
          id={dayOfWeek}
          checked={switchChecked}
          defaultChecked={switchChecked}
          onCheckedChange={handleToggleSwitch}
          name={dayOfWeek}
          className="py-3"
        />
        <label htmlFor={dayOfWeek} className="font-bold text-sm">
          {label}
        </label>
      </div>

      <DialogShowTimerPicker
        setTimerUserSelected={(timer) => {
          const [hours, minutes] = timer.split(':').map(Number)
          handleTimeChange(hours * 60 + minutes)
        }}
        triggerButton={
          <button
            disabled={!switchChecked}
            className="p-2 rounded bg-blue-800 disabled:opacity-70"
          >
            {`${String(Math.floor(time / 60)).padStart(2, '0')}:${String(
              time % 60,
            ).padStart(2, '0')}`}
          </button>
        }
      />
    </div>
  )
}
