'use client'

import { FirebaseError } from 'firebase/app'
import { Eye, EyeClosed } from 'lucide-react'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

import logo from '@/assets/logo_cibele.png'
import { FIREBASE_ERRORS } from '@/lib/firebase'

import { useAuth } from '@/app/hooks/useAuth'
import { RecoveryPassword } from './_components/recoveryPassword'

const loginFormSchema = z.object({
  email: z.string().email(),
  password: z.string().min(5),
})

type LoginFormSchema = z.infer<typeof loginFormSchema>

export default function Home() {
  const { register, handleSubmit } = useForm<LoginFormSchema>()
  const [showPassword, setShowPassword] = useState(false)
  const [recoverPassword, setRecoverPassword] = useState(false)

  const { loginWithEmailAndPassword, role } = useAuth()

  async function handleLoginUser({ email, password }: LoginFormSchema) {
    try {
      await loginWithEmailAndPassword(email, password)
    } catch (error: unknown) {
      if (error instanceof FirebaseError) {
        if (!(error.code in FIREBASE_ERRORS)) {
          toast.error(
            'Um erro inesperado aconteceu. Entre em contato com o Administrador do sistema.',
          )
        } else {
          toast.error(
            FIREBASE_ERRORS[error.code as keyof typeof FIREBASE_ERRORS],
          )
        }
      } else {
        toast.error(
          'Erro desconhecido. Verifique sua conexão ou tente novamente mais tarde.',
        )
      }
    }
  }

  useEffect(() => {
    if (role) {
      window.location.href = `/${role}`
    }
  }, [role])

  if (recoverPassword) {
    return <RecoveryPassword setRecoverPassword={setRecoverPassword} />
  }

  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <div className="flex flex-col justify-center items-center gap-16 max-w-sm">
        <div>
          <Image
            className="w-96 h-max"
            width={384}
            height={384}
            priority
            src={logo}
            alt="CIBELE CRUZ"
          />
        </div>

        <form onSubmit={handleSubmit(handleLoginUser)} className="space-y-4">
          <input
            type="email"
            autoComplete="new-email"
            {...register('email')}
            placeholder="Email"
            className="border border-zinc-400 bg-transparent w-full py-2 px-3 rounded text-zinc-300 placeholder:text-zinc-300"
          />

          <div className="flex items-center justify-between border border-zinc-400 bg-transparent w-full py-2 px-3 rounded text-zinc-300">
            <input
              autoComplete="new-password"
              {...register('password')}
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              className="focus:bg-transparent active:bg-transparent bg-transparent outline-none placeholder:text-zinc-300"
            />

            <button
              onClick={() => setShowPassword(!showPassword)}
              type="button"
              className="bg-transparent"
            >
              {showPassword ? <Eye /> : <EyeClosed />}
            </button>
          </div>

          <div className="w-full flex flex-col gap-4 text-right">
            <button
              type="button"
              onClick={() => setRecoverPassword(true)}
              className="text-blue-400 font-semibold text-sm hover:underline"
            >
              Primeiro acesso?
            </button>
            <button
              type="button"
              onClick={() => setRecoverPassword(true)}
              className="text-blue-400 font-semibold text-sm hover:underline"
            >
              Esqueceu a senha?
            </button>
          </div>

          <button
            type="submit"
            className="w-full bg-yellow-600 hover:bg-yellow-700 rounded-[5px] text-black font-bold py-2"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  )
}
