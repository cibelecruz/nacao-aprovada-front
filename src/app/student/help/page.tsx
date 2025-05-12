'use client'

import { useState, useEffect } from 'react'

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@/app/_components/ui/card'
import type { HelpContent } from '@/@types/help-content'
import { TitlePage } from '@/app/_components/titlePage'
import { api } from '@/lib/axios'
import { CardHelpContent } from './components/cardHelpContent'

export default function HelpPage() {
  const [helpContent, setHelpContent] = useState<HelpContent[]>([])
  const [search, setSearch] = useState('')

  useEffect(() => {
    api.get('/help-content').then((response) => {
      setHelpContent(response.data.helpContent)
    })
  }, [])

  const filteredContent = helpContent.filter((content) =>
    content.title.toLowerCase().includes(search.toLowerCase()),
  )

  return (
    <div className="md:flex md:justify-center sm:p-auto min-h-max p-4 pb-36 overflow-y-scroll scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent active:scrollbar-thumb-yellow-600">
      <div className="max-sm:w-full md:w-1/2 lg:pl-10 lg:w-3/5 mt-7 lg:mt-0 space-y-10">
        <TitlePage title="Central de Ajuda" className="text-yellow-600" />
        <Card className="bg-blue-900 border-none space-y-4">
          <CardHeader className="space-y-4">
            <CardTitle className="text-2xl font-bold text-white">
              Perguntas Frequentes
            </CardTitle>

            <div>
              <input
                type="text"
                placeholder="Pesquisar conteúdo pelo título"
                className="bg-transparent border w-full p-2 text-white border-yellow-600 focus:border-yellow-500 focus:shadow-lg outline-none rounded-lg"
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </CardHeader>
          <CardContent className="flex max-md:justify-center gap-4 flex-wrap">
            {filteredContent.length === 0 && (
              <div className="w-full text-center">
                <p className="text-yellow-600">Nenhum conteúdo encontrado</p>
              </div>
            )}
            {filteredContent.map((content) => (
              <CardHelpContent
                id={content.id}
                title={content.title}
                key={content.id}
              />
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
