import React from 'react'

interface ConfirmButtonProps {
  onClick?: () => void
  children: React.ReactNode
  className?: string
  disabled?: boolean
  type?: 'button' | 'submit'
}

export default function ConfirmButton({
  onClick,
  children,
  className = '',
  disabled = false,
  type = 'button',
}: ConfirmButtonProps) {
  return (
    <button
      className={`bg-yellow-600 px-2 h-8 rounded ${className} hover:bg-yellow-600/80 transition-all`}
      onClick={onClick || (() => {})}
      disabled={disabled}
      type={type}
    >
      {children}
    </button>
  )
}
