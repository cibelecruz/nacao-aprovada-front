import type { ReactNode } from 'react'

interface CardInfoProps {
  icon: ReactNode
  title: string
  subtitle: string
  label: string
}

export function CardInfo({ icon, label, subtitle, title }: CardInfoProps) {
  return (
    <div className="flex-1 space-y-3 p-3 bg-blue-900/20 rounded-2xl">
      <div className="flex w-full justify-between">
        <p className="text-yellow-600 font-semibold">{title}</p>
        {icon}
      </div>

      <p className="text-xl">{label}</p>
      <p className="text-zinc-500 text-sm">{subtitle}</p>
    </div>
  )
}
