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
      <DropdownMenuTrigger asChild>
        <button className="flex items-center w-10 h-8 justify-center gap-2 border border-gray-400 rounded-md py-1 px-2 hover:text-yellow-700">
          {relevance} <ChevronDown size={17} />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-slate-800 text-white">
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
