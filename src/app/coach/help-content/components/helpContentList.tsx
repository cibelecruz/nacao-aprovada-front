'use client'

import { useState } from 'react'

import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  PenSquareIcon,
  Trash2,
} from 'lucide-react'
import type { HelpContent } from '@/@types/help-content'
import Link from 'next/link'
import { NavigationButton } from '../../(home)/components/navigationButton'

interface HelpContentListProps {
  contents: HelpContent[]
  onEdit: (contentId: string) => void
  onDelete: (id: string) => Promise<void>
}

export function HelpContentList({
  contents,
  onEdit,
  onDelete,
}: HelpContentListProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [viewpage, setViewPage] = useState(0)

  async function handleDelete(id: string) {
    setDeletingId(id)
    try {
      await onDelete(id)
    } catch (error) {
      console.error('Error deleting content:', error)
    } finally {
      setDeletingId(null)
    }
  }

  const page = Math.ceil(contents.length / 10)
  const indexInit = 10 * viewpage
  const indexLast = Math.min(indexInit + 10, contents.length)
  const contentsPage = contents.slice(indexInit, indexLast)

  return (
    <div className="w-full max-h-full mt-5 rounded-lg border border-blue-400/60">
      <table className="min-w-full text-left">
        <thead className="text-gray-500 text-sm">
          <tr>
            <th className="p-2 py-3 w-2/12">Título</th>
            <th className="w-2/12">Conteúdo</th>
            <th className="w-2/12">Video</th>
            <th className="w-2/12">Editar</th>
            <th className="w-1/12">Deletar</th>
          </tr>
        </thead>
        <tbody>
          {contentsPage.map(function (content) {
            return (
              <tr
                key={content.id}
                className="text-sm border-y border-y-blue-400/60"
              >
                <td className="p-1">{content.title}</td>
                <td className="p-1 max-w-xs overflow-hidden whitespace-nowrap text-ellipsis">
                  {content.content}
                </td>
                <td className="p-1">
                  <Link
                    className="hover:underline"
                    target="_blank"
                    href={content.videoUrl!}
                  >
                    {content.videoUrl}
                  </Link>
                </td>
                <td className="p-1">
                  <button onClick={() => onEdit(content.id)}>
                    <PenSquareIcon className="size-5 text-zinc-300 hover:text-white transition-all" />
                  </button>
                </td>
                <td className="">
                  <button
                    disabled={deletingId === content.id}
                    onClick={() => handleDelete(content.id)}
                  >
                    <Trash2 className="size-5 text-red-500 hover:text-red-400 transition-all" />
                  </button>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>

      <div className="flex mt-7 px-2 pb-2 w-full justify-between items-end">
        <p className="text-sm text-gray-500 pb-3">
          {contents.length} conteúdo(s) criados
        </p>

        <div className="flex items-center text-gray-300 gap-2">
          <p>Linhas por páginas {10}</p>

          <p className="px-5">
            Página {viewpage + 1} de {page}
          </p>

          <div className="flex items-center gap-2">
            <NavigationButton
              disabled={viewpage === 0}
              onClick={() => setViewPage(0)}
              icon={<ChevronsLeft />}
            />

            <NavigationButton
              disabled={viewpage === 0}
              onClick={() => setViewPage(viewpage - 1)}
              icon={<ChevronLeft />}
            />

            <NavigationButton
              disabled={viewpage + 1 === page}
              onClick={() => setViewPage(viewpage + 1)}
              icon={<ChevronRight />}
            />

            <NavigationButton
              disabled={viewpage + 1 === page}
              onClick={() => setViewPage(page - 1)}
              icon={<ChevronsRight />}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
