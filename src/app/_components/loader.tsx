import { Loader as LoaderIcon } from 'lucide-react'

export function Loader() {
  return (
    <div className="w-full h-screen flex flex-col items-center justify-center">
      <LoaderIcon className="size-10 animate-spin" />
      <h1>Carregando...</h1>
    </div>
  )
}
