import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogClose,
  DialogHeader,
  DialogFooter,
  DialogDescription,
} from '@/app/_components/ui/dialog'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/app/_components/ui/select'
import { useState } from 'react'
import { InputInfo } from './inputInfo'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import { CourseConfig, CourseName } from 'course-info'
import { toast } from 'sonner'
import ConfirmButton from './confirmButton'
import CancelButton from './cancelButton'

interface addCourseProps {
  courses: CourseName[]
  setAssignedCourses: (arg: CourseConfig[]) => void
  assignedCourses: CourseConfig[]
}

export function AddCourse({
  courses,
  setAssignedCourses,
  assignedCourses,
}: addCourseProps) {
  dayjs.extend(customParseFormat)

  function formatDate(offsetYears = 0): string {
    const date = new Date()
    date.setFullYear(date.getFullYear() + offsetYears)

    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')

    return `${day}/${month}/${year}`
  }

  const [selectCourse, setSelectCourse] = useState(courses[0].id)
  const [registrationDate, setRegistrationDate] = useState(formatDate())
  const [expirationDate, seExpirationDate] = useState(formatDate(1))

  function confirmAdd() {
    const selectedCourse = courses.find((course) => course.id === selectCourse)

    if (!selectedCourse) {
      toast.error('Curso não encontrado!')
      return
    }

    const courseAlreadyExists = assignedCourses.find(
      (course) => course.id === selectCourse,
    )

    if (courseAlreadyExists) {
      return toast.error('Curso já foi adicionado!')
    }

    const addCourse = {
      name: selectedCourse.institution.concat('-', selectedCourse.jobPosition),
      id: selectedCourse.id,
      registrationDate: dayjs(registrationDate, 'DD/MM/YYYY').format(
        'YYYY-MM-DD',
      ),
      expirationDate: dayjs(expirationDate, 'DD/MM/YYYY').format('YYYY-MM-DD'),
    } as CourseConfig

    setAssignedCourses([...assignedCourses, addCourse])
  }

  return (
    <Dialog>
      <DialogTrigger className="border border-yellow-600 w-max h-8 px-3 text-base rounded hover:border-yellow-500 transition-all">
        Adicionar plano de estudos
      </DialogTrigger>
      <DialogContent className="bg-blue-900 border-none rounded-3xl w-max lg:w-1/4 space-y-3">
        <DialogHeader>
          <DialogTitle>Adicionar Plano</DialogTitle>
          <DialogDescription hidden>
            Dialog para adicionar um novo curso
          </DialogDescription>
          <div className="pt-9 space-y-3">
            <div>
              <p className="text-sm">Planos:</p>
              <Select
                defaultValue={courses[0].id}
                onValueChange={(value) => {
                  setSelectCourse(value)
                }}
              >
                <SelectTrigger className="border border-yellow-600 xl:w-72 lg:w-52">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-blue-800 text-white">
                  {courses.map((Subject) => (
                    <SelectItem key={Subject.id} value={Subject.id}>
                      {Subject.institution.concat('-', Subject.jobPosition)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <InputInfo
              label="Data da Matricula:"
              onChange={setRegistrationDate}
              value={registrationDate}
              placeholder="DD/MM/YYYY"
              type="date"
            />

            <InputInfo
              label="Data de Vencimento:"
              onChange={seExpirationDate}
              value={expirationDate}
              placeholder="DD/MM/YYYY"
              type="date"
            />
          </div>
        </DialogHeader>
        <DialogFooter className="max-sm:items-center">
          <DialogClose asChild>
            <ConfirmButton
              className="w-32 lg:w-20 xl:w-32 mt-4 "
              onClick={() => confirmAdd()}
            >
              Confirmar
            </ConfirmButton>
          </DialogClose>
          <DialogClose asChild>
            <CancelButton className="w-32 lg:w-20 xl:w-32 mt-4">
              Cancelar
            </CancelButton>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
