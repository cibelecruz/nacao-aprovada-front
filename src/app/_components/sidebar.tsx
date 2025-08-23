'use client'

import { usePathname, useRouter } from 'next/navigation'
import type { ReactNode } from 'react'
import { LogoSVG } from './icons/logo'

interface SidebarButton {
  icon: ReactNode
  href: string
  isExternalLink?: boolean
  title: string
}

interface SidebarProps {
  buttons: SidebarButton[]
  firstNameLetter: string
  lastNameLetter: string
  signOut: () => Promise<void>
}

export default function Sidebar({
  buttons,
  firstNameLetter,
  signOut,
  lastNameLetter,
}: SidebarProps) {
  return (
    <>
      <SidebarMobile
        buttons={buttons}
        signOut={signOut}
        firstNameLetter={firstNameLetter}
        lastNameLetter={lastNameLetter}
      />
      <SidebarDesktop
        buttons={buttons}
        signOut={signOut}
        firstNameLetter={firstNameLetter}
        lastNameLetter={lastNameLetter}
      />
    </>
  )
}

function SidebarDesktop({ buttons }: SidebarProps) {
  const router = useRouter()
  const pathname = usePathname()
  return (
    <div className="max-md:hidden z-50 space-y-10 pt-6 h-screen rounded-r-lg fixed bg-white border-r border-zinc-100 dark:border-transparent dark:bg-[#070E17] w-20 flex flex-col items-center justify-start p-3">
      <LogoSVG />

      <div className="flex flex-col items-center gap-2">
        {buttons.map((button, index) => {
          let isActive: boolean

          if (button.href === '/coach' || button.href === '/student') {
            if (
              pathname.startsWith('/coach/student-profile') ||
              pathname.startsWith('/coach/edit-configuration')
            ) {
              isActive = true
            } else {
              isActive = pathname === button.href
            }
          } else {
            isActive = pathname.startsWith(button.href)
          }

          return (
            <button
              key={index}
              onClick={() => {
                if (button.isExternalLink) {
                  window.open(button.href, '_blank')
                } else {
                  router.push(button.href)
                }
              }}
              className={`relative group hover:text-black hover:dark:text-white p-2 ${isActive ? 'bg-yellow-600 rounded-lg text-black' : 'hover:text-white'} transition-all`}
              title={button.title}
            >
              <span className="absolute inset-0 bg-yellow-600/60 backdrop-blur-sm rounded-lg opacity-0 group-hover:opacity-100 transition-all"></span>
              {button.icon}
            </button>
          )
        })}
      </div>
    </div>
  )
}

function SidebarMobile({ buttons }: SidebarProps) {
  const router = useRouter()
  const pathname = usePathname()
  return (
    <>
      <div className="md:hidden w-screen fixed bg-[#050c16] bottom-0 pb-3 z-50">
        <div className="flex justify-between w-full p-2">
          {buttons.map((button, index) => {
            const isActive = pathname === button.href
            return (
              <button
                key={index}
                onClick={() => {
                  if (button.isExternalLink) {
                    window.open(button.href, '_blank')
                  } else {
                    router.push(button.href)
                  }
                }}
                className={`relative group hover:text-white p-2 ${isActive ? 'bg-yellow-600/60 rounded-lg' : 'hover:text-white'} transition-all 2`}
              >
                <span className="absolute inset-0 bg-yellow-600/60 backdrop-blur-sm rounded-lg opacity-0 group-hover:opacity-100 transition-all"></span>
                {button.icon}
              </button>
            )
          })}
        </div>
      </div>
    </>
  )
}
