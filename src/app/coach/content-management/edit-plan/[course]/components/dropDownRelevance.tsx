import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from '@/app/_components/ui/dropdown-menu'
import { ChevronDown } from 'lucide-react'

interface DropDownRelevanceProps {
  relevance: number
  setRelevance: (arg: number) => void
}

export function DropDownRelevance({
  relevance,
  setRelevance,
}: DropDownRelevanceProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger onClick={(e) => e.stopPropagation()}  asChild>
        <button onClick={(e) => e.stopPropagation()} className="flex items-center w-10 h-8 justify-center gap-2 text-black dark:text-white border border-gray-400 rounded-md py-1 px-2 hover:text-yellow-700">
          {relevance} <ChevronDown size={17} />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="dark:bg-slate-800 bg-white text-black dark:text-white">
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup
          value={String(relevance)}
          onValueChange={(value) => setRelevance(Number(value))}
          onClick={(e) => e.stopPropagation()}
        >
          <DropdownMenuRadioItem value="1">1</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="2">2</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="3">3</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="4">4</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="5">5</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
