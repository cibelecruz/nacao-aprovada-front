import type { StaticImageData } from 'next/image'
import Image from 'next/image'

interface GoalCardProps {
  icon: StaticImageData
  goal: string
  label: string
}

export function GoalCard({ icon, goal, label }: GoalCardProps) {
  return (
    <div
      className="max-sm:w-24 w-32 max-sm:p-2 p-4 rounded-2xl 
                 flex flex-col items-center gap-3
                 bg-white text-black 
                 dark:bg-[#070E17] dark:text-white"
    >
      <Image
        priority
        width={64}
        height={64}
        src={icon}
        alt={label}
        className="w-8"
      />
      <p className="text-xs text-center">{label}:</p>
      <p className="font-bold">{goal}</p>
    </div>
  )
}