'use client'

import { useParams, useRouter } from 'next/navigation'
import { SubjectProps } from '../../page'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { api } from '@/lib/axios'

import { ArrowLeft, Trash2 } from 'lucide-react'

import { Button } from '@/app/_components/button'
import { TopicTbodyList } from './components/topicTbodylist'

import { Loader } from '@/app/_components/loader'
import {
  DialogHeader,
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogClose,
  DialogFooter,
} from '@/app/_components/ui/dialog'
import { toast } from 'sonner'
import { compareArrayValues, GenericObject } from '@/utils/compareArrayValues'
import { EditableText } from '@/app/_components/editableText'
import { DialogDeleteSubjectCourse } from '../../components/dialogDeleteSubjectCourse'
import { PageContainer } from '@/app/_components/pageContainer'
import { ContentContainer } from '@/app/_components/contentContainer'
import { createUuidV4 } from '@/app/serverActions/createUuidV4'
import ConfirmButton from '@/app/_components/confirmButton'
import CancelButton from '@/app/_components/cancelButton'

export interface topicProps {
  active: boolean
  id: string
  name: string
  taskTypes: string[]
}

export default function EditSubjects() {
  const params = useParams()
  const router = useRouter()
  const [loader, setLoader] = useState(true)

  const [subject, setSubject] = useState<SubjectProps>({
    _id: '',
    name: '',
    topics: [],
    createdAt: '',
    updatedAt: '',
    deleted: false,
  })
  const [newTopicName, setNewTopicName] = useState('')
  const [topics, setTopics] = useState<topicProps[]>([])

  const [subjectName, setSubjectName] = useState(subject.name)
  const [newSubjectName, setNewSubjectName] = useState(subject.name)

  const [buttonIsDisabled, setButtonIsDisabled] = useState(false)

  useEffect(() => {
    setLoader(true)
    api.get(`/subjects/${String(params.subject)}`).then((response) => {
      setLoader(false)
      setSubject(response.data)
      setSubjectName(response.data.name)
      setNewSubjectName(response.data.name)

      if (response.data) {
        setTopics(response.data.topics)
      }
    })
  }, [params])

  const creatPostTopic = useCallback((topic: topicProps, isDelete: boolean) => {
    setTopics((prevTopics) => {
      const existingIndex = prevTopics.findIndex((t) => t.id === topic.id)

      if (existingIndex !== -1) {
        if (isDelete) {
          return prevTopics.filter((_, index) => index !== existingIndex)
        }

        const updatedTopics = [...prevTopics]
        updatedTopics[existingIndex] = topic
        return updatedTopics
      } else {
        return [topic, ...prevTopics]
      }
    })
  }, [])

  async function addTopic() {
    if (newTopicName === '') toast.error('Preencha um nome para o tópico')
    else {
      const { uuid } = await createUuidV4()
      const newTopic = {
        active: true,
        id: uuid,
        name: newTopicName,
        taskTypes: ['study', 'lawStudy', 'exercise', 'review'],
      }
      creatPostTopic(newTopic, false)
    }
  }

  const dataPost = useMemo(
    () => ({
      subjectId: String(params.subject),
      topics,
    }),
    [params.subject, topics],
  )

  useEffect(() => {
    const topicsChange = compareArrayValues(
      dataPost.topics as unknown as GenericObject[],
      subject.topics,
    )

    if (topicsChange && newSubjectName === subjectName) {
      setButtonIsDisabled(true)
    } else {
      setButtonIsDisabled(false)
    }
  }, [
    dataPost.topics,
    subject.topics,
    subjectName,
    newSubjectName,
    params.subject,
  ])

  function post() {
    api
      .post('/subjects/register-subject-customizations', dataPost)
      .then(() => {
        toast.success('Tópicos salvos com sucesso')
      })
      .catch((e) => toast.error(`Erro ao salvar tópicos: ${e}`))

    if (subjectName !== newSubjectName) {
      setSubjectName(newSubjectName)
      api
        .patch(`/subjects/${String(params.subject)}`, { name: newSubjectName })
        .then((r) => {
          if (r.status !== 200 && r.status !== 204)
            toast.error(`${r.status} Erro ao editar nome: ${r.statusText}`)
          toast.success('Nome da disciplina editado com sucesso')
        })
        .catch(() => toast.error('Erro ao editar nome da disciplina'))
    }
  }

  return loader ? (
    <Loader />
  ) : (
    <PageContainer>
      <button className="text-yellow-700 pt-5" onClick={() => router.back()}>
        <ArrowLeft size={30} />
      </button>

      <ContentContainer>
        <div className="flex items-center gap-4">
          <EditableText
            text={newSubjectName}
            setText={setNewSubjectName}
            className="-7 text-lg font-bold text-black dark:text-white"
          />

          <DialogDeleteSubjectCourse
            id={String(params.subject)}
            name={newSubjectName}
            label={<Trash2 className="text-red-500 hover:text-red-700" />}
            className="px-2 h-8 rounded ml-2 transition-all"
            route={true}
            isSubject={true}
          />
        </div>

        <div>
          <input
            className="bg-transparent border border-yellow-500 rounded-2xl text-gray-300 h-9 w-4/12 mr-5 pl-4 mt-8 hover:border-yellow-400 hover:shadow hover:shadow-yellow-600 transition-all"
            placeholder="Nome do tópico"
            type="text"
            value={newTopicName}
            onChange={(e) => setNewTopicName(e.target.value)}
          />
          <Button label="Adicionar Tópico" onClick={() => addTopic()} />
        </div>
        <table className="mt-5 w-full dark:text-white text-black">
          <thead className="text-left justify-between">
            <tr>
              <th className="sr-only w-3/6">None</th>
              <th className="w-1/12">Tudo</th>
              <th className="w-1/12">Teoria</th>
              <th className="w-1/12">Questões</th>
              <th className="w-1/12">Revisões</th>
              <th className="w-1/12">Letra da Lei</th>
            </tr>
          </thead>

          <tbody>
            {topics.map((topics) => {
              return (
                <TopicTbodyList
                  key={topics.id}
                  topic={topics}
                  onUpdate={creatPostTopic}
                />
              )
            })}
          </tbody>
        </table>
        <div className="flex items-end mt-4">
          <Dialog>
            <DialogTrigger asChild>
              <ConfirmButton
                disabled={buttonIsDisabled}
                className="disabled:opacity-30 disabled:cursor-no-drop"
              >
                Salvar
              </ConfirmButton>
            </DialogTrigger>
            <DialogContent className="bg-white dark:bg-[#050c16] text-black dark:text-white border-none rounded-3xl w-max lg:w-1/4">
              <DialogHeader>
                <DialogTitle>Desejar salvar alterações?</DialogTitle>
              </DialogHeader>
              <DialogFooter className="flex">
                <DialogClose asChild>
                  <CancelButton className="w-32 mt-4">Cancelar</CancelButton>
                </DialogClose>
                <DialogClose asChild>
                  <ConfirmButton onClick={() => post()} className="w-32 mt-4 text-white">
                    Salvar
                  </ConfirmButton>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </ContentContainer>
    </PageContainer>
  )
}
