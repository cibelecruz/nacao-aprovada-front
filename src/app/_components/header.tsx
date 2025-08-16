import { useTheme } from 'next-themes'
import { AvatarDropdown } from './avatarDropdown'
import { Button } from './ui/button'
import { ToggleThemeButton } from './toggleTheme'

interface HeaderProps {
  signOut: () => Promise<void>
  firstNameLetter: string
  lastNameLetter: string
  imageUrl?: string
  isStudent?: boolean
}

export function Header({
  signOut,
  firstNameLetter,
  lastNameLetter,
  imageUrl,
  isStudent = false,
}: HeaderProps) {
  return (
    <header className="fixed w-full z-50 md:px-5 pt-5 p-3 bg-blue-950 flex justify-between items-center">
      <div />
      <div className='flex gap-5'>
        <ToggleThemeButton />
        <AvatarDropdown
          imageUrl={imageUrl}
          firstNameLetter={firstNameLetter}
          lastNameLetter={lastNameLetter}
          signOut={signOut}
          isStudent={isStudent}
        />
      </div>
    </header>
  )
}
