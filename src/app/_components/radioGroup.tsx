'use client'

import { Loader } from 'lucide-react'

import { RadioGroup, RadioGroupItem } from '@/app/_components/ui/radio-group'

interface RadioProps {
  items:
    | {
        label: string
        value: string
      }[]
    | null
  value: string
  onChange: (value: string) => void
}

export function Radio({ items, value, onChange }: RadioProps) {
  if (!items) {
    return (
      <div className="flex flex-col justify-center items-center gap-4">
        <Loader className="animate-spin" />
        <h1>Carregando</h1>
      </div>
    )
  }

  return (
    <RadioGroup
      className="space-y-2 w-full overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent active:scrollbar-thumb-yellow-600"
      value={value}
      onValueChange={onChange}
    >
      {items.map((item) => (
        <label
          key={item.value}
          htmlFor={item.value}
          className="flex items-center rounded-lg space-x-4 p-3 dark:text-white text-black bg-white dark:bg-blue-800 border border-transparent hover:border-yellow-400 hover:cursor-pointer transition-all"
        >
          <RadioGroupItem
            value={item.value}
            id={item.value}
            className="border-yellow-600 w-4 h-4"
          />
          <div className="flex-1">
            <p className="cursor-pointer text-left">{item.label}</p>
          </div>
        </label>
      ))}
    </RadioGroup>
  )
}
