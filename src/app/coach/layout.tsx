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
      icon: <List className="z-10 relative size-6" />,
      href: '/coach',
      title: 'Tabela de alunos',
    },
    {
      icon: <Settings className="z-10 relative size-6" />,
      href: '/coach/content-management',
      title: 'Gerenciamento de conteúdo',
    },

    {
      icon: <UserRoundPlus className="z-10 relative size-6" />,
      href: '/coach/student-registration',
      title: 'Cadastro de aluno',
    },
    {
      icon: <Bell className="z-10 relative size-6" />,
      href: '/coach/notifications-maneger',
      title: 'Gerenciamento de notificações',
    },
    {
      icon: <BookOpenText className="z-10 relative size-6" />,
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
