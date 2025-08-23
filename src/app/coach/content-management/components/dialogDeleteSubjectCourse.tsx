import CancelButton from '@/app/_components/cancelButton'
import ConfirmButton from '@/app/_components/confirmButton'
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogClose,
  DialogHeader,
  DialogFooter,
} from '@/app/_components/ui/dialog'
import { api } from '@/lib/axios'
import { useRouter } from 'next/navigation'
import type { ReactNode } from 'react'
import { toast } from 'sonner'

interface DialogDeleteSubjectProps {
  id: string
  name: string
  label: string | ReactNode
  className: string
  route: boolean
  isSubject: boolean
}

export function DialogDeleteSubjectCourse({
  id,
  name,
  label,
  className = '',
  route = false,
  isSubject,
}: DialogDeleteSubjectProps) {
  const router = useRouter()

  function deleted() {
    api
      .delete(`${isSubject ? '/subjects/' : '/courses/'}${id}`)
      .then((response) => {
        if (response.status === 200) {
          toast.success(
            `${isSubject ? 'Disciplina' : 'Plano de estudo'} "${name}" excluido(a) com sucesso`,
          )
          if (route) router.back()
          else window.location.reload()
        }
      })
      .catch((e) => toast.error(`Erro ao excluir disciplina"${name}:${e}" `))
  }

  return (
    <Dialog>
      <DialogTrigger onClick={(e) => e.stopPropagation()} className={className}>
        {label}
      </DialogTrigger>
      <DialogContent
        onClick={(e) => e.stopPropagation()}
        className="bg-white text-gray-600 dark:text-white dark:bg-[#050c16] border-none rounded-3xl w-max lg:w-1/4"
      >
        <DialogHeader>
<<<<<<< HEAD
          <DialogTitle className="text-black dark:text-white">
=======
          <DialogTitle className='text-black dark:text-white'>
>>>>>>> 76d27db67be57b96513a92ac4cb4b0d29bca574c
            Desejar excluir {isSubject ? 'a disciplina' : 'o plano de estudos'}?
          </DialogTitle>
        </DialogHeader>
        <DialogFooter className="flex justify-between">
          <DialogClose onClick={(e) => e.stopPropagation()} asChild>
            <CancelButton className="flex-1 mt-4">Cancelar</CancelButton>
          </DialogClose>
          <DialogClose onClick={(e) => e.stopPropagation()} asChild>
            <ConfirmButton
              onClick={() => deleted()}
              className="flex-1 rounded mt-4"
            >
              Confirmar
            </ConfirmButton>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
