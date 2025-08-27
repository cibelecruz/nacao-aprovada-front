import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogClose,
  DialogHeader,
  DialogFooter,
} from '@/app/_components/ui/dialog'
import { CoursesProps } from '../../../page'
import { useState } from 'react'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/app/_components/ui/select'
import { api } from '@/lib/axios'
import { toast } from 'sonner'
import CancelButton from '@/app/_components/cancelButton'
import ConfirmButton from '@/app/_components/confirmButton'

export function DialogImportSubject({
  courses,
  idCourse,
}: {
  courses: CoursesProps[]
  idCourse: string
}) {
  const [selectCourse, setSelectCourse] = useState(courses[0].id)

  function importSubjects() {
    const importSubjectPost = {
      courseFrom: selectCourse,
      courseTo: idCourse,
    }
    api
      .post('/courses/import-subjects', importSubjectPost)
      .then(() => {
        toast.success('Disciplinas importadas com sucesso')
        window.location.reload()
      })
      .catch(() => toast.error('erro ao importar disciplinas'))
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <CancelButton className="w-auto mt-4 mr-3">
          Importar Disciplinas
        </CancelButton>
      </DialogTrigger>
      <DialogContent className="bg-white dark:bg-[#050c16] text-black dark:text-white border-none rounded-3xl w-max lg:w-1/4">
        <DialogHeader>
          <DialogTitle>Importar Disciplinas</DialogTitle>
          <div className="pt-9">
            <p>Planos</p>
            <Select
              defaultValue={courses[0].id}
              onValueChange={(value) => {
                setSelectCourse(value)
              }}
            >
              <SelectTrigger className="border border-yellow-600 xl:w-full lg:w-52">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {courses.map((subject) => (
                  <SelectItem key={subject.id} value={subject.id}>
                    {subject.institution.concat('-', subject.jobPosition)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </DialogHeader>
        <DialogFooter className="max-sm:items-center">
          <DialogClose asChild>
            <CancelButton className="w-32 lg:w-20 xl:w-32 mt-4">
              Cancelar
            </CancelButton>
          </DialogClose>
          <DialogClose asChild>
            <ConfirmButton
              className="w-32 lg:w-20 xl:w-32 mt-4 text-white"
              onClick={() => importSubjects()}
            >
              Confirmar
            </ConfirmButton>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
