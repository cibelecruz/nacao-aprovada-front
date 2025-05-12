'use client'

import { Button } from '@/app/_components/button'
import { useRouter } from 'next/navigation'
import { DialogDeleteSubjectCourse } from './dialogDeleteSubjectCourse'
import { Trash2 } from 'lucide-react'

interface MenuSubjectCourseProp {
  name: string
  route: string
  id: string
  isSubject: boolean
}

export function MenuSubjectCourse({
  name,
  route,
  id,
  isSubject,
}: MenuSubjectCourseProp) {
  const router = useRouter()

  return (
    <div className="flex justify-between items-center bg-blue-600/10 p-2 rounded-2xl">
      <h1>{name}</h1>
      <div className="flex gap-3">
        <DialogDeleteSubjectCourse
          route={false}
          name={name}
          id={id}
          className=""
          label={<Trash2 />}
          isSubject={isSubject}
        />
        <Button label="Editar" onClick={() => router.push(route)} />
      </div>
    </div>
  )
}
