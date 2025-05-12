import type { StaticImageData } from 'next/image'
import Image from 'next/image'

interface CardPerformanceProps {
  label: string
  icon: StaticImageData
  title: string
}

export function CardPerformance({ title, icon, label }: CardPerformanceProps) {
  return (
    <div className="bg-blue-800 space-y-4 max-sm:flex-1 md:w-60 py-4 px-3 rounded-lg flex flex-col">
      <div className="p-2 bg-blue-700 w-max rounded-lg">
        <p className={`text-yellow-500 font-semibold max-md:text-sm`}>
          {title}
        </p>
      </div>

      <div className="flex items-center gap-4 pl-3">
        <div className="size-8">
          <Image
            property=""
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
