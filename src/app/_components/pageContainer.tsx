import { ReactNode } from 'react'

interface ContainerProps {
  children: ReactNode
}

export function PageContainer({ children }: ContainerProps) {
  return <div className="w-9/12 mt-16">{children}</div>
}
