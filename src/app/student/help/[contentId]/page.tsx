'use client'

import type { HelpContent } from '@/@types/help-content'
import { Card, CardContent, CardHeader } from '@/app/_components/ui/card'
import { Loader } from '@/app/_components/loader'
import { TitlePage } from '@/app/_components/titlePage'
import { api } from '@/lib/axios'
import { ArrowLeft } from 'lucide-react'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

export default function HelpContentPage() {
  const { contentId } = useParams<{ contentId: string }>()
  const [content, setContent] = useState<HelpContent>()

  useEffect(() => {
    api.get(`/help-content/${contentId}`).then((response) => {
      setContent(response.data.helpContent)
    })
  }, [contentId])

  if (!content) return <Loader />

  return (
    <div className="md:flex md:justify-center sm:p-auto min-h-max p-4 pb-36 overflow-y-scroll scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent active:scrollbar-thumb-yellow-600">
      <div className="max-sm:w-full md:w-1/2 lg:pl-10 lg:w-3/5 mt-7 lg:mt-0 space-y-10">
        <button onClick={() => window.history.back()}>
          <ArrowLeft className="text-yellow-600" />
        </button>
        <div className="flex justify-center w-full">
          <Card className="bg-[#070E17] text-white max-md:w-full max-md:p-0 lg:px-8 rounded-2xl border-none space-y-4">
            <CardHeader>
              <TitlePage
                title={content.title}
                className="text-yellow-600 text-center"
              />
            </CardHeader>
            <CardContent className="prose prose-invert text-white max-w-none">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {content.content}
              </ReactMarkdown>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
