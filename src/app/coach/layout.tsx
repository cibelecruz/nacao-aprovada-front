'use client'

import { BookOpenText, List, Settings, UserRoundPlus, Bell } from 'lucide-react'

import { Header } from '../_components/header'
import Sidebar from '../_components/sidebar'
import { useAuth } from '../hooks/useAuth'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Loader } from '../_components/loader'
import { Inter, Roboto } from 'next/font/google'

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
  const { signOut, role, isAuthenticated, currentUser, imageUrl } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (isAuthenticated && role === 'student') {
      router.push('/student')
    }
  }, [role, isAuthenticated, router])

  const studentButtons = [
    {
<<<<<<< HEAD
      icon: (
        <List className="z-10 relative size-6 text-black dark:text-white" />
      ),
=======
      icon: <List className="z-10 relative size-6 text-black dark:text-white" />,
>>>>>>> 76d27db67be57b96513a92ac4cb4b0d29bca574c
      href: '/coach',
      title: 'Tabela de alunos',
    },
    {
<<<<<<< HEAD
      icon: (
        <Settings className="z-10 relative size-6 text-black dark:text-white" />
      ),
=======
      icon: <Settings className="z-10 relative size-6 text-black dark:text-white" />,
>>>>>>> 76d27db67be57b96513a92ac4cb4b0d29bca574c
      href: '/coach/content-management',
      title: 'Gerenciamento de conteúdo',
    },

    {
<<<<<<< HEAD
      icon: (
        <UserRoundPlus className="z-10 relative size-6 text-black dark:text-white" />
      ),
=======
      icon: <UserRoundPlus className="z-10 relative size-6 text-black dark:text-white" />,
>>>>>>> 76d27db67be57b96513a92ac4cb4b0d29bca574c
      href: '/coach/student-registration',
      title: 'Cadastro de aluno',
    },
    {
<<<<<<< HEAD
      icon: (
        <Bell className="z-10 relative size-6 text-black dark:text-white" />
      ),
=======
      icon: <Bell className="z-10 relative size-6 text-black dark:text-white" />,
>>>>>>> 76d27db67be57b96513a92ac4cb4b0d29bca574c
      href: '/coach/notifications-maneger',
      title: 'Gerenciamento de notificações',
    },
    {
<<<<<<< HEAD
      icon: (
        <BookOpenText className="z-10 relative size-6 text-black dark:text-white" />
      ),
=======
      icon: <BookOpenText className="z-10 relative size-6 text-black dark:text-white" />,
>>>>>>> 76d27db67be57b96513a92ac4cb4b0d29bca574c
      href: '/coach/help-content',
      title: 'Gerenciar conteúdo de ajuda',
    },
  ]

  if (!currentUser || !currentUser.displayName) {
    return <Loader />
  }

  const firstNameLetter = currentUser?.displayName.split(' ')[0].split('')[0]
  const lastNameLetter = currentUser?.displayName.split(' ')[1].split('')[0]

  return (
    <div
      className={
        (roboto.className,
        inter.className,
        `w-full h-full antialiased bg-transparent text-zinc-50`)
      }
    >
      <Header
        imageUrl={imageUrl}
        firstNameLetter={firstNameLetter}
        lastNameLetter={lastNameLetter}
        signOut={signOut}
      />
      <Sidebar
        firstNameLetter={firstNameLetter}
        lastNameLetter={lastNameLetter}
        signOut={signOut}
        buttons={studentButtons}
      />
      <div className="flex justify-center pt-16">{children}</div>
    </div>
  )
}
