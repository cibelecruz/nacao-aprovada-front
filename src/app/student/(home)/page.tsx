'use client'
import { useAuth } from '@/app/hooks/useAuth'
import ConfigIcon from '@/assets/Icons_Config1.png'
import CalendarImageIcon from '@/assets/Icons_Cronograma1.png'
import PerformanceIcon from '@/assets/Icons_Desempenho1.png'
import EditalImageIcon from '@/assets/Icons_Edital1.png'
import SimuladeImageIcon from '@/assets/icon-simulation.png'
import HelpImageIcon from '@/assets/icon-help.png'

import { CardPage } from './components/cardPages'
import { useEffect, useState } from 'react'
import { api } from '@/lib/axios'
import dayjs from '@/lib/dayjs'
import { useToast } from '@/app/hooks/use-toast'
import { ToastAction } from '@/app/_components/ui/toast'
import { useCourseContext } from '@/app/context/coursesSelect'
import { Onboarding } from './components/onboarding'

interface UserCourseInfoProps {
  id: string
  name: string
  expirationDate: string
}

export default function HomeStudent() {
  const [userCourseInfo, setUserCourseInfo] = useState<UserCourseInfoProps[]>()
  const { currentUser, isLoadingAuth, onboardingIsCompleted, role } = useAuth()
  const { courseSelected } = useCourseContext()

  const messageForUser = `Olá, ${currentUser?.displayName}!`
  const { toast } = useToast()

  useEffect(() => {
    if (currentUser) {
      api.get('/users/courses').then(({ data: response }) => {
        setUserCourseInfo(response.data)
      })
    }
  }, [currentUser, courseSelected])

  useEffect(() => {
    if (userCourseInfo) {
      const today = dayjs()
      if (userCourseInfo) {
        userCourseInfo.forEach((course) => {
          const expirationDate = dayjs(course.expirationDate)
          const daysToExpire = expirationDate.diff(today, 'day')

          if (daysToExpire > 0 && daysToExpire <= 7) {
            toast({
              description: `O curso "${course.name}" expirará em ${daysToExpire} dias. Renove agora para continuar!`,
              style: {
                background: '#1E2A47',
                color: 'white',
                border: '1px solid #3A4B6D',
                boxShadow: '0 0 10px rgba(245, 176, 66, 0.3)',
              },
              duration: 3000,
              action: (
                <ToastAction
                  onClick={() =>
                    window.open(
                      `https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP}`,
                      '_blank',
                    )
                  }
                  className="rounded-md bg-green-500 px-3 py-1 text-sm font-medium text-white hover:bg-green-600 shadow-sm transition-colors"
                  altText="Suporte"
                >
                  Suporte
                </ToastAction>
              ),
            })
          }
        })
      }
    }
  }, [toast, userCourseInfo])

  if (onboardingIsCompleted === false && role === 'student') {
    return <Onboarding />
  }

  return (
    <>
      <div className="flex justify-center sm:p-auto min-h-max p-4 pb-36">
        <div className="mt-10  space-y-8">
          <h1 className="font-bold text-xl text-black dark:text-zinc-300">
            {!isLoadingAuth ? messageForUser : 'Carregando...'}
          </h1>

          <div className="grid max-sm:grid-cols-2 max-md:grid-cols-3 md:mt-5 grid-cols-3 justify-items-center gap-4 w-max p-4">
            <CardPage
              image={CalendarImageIcon}
              label="Cronograma"
              link="/student/scheduled-tasks"
            />
            <CardPage
              image={EditalImageIcon}
              label="Edital"
              link="/student/subjects-list"
            />
            <CardPage
              image={PerformanceIcon}
              label="Desempenho"
              link="/student/performance-screen"
            />
            <CardPage
              image={ConfigIcon}
              label="Configurações"
              link="/student/settings"
            />
            <CardPage
              image={SimuladeImageIcon}
              label="Simulado"
              link="/student/simulations"
            />
            <CardPage
              image={HelpImageIcon}
              label="Suporte"
              link="/student/help"
            />
          </div>
        </div>
      </div>
    </>
  )
}
