import { Progress } from '@/app/_components/ui/progress'

interface GoalProps {
  title: string
  label: string
  value: number
}

export function Goal({ label, title, value }: GoalProps) {
  return (
    <div className="space-y-10 p-4 flex-1 rounded-xl border border-blue-400/50">
      <div className="space-y-2">
        <p className="text-lg font-bold">{title}</p>

        <p className="text-gray-300">{label}</p>
      </div>

      <div className="px-10 space-y-4">
        <Progress
          value={value}
          className="h-2 rounded-sm overflow-hidden relative bg-neutral-700"
          indicatorClassName="relative h-full w-full bg-yellow-600 before:absolute before:inset-0 before:bg-[length:20px_20px] before:bg-[linear-gradient(45deg,_rgba(255,255,255,0.2)_25%,_transparent_25%,_transparent_50%,_rgba(255,255,255,0.2)_50%,_rgba(255,255,255,0.2)_75%,_transparent_75%,_transparent)]"
        />
      </div>
    </div>
  )
}
