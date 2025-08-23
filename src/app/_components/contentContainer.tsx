import type { ReactNode } from 'react'

interface ContentContainerProps {
  children: ReactNode
}

export function ContentContainer({ children }: ContentContainerProps) {
  return (
<<<<<<< HEAD
    <div className="w-full px-4 py-8 rounded-lg bg-white border border-zinc-300 dark:border-transparent dark:bg-blue-900">
      {children}
    </div>
=======
    <div className="w-full px-4 py-8 rounded-lg bg-white border border-zinc-300 dark:border-transparent dark:bg-blue-900">{children}</div>
>>>>>>> 76d27db67be57b96513a92ac4cb4b0d29bca574c
  )
}
