import WhatsappSVG from '@/app/_components/icons/whatsapp'

import type { UserInfoProps } from 'course-info'
import { Mail } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from '@/app/_components/ui/select'
import { TitlePage } from '@/app/_components/titlePage'
import Link from 'next/link'
import type { ScheduleCourseProps } from 'schedule-course'

interface HeaderEditConfigurationProps {
  info: UserInfoProps | ScheduleCourseProps
  titlePage: string
  selectedCourse: string
  setSelectedCourse: (value: string) => void
}

export function HeaderEditConfiguration({
  info,
  titlePage,
  selectedCourse,
  setSelectedCourse,
}: HeaderEditConfigurationProps) {
  return (
    <header className="space-y-10">
      <TitlePage title={titlePage} className="text-2xl text-yellow-600" />

      <div className="flex justify-between">
        <div className="flex gap-2.5 items-center">
          <p className="text-xl">{info.name}</p>
          {info.phone && (
            <Link href={`https://wa.me/${info.phone}`} target="_blank">
              <WhatsappSVG className="size-4" />
            </Link>
          )}
          <Link
            href={`mailto:${info.email}`}
            className="hover:text-blue-600 transition-all"
            target="_blank"
          >
            <Mail className="size-4" />
          </Link>
        </div>

        <Select onValueChange={(value: string) => setSelectedCourse(value)}>
          <SelectTrigger className="w-max">{selectedCourse}</SelectTrigger>

          <SelectContent className="bg-blue-800 text-white">
            {info.courses.map((course) => (
              <SelectItem value={course.name} key={course.name}>
                {course.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </header>
  )
}
