'use client'

import { TitlePage } from '@/app/_components/titlePage'
import { useEffect, useMemo, useState } from 'react'
import { InputInfo } from '../../_components/inputInfo'
import { AddCourse } from '../../_components/addCourse'
import { api } from '@/lib/axios'
import { Loader } from '@/app/_components/loader'
import { toast } from 'sonner'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import { X } from 'lucide-react'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/app/_components/ui/dialog'
import { useRouter } from 'next/navigation'
import { PageContainer } from '@/app/_components/pageContainer'
import { ContentContainer } from '@/app/_components/contentContainer'
import { CourseConfig, CourseName } from 'course-info'
import ConfirmButton from '@/app/_components/confirmButton'
import CancelButton from '@/app/_components/cancelButton'

export default function StudentRegitration() {
  dayjs.extend(customParseFormat)

  const router = useRouter()

  const [userName, setUserName] = useState('')
  const [email, setEmail] = useState('')
  const [cpf, setCpf] = useState('')
  const [preferedStartDate, setPreferedStartDate] = useState('')
  const [assignedCourses, setAssignedCourses] = useState<CourseConfig[]>([])

  const [courses, setCourses] = useState<CourseName[]>([])
  const [loader, setLoader] = useState(true)

  useEffect(() => {
    setLoader(true)
    api.get('/courses/list').then((response) => {
      setCourses(response.data.data)
      setLoader(false)
    })
  }, [])

  const isDesabledButton = useMemo(() => {
    if (!userName || !email || assignedCourses.length === 0) return true
    else return false
  }, [userName, email, assignedCourses])

  function creatStudent() {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const postCourses = assignedCourses.map(({ name, ...rest }) => rest)
    const userLogin = {
      name: userName,
      email,
      cpf: cpf.replace(/[.-]/g, ''),
      preferedStartDate: preferedStartDate
        ? dayjs(preferedStartDate, 'DD/MM/YYYY').format('YYYY-MM-DD')
        : '',
      courses: postCourses,
      role: 'student',
    }

    api
      .post('/register-user', userLogin)
      .then((response) => {
        toast('Aluno adicionado com sucesso', {
          description: 'Clique no botão para ver aluno:',
          action: {
            label: 'Ver aluno',
            onClick: () =>
              router.push(`/coach/student-profile/${response.data}`),
          },
        })
      })
      .catch((response) => toast.error(`Erro ao adicionar aluno:${response}`))
  }

  return loader ? (
    <Loader />
  ) : (
    <PageContainer>
      <ContentContainer>
        <TitlePage className="text-yellow-600" title="Cadastro de Aluno" />
        <div className="rounded-lg p-4 h-max flex flex-col space-y-4">
          <InputInfo
            label="Nome:"
            type="text"
            value={userName}
            placeholder="Nome"
            onChange={setUserName}
          />

          <InputInfo
            label="Email:"
            type="text"
            value={email}
            placeholder="nome@email.com"
            onChange={setEmail}
          />

          <InputInfo
            placeholder="000.000.000-00"
            label="CPF:"
            type="cpf"
            value={cpf}
            onChange={setCpf}
          />

          <InputInfo
            label="Data de Preferencia:"
            type="date"
            value={preferedStartDate}
            placeholder="DD/MM/YYYY"
            onChange={setPreferedStartDate}
          />
          <div className="mt-4 pt-2 border-none border-t-2">
            <p className="text-lg">Planos do aluno:</p>
            {assignedCourses.length === 0 ? (
              <p className="text-base text-gray-300 pl-3">
                Nenhum plano atribuido
              </p>
            ) : (
              <ul className="list-disc space-y-3 pl-5">
                {assignedCourses.map((userCourse) => (
                  <li
                    className="text-base text-gray-400 items-center"
                    key={userCourse.id}
                  >
                    <div className="flex bg-blue-800 text-white w-max p-2 rounded-xl border border-yellow-800 gap-4">
                      {userCourse.name}
                      <button
                        className="text-white hover:text-red-600 transition-all"
                        onClick={() =>
                          setAssignedCourses(
                            assignedCourses.filter(
                              (course) => course.id !== userCourse.id,
                            ),
                          )
                        }
                      >
                        <X size={19} />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <AddCourse
            courses={courses}
            assignedCourses={assignedCourses}
            setAssignedCourses={setAssignedCourses}
          />
        </div>

        <Dialog>
          <DialogTrigger asChild>
            <ConfirmButton
              className="w-mas mt-5 ml-4 disabled:opacity-30 disabled:cursor-no-drop"
              disabled={isDesabledButton}
            >
              Cadastrar aluno
            </ConfirmButton>
          </DialogTrigger>
          <DialogContent className="bg-[#050c16] border-none rounded-3xl w-max lg:w-1/4">
            <DialogHeader>
              <DialogTitle>Desejar cadastrar o aluno?</DialogTitle>
              <DialogDescription hidden>
                Dialog para adicionar um novo usuário na plataforma
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="flex">
              <DialogClose asChild>
                <ConfirmButton onClick={() => creatStudent()} className="mt-4">
                  Cadastrar
                </ConfirmButton>
              </DialogClose>
              <DialogClose asChild>
                <CancelButton className="mt-4">Cancelar</CancelButton>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </ContentContainer>
    </PageContainer>
  )
}
