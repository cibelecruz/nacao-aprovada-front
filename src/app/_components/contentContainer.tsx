import type { ReactNode } from 'react'

interface ContentContainerProps {
  children: ReactNode
}

export function ContentContainer({ children }: ContentContainerProps) {
  return (
    <div className="w-full px-4 py-8 rounded-lg bg-blue-900">{children}</div>
  )
}
