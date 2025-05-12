import type { ReactNode } from 'react'

interface ButtonProps {
  form?: string
  type: 'submit' | 'reset' | 'button'
  disabled: boolean
  label: string | ReactNode
  onClick?: () => void
  rounded?: string
  className?: string
}

export function ButtonFill({
  disabled,
  type,
  form,
  label,
  onClick,
  rounded,
  className,
}: ButtonProps) {
  return (
    <button
      disabled={disabled}
      form={form}
      type={type}
      onClick={onClick}
      className={`max-sm:w-full md:w-10/12 mx-auto py-1 ${rounded ?? 'rounded-md'}  bg-yellow-600 text-black font-bold disabled:bg-yellow-800 disabled:cursor-not-allowed ${className}`}
    >
      {label}
    </button>
  )
}
