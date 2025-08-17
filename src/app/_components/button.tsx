interface ButtonProps {
  label: string
  disabled?: boolean
  onClick?: () => void
  className?: string
  type?: 'button' | 'submit' | 'reset'
}

export function Button({
  disabled,
  label,
  onClick,
  className,
  type,
}: ButtonProps) {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      type={type}
      className={`border border-yellow-500 rounded-2xl px-3 py-1 text-zinc-500 dark:text-white hover:border-yellow-400 hover:shadow hover:shadow-yellow-600 transition-all ${className}`}
    >
      {label}
    </button>
  )
}
