import { Progress } from '@/app/_components/ui/progress'

interface ProgressContainerProps {
  value: number
  indicatorColor: string
}

export function ProgressContainer({
  value,
  indicatorColor,
}: ProgressContainerProps) {
  const valueLength = String(value).split('.')

  const valueFormatted = valueLength.length > 1 ? value.toFixed(2) : value

  return (
    <div className="w-[calc(100%-5%)]  h-8">
      <div className="relative h-full flex items-center">
        <Progress
          dir="left"
          value={value}
          className="bg-transparent h-8 rounded-sm"
          indicatorClassName={indicatorColor}
        />
        <p
          className="absolute text-sm"
          style={{
            left: `calc(${value}% + 2rem)`, // Adiciona um gap de 4rem
            transform: 'translateX(-50%)',
          }}
        >
          {valueFormatted}%
        </p>
      </div>
    </div>
  )
}
