import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/app/_components/ui/dialog'
import { useAuth } from '@/app/context/authContext'
import SendEmail from '@/app/serverActions/sendEmail'
import { Mails, X } from 'lucide-react'
import { useRef, useState } from 'react'
import { toast } from 'sonner'

interface DialogEmailProps {
  emails: string[]
}
export function DialogEmail({ emails }: DialogEmailProps) {
  const { currentUser } = useAuth()

  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const [coachEmail, setCoachEmail] = useState<string>(
    (currentUser?.displayName as string) || '',
  )
  const [title, setTitle] = useState<string>('')
  const [description, setDescription] = useState<string>('')
  const [files, setFiles] = useState<File[]>([])

  const [isOpen, setIsOpen] = useState(false)

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files)
      setFiles((prevFiles) => [...prevFiles, ...newFiles])
    }
  }

  async function submitEmail() {
    if (!title || !description || !coachEmail || emails.length === 0) {
      toast.error('Preencha os campos')
    } else {
      setIsOpen(false)

      const payloader = {
        coachEmail,
        studentsEmail: [...new Set(emails)],
        title,
        description,
        files,
      }
      const resp = await SendEmail({ payloader })
      if (resp.length > 0) {
        toast.error(`Erro para enviar e-mail para:${resp}`)
      } else {
        toast.success('E-mail enviado com sucesso')
      }
      setTitle('')
      setDescription('')
      setFiles([])
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger
        title="Enviar email"
        className="bg-yellow-600 mb-1 hover:bg-yellow-500 p-2 h-max rounded-lg transition-all"
      >
        <Mails className="size-5 text-black" />
      </DialogTrigger>
      <DialogContent className="bg-[#050c16] border-none rounded-3xl w-max lg:w-2/4 h-[520px] overflow-y-scroll scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent scrollbar-thumb-rounded">
        <DialogHeader>
          <DialogTitle className="text-yellow-500 font-bold">
            Preencha os dado do e-mail
          </DialogTitle>
          <div className="space-y-5">
            <div className="flex flex-col gap-1">
              <label htmlFor="title">Seu nome:</label>
              <input
                value={coachEmail}
                onChange={(e) => setCoachEmail(e.target.value)}
                className="bg-transparent w-full border-b px-2 py-1 text-gray-300 focus:border-yellow-500 transition-all outline-none"
                placeholder="Seu email"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="title">Título:</label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="bg-transparent w-full border-b px-2 py-1 text-gray-300 focus:border-yellow-500 transition-all outline-none"
                placeholder="Título"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="description">Descrição:</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="bg-transparent w-full border rounded-lg px-2 py-1 text-gray-300 focus:border-yellow-500 transition-all outline-none scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent scrollbar-thumb-rounded"
                placeholder="Descrição"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="file_input">Arquivos:</label>
              <input
                id="file_input"
                type="file"
                className="hidden"
                multiple
                onChange={handleFileChange}
                ref={fileInputRef}
              />
              <button
                type="button"
                className="bg-yellow-600 rounded-lg hover:bg-yellow-600/55 transition-all"
                onClick={() => fileInputRef.current?.click()}
              >
                Adicionar
              </button>
            </div>
            {files.length > 0 &&
              files.map((file) => (
                <div key={file.name} className="flex items-center gap-3">
                  <p className="line-clamp-1 text-sm pl-1 text-gray-200">
                    {file.name}
                  </p>
                  <button
                    className="hover:text-red-600"
                    onClick={() =>
                      setFiles(files.filter((f) => f.name !== file.name))
                    }
                  >
                    <X size={22} />
                  </button>
                </div>
              ))}
          </div>
        </DialogHeader>
        <DialogFooter className="flex justify-between">
          <button
            onClick={() => setIsOpen(false)}
            className="border border-yellow-600 px-4 h-8 flex-1 rounded mt-4"
          >
            Cancelar
          </button>
          <button
            onClick={() => submitEmail()}
            className="bg-yellow-600 px-4 h-8 flex-1 rounded mt-4"
          >
            Confirmar
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
