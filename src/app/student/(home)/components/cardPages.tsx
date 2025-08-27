'use client'

import Image, { type StaticImageData } from 'next/image'
import { useRouter } from 'next/navigation'

interface CardPageProps {
  label: string
  image: StaticImageData
  link: string
}

export function CardPage({ image, label, link }: CardPageProps) {
  const router = useRouter()

  function handleRedirectUser() {
    router.push(link)
  }
  return (
    <button
      onClick={handleRedirectUser}
      className="w-[150px] flex flex-col justify-center items-center gap-1 py-2 px-5 border border-transparent bg-white dark:bg-blue-800 rounded-2xl dark:hover:bg-blue-600 hover:border-yellow-600 transition-all "
    >
      <Image
        priority
        width={320}
        height={320}
        src={image}
        alt="calendario"
        className="w-20 h-20"
      />

      <p className="text-black dark:text-zinc-300">{label}</p>
    </button>
  )
}
