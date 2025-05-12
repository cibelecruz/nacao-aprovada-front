'use client'

import WhatsappSVG from '@/app/_components/icons/whatsapp'
import { Loader } from '@/app/_components/loader'

import { api } from '@/lib/axios'
import { ArrowLeft, Mail } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { SelectedCourse } from './components/selectedCourse'
import { TabButton } from './components/tabButton'
import { GeneralInformation } from './components/generalInfoSection'
import { PerformanceSection } from './components/performanceSection'
import { FrequencySection } from './components/frequencySection'
import type { UserFrequencyProps } from '@/@types/user-frequency'
import type { Course, CoursePerformanceProps } from 'course-performance'
import type { CourseInfo, UserInfoProps } from 'course-info'
import { transformDataForTypeUserInfoProps } from '@/utils/transformDataForTypeUserInfoProps'
import { ContentContainer } from '@/app/_components/contentContainer'
import { PageContainer } from '@/app/_components/pageContainer'
import type { DailyPerformanceProps } from '@/@types/daily-performance'
import { transformDataForTypeUserPerformanceProps } from '@/utils/transformDataForTypeUserPerformanceProps'

export default function StudentProfile() {
  const { userId } = useParams<{ userId: string }>()
  const router = useRouter()
  const [userPerformance, setUserPerformance] =
    useState<CoursePerformanceProps>()
  const [userInfo, setUserInfo] = useState<UserInfoProps>()
  const [userFrequency, setUserFrequency] = useState<UserFrequencyProps>()
  const [dailyPerformance, setDailyPerformance] =
    useState<DailyPerformanceProps[]>()
  const [selectedCourse, setSelectedCourse] = useState<string>()
  const [coursePerformance, setCoursePerformance] = useState<Course>()
  const [courseInfo, setCourseInfo] = useState<CourseInfo>()
  const [activeSection, setActiveSection] = useState<
    'general' | 'performance' | 'frequency'
  >('general')

  useEffect(() => {
    api.get(`/users/info/${userId}`).then((response) => {
      const data = transformDataForTypeUserInfoProps(response.data)
      setSelectedCourse(data.courses[0].name)
      setUserInfo(data)
    })

    api.get(`/users/performance/${userId}`).then((response) => {
      const formattedData = transformDataForTypeUserPerformanceProps(
        response.data.userPerformance,
      )
      setUserPerformance(formattedData)
      setCoursePerformance(formattedData.courses[0])
    })

    api
      .get(`users/frequency/${userId}`)
      .then((response) => setUserFrequency(response.data))

    api.get(`/users/daily-performance/${userId}`).then((response) => {
      setDailyPerformance(response.data.notes)
    })
  }, [userId])

  useEffect(() => {
    if (selectedCourse) {
      const course = userPerformance?.courses.find(
        (course) => course.name === selectedCourse,
      )

      const courseInfo = userInfo?.courses.find(
        (course) => course.name === selectedCourse,
      )

      if (!course) {
        setCourseInfo(courseInfo)
        setCoursePerformance(userPerformance?.courses[0])
        return
      }

      setCourseInfo(courseInfo)
      setCoursePerformance(course)
    } else {
      setCourseInfo(userInfo?.courses[0])
      setCoursePerformance(userPerformance?.courses[0])
    }
  }, [selectedCourse, userPerformance, userInfo])

  if (!userPerformance || !selectedCourse || !courseInfo || !userFrequency) {
    return <Loader />
  }

  return (
    <PageContainer>
      <button className="mt-10" onClick={() => window.history.back()}>
        <ArrowLeft className="text-yellow-500" />
      </button>

      <ContentContainer>
        <header>
          <div className="flex justify-between">
            <div className="flex items-center gap-4">
              <p className="text-3xl font-bold">{userInfo?.name}</p>
              <button>
                <WhatsappSVG className="relative w-5 z-10" />
              </button>
              <button>
                <Mail className="relative w-5 z-10" />
              </button>
            </div>

            <SelectedCourse
              setSelectedCourse={setSelectedCourse}
              selectedCourse={selectedCourse ?? ''}
              userPerformance={userPerformance}
            />
          </div>

          <div className="flex justify-between mt-14">
            <div className="space-x-8">
              <TabButton
                onClick={() => setActiveSection('general')}
                isActive={activeSection === 'general'}
                label="Informações Gerais"
              />
              <TabButton
                onClick={() => setActiveSection('performance')}
                isActive={activeSection === 'performance'}
                label="Desempenho"
              />
              <TabButton
                onClick={() => setActiveSection('frequency')}
                isActive={activeSection === 'frequency'}
                label="Frequência"
              />
            </div>

            <button
              onClick={() => {
                router.push(`/coach/edit-configuration/${userId}`)
              }}
              className="border border-blue-300/30 py-1 px-4 rounded-lg"
            >
              Configurações
            </button>
          </div>
        </header>

        <div>
          {activeSection === 'general' &&
            (coursePerformance ? (
              <GeneralInformation
                courseInfo={courseInfo}
                coursePerformance={coursePerformance}
                selectedCourse={selectedCourse}
              />
            ) : (
              <div className="mt-10 w-full text-center">
                <h1>
                  Desculpe, não encontramos dados disponíveis para as
                  informações gerais.
                </h1>
              </div>
            ))}
          {activeSection === 'performance' &&
            (dailyPerformance && coursePerformance ? (
              <PerformanceSection
                userId={userId}
                dailyPerformance={dailyPerformance}
                coursePerformance={coursePerformance}
              />
            ) : (
              <div className="mt-10 w-full text-center">
                <h1>
                  Desculpe, não encontramos dados de desempenho disponíveis.
                </h1>
              </div>
            ))}
          {activeSection === 'frequency' && (
            <FrequencySection
              userFrequency={userFrequency}
              selectedCourse={selectedCourse}
            />
          )}
        </div>
      </ContentContainer>
    </PageContainer>
  )
}
