'use client'

import * as React from 'react'
import * as SwitchPrimitives from '@radix-ui/react-switch'
import { cn } from '@/lib/utils'
import { Check, X } from 'lucide-react'

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>
>(({ className, ...props }, ref) => {
  const [isChecked, setIsChecked] = React.useState(
    props.defaultChecked || false,
  )

  return (
    <SwitchPrimitives.Root
      ref={ref}
      {...props}
      checked={isChecked}
      onCheckedChange={(checked) => {
        setIsChecked(checked)
        props.onCheckedChange?.(checked)
      }}
      className={cn(
        'peer inline-flex h-6 w-12 shrink-0 cursor-pointer items-center rounded-full border-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50',
        'data-[state=checked]:bg-yellow-600 data-[state=checked]:border-yellow-600',
        'data-[state=unchecked]:bg-gray-700 data-[state=unchecked]:border-gray-400',
        className,
      )}
    >
      <SwitchPrimitives.Thumb
        className={cn(
          'flex h-5 w-5 items-center justify-center rounded-full shadow-md transition-transform transform',
          'data-[state=checked]:translate-x-6 data-[state=unchecked]:translate-x-1',
          'data-[state=checked]:bg-black data-[state=unchecked]:bg-gray-400',
        )}
      >
        {/* Ícones alterados com base no estado */}
        {isChecked ? (
          <Check className="text-white text-xs font-bold" />
        ) : (
          <X className="text-white text-xs font-bold" />
        )}
      </SwitchPrimitives.Thumb>
    </SwitchPrimitives.Root>
  )
})

Switch.displayName = SwitchPrimitives.Root.displayName

export { Switch }
