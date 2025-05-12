interface SimpleCardProps {
  label: string
  value: number
  isPercentag?: boolean
}

export function SimpleCard({ label, value, isPercentag }: SimpleCardProps) {
  return (
    <div className="space-y-2 p-4 w-full rounded-xl border border-blue-400/50">
      <p>{isPercentag ? value.toString().concat('%') : value}</p>
      <p className="text-xs">{label}</p>
    </div>
  )
}
