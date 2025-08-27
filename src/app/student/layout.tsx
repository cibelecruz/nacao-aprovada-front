'use client'

import {
  BookOpenText,
  Calendar,
  ChartNoAxesColumn,
  FileText,
  Folder,
  LayoutPanelLeft,
  Settings,
} from 'lucide-react'

import { Header } from '../_components/header'
import Sidebar from '../_components/sidebar'
import { useAuth } from '../hooks/useAuth'
import { Loader } from '../_components/loader'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { NotificationProvider } from '../context/notificationContext'
import NotificationManager from '../_components/notificationManeger'

import { Inter, Roboto } from 'next/font/google'
import { CourseSelected } from '../context/coursesSelect'
import { ChatBot } from '../_components/chatBot'
import { AccountDeleted } from '../_components/accountDeleted'

const inter = Inter({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-inter',
})

const roboto = Roboto({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-roboto',
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { signOut, currentUser, role, isAuthenticated, imageUrl } = useAuth()
  const router = useRouter()
  const [userDeleted, setUserDeleted] = useState(false)

  useEffect(() => {
    if (currentUser) {
      currentUser.getIdTokenResult().then((idTokenResult) => {
        if (idTokenResult.claims.deleted === true) {
          setUserDeleted(true)
        }
      })
    }
  }, [currentUser])

  useEffect(() => {
    if (isAuthenticated && role === 'coach') {
      router.push('/coach')
    }
  }, [role, isAuthenticated, router])

  const studentButtons = [
    {
      icon: <LayoutPanelLeft className="z-10 relative size-6 dark:text-white text-black" />,
      href: '/student',
      title: 'Menu',
    },
    {
      icon: <Calendar className="z-10 relative size-6  dark:text-white text-black " />,
      href: '/student/scheduled-tasks',
      title: 'Cronograma',
    },
    {
      icon: <Settings className="z-10 relative size-6 dark:text-white text-black" />,
      href: '/student/settings',
      title: 'Configurações',
    },
    {
      icon: <ChartNoAxesColumn className="z-10 relative size-6 dark:text-white text-black" />,
      href: '/student/performance-screen',
      title: 'Desempenho',
    },
    {
      icon: <Folder className="z-10 relative size-6 dark:text-white text-black" />,
      href: '/student/subjects-list',
      title: 'Edital',
    },
    {
      icon: <FileText className="z-10 relative size-6 dark:text-white text-black" />,
      href: '/student/simulations',
      title: 'Simulados',
    },
    {
      icon: <BookOpenText className="z-10 relative size-6 dark:text-white text-black" />,
      href: '/student/help',
      title: 'Central de Ajuda',
    },
  ]

  if (!currentUser || !currentUser.displayName) {
    return <Loader />
  }

  if (userDeleted) {
    return <AccountDeleted />
  }

  const firstNameLetter = currentUser?.displayName.split(' ')[0].split('')[0]
  const lastNameLetter = currentUser?.displayName.split(' ')[1]?.split('')[0]

  return (
    <div
      className={
        (roboto.className,
        inter.className,
        'w-screen min-h-screen h-max dark:bg-blue-950 bg-[#f9ebd4] antialiased text-zinc-50 overflow-hidden')
      }
    >
      <CourseSelected>
        <NotificationProvider>
          <NotificationManager />
          <Header
            imageUrl={imageUrl}
            firstNameLetter={firstNameLetter}
            lastNameLetter={lastNameLetter}
            signOut={signOut}
            isStudent={true}
          />
          <Sidebar
            firstNameLetter={firstNameLetter}
            lastNameLetter={lastNameLetter}
            signOut={signOut}
            buttons={studentButtons}
          />
          <div className="md:pt-24 max-sm:pt-10 md:pl-24 md:pr-5 pb-3">
            {children}
            <ChatBot />
          </div>
        </NotificationProvider>
      </CourseSelected>
    </div>
  )
}
