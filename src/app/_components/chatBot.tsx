'use client'

import { Loader } from '@/app/_components/loader'
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTrigger,
  DrawerTitle,
  DrawerClose,
} from '@/app/_components/ui/drawer'
import { useAuth } from '@/app/hooks/useAuth'
import { useChat } from 'ai/react'
import { MessageCircleMore, X } from 'lucide-react'
import { useEffect, useRef } from 'react'

export function ChatBot() {
  const { messages, input, handleInputChange, handleSubmit, setMessages } =
    useChat()
  const { currentUser } = useAuth()

  const endOfMessagesRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMessages([
      {
        id: 'initial-ai-message',
        role: 'assistant',
        content: 'Olá eu sou a Xuxu, como posso te ajudar hoje?',
      },
    ])
  }, [setMessages])

  useEffect(() => {
    if (endOfMessagesRef.current) {
      endOfMessagesRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages])

  if (!currentUser || !currentUser.displayName) {
    return <Loader />
  }

  return (
    <Drawer direction="bottom">
      <DrawerTrigger
        title="Pergunte para a Xuxu sobre a sua dúvida!"
        className="fixed bottom-24 right-5 lg:bottom-10 lg:right-10"
      >
        <MessageCircleMore className="text-yellow-500 size-8" />
      </DrawerTrigger>

      <DrawerContent className="ml-auto w-[50%] max-sm:w-[100%] max-sm:h-[90%] max-md:w-[80%] xl:w-[40%] h-[100%] bg-blue-900 p-2">
        <DrawerHeader className="flex justify-between text-yellow-500">
          <div />
          <DrawerTitle hidden>Xuxu</DrawerTitle>
          <DrawerClose>
            <X className="size-5 text-white" />
          </DrawerClose>
          <DrawerDescription hidden>
            Chat em tempo real com a IA
          </DrawerDescription>
        </DrawerHeader>

        <div className="py-2 space-y-4 h-full overflow-auto pb-10 scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent">
          {messages.map((m) => (
            <div key={m.id} className="whitespace-pre-wrap">
              <p className="text-yellow-600">
                {m.role === 'user' ? `${currentUser.displayName}: ` : 'Xuxu: '}
              </p>
              {m.toolInvocations ? (
                <pre>{JSON.stringify(m.toolInvocations, null, 2)}</pre>
              ) : (
                <p>{m.content}</p>
              )}
            </div>
          ))}
          {/* Elemento vazio para o scroll */}
          <div ref={endOfMessagesRef} />
        </div>

        <DrawerFooter className="w-full p-0">
          <form onSubmit={handleSubmit} className="flex items-center gap-4">
            <input
              className="flex-1 bg-transparent border border-yellow-600 p-2 rounded-lg"
              value={input}
              placeholder="Digite sua mensagem..."
              onChange={handleInputChange}
            />
            <button className="bg-yellow-500 p-2 rounded-lg">Enviar</button>
          </form>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
