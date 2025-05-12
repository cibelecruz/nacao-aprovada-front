'use client'

import { ArrowLeft } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { ButtonFill } from '@/app/_components/buttonFill'
import { TitlePage } from '@/app/_components/titlePage'
import { useAuth } from '@/app/hooks/useAuth'
import { api } from '@/lib/axios'

import { SwitchGoalOfStudy } from '../components/switchGoalOfStudy'

interface StudyAvailability {
  monday: number
  tuesday: number
  wednesday: number
  thursday: number
  friday: number
  saturday: number
  sunday: number
}

export default function EditStudyPreferencesPage() {
  const { studyAvailability } = useAuth()

  const [studyGoals, setStudyGoals] = useState<StudyAvailability>({
    monday: studyAvailability?.monday ?? 0,
    tuesday: studyAvailability?.tuesday ?? 0,
    wednesday: studyAvailability?.wednesday ?? 0,
    thursday: studyAvailability?.thursday ?? 0,
    friday: studyAvailability?.friday ?? 0,
    saturday: studyAvailability?.saturday ?? 0,
    sunday: studyAvailability?.sunday ?? 0,
  })

  const handleUpdateDay = (day: keyof StudyAvailability, value: number) => {
    setStudyGoals((prev) => ({
      ...prev,
      [day]: value,
    }))
  }

  const { handleSubmit } = useForm()

  async function handleSetNewGoal() {
    const { status } = await api.post('/users/set-study-availability', {
      studyAvailability: studyGoals,
    })

    if (status === 200) {
      toast.success('Meta atualizada.')
      window.sessionStorage.removeItem('studyAvailability')
      window.sessionStorage.setItem(
        'studyAvailability',
        JSON.stringify(studyGoals),
      )
      setTimeout(() => (window.location.href = '/student/settings'), 500)
    } else {
      toast.error('Erro ao atualizar a sua meta.')
    }
  }

  return (
    <div className="md:flex md:justify-center sm:p-auto min-h-max p-4 pb-36">
      <div className="bg-blue-900 mt-10 p-6 rounded-lg max-sm:w-full md:w-1/2 md:space-y-8 max-sm:space-y-4">
        <button
          onClick={() => window.history.back()}
          className="text-yellow-600"
        >
          <ArrowLeft />
        </button>
        <TitlePage title="Metas de Estudo" />
        <p className="text-sm">
          Selecione os dias da semana em que planeja estudar e defina a
          quantidade de tempo disponível para cada dia.
        </p>
        <form onSubmit={handleSubmit(handleSetNewGoal)} className="space-y-20">
          <div className="space-y-4">
            <SwitchGoalOfStudy
              label="Segunda-feira"
              initalTime={studyGoals.monday}
              dayOfWeek="monday"
              isActive={studyGoals.monday > 0}
              onUpdateDay={(value) => handleUpdateDay('monday', value)}
            />
            <SwitchGoalOfStudy
              label="Terça-feira"
              initalTime={studyGoals.tuesday}
              dayOfWeek="tuesday"
              isActive={studyGoals.tuesday > 0}
              onUpdateDay={(value) => handleUpdateDay('tuesday', value)}
            />
            <SwitchGoalOfStudy
              label="Quarta-feira"
              initalTime={studyGoals.wednesday}
              dayOfWeek="wednesday"
              isActive={studyGoals.wednesday > 0}
              onUpdateDay={(value) => handleUpdateDay('wednesday', value)}
            />
            <SwitchGoalOfStudy
              label="Quinta-feira"
              initalTime={studyGoals.thursday}
              dayOfWeek="thursday"
              isActive={studyGoals.thursday > 0}
              onUpdateDay={(value) => handleUpdateDay('thursday', value)}
            />
            <SwitchGoalOfStudy
              label="Sexta-feira"
              initalTime={studyGoals.friday}
              dayOfWeek="friday"
              isActive={studyGoals.friday > 0}
              onUpdateDay={(value) => handleUpdateDay('friday', value)}
            />
            <SwitchGoalOfStudy
              label="Sábado"
              initalTime={studyGoals.saturday}
              dayOfWeek="saturday"
              isActive={studyGoals.saturday > 0}
              onUpdateDay={(value) => handleUpdateDay('saturday', value)}
            />
            <SwitchGoalOfStudy
              label="Domingo"
              initalTime={studyGoals.sunday}
              dayOfWeek="sunday"
              isActive={studyGoals.sunday > 0}
              onUpdateDay={(value) => handleUpdateDay('sunday', value)}
            />
          </div>

          <div className="flex items-center">
            <ButtonFill
              disabled={false}
              label="Confirmar alterações"
              type="submit"
              rounded="rounded-lg"
              className="m-"
            />
          </div>
        </form>
      </div>
    </div>
  )
}
