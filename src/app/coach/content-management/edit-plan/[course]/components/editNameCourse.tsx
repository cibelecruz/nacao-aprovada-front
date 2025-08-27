import { Check, SquarePen } from 'lucide-react'
import { useState } from 'react'

interface EditNameCourseProps {
  name: string
  setName: (arg: string) => void
  className: string
}

export function EditNameCourse({
  name,
  setName,
  className,
}: EditNameCourseProps) {
  const [isEditing, setIsEditing] = useState(false)
  const nameSplit = name.split('-')
  const [institution, setInstitution] = useState(nameSplit[0])
  const [jobPosition, setJobPosition] = useState(nameSplit[1])

  function confirmRename() {
    const name = institution.concat('-', jobPosition)
    setName(name)
    setIsEditing(false)
  }

  return isEditing ? (
    <div className="flex gap-3">
      <input
        className={`bg-transparent text-black dark:text-white block border pl-2 border-yellow-500 rounded ${className}`}
        type="text"
        value={institution}
        onChange={(e) => {
          setInstitution(e.target.value)
        }}
      ></input>
      -
      <input
        className={`bg-transparent text-black dark:text-white block border pl-2 border-yellow-500 rounded ${className}`}
        type="text"
        value={jobPosition}
        onChange={(e) => {
          setJobPosition(e.target.value)
        }}
      ></input>
      <button
        className="text-yellow-500 hover:text-blue-400/60"
        onClick={() => confirmRename()}
      >
        <Check />
      </button>
    </div>
  ) : (
    <div className="flex gap-4">
      <h1 className={className}>{name}</h1>
      <button className="text-gray-200 {}" onClick={() => setIsEditing(true)}>
        <SquarePen size={17} />
      </button>
    </div>
  )
}
