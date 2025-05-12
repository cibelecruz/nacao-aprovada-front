interface TitlePageProps {
  title: string
  className?: string
}

export function TitlePage({ title, className }: TitlePageProps) {
  return (
    <h1 className={`text-xl font-bold font-inter ${className}`}>{title}</h1>
  )
}
