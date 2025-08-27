import { Mail, ArrowDown, ArrowRight, ArrowUp } from 'lucide-react'

import WhatsappSVG from '../../../_components/icons/whatsapp'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../_components/ui/select'

import { UserProps } from '../page'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Checkbox } from '@/app/_components/ui/checkbox'

interface UserTBodyListProps {
  user: UserProps
  expected: string
  checkedUsers: string[]
  checkUserConf: (id: string, checked: boolean) => void
}

export function UserTBodyList({
  user,
  expected,
  checkedUsers,
  checkUserConf,
}: UserTBodyListProps) {
  const [course, setCourse] = useState(Object.keys(user.courses)[0])

  const Viewexpected = user.expectedWorkload[expected]
  const ViewWorkload = user.completedWorkload[expected]
  const progress =
    Viewexpected > ViewWorkload
      ? Math.round((1 - ViewWorkload / Viewexpected) * 100)
      : 0

  const isUserChecked = checkedUsers.includes(user.id)
  const handleWhatsappClick = (phone: string) => {
    const whatsappUrl = `https://wa.me/${phone}`
    window.open(whatsappUrl, '_blank')
  }

  const handleEmailClick = (email: string) => {
    const mailtoUrl = `mailto:${email}`
    window.open(mailtoUrl, '_blank')
  }

  const router = useRouter()

  return (
    <tr
      onClick={() => router.push(`/coach/student-profile/${user.id}`)}
      className="hover:bg-zinc-300 hover:dark:bg-slate-700 text-base text-black dark:text-white border-y border-y-blue-400/60 cursor-pointer"
    >
      <td className="w-[2%] px-1" onClick={(e) => e.stopPropagation()}>
        <Checkbox
          checked={isUserChecked}
          className="data-[state=checked]:bg-green-500 data-[state=checked]:border-transparent border-yellow-500"
          onClick={(e) => e.stopPropagation()}
          onCheckedChange={() => checkUserConf(user.id, !isUserChecked)}
        />
      </td>
      <td className="p-1 w-2/12">{user.name}</td>
      <td className="w-2/12">
        {Object.keys(user.courses).length > 1 ? (
          <Select
            defaultValue={Object.keys(user.courses)[0]}
            onValueChange={(value) => {
              setCourse(value)
            }}
          >
            <SelectTrigger className="bg-transparent w-52 border-none p-0 pr-3 text-gray-200 text-base">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-blue-800 text-white border-none">
              {Object.keys(user.courses).map((courseName) => (
                <SelectItem key={courseName} value={courseName}>
                  {courseName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : (
          <p>{Object.keys(user.courses)[0]}</p>
        )}
      </td>

      <td className="w-1/5">{user.cpf}</td>
      <td className="w-1/5">
        {user.courses[course]?.expirationDate
          ? user.courses[course].expirationDate
          : ''}
      </td>
      <td className="W-1/5">{user.lastAccess}</td>
      <td className="w-[8%]">
        {Number.isInteger(Viewexpected)
          ? Viewexpected
          : Viewexpected.toFixed(2)}{' '}
        h
      </td>
      <td className="w-[8%]]">
        <p
          className={
            progress <= 40
              ? ' text-green-500 flex items-center'
              : progress > 40 && progress <= 60
                ? 'text-yellow-500 flex items-center'
                : 'text-red-500 flex items-center'
          }
        >
          {progress <= 40 ? (
            <ArrowDown size={15} />
          ) : progress > 40 && progress <= 60 ? (
            <ArrowRight size={15} />
          ) : (
            <ArrowUp size={15} />
          )}
          {ViewWorkload} h / {progress}%
        </p>
      </td>
      <td
        className="flex items-center justify-center gap-5 m-1"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="text-2xl flex items-center justify-center hover:text-green-400"
          onClick={(e) => {
            e.stopPropagation()
            handleWhatsappClick(user.phone || '')
          }}
        >
          <WhatsappSVG
            color="#38c24d"
            colorHover="#20e83e"
            className="z-10 relative w-5"
          />
        </button>
        <button
          className="text-2xl flex items-center justify-center text-black dark:text-blue-600"
          onClick={(e) => {
            e.stopPropagation()
            handleEmailClick(user.email)
          }}
        >
          <Mail />
        </button>
      </td>
    </tr>
  )
}
