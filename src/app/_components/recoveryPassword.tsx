import { ArrowLeft, Loader } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { useState } from 'react'
import { toast } from 'sonner'

interface RecoveryPasswordProps {
  setRecoverPassword: (value: boolean) => void
}

export function RecoveryPassword({
  setRecoverPassword,
}: RecoveryPasswordProps) {
  const [emailForRecover, setEmailForRecover] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { handleRecoverPassword } = useAuth()

  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <div className="flex flex-col justify-center items-center gap-16 lg:w-1/4 p-2">
        <div className="w-full flex justify-start">
          <button
            onClick={() => setRecoverPassword(false)}
            className="flex items-center gap-2 text-yellow-500"
          >
            <ArrowLeft className="size-5" />
            Voltar
          </button>
        </div>

        <p className="text-lg">
          Digite abaixo seu endereço de e-mail para que você receba as
          instruções de recuperação de senha.
        </p>

        <div className="w-full space-y-4">
          <input
            type="email"
            onChange={(e) => setEmailForRecover(e.target.value)}
            placeholder="Email"
            className="border border-zinc-400 bg-transparent w-full py-2 px-3 rounded text-zinc-300 placeholder:text-zinc-300"
          />
          <button
            disabled={isLoading}
            onClick={() => {
              setIsLoading(true)
              handleRecoverPassword(emailForRecover)
              setTimeout(() => {
                toast.success('Email enviado com sucesso!')
                setIsLoading(false)
                setRecoverPassword(false)
              }, 500)
            }}
            type="button"
            className="bg-yellow-500 flex justify-center items-center p-4 rounded-2xl w-full text-blue-900 font-bold text-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? <Loader className="size-5 animate-spin" /> : 'Enviar'}
          </button>
        </div>
      </div>
    </div>
  )
}
