import { ChevronRight } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface CardHelpContentProps {
  title: string
  id: string
}

export function CardHelpContent({ title, id }: CardHelpContentProps) {
  const router = useRouter()
  return (
    <button
      onClick={() => router.push(`/student/help/${id}`)}
      className="h-14 items-center text-white min-w-80 w-full bg-blue-800 p-3 rounded-lg flex justify-between border border-blue-700 hover:border-yellow-800 transition-all"
    >
      <p className="text-yellow-500">{title}</p>

      <ChevronRight className="size-5 text-yellow-500" />
    </button>
  )
}
