'use client'

import { useFieldArray, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Plus, Minus, ArrowLeft } from 'lucide-react'
import { z } from 'zod'
import { TitlePage } from '@/app/_components/titlePage'
import { toast } from 'sonner'
import dayjs from '@/lib/dayjs'
import { api } from '@/lib/axios'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Loader } from '@/app/_components/loader'
import ConfirmButton from '@/app/_components/confirmButton'

const subjectSchema = z
  .object({
    name: z.string().min(1, 'Nome da matéria é obrigatório'),
    totalQuestions: z.string().min(1, 'Total de questões é obrigatório'),
    correctQuestions: z.string().min(1, 'Número de acertos é obrigatório'),
  })
  .refine(
    (data) => {
      const total = parseInt(data.totalQuestions, 10)
      const correct = parseInt(data.correctQuestions, 10)
      return correct <= total
    },
    {
      message:
        'O número de acertos não pode ser maior que o total de questões.',
      path: ['correctAnswers'],
    },
  )

const formSchema = z.object({
  date: z
    .string()
    .min(1, 'Data é obrigatória')
    .refine((date) => {
      const selectedDate = new Date(date)
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      return selectedDate <= today
    }, 'A data não pode ser posterior a hoje'),
  name: z.string().min(1, 'Nome do simulado é obrigatório'),
  subjects: z.array(subjectSchema).min(1, 'Adicione pelo menos uma matéria'),
})

type FormSchema = z.infer<typeof formSchema>

interface SubjectListProps {
  subjectName: string
  subjectId: string
}

interface SubjectProps {
  id: string
  name: string
  totalQuestions: number
  correctQuestions: number
}

export default function EditExam() {
  const [isLoading, setIsLoading] = useState(true)
  const [subjectList, setSubjectList] = useState<SubjectListProps[]>([])
  const { simulationId } = useParams<{ simulationId: string }>()
  const router = useRouter()

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
  })

  const { fields, prepend, remove } = useFieldArray({
    control,
    name: 'subjects',
  })

  useEffect(() => {
    setIsLoading(true)
    // 1. Primeiro carrega a lista de matérias
    api
      .get('/users/fetch-subjects')
      .then((response) => {
        setSubjectList(response.data.subjects)

        return api.get(`/simulations/${simulationId}`)
      })
      .then((response) => {
        const simulation = response.data.simulation
        reset({
          name: simulation.name,
          date: dayjs(simulation.date).format('YYYY-MM-DD'),
          subjects: simulation.subjects.map((subject: SubjectProps) => ({
            name: subject.name,
            totalQuestions: subject.totalQuestions.toString(),
            correctQuestions: subject.correctQuestions.toString(),
          })),
        })
      })
      .finally(() => setIsLoading(false))
  }, [simulationId, reset, router])

  async function onSubmit(data: FormSchema) {
    const payload = {
      id: simulationId,
      ...data,
    }
    const response = await api.put(`/simulations/update`, payload)
    if (response.status === 200) {
      toast.success('Simulado atualizado')
      setTimeout(() => window.history.back())
    } else {
      toast.error('Erro ao atualizar o simulado')
    }
  }

  function addSubject() {
    prepend({ name: '', totalQuestions: '', correctQuestions: '' })
  }

  function removeSubject(index: number) {
    if (fields.length > 1) {
      remove(index)
    }
  }

  if (isLoading) {
    return <Loader />
  }

  return (
    <div className="md:flex md:justify-center sm:p-auto min-h-max p-4 pb-36 overflow-y-scroll scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent active:scrollbar-thumb-yellow-600">
      <div className="max-sm:w-full md:w-1/2 lg:w-3/5 mt-7 lg:mt-0 p-4 rounded-lg space-y-10 bg-blue-900">
        <div className="space-y-2">
          <button
            title="voltar"
            onClick={() => router.push('/student/simulations')}
          >
            <ArrowLeft className="size-5 text-yellow-600" />
          </button>
          <TitlePage title="Editar Simulado" className="text-yellow-600" />
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="max-w-4xl space-y-6 text-base"
        >
          <div className="space-y-2">
            <label htmlFor="name">Nome do Simulado</label>
            <input
              type="text"
              placeholder="Enem"
              id="name"
              {...register('name')}
              className="bg-transparent w-full border border-gray-700 rounded-md p-2"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="date">Data do Simulado</label>
            <input
              type="date"
              id="date"
              {...register('date')}
              className="bg-transparent w-full border border-gray-700 rounded-md p-2"
            />
            {errors.date && (
              <p className="text-red-500 text-sm mt-1">{errors.date.message}</p>
            )}
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label>Matérias</label>
              <ConfirmButton
                onClick={addSubject}
                className="flex items-center text-black"
              >
                <Plus className="w-4 h-4 mr-1" />
                Adicionar Matéria
              </ConfirmButton>
            </div>

            {errors.subjects && (
              <p className="text-red-500 text-sm">{errors.subjects.message}</p>
            )}

            {fields.map((field, index) => (
              <div
                key={field.id}
                className="grid grid-cols-1 md:grid-cols-[2fr,1fr,1fr,auto] gap-4 p-4 rounded-lg border border-gray-700 items-center"
              >
                <div>
                  <select
                    {...register(`subjects.${index}.name`)}
                    className="w-full px-1 py-2 rounded-lg bg-blue-800 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-600 focus:border-transparent text-white"
                  >
                    <option value="">Selecione uma matéria</option>
                    {subjectList.map((subject) => (
                      <option
                        key={subject.subjectId}
                        value={subject.subjectName}
                      >
                        {subject.subjectName}
                      </option>
                    ))}
                  </select>
                  {errors.subjects?.[index]?.name && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.subjects[index]?.name?.message}
                    </p>
                  )}
                </div>
                <div>
                  <input
                    type="number"
                    placeholder="Total de questões"
                    {...register(`subjects.${index}.totalQuestions`)}
                    min="0"
                    className="w-full px-4 py-2 rounded-lg bg-blue-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-600 focus:border-transparent text-white md:placeholder:text-xs md:px-2"
                  />
                  {errors.subjects?.[index]?.totalQuestions && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.subjects[index]?.totalQuestions?.message}
                    </p>
                  )}
                </div>
                <div>
                  <input
                    type="number"
                    placeholder="Questões corretas"
                    {...register(`subjects.${index}.correctQuestions`)}
                    min="0"
                    className="w-full px-4 py-2 rounded-lg bg-blue-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-600 focus:border-transparent text-white md:placeholder:text-xs md:px-2"
                  />
                  {errors.subjects?.[index]?.correctQuestions && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.subjects[index]?.correctQuestions?.message}
                    </p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => removeSubject(index)}
                  className="inline-flex items-center justify-center w-8 h-8 rounded-md bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors max-md:w-full"
                  disabled={fields.length === 1}
                >
                  <Minus className="w-4 h-4 max-md:hidden" />
                  <p className="md:hidden">Excluir</p>
                </button>
              </div>
            ))}
          </div>

          <ConfirmButton
            type="submit"
            className="max-md:w-full text-black font-bold"
          >
            Atualizar Simulado
          </ConfirmButton>
        </form>
      </div>
    </div>
  )
}
