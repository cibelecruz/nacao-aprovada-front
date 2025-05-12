import React from 'react'

interface Subject {
  subjectName: string
  questions: number
  correct: number
  incorrect: number
  progress: number
}

interface Props {
  subjects: Subject[]
  onEditClick: () => void
}

export function SubjectTable({ subjects, onEditClick }: Props) {
  return (
    <div className="p-6 bg-transparent flex flex-col justify-between h-full rounded-md text-white">
      <table className="w-full border-collapse text-left">
        <thead>
          <tr className="border-b border-gray-700">
            <th className="py-2 px-4 text-zinc-400 text-sm">ASSUNTOS</th>
            <th className="py-2 px-4 text-zinc-400 text-sm">QUESTÕES</th>
            <th className="py-2 px-4 text-zinc-400 text-sm">ACERTOS</th>
            <th className="py-2 px-4 text-zinc-400 text-sm">ERROS</th>
            <th className="py-2 px-4 text-zinc-400 text-sm">% ACERTO</th>
          </tr>
        </thead>
        <tbody>
          {subjects.map((subject, index) => {
            let correctPorcentage: string | number

            const result = (subject.correct / subject.questions) * 100

            if (isNaN(result)) {
              correctPorcentage = 0
            } else {
              correctPorcentage = result.toFixed(2)
            }
            return (
              <tr key={index} className="border-b border-gray-800">
                <td className="py-2 px-4">{subject.subjectName}</td>
                <td className="py-2 px-4">{subject.questions}</td>
                <td className="py-2 px-4">{subject.correct}</td>
                <td className="py-2 px-4">{subject.incorrect}</td>
                <td className="py-2 px-4">{correctPorcentage}%</td>
              </tr>
            )
          })}
        </tbody>
      </table>
      <div className="flex justify-end  mt-4">
        <button
          onClick={onEditClick}
          className="py-2 px-4  border border-gray-500 rounded hover:bg-gray-700"
        >
          Editar conteúdo
        </button>
      </div>
    </div>
  )
}
