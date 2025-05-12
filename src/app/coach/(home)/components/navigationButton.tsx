import React, { ReactNode } from 'react'

interface ButtonProps {
  icon: ReactNode
  disabled: boolean
  onClick: () => void
}

export function NavigationButton({ icon, disabled, onClick }: ButtonProps) {
  return (
    <button
      disabled={disabled}
      className="text-xl text-gray-900 flex items-center justify-center bg-yellow-700 rounded-md h-10 w-10 hover:bg-yellow-600 disabled:bg-yellow-700/40 disabled:cursor-not-allowed transition-all"
      onClick={onClick}
    >
      {icon}
    </button>
  )
}
