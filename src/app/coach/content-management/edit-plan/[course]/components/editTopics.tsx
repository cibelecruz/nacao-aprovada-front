import { Switch } from '@/app/_components/ui/switch'
import { topicProps } from '../page'
import { DropDownRelevance } from './dropDownRelevance'
import { useEffect, useState } from 'react'
import { api } from '@/lib/axios'
import { toast } from 'sonner'

export function EditTopics({
  topic,
  idCourse,
}: {
  topic: topicProps
  idCourse: string
}) {
  const [topicRelevance, setTopicRelevance] = useState(topic.relevance)
  const [topicIsActive, setTopicIsActive] = useState(topic.active)

  useEffect(() => {
    if (topicIsActive !== topic.active || topicRelevance !== topic.relevance) {
      const postTopic = {
        active: topicIsActive,
        id: idCourse,
        idTopic: topic.id,
        relevance: topicRelevance,
      }

      api
        .put('/courses/topic', postTopic)
        .then(() => toast.success('Alteração salva com sucesso'))
        .catch(() => toast.error('Erro ao slavar alterações'))
    }
  }, [topicIsActive, topicRelevance, idCourse, topic])

  return (
    <div
      className="flex justify-between rounded-xl hover:bg-[#f8dda5] dark:hover:bg-gray-700 py-2 px-1"
      key={topic.id}
    >
      <div className="flex items-center gap-2">
        <Switch
          defaultChecked={topicIsActive}
          onCheckedChange={(value) => setTopicIsActive(value)}
        />
        <p className="text-black dark:text-white">{topic.name}</p>
      </div>
      <DropDownRelevance
        relevance={topicRelevance}
        setRelevance={setTopicRelevance}
      />
    </div>
  )
}
