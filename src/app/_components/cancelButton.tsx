import React from 'react'

interface ConfirmButtonProps {
  onClick?: () => void
  children: React.ReactNode
  className?: string
}

export default function CanselButton({
  onClick,
  children,
  className = '',
}: ConfirmButtonProps) {
  return (
    <button
      className={`border border-yellow-600 px-2 h-8 rounded ${className} hover:bg-blue-600/20 transition-all`}
      onClick={onClick || (() => {})}
    >
      {children}
    </button>
  )
}
