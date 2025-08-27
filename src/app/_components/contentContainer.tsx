import type { ReactNode } from 'react'

interface ContentContainerProps {
  children: ReactNode
}

export function ContentContainer({ children }: ContentContainerProps) {
  return (
    <div className="w-full px-4 py-8 rounded-lg bg-[#f3e3c2] border border-zinc-300 dark:border-transparent dark:bg-blue-900">
      {children}
    </div>
  )
}
