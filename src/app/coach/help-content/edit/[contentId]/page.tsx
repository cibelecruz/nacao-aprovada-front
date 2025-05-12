'use client'

import type { HelpContent } from '@/@types/help-content'
import { ButtonFill } from '@/app/_components/buttonFill'
import { Loader } from '@/app/_components/loader'
import { TitlePage } from '@/app/_components/titlePage'
import { api } from '@/lib/axios'
import { useRouter, useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import ReactMde from 'react-mde'
import { Converter } from 'showdown'
import 'react-mde/lib/styles/css/react-mde-all.css'
import { toast } from 'sonner'
import { PageContainer } from '@/app/_components/pageContainer'
import { ContentContainer } from '@/app/_components/contentContainer'
import { InputInfo } from '@/app/_components/inputInfo'
import { ArrowLeft } from 'lucide-react'

const converter = new Converter({
  tables: true,
  simplifiedAutoLink: true,
  strikethrough: true,
  tasklists: true,
})

export default function EditContentPage() {
  const { contentId } = useParams<{ contentId: string }>()
  const router = useRouter()

  const [value, setValue] = useState('**Adicione o conteúdo da pagina aqui!!**')
  const [selectedTab, setSelectedTab] = useState<'write' | 'preview'>('write')
  const [content, setContent] = useState<HelpContent>()
  const [title, setTitle] = useState('')
  const [videoUrl, setVideoUrl] = useState('')

  useEffect(() => {
    api.get(`/help-content/${contentId}`).then((response) => {
      setContent(response.data.helpContent)
      setValue(response.data.helpContent.content)
      setTitle(response.data.helpContent.title)
      setVideoUrl(response.data.helpContent.videoUrl)
    })
  }, [contentId])

  if (!content) return <Loader />

  async function handleSaveC0ntent() {
    if (!title || !value) return null

    const data = {
      title,
      content: value,
      videoUrl,
      id: content?.id,
    }

    const response = await api.put('/help-content', data)
    if (response.status === 200) {
      setTimeout(() => window.history.back(), 700)
    } else {
      toast.error('Conteúdo atualizado com sucesso!')
    }
  }

  return (
    <PageContainer>
      <button
        className="text-yellow-700 pt-5"
        onClick={() => router.push('..')}
      >
        <ArrowLeft size={30} />
      </button>
      <ContentContainer>
        <TitlePage
          className="text-yellow-600"
          title="Editar conteúdo de ajuda"
        />

        <div className="w-full flex justify-center">
          <div className="mt-4 w-full space-y-8">
            <InputInfo
              label="Titulo"
              value={title}
              onChange={(e) => setTitle(e)}
              type="text"
              placeholder="Digite o titulo do conteúdo"
            />

            <div className="flex flex-col space-y-2">
              <label htmlFor="videoUrl" className="font-medium text-white">
                Link do video
              </label>
              <input
                id="videoUrl"
                type="url"
                value={videoUrl}
                onBlur={(event) => {
                  const inputElement = event.target as HTMLInputElement
                  const url = inputElement.value

                  const youtubeRegex =
                    /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})(\S+)?$/
                  if (!url || youtubeRegex.test(url)) {
                    inputElement.setCustomValidity('')
                  } else {
                    inputElement.setCustomValidity(
                      'Por favor, insira um URL válido do YouTube.',
                    )
                  }
                }}
                onInput={(event) => {
                  const inputElement = event.target as HTMLInputElement
                  inputElement.setCustomValidity('')
                }}
                onChange={(event) => {
                  setVideoUrl(event.target.value)
                }}
                placeholder="Cole a URL do video do YouTube"
                className=" flex-grow px-3 py-2 bg-transparent border border-gray-800 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-yellow-600 focus:border-transparent"
              />
            </div>

            <div className="container text-black">
              <ReactMde
                value={value}
                onChange={setValue}
                selectedTab={selectedTab}
                onTabChange={setSelectedTab}
                generateMarkdownPreview={(markdown) =>
                  Promise.resolve(converter.makeHtml(markdown))
                }
              />
            </div>

            <div className="w-1/6 flex justify-center">
              <ButtonFill
                disabled={false}
                label="Salvar conteúdo"
                type="button"
                onClick={handleSaveC0ntent}
                className="w-full hover:bg-yellow-700 transition-all text-white"
              />
            </div>
          </div>
        </div>
      </ContentContainer>
    </PageContainer>
  )
}
