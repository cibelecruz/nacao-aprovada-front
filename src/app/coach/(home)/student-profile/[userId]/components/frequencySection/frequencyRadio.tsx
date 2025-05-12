'use client'

import { RadioGroup, RadioGroupItem } from '@/app/_components/ui/radio-group'

interface RadioItem {
  label: string
  value: string
}

interface RadioProps {
  items: RadioItem[]
  value: string
  onChange: (value: string) => void
  chartId: string
}

export function FrequencyRadio({
  items,
  value,
  onChange,
  chartId,
}: RadioProps) {
  return (
    <RadioGroup
      className="space-y-2 w-max flex items-end"
      value={value}
      onValueChange={(newValue) => {
        onChange(newValue)
      }}
    >
      {items.map((item) => (
        <label
          key={`${chartId}-${item.value}`}
          htmlFor={`${chartId}-${item.value}`}
          className="flex max-md:text-xs items-center rounded-lg space-x-4 p-3 hover:text-yellow-500  hover:cursor-pointer transition-all"
          onClick={(event) => event.stopPropagation()}
        >
          <RadioGroupItem
            value={item.value}
            id={`${chartId}-${item.value}`}
            className="border-yellow-600 w-5 h-5"
            onClick={(event) => event.stopPropagation()}
          />
          <div className="flex-1">
            <p className="cursor-pointer text-left">{item.label}</p>
          </div>
        </label>
      ))}
    </RadioGroup>
  )
}
