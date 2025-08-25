'use client'
import '@/app/css/react-mde-all.css'

import { TitlePage } from '@/app/_components/titlePage'
import { ButtonFill } from '@/app/_components/buttonFill'

import ReactMde from 'react-mde'
import { Converter } from 'showdown'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from '@/app/hooks/use-toast'
import { toast as toastSonner } from 'sonner'
import { api } from '@/lib/axios'
import { useRouter } from 'next/navigation'
import { PageContainer } from '@/app/_components/pageContainer'
import { ContentContainer } from '@/app/_components/contentContainer'
import { ArrowLeft } from 'lucide-react'

const converter = new Converter({
  tables: true,
  simplifiedAutoLink: true,
  strikethrough: true,
  tasklists: true,
})

const formSchema = z.object({
  title: z.string().nonempty({ message: 'Por favor, insira um titulo.' }),
  videoUrl: z.string().nullable(),
})

type FormSchema = z.infer<typeof formSchema>

export default function HelpContentForm() {
  const [value, setValue] = useState('**Adicione o conteúdo da pagina aqui!!**')
  const [selectedTab, setSelectedTab] = useState<'write' | 'preview'>('write')

  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
  })

  async function handleCreateContent(data: FormSchema) {
    if (value === '**Adicione o conteúdo da pagina aqui!!**' || value === '') {
      return toast({
        title: 'Por favor, adicione o conteúdo da página.',
        description: 'Você não atualizou o conteúdo que vai ficar na pagina',
        className: 'bg-white dark:bg-blue-600/20 text-black dark:text-white',
        duration: 1500,
      })
    }

    const { status } = await api.post('/help-content', {
      title: data.title,
      videoUrl: data.videoUrl,
      content: value,
    })

    if (status === 201) {
      router.push('/coach/help-content')
    } else {
      toastSonner.error('Erro ao salvar o conteúdo, tente novamente.')
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
          title="Adicionar Novo Conteúdo de Ajuda"
        />

        <div className="w-full flex justify-center">
          <form
            onSubmit={handleSubmit(handleCreateContent)}
            className="w-full space-y-8"
          >
            <div className="flex flex-col space-y-2">
              <label
                htmlFor="title"
                className="font-medium text-black dark:text-white"
              >
                Titulo
              </label>
              <input
                {...register('title')}
                id="title"
                placeholder="Digite o titulo do conteúdo"
                className=" flex-grow px-3 py-2 bg-transparent border border-gray-800 rounded-md text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-yellow-600 focus:border-transparent"
              />
              {errors.title && (
                <p className="text-sm text-red-500">{errors.title.message}</p>
              )}
            </div>

            <div className="flex flex-col space-y-2">
              <label
                htmlFor="videoUrl"
                className="font-medium text-black dark:text-white"
              >
                Link do video
              </label>
              <input
                id="videoUrl"
                {...register('videoUrl')}
                type="url"
                onBlur={(event) => {
                  const inputElement = event.target as HTMLInputElement
                  const url = inputElement.value

                  const youtubeRegex =
                    /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})(\S+)?$/

                  if (url !== '' && !youtubeRegex.test(url)) {
                    inputElement.setCustomValidity(
                      'Por favor, insira um URL válido do YouTube.',
                    )
                  } else {
                    inputElement.setCustomValidity('')
                  }
                }}
                onInput={(event) => {
                  const inputElement = event.target as HTMLInputElement
                  inputElement.setCustomValidity('')
                }}
                placeholder="Cole a URL do video do YouTube"
                className=" flex-grow px-3 py-2 bg-transparent border border-gray-800 rounded-md text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-yellow-600 focus:border-transparent"
              />
              {errors.videoUrl && (
                <p className="text-sm text-red-500">
                  {errors.videoUrl.message}
                </p>
              )}
            </div>

            <div className="container bg-blue-800 rounded-xl dark:bg-transparent text-black">
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
                type="submit"
                className=" hover:bg-yellow-700 transition-all text-white"
              />
            </div>
          </form>
        </div>
      </ContentContainer>
    </PageContainer>
  )
}
