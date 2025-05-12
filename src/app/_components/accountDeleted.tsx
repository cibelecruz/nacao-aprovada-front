'use client'

import { AlertCircle, MessageCircle } from 'lucide-react'
import { Card, CardContent, CardFooter } from '@/app/_components/ui/card'

export function AccountDeleted() {
  const handleWhatsAppContact = () => {
    window.open(`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP}`, '_blank')
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-blue-900">
      <Card className="max-w-md w-full bg-blue-800 border-none">
        <CardContent className="pt-6 text-center space-y-4">
          <div className="flex justify-center">
            <div className="h-20 w-20 rounded-full bg-yellow-500/10 flex items-center justify-center">
              <AlertCircle className="h-10 w-10 text-yellow-500" />
            </div>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-50">
            Conta Deletada
          </h1>
          <p className="text-zinc-400">
            Sua conta foi removida do nosso sistema. Se você precisar de ajuda
            ou tiver alguma dúvida, entre em contato com nossa equipe de suporte
            via WhatsApp.
          </p>
        </CardContent>
        <CardFooter>
          <button
            className="w-full flex justify-center items-center gap-4 p-4 rounded-lg bg-green-800 hover:bg-green-700 text-zinc-50"
            onClick={handleWhatsAppContact}
          >
            <MessageCircle className="mr-2 h-5 w-5" />
            Contatar Suporte via WhatsApp
          </button>
        </CardFooter>
      </Card>
    </div>
  )
}
