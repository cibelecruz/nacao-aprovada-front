'use client'

import { useCallback, useEffect, useState } from 'react'

import type { HelpContent } from '@/@types/help-content'
import { TitlePage } from '@/app/_components/titlePage'
import { api } from '@/lib/axios'
import { PageContainer } from '@/app/_components/pageContainer'
import { ContentContainer } from '@/app/_components/contentContainer'
import { useRouter } from 'next/navigation'
import '@/app/css/react-mde-all.css'
import Link from 'next/link'
import { Trash2, Youtube } from 'lucide-react'
import { NavigationTable } from '@/app/_components/navigationTable'
import ConfirmButton from '@/app/_components/confirmButton'

interface items {
  key: string
  check?: boolean
  [key: string]: React.ReactNode
}

export default function HelpManager() {
  const [tableContents, setTableContents] = useState<items[]>([])

  const router = useRouter()

  const handleDelete = useCallback(
    async (id: string) => {
      try {
        await api.delete(`/help-content/${id}`)
        setTableContents((prevContents) =>
          prevContents.filter((content) => content.key !== id),
        )
      } catch (error) {
        console.error('Error deleting content:', error)
      }
    },
    [setTableContents],
  )
  async function handleUpdateIaAccess(id: string, checked: boolean) {
    const update = tableContents.map((item) =>
      item.key === id ? { ...item, check: checked } : item,
    )

    setTableContents(update)
    api.patch(`/help-content/toggle-access`, { id, checked })
  }

  useEffect(() => {
    api.get('/help-content').then((response) => {
      const resp = response.data.helpContent as HelpContent[]

      const tableContents = resp.map((content) => {
        return {
          key: content.id,
          check: content.iaAccess,
          title: content.title,
          content: content.content
            .replace(/[*_~`]/g, '')
            .replace(/^#+\s/gm, '')
            .replace(/^- /gm, '')
            .replace(/!\[.*?\]\(.*?\)/g, '')
            .replace(/\[.*?\]\(.*?\)/g, '')
            .trim(),
          videoURL: content.videoUrl ? (
            <Link
              className="hover:text-zinc-400 transition-all"
              target="_blank"
              href={content.videoUrl}
              title={content.videoUrl}
              onClick={(e) => e.stopPropagation()}
            >
              <Youtube />
            </Link>
          ) : null,
          actions: (
            <button
              onClick={(e) => {
                e.stopPropagation()
                handleDelete(content.id)
              }}
            >
              <Trash2 className="size-5 text-red-500 hover:text-red-400 transition-all" />
            </button>
          ),
        }
      })
      setTableContents(tableContents)
    })
  }, [handleDelete])

  return (
    <PageContainer>
      <ContentContainer>
        <div className="w-full flex items-center justify-between">
          <TitlePage
            title="Gerenciar conteúdo de ajuda"
            className="text-yellow-600"
          />
          <ConfirmButton onClick={() => router.push('/coach/help-content/add')}>
            Adicionar conteúdo
          </ConfirmButton>
        </div>

        <NavigationTable
          header={['check', 'Título', 'Conteúdo', 'Vídeo', 'actions']}
          items={tableContents}
          link="/coach/help-content/edit/"
          label="Conteúdo(s) criados"
          setCheckedItem={handleUpdateIaAccess}
        />
      </ContentContainer>
    </PageContainer>
  )
}
