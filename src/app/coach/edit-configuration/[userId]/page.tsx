'use client'

import { useParams, useRouter } from 'next/navigation'
import { HeaderEditConfiguration } from '../components/headerEditConfiguration'
import { useEffect, useState, useMemo } from 'react'
import { api } from '@/lib/axios'
import { toast } from 'sonner'
import type { CourseConfig, CourseName, UserInfoProps } from 'course-info'
import { transformDataForTypeUserInfoProps } from '@/utils/transformDataForTypeUserInfoProps'
import { Loader } from '@/app/_components/loader'
import { InputInfo } from '../components/inputInfo'
import dayjs from '@/lib/dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'

import { PageContainer } from '@/app/_components/pageContainer'
import { ContentContainer } from '@/app/_components/contentContainer'
import { RotateCcw, X, ArrowLeft } from 'lucide-react'
import { AddCourse } from '@/app/_components/addCourse'
import { transformDataForTypeCourseConfig } from '@/utils/transformDataForTypeCourseConfig'
import { DialogDeleteUser } from '@/app/_components/dialogDeleteUser'
import ConfirmButton from '@/app/_components/confirmButton'
import CancelButton from '@/app/_components/cancelButton'

interface FormData {
  registrationDate: string
  expirationDate: string
  email: string
  phone: string
}

