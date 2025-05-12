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
import { useState } from 'react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import ConfirmButton from '@/app/_components/confirmButton'

interface DialogCreateSubjectCourseProps {
  isSubject: boolean
}

export function DialogCreateSubjectCourse({
  isSubject,
}: DialogCreateSubjectCourseProps) {
  const router = useRouter()

  const [nameNewSubject, setNameNewSubject] = useState('')
  const [nameNewInstitution, setNameNewInstitution] = useState('')
  const [nameNewJobPosition, setNameNewJobPosition] = useState('')

  function addSubject() {
    if (!nameNewSubject) toast.error('Preencha o nome da disciplina')
    else {
      const At = new Date().toISOString()

      const NewSubject = {
        createdAt: At,
        deleted: false,
        name: nameNewSubject,
        topics: [],
        updatedAt: At,
        __v: 0,
      }
      api
        .post('/subjects/create', NewSubject)
        .then((response) => {
          toast.success(`Disciplina "${nameNewSubject}" criada com sucesso`)
          setTimeout(() => {
            router.push(
              `content-management/edit-topic/${response.data.id._value}`,
            )
          }, 800)
        })
        .catch(() =>
          toast.error(`Erro ao criar disciplina "${nameNewSubject}"`),
        )
    }
  }

  function addCourse() {
    if (!nameNewInstitution || !nameNewJobPosition)
      toast.error('Preencha o nome da disciplina')
    else {
      const newCourse = {
        institution: nameNewInstitution,
        jobPosition: nameNewJobPosition,
      }
      api.post('/courses/create', newCourse).then((response) => {
        toast.success(
          `Plano ${nameNewInstitution} - ${nameNewJobPosition} criado com sucesso`,
        )
        router.push(`content-management/edit-plan/${response.data.message}`)
      })
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <ConfirmButton>
          Criar {isSubject ? 'Disciplina' : 'Plano'}
        </ConfirmButton>
      </DialogTrigger>
      <DialogContent className="bg-[#050c16] border-none rounded-3xl w-max lg:w-1/4">
        <DialogHeader>
          <DialogTitle>Criar {isSubject ? 'Disciplina' : 'Plano'}</DialogTitle>
        </DialogHeader>
        {isSubject ? (
          <input
            className="bg-transparent border border-yellow-500 rounded-2xl text-gray-300 h-9 pl-4 mt-8 hover:border-yellow-400 hover:shadow hover:shadow-yellow-600 transition-all"
            placeholder="Nome da Disciplina"
            type="text"
            value={nameNewSubject}
            onChange={(e) => setNameNewSubject(e.target.value)}
          />
        ) : (
          <div>
            <p>Instituição</p>
            <input
              className="bg-transparent border border-yellow-500 rounded-2xl w-full text-gray-300 h-9 pl-4 mb-4 hover:border-yellow-400 hover:shadow hover:shadow-yellow-600 transition-all"
              placeholder="Nome da Instituição"
              type="text"
              value={nameNewInstitution}
              onChange={(e) => setNameNewInstitution(e.target.value)}
            />
            <p>Cargo</p>
            <input
              className="bg-transparent border border-yellow-500 rounded-2xl w-full text-gray-300 h-9 pl-4 hover:border-yellow-400 hover:shadow hover:shadow-yellow-600 transition-all"
              placeholder="Nome do Cargo"
              type="text"
              value={nameNewJobPosition}
              onChange={(e) => setNameNewJobPosition(e.target.value)}
            />
          </div>
        )}
        <DialogFooter className="flex">
          <DialogClose asChild>
            <button className="border border-yellow-600 w-32 h-8 rounded mt-4">
              Cancelar
            </button>
          </DialogClose>
          <DialogClose asChild>
            <ConfirmButton
              className="mt-4 w-32"
              onClick={() => (isSubject ? addSubject() : addCourse())}
            >
              Criar
            </ConfirmButton>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
