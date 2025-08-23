import { SquarePen } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/app/_components/ui/tooltip'

interface EditableTextProps {
  text: string
  setText: (arg: string) => void
  className: string
}

export function EditableText({ text, setText, className }: EditableTextProps) {
  const [isEditing, setIsEditing] = useState(false)
  const textRef = useRef<HTMLParagraphElement>(null)
  const [isOverflow, setIsOverflow] = useState(false)

  useEffect(() => {
    if (textRef.current) {
      const isTextOverflowing =
        textRef.current.scrollHeight > textRef.current.clientHeight ||
        textRef.current.scrollWidth > textRef.current.clientWidth
      setIsOverflow(isTextOverflowing)
    }
  }, [text])

  return isEditing ? (
    <input
      className={`bg-transparent block border border-yellow-500 rounded w-full ${className}`}
      type="text"
      value={text}
      onChange={(e) => {
        setText(e.target.value)
      }}
      autoFocus
      onBlur={() => setIsEditing(false)}
    />
  ) : (
    <div className="w-full flex justify-between mr-4">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <p ref={textRef} className={className}>
              {text}
            </p>
          </TooltipTrigger>

          {isOverflow && (
            <TooltipContent className="text-base">{text}</TooltipContent>
          )}
        </Tooltip>
      </TooltipProvider>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <SquarePen
              className="cursor-pointer dark:text-white text-black"
              onClick={() => setIsEditing(true)}
            />
          </TooltipTrigger>
          <TooltipContent className="text-base">Editar</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  )
}