export default function EditConfiguration() {
  dayjs.extend(customParseFormat)

  const { userId } = useParams<{ userId: string }>()
  const [userInfo, setUserInfo] = useState<UserInfoProps | null>(null)
  const [formData, setFormData] = useState<FormData | null>(null)
  const [selectedCourse, setSelectedCourse] = useState('')
  const [isModified, setIsModified] = useState(false)
  const [userCoursesConfig, setUserCoursesConfig] = useState<CourseConfig[]>([])
  const [userCourse, setUserCourse] = useState<CourseConfig[]>([])
  const [courses, setCourses] = useState<CourseName[]>([])

  const router = useRouter()

  useEffect(() => {
    api.get(`/users/info/${userId}`).then((response) => {
      if (response.status !== 200) {
        toast.error('Erro ao pegar os dados do usuário.')
        return
      }

      const userInfo = transformDataForTypeUserInfoProps(response.data)
      const userCourse = transformDataForTypeCourseConfig(userInfo.courses)

      setUserInfo(userInfo)
      setSelectedCourse(userInfo.courses[0].name)
      setUserCoursesConfig(userCourse)
      setUserCourse(userCourse)
    })
  }, [userId])

  useEffect(() => {
    api.get('/courses/list').then((response) => {
      setCourses(response.data.data)
    })
  }, [])

  const displayCourse = useMemo(() => {
    setFormData(null)
    return userInfo?.courses.find((course) => course.name === selectedCourse)
  }, [selectedCourse, userInfo])

  const isModifiedCourses = useMemo(() => {
    if (!userInfo || userCoursesConfig === userCourse) {
      return false
    } else {
      return true
    }
  }, [userCoursesConfig, userCourse, userInfo])

  function handleInputChange(field: keyof FormData, value: string) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setFormData((prev: any) => {
      const updated = { ...prev, [field]: value }

      const isModified =
        updated.email !== userInfo?.email ||
        updated.phone !== (userInfo?.phone || 'Não Informado') ||
        updated.registrationDate !==
          dayjs(displayCourse?.registrationDate, 'DD/MM/YYYY').format(
            'YYYY-MM-DD',
          ) ||
        updated.expirationDate !==
          dayjs(displayCourse?.expirationDate, 'DD/MM/YYYY').format(
            'YYYY-MM-DD',
          )

      setIsModified(isModified)
      return updated
    })
  }

  async function handleSave() {
    const updateUserCourses = {
      id: displayCourse?.id,
      expirationDate: formData?.expirationDate
        ? dayjs(formData?.expirationDate, 'DD/MM/YYYY').format('YYYY-MM-DD')
        : displayCourse?.expirationDate,
      registrationDate: formData?.registrationDate
        ? dayjs(formData?.registrationDate, 'DD/MM/YYYY').format('YYYY-MM-DD')
        : displayCourse?.registrationDate,
    }

    const userUpdate: { [key: string]: string | object } = {}
    if (formData?.email) {
      userUpdate.email = formData.email
    }
    if (formData?.phone) {
      userUpdate.phone = formData.phone.replace(/[-()\s]/g, '')
    }

    if (formData?.expirationDate || formData?.registrationDate) {
      userUpdate.course = updateUserCourses
    }
    const response = await api.put(`users/student/update/${userId}`, userUpdate)

    if (response.status === 200) {
      toast.success('Alterações salvas com sucesso!')
    } else {
      toast.error('Erro ao salvar alterações.')
    }
  }

  async function handleSaveCourse() {
    const { added, removed } = detectCourseChanges({
      previous: userCourse,
      current: userCoursesConfig,
    })

    if (userCoursesConfig.length === 0) {
      toast.error('O usuário deve ter pelo menos 1 curso')
      return
    }

    const courseUpdate = {
      userId,
      addedCourses: added,
      removedCourseIds: removed.map((c) => c.id),
    }

    try {
      const response = await api.put('users/add-course', courseUpdate)

      if (response.status === 200) {
        setUserCourse(userCoursesConfig)
        toast.success('Alterações salvas com sucesso!')
      }
    } catch (error) {
      toast.error('Erro ao salvar alterações.')
    }
  }

  async function deleteUser() {
    const response = await api.delete(`users/${userId}`)

    if (response.status === 200) {
      toast.success('Alterações salvas com sucesso!')
      setTimeout(() => (window.location.href = '/coach'), 300)
    } else {
      toast.error('Erro ao salvar alterações.')
    }
  }

  function detectCourseChanges({
    current,
    previous,
  }: {
    previous: CourseConfig[]
    current: CourseConfig[]
  }) {
    const added = current.filter(
      (nc) => !previous.some((pc) => pc.id === nc.id),
    )

    const removed = previous.filter(
      (pc) => !current.some((nc) => nc.id === pc.id),
    )

    return { added, removed }
  }

  if (!userInfo || !displayCourse) {
    return <Loader />
  }

  return (
    <PageContainer>
      <button onClick={() => window.history.back()} className="text-yellow-600">
        <ArrowLeft />
      </button>

      <ContentContainer>
        <HeaderEditConfiguration
          titlePage="Configurações"
          selectedCourse={selectedCourse}
          setSelectedCourse={setSelectedCourse}
          info={userInfo}
        />

        <p className="mt-10 mb-2 text-xl font-bold">Matrícula</p>

        <div className="space-y-4">
          <InputInfo
            label="Data de matrícula:"
            type="date"
            value={dayjs(displayCourse.registrationDate).format('DD/MM/YYYY')}
            onChange={(value) => handleInputChange('registrationDate', value)}
          />

          <InputInfo
            label="Vencimento:"
            type="date"
            value={dayjs(displayCourse.expirationDate).format('DD/MM/YYYY')}
            onChange={(value) => handleInputChange('expirationDate', value)}
          />

          <InputInfo
            label="E-mail:"
            type="email"
            value={userInfo.email}
            onChange={(value) => handleInputChange('email', value)}
          />

          <InputInfo
            label="Telefone:"
            type="tel"
            value={
              userInfo.phone
                ? userInfo.phone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')
                : 'Não informado'
            }
            onChange={(value) => handleInputChange('phone', value)}
          />
        </div>

        <div className="flex gap-2 w-max mt-4">
          <DialogDeleteUser
            buttonClose={[
              <CancelButton
                key="cancel"
                className="border border-yellow-600 w-32 h-8 rounded mt-4"
              >
                Cancelar
              </CancelButton>,
              <ConfirmButton
                key="confirm"
                onClick={() => deleteUser()}
                className="bg-yellow-600 w-32 h-8 rounded mt-4"
              >
                Confirmar
              </ConfirmButton>,
            ]}
          />
          {isModified && (
            <ConfirmButton onClick={handleSave}>Salvar</ConfirmButton>
          )}
        </div>
      </ContentContainer>

      <div className="bg-blue-900 p-8 rounded-2xl space-y-8 mt-8">
        <p className="text-xl font-bold">Disciplinas do Aluno</p>
        <ol>
          {userCoursesConfig && userCoursesConfig.length > 0 ? (
            userCoursesConfig.map((course) => (
              <li key={course.id} className="flex items-center">
                {course.name}
                <button
                  onClick={() =>
                    userCoursesConfig.length > 1 &&
                    setUserCoursesConfig(
                      userCoursesConfig.filter(
                        (deleteCourse) => deleteCourse.id !== course.id,
                      ),
                    )
                  }
                  className="disabled:cursor-not-allowed"
                  disabled={userCoursesConfig.length === 1}
                  title={
                    userCoursesConfig.length === 1
                      ? 'Usuário deve ter pelo menos 1 curso'
                      : ''
                  }
                >
                  <X />
                </button>
              </li>
            ))
          ) : (
            <p>Nenhum plano encontrado</p>
          )}
        </ol>
        <AddCourse
          courses={courses}
          setAssignedCourses={setUserCoursesConfig}
          assignedCourses={userCoursesConfig}
        />
        {isModifiedCourses && (
          <div className="flex items-center gap-3 mt-4">
            <button
              className="bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded"
              onClick={() => handleSaveCourse()}
            >
              Salvar
            </button>
            <button
              title="Desfazer alterações"
              onClick={() => setUserCoursesConfig(userCourse)}
            >
              <RotateCcw />
            </button>
          </div>
        )}
      </div>

      <div className="bg-blue-900 p-8 rounded-2xl space-y-8 mt-8">
        <p className="text-xl font-bold">Cronograma do Aluno</p>

        <ConfirmButton
          onClick={() =>
            router.push(`/coach/edit-configuration/schedule/${userId}`)
          }
        >
          Editar conteúdo
        </ConfirmButton>
      </div>
    </PageContainer>
  )
}
