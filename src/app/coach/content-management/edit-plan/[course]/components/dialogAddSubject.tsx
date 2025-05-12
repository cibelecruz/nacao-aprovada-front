import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogClose,
  DialogHeader,
  DialogFooter,
} from '@/app/_components/ui/dialog'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/app/_components/ui/select'
import { SubjectProps } from '../../../page'
import { useState } from 'react'
import { api } from '@/lib/axios'
import { toast } from 'sonner'
import CancelButton from '@/app/_components/cancelButton'
import ConfirmButton from '@/app/_components/confirmButton'

interface DialogAddSubject {
  subjects: SubjectProps[]
  idCourse: string
}

export function DialogAddSubject({ subjects, idCourse }: DialogAddSubject) {
  const [selectSubject, setSelectSubject] = useState(subjects[0]._id)

  function addSubject() {
    if (selectSubject) {
      const postAddSubject = { courseId: idCourse, subjectId: selectSubject }
      api.post('/courses/add-subject', postAddSubject).then(() => {
        window.location.reload()
        toast.success('Disciplina adicionada com sucesso')
      })
    } else toast.error('Escolha uma disciplina para adicionar')
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <ConfirmButton className="w-auto mt-4 mr-3">
          Adicionar Disciplina
        </ConfirmButton>
      </DialogTrigger>
      <DialogContent className="bg-[#050c16] border-none rounded-3xl w-max lg:w-1/4">
        <DialogHeader>
          <DialogTitle>Dicionar Disciplina</DialogTitle>
          <div className="pt-9">
            <p>Disciplina</p>
            <Select
              defaultValue={subjects[0]._id}
              onValueChange={(value) => {
                setSelectSubject(value)
              }}
            >
              <SelectTrigger className="border border-yellow-600 xl:w-full lg:w-52">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {subjects.map((Subject) => (
                  <SelectItem key={Subject._id} value={Subject._id}>
                    {Subject.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </DialogHeader>
        <DialogFooter className="max-md:items-center">
          <DialogClose asChild>
            <CancelButton className="w-32 lg:w-20 xl:w-32 mt-4">
              Cancelar
            </CancelButton>
          </DialogClose>
          <DialogClose asChild>
            <ConfirmButton
              className="mt-4 w-32 lg:w-20 xl:w-32"
              onClick={() => addSubject()}
            >
              Confirmar
            </ConfirmButton>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
