'use client'

import { useState, useRef } from 'react'
import { UploadCloud, X } from 'lucide-react'
import { toast } from 'sonner'

import { api } from '@/lib/axios'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog'
import Image from 'next/image'

export function DialogUploadProfileImage() {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result as string)
      }
      reader.readAsDataURL(selectedFile)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile) {
      setFile(droppedFile)
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result as string)
      }
      reader.readAsDataURL(droppedFile)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  async function handleSaveImage() {
    if (!file) return

    try {
      setIsUploading(true)
      const formData = new FormData()
      formData.append('file', file)

      const response = await api.post('/users/upload-image', formData)

      switch (response.status) {
        case 200:
          toast.success('Avatar salvo com sucesso.')
          setTimeout(() => window.location.reload(), 500)
          break

        case 415:
          toast.error(
            'O formato do arquivo não é suportado. Envie um arquivo no formato correto, como JPEG ou PNG.',
          )
          break

        default:
          toast.error('Erro ao salvar o avatar.')
      }
    } catch (error) {
      toast.error('Erro ao fazer upload da imagem.')
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <Dialog>
      <DialogTrigger onClick={(e) => e.stopPropagation()} className="text-sm">
        Alterar avatar
      </DialogTrigger>
      <DialogContent
        onClick={(e) => e.stopPropagation()}
        className="bg-[#050c16] space-y-6 border-yellow-600/40 sm:max-w-md"
      >
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            Alterar avatar
          </DialogTitle>
        </DialogHeader>

        <div
          className={`
            mt-4 grid place-items-center gap-6 rounded-lg border-2 border-dashed p-6 transition-colors
            ${preview ? 'border-yellow-600/20' : 'border-yellow-600/40'}
          `}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          {preview ? (
            <div className="relative aspect-square w-32 overflow-hidden rounded-full">
              <Image
                src={preview || '/placeholder.svg'}
                alt="Preview"
                className="h-full w-full object-cover"
              />
              <button
                onClick={() => {
                  setFile(null)
                  setPreview(null)
                }}
                className="absolute right-0 top-0 rounded-full bg-[#050c16] p-1 text-yellow-500 shadow-sm hover:text-yellow-400"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div className="grid place-items-center gap-2 text-yellow-500/70">
              <UploadCloud className="h-8 w-8" />
              <p className="text-sm">
                Arraste uma imagem ou clique para escolher
              </p>
            </div>
          )}
          <input
            ref={inputRef}
            id="file_input"
            type="file"
            accept=".png, .jpg, .jpeg"
            className="hidden"
            onChange={handleFileChange}
          />
          <button
            onClick={() => inputRef.current?.click()}
            className="w-full rounded-lg border border-yellow-600/40 bg-yellow-600/10 px-4 py-2 text-sm text-yellow-500 hover:bg-yellow-600/20"
          >
            Escolher arquivo
          </button>

          {isUploading && (
            <div className="w-full text-center">
              <p>Salvando...</p>
            </div>
          )}
        </div>

        {file && (
          <div className="flex gap-4">
            <DialogClose asChild>
              <button
                type="button"
                className="flex-1 rounded-2xl border border-transparent px-4 py-2 text-sm hover:border-yellow-500 transition-all disabled:opacity-50"
                disabled={isUploading}
              >
                Cancelar
              </button>
            </DialogClose>
            <button
              onClick={handleSaveImage}
              disabled={isUploading}
              className="flex-1 rounded-2xl border border-transparent bg-yellow-600 px-4 py-2 text-sm hover:bg-yellow-500 transition-all disabled:opacity-50"
            >
              {isUploading ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
