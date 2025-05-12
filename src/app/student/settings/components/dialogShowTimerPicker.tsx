'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import type { ReactNode } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'

import { ButtonFill } from '@/app/_components/buttonFill'
import { Radio } from '@/app/_components/radioGroup'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from '@/app/_components/ui/dialog'

interface DialogShowTimerPickerProps {
  triggerButton: ReactNode
  setTimerUserSelected: (timer: string) => void
}

const radioGroupSchema = z.object({
  timerSelected: z.string({ message: 'Escolha uma opção.' }),
})

type RadioGroupSchema = z.infer<typeof radioGroupSchema>

export function DialogShowTimerPicker({
  triggerButton,
  setTimerUserSelected,
}: DialogShowTimerPickerProps) {
  const { control, watch } = useForm<RadioGroupSchema>({
    resolver: zodResolver(radioGroupSchema),
    mode: 'onChange',
    defaultValues: {
      timerSelected: '',
    },
  })

  // Observar o valor selecionado
  const timerSelected = watch('timerSelected')

  // Atualiza o estado externo sempre que o valor muda
  const handleTimeChange = (value: string) => {
    setTimerUserSelected(value)
  }

  const items = [
    { value: '1:00', label: '1:00' },
    { value: '1:30', label: '1:30' },
    { value: '2:00', label: '2:00' },
    { value: '2:30', label: '2:30' },
    { value: '3:00', label: '3:00' },
    { value: '3:30', label: '3:30' },
    { value: '4:00', label: '4:00' },
    { value: '4:30', label: '4:30' },
    { value: '5:00', label: '5:00' },
    { value: '5:30', label: '5:30' },
    { value: '6:00', label: '6:00' },
    { value: '6:30', label: '6:30' },
  ]

  return (
    <Dialog>
      <DialogTrigger asChild>{triggerButton}</DialogTrigger>
      <DialogContent className="bg-blue-900 overflow-y-auto max-md:h-[calc(80%)] border-none rounded-3xl max-sm:w-full lg:w-1/4">
        <DialogTitle hidden>Horários</DialogTitle>
        <div className="space-y-4 flex flex-col items-center">
          <Controller
            name="timerSelected"
            control={control}
            render={({ field }) => (
              <Radio
                items={items}
                value={field.value}
                onChange={(value) => {
                  field.onChange(value) // Atualiza o valor no formulário
                  handleTimeChange(value) // Atualiza o estado externo
                }}
              />
            )}
          />

          <DialogFooter className="bottom-0 flex justify-between w-full gap-4 md:gap-10">
            <DialogClose asChild>
              <ButtonFill disabled={false} type="button" label="Cancelar" />
            </DialogClose>
            <DialogClose asChild>
              <ButtonFill
                disabled={!timerSelected}
                type="button"
                label="Selecionar"
              />
            </DialogClose>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  )
}
