import type { StaticImageData } from 'next/image'
import Image from 'next/image'

interface CardPerformanceProps {
  label: string
  icon: StaticImageData
  title: string
}

export function CardPerformance({ title, icon, label }: CardPerformanceProps) {
  return (
    <div
      className="
        space-y-4 max-sm:flex-1 md:w-60 py-4 px-3 rounded-lg flex flex-col
        bg-white text-black border border-gray-200
        dark:bg-blue-800 dark:text-white dark:border-blue-900/40
      "
    >
      {/* badge título */}
      <div
        className="
          p-2 w-max rounded-lg
          bg-blue-100 text-blue-900
          dark:bg-blue-700 dark:text-yellow-500
        "
      >
        <p className="font-semibold max-md:text-sm">{title}</p>
      </div>

      <div className="flex items-center gap-4 pl-3">
        <div className="size-8">
          <Image
            width={128}
            height={128}
            src={icon}
            alt="Emblema"
          />
        </div>
        <p className="text-sm font-bold">{label}</p>
      </div>
    </div>
  )
}