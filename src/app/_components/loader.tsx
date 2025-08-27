import { Loader as LoaderIcon } from 'lucide-react'

export function Loader() {
  return (
    <div className="w-full h-screen flex flex-col items-center justify-center">
      <LoaderIcon className="size-10 animate-spin text-black dark:text-white" />
      <h1 className="text-black dark:text-white">Carregando...</h1>
    </div>
  )
}
