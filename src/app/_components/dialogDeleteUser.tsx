import type { ReactNode } from 'react'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog'
import { isArray } from 'lodash'
import CancelButton from './cancelButton'

interface DialogDeleteUserProps {
  buttonClose: ReactNode | ReactNode[]
}

export function DialogDeleteUser({ buttonClose }: DialogDeleteUserProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <CancelButton>Deletar Aluno</CancelButton>
      </DialogTrigger>
      <DialogContent className="bg-[#050c16] border-none rounded-3xl w-max lg:w-1/4">
        <DialogHeader>
          <DialogTitle className="flex flex-col gap-2">
            <span className="text-yellow-600">Atenção:</span>
            <p className="font-normal">
              Esta ação excluirá o aluno permanentemente. Confirmar?
            </p>
          </DialogTitle>
          <DialogDescription hidden>
            Dialog para excluir alunos da plataforma
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex">
          {isArray(buttonClose) ? (
            buttonClose.map((button, index) => (
              <DialogClose key={index} asChild>
                {button}
              </DialogClose>
            ))
          ) : (
            <DialogClose asChild>{buttonClose}</DialogClose>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
