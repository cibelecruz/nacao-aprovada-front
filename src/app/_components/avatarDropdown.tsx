import { useState } from 'react'
import { useCourseContext } from '../context/coursesSelect'
import { CourseSelector } from './courseSelector'
import { DialogUploadProfileImage } from './dialogUploadProfileImage'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'
import Image from 'next/image'

interface AvatarDropdownProps {
  imageUrl?: string
  firstNameLetter: string
  lastNameLetter: string
  signOut: () => Promise<void>
  isStudent?: boolean
}

export function AvatarDropdown({
  firstNameLetter,
  lastNameLetter,
  imageUrl,
  signOut,
  isStudent = false,
}: AvatarDropdownProps) {
  const { setCourseSelected } = useCourseContext()
  const [courseSelect, setCourseSelect] = useState('')

  return (
    <DropdownMenu>
      {imageUrl ? (
        <DropdownMenuTrigger className="w-full outline-none flex items-center justify-center">
          <Image
            src={imageUrl}
            width={100}
            height={100}
            alt="Avatar de perfil"
            className="rounded-full size-10 border border-yellow-500/50"
          />
        </DropdownMenuTrigger>
      ) : (
        <DropdownMenuTrigger className="w-full p-2 rounded-full bg-yellow-600 text-black font-bold flex items-center justify-center">
          <p>
            {firstNameLetter}
            {lastNameLetter}
          </p>
        </DropdownMenuTrigger>
      )}

      <DropdownMenuContent className="dark:bg-blue-800 text-black dark:text-white">
        <DropdownMenuLabel>Minha conta</DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-zinc-400" />
        {isStudent && (
          <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
            <Dialog>
              <DialogTrigger>Alterar Plano</DialogTrigger>
              <DialogContent className="bg-[#050c16] border-none rounded-3xl w-max lg:w-1/4">
                <DialogHeader>
                  <DialogTitle className="mt-2">
                    Escolha o plano desejado:
                  </DialogTitle>
                </DialogHeader>
                <CourseSelector setCourseSelect={setCourseSelect} />
                <DialogFooter className="flex"></DialogFooter>
                <DialogFooter>
                  <DialogClose asChild>
                    <button className="border border-yellow-600 px-4 h-8 flex-1 rounded max-sm:invisible">
                      Retornar
                    </button>
                  </DialogClose>
                  <DialogClose asChild>
                    <button
                      className="bg-yellow-600 px-4 h-8 flex-1 rounded"
                      onClick={() =>
                        courseSelect && setCourseSelected(courseSelect)
                      }
                    >
                      Confirmar
                    </button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </DropdownMenuItem>
        )}
        <DropdownMenuItem>
          <DialogUploadProfileImage />
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() =>
            window.open(
              `https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP}`,
              '_blank',
            )
          }
        >
          Suporte
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => signOut()}>Sair</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
