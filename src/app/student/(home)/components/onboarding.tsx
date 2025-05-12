'use client'

import { type ChangeEvent, useMemo, useState } from 'react'

import { ButtonFill } from '@/app/_components/buttonFill'
import { useAuth } from '@/app/hooks/useAuth'
import { api } from '@/lib/axios'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

const formSchema = z.object({
  age: z.coerce.number(),
  jobPosition: z.string().nullable().optional(),
  name: z.string(),
  phone: z
    .string()
    .nullable()
    .optional()
    .refine(
      (val) => {
        if (!val) {
          return true
        }
        return val.length === 11
      },
      {
        message: 'O número precisa ter exatamente 11 caracteres',
      },
    ),
})

type FormSchema = z.infer<typeof formSchema>

export function Onboarding() {
  const [isEmployed, setIsEmployed] = useState<'yes' | 'no'>('no')

  const { currentUser, setOnboardingIsCompleted } = useAuth()

  const {
    handleSubmit,
    register,
    formState: { errors },
    setValue,
  } = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
  })

  function handleRadioChange(event: ChangeEvent<HTMLInputElement>) {
    if (event.target.value === 'yes') {
      setIsEmployed(event.target.value)
    }

    if (event.target.value === 'no') {
      setValue('jobPosition', null)
    }
  }

  async function handleSubmitForm(formData: FormSchema) {
    const data = {
      age: formData.age,
      jobPosition: isEmployed === 'yes' ? formData.jobPosition : null, // Força null se não empregado
      name: formData.name || currentUser?.displayName,
      phone: formData.phone ?? null,
    }

    const { status } = await api.put('/users/info', data)

    if (status === 200) {
      window.sessionStorage.setItem(
        'onboardingIsCompleted',
        JSON.stringify(true),
      )
      api.post('/users/complete-onboarding')

      setOnboardingIsCompleted(true)
    }
  }

  const showInputJobPosition = useMemo(() => isEmployed === 'yes', [isEmployed])

  return (
    <div className="md:flex md:justify-center sm:p-auto min-h-max p-4 pb-36">
      <div className="mt-10 max-sm:w-full md:w-1/2 md:space-y-8 max-sm:space-y-4">
        <h1>
          Bem-vindo(a), <br />
          <strong>{currentUser?.displayName}</strong>
        </h1>

        <p className="text-xs">
          Vou te ajudar a organizar os seus estudos, mas para isso vou precisar
          conhecer um pouquinho mais sobre você!
        </p>

        <form
          onSubmit={handleSubmit(handleSubmitForm)}
          className="w-full space-y-4"
        >
          <fieldset className="border p-1 border-zinc-400 rounded w-full">
            <legend className="text-sm text-zinc-300 font-bold">Nome</legend>
            <input
              type="text"
              {...register('name')}
              defaultValue={currentUser?.displayName ?? ''}
              className="bg-transparent w-full p-1 outline-none text-zinc-300 placeholder:text-zinc-300"
              placeholder="Nome"
            />
          </fieldset>
          {errors.name && (
            <p className="text-xs text-red-500">{errors.name.message}</p>
          )}

          <fieldset className="border p-1 border-zinc-400 rounded w-full">
            <legend className="text-sm font-bold text-zinc-300">Idade</legend>
            <input
              type="number"
              required
              {...register('age')}
              className="bg-transparent w-full p-1 outline-none text-zinc-300 placeholder:text-zinc-300"
              placeholder="Idade"
            />
          </fieldset>
          {errors.age && (
            <p className="text-xs text-red-500">{errors.age.message}</p>
          )}

          <fieldset className="border p-1 border-zinc-400 rounded w-full">
            <legend className="text-sm font-bold text-zinc-300">
              Telefone
            </legend>
            <input
              type="tel"
              {...register('phone')}
              className="bg-transparent w-full p-1 outline-none text-zinc-300 placeholder:text-zinc-300"
              placeholder="Telefone"
            />
          </fieldset>
          {errors.phone && (
            <p className="text-xs text-red-500">{errors.phone.message}</p>
          )}

          <div>
            <p className="font-bold text-lg">Você está empregado atualmente?</p>
            <div className="mt-2">
              <label className="inline-flex items-center mr-4">
                <input
                  type="radio"
                  name="employee"
                  value="yes"
                  onChange={handleRadioChange}
                  className="form-radio text-blue-500"
                />
                <span className="ml-2">Sim</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="employee"
                  value="no"
                  onChange={handleRadioChange}
                  className="form-radio text-blue-500"
                />
                <span className="ml-2">Não</span>
              </label>
            </div>
          </div>

          {showInputJobPosition ? (
            <fieldset className="border p-1 border-zinc-400 rounded w-full">
              <input
                {...register('jobPosition')}
                type="text"
                className="bg-transparent w-full p-1 outline-none text-zinc-300 placeholder:text-zinc-400"
                placeholder="Qual sua profissão?"
              />

              {errors.jobPosition && (
                <p className="text-xs text-red-500">
                  {errors.jobPosition.message}
                </p>
              )}
            </fieldset>
          ) : null}

          <ButtonFill label="Próximo" type="submit" disabled={false} />
        </form>
      </div>
    </div>
  )
}
