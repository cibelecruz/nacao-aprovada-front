'use client'
import { useRouter } from 'next/navigation'

import { Button } from '@/app/_components/button'
import { Loader } from '@/app/_components/loader'
import { TitlePage } from '@/app/_components/titlePage'
import IconsCalendary from '@/assets/Icons_calendary.png'
import IconsCalendaryClock from '@/assets/Icons_calendary_clock.png'
import IconsClock from '@/assets/Icons_clock.png'
import { formatSecondsToTime } from '@/utils/formatSecondsToTimer'

import { GoalCard } from './components/goalCard'
import { useEffect, useState } from 'react'
import { api } from '@/lib/axios'
import { toast } from 'sonner'
import {
  Select,
  SelectContent,
  SelectTrigger,
} from '@/app/_components/ui/select'
import { SelectItem } from '@radix-ui/react-select'
import CancelButton from '@/app/_components/cancelButton'

interface StudyAvailabilityProps {
  friday: number
  monday: number
  saturday: number
  sunday: number
  thursday: number
  tuesday: number
  wednesday: number
}

export default function SettingsPage() {
  const [studyAvailability, setStudyAvailability] =
    useState<StudyAvailabilityProps>()
  const [preferredStartDate, setPreferredStartDate] = useState('')
  const [inputValue, setInputValue] = useState(preferredStartDate)
  const [isInputChanged, setIsInputChanged] = useState(false)
  const [frequency, setFrequency] = useState('')
  const router = useRouter()

  useEffect(() => {
    api.get('/users/current-user').then((response) => {
      setStudyAvailability(response.data.studyAvailability)
      setPreferredStartDate(response.data.preferedStartDate._value)
      setInputValue(response.data.preferedStartDate._value)
    })
  }, [])

  function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    setInputValue(event.target.value)
    setIsInputChanged(event.target.value !== preferredStartDate)
  }

  async function handleSaveNewPreferredStartDate() {
    const [year, month, day] = inputValue.split('-').map(Number)
    const selectedDate = new Date(year, month - 1, day)

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const selectedDateMidnight = new Date(selectedDate)
    selectedDateMidnight.setHours(0, 0, 0, 0)

    if (selectedDateMidnight < today) {
      return toast.error('A data de início deve ser hoje ou uma data futura.')
    }

    const { status } = await api.post('/users/set-preferred-start-date', {
      preferredStartDate: selectedDate,
    })

    if (status === 200) {
      setPreferredStartDate(inputValue)
      setIsInputChanged(false)
      toast.success('Data de início atualizada.')
    }
  }

  async function handleUpdateFrequency() {
    const { status } = await api.post('/users/set-frequency', {
      frequency,
    })

    if (status === 200) {
      toast.success('Frequência de e-mails atualizada.')
      setFrequency('')
    } else {
      toast.error('Erro ao atualizar a frequência.')
    }
  }

  if (!studyAvailability) {
    return <Loader />
  }

  const totalTimeInSeconds = Object.values(studyAvailability).reduce(
    (acc, time) => acc + time,
    0,
  )

  const activeDays = Object.values(studyAvailability).filter(
    (time) => time > 0,
  ).length

  const [, hourTotal, minutesTotal] =
    formatSecondsToTime(totalTimeInSeconds).split(':')

  const [, hour, minutes] = formatSecondsToTime(
    totalTimeInSeconds / activeDays,
  ).split(':')

  return (
    <div className="md:flex md:justify-center sm:p-auto min-h-max p-4 pb-36">
      <div className="mt-5 md:w-1/2 lg:w-3/5 md:space-y-8 max-sm:space-y-4">
        <TitlePage title="Configurações" className="text-yellow-600" />

        {/* Card Alterar Data de Início */}
        <div className="w-full border border-blue-400/60 bg-[#f6e6c1] dark:bg-blue-950/10 p-4 rounded-xl space-y-10">
          <div className="space-y-2">
            <h2 className="font-bold text-xl dark:text-white text-black">
              Alterar Data de Início
            </h2>
            <p className="dark:text-white text-black">
              Altere a data de início dos seus estudos aqui.
            </p>
          </div>

          <form className="space-y-4">
            <fieldset className="border rounded w-max border-blue-300 dark:border-blue-400/50">
              <legend className="text-sm text-blue-700 dark:text-blue-300">
                Data de Início
              </legend>
              <input
                type="date"
                value={inputValue}
                onChange={handleInputChange}
                className="
                  w-full px-3 py-2 rounded-md
                  border border-gray-300 text-gray-900 bg-white
                  placeholder:text-gray-500
                  focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none
                  dark:bg-zinc-900 dark:border-zinc-700 dark:text-gray-200
                  dark:placeholder:text-gray-500 dark:focus:border-blue-400 dark:focus:ring-blue-400
                "
                placeholder="Data de Início"
              />
            </fieldset>
            {isInputChanged && (
              <Button
                type="button"
                onClick={handleSaveNewPreferredStartDate}
                label="Salvar"
              />
            )}
          </form>
        </div>

        {/* Card Metas de Estudo */}
        <div className="rounded-xl p-4 space-y-7 border
                        bg-[#f6e6c1] border-blue-300
                        dark:bg-[#070E17] dark:border-blue-900/40">
          <div className="space-y-2">
            <h2 className="font-bold text-xl text-black dark:text-white">Metas de Estudo</h2>
            <p className="text-sm text-gray-800 dark:text-gray-300">
              Configure as suas metas semanais de estudo.
            </p>
          </div>

          <div className="flex justify-center gap-8">
            <GoalCard
              icon={IconsCalendary}
              goal={`${activeDays} dias`}
              label="Estudar"
            />
            <GoalCard
              icon={IconsClock}
              goal={`${hour}h${minutes.split('.')[0]}m`}
              label="Em média"
            />
            <GoalCard
              icon={IconsCalendaryClock}
              goal={`${hourTotal}h${minutesTotal}m`}
              label="Total"
            />
          </div>

          <CancelButton
            onClick={() =>
              router.push('/student/settings/edit-study-preferences')
            }
          >
            Editar Metas
          </CancelButton>
        </div>

        {/* Card Frequência de E-mails */}
        <div className="rounded-xl p-4 space-y-7 border
                        bg-[#f6e6c1] border-blue-300
                        dark:bg[#070E17] dark:bg-[#070E17] dark:border-blue-900/40">
          <div className="space-y-2">
            <h2 className="font-bold text-xl text-black dark:text-white">
              Escolha a Frequência dos E-mails
            </h2>
            <p className="text-sm text-gray-800 dark:text-gray-300">
              Defina a frequência dos e-mails sobre seu desempenho.
            </p>
          </div>

          <Select onValueChange={(value: string) => setFrequency(value)}>
            <SelectTrigger className="w-max rounded-md px-3 py-2 border
                                      bg-white text-gray-900 border-gray-300
                                      dark:bg-zinc-900 dark:text-gray-200 dark:border-zinc-700">
              {frequency === 'weekly'
                ? 'Semanalmente'
                : frequency === 'monthly'
                  ? 'Mensalmente'
                  : frequency === 'Bimonthly'
                    ? 'Bimestralmente'
                    : frequency === 'Semiannually'
                      ? 'Semestralmente'
                      : frequency === 'never'
                        ? 'Nunca'
                        : 'Escolha a frequência'}
            </SelectTrigger>

            <SelectContent className="font-normal text-base md:text-sm border
                                      bg-white text-slate-900 border-gray-200
                                      dark:bg-blue-800 dark:text-white dark:border-blue-700">
              <SelectItem value="weekly">Semanalmente</SelectItem>
              <SelectItem value="monthly">Mensalmente</SelectItem>
              <SelectItem value="Bimonthly">Bimestralmente</SelectItem>
              <SelectItem value="Semiannually">Semestralmente</SelectItem>
              <SelectItem value="never">Nunca</SelectItem>
            </SelectContent>
          </Select>

          {frequency && (
            <Button onClick={handleUpdateFrequency} label="Salvar" />
          )}
        </div>
      </div>
    </div>
  )
}