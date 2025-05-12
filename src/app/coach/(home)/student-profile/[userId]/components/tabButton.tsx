interface TabButtonProps {
  label: string
  isActive: boolean
  onClick: () => void
}

export function TabButton({ isActive, label, onClick }: TabButtonProps) {
  return (
    <button
      onClick={onClick}
      data-isactive={isActive}
      className="text-zinc-500 font-bold hover:text-yellow-600 data-[isActive=true]:text-yellow-600 p-1 rounded-lg text-lg transition-all"
      disabled={isActive}
    >
      {label}
    </button>
  )
}
