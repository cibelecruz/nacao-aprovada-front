'use client'

import { Switch } from '@/app/_components/ui/switch'
import { Checkbox } from '@/app/_components/ui/checkbox'
import { useEffect, useMemo, useState } from 'react'
import { Trash2 } from 'lucide-react'

import { topicProps } from '../page'
import { EditableText } from '@/app/_components/editableText'

export interface topicTbodyListProps {
  topic: {
    name: string
    id?: string
    active: boolean
    taskTypes: string[]
  }
  onUpdate: (arg: topicProps, isDelete: boolean) => void
}

export function TopicTbodyList({ topic, onUpdate }: topicTbodyListProps) {
  const [disabledtopic, setDisabledTopic] = useState(topic.active)

  const task = topic.taskTypes
  const [study, setStudy] = useState(task.includes('study'))
  const [lawStudy, setLawStudy] = useState(task.includes('lawStudy'))
  const [exercise, setExercise] = useState(task.includes('exercise'))
  const [review, setReview] = useState(task.includes('review'))
  const [checkedAll, setCheckedAll] = useState(task.length === 4)

  const [topicName, setTopicName] = useState(topic.name)

  const postTasktype = []
  if (study) postTasktype.unshift('study')
  if (lawStudy) postTasktype.unshift('lawStudy')
  if (exercise) postTasktype.unshift('exercise')
  if (review) postTasktype.unshift('review')

  const postTopic = useMemo(() => {
    const postTasktype = []
    if (study) postTasktype.unshift('study')
    if (lawStudy) postTasktype.unshift('lawStudy')
    if (exercise) postTasktype.unshift('exercise')
    if (review) postTasktype.unshift('review')

    return {
      active: disabledtopic,
      id: topic.id,
      name: topicName,
      taskTypes: postTasktype,
    }
  }, [study, lawStudy, exercise, review, topicName, topic.id, disabledtopic])

  useEffect(() => {
    if (study && lawStudy && exercise && review) {
      setCheckedAll(true)
    } else {
      setCheckedAll(false)
    }
  }, [study, lawStudy, exercise, review])
  useEffect(() => {
    onUpdate({ ...postTopic, id: postTopic.id || '' }, false)
  }, [onUpdate, postTopic])

  function setAllCheckedBox(boolean: boolean) {
    setStudy(boolean)
    setLawStudy(boolean)
    setExercise(boolean)
    setReview(boolean)
  }

  function checkedAllConf() {
    setCheckedAll(!checkedAll)
    if (!checkedAll) {
      setAllCheckedBox(true)
    } else {
      setAllCheckedBox(false)
    }
  }

  return (
    <tr
      data-active={topic.active}
      className="rounded hover:bg-gray-700 data-[active=false]:opacity-30 transition-all"
    >
      <td className="flex items-center gap-3 p-3">
        <Switch
          defaultChecked={disabledtopic}
          onCheckedChange={(value) => setDisabledTopic(value)}
        />
        <EditableText
          text={topicName}
          setText={setTopicName}
          className="text-base w-full line-clamp-1"
        />
      </td>
      <td>
        <Checkbox
          onCheckedChange={checkedAllConf}
          checked={checkedAll}
          disabled={!disabledtopic}
          className="size-5 bg-gray-700 border-gray-400 data-[state=checked]:bg-yellow-600 data-[state=checked]:border-yellow-600"
        />
      </td>
      <td>
        <Checkbox
          onCheckedChange={() => setStudy(!study)}
          checked={study}
          disabled={!disabledtopic}
          className="size-5 bg-gray-700 border-gray-400 data-[state=checked]:bg-yellow-600 data-[state=checked]:border-yellow-600"
        />
      </td>
      <td>
        <Checkbox
          onCheckedChange={() => setExercise(!exercise)}
          checked={exercise}
          disabled={!disabledtopic}
          className="size-5 bg-gray-700 border-gray-400 data-[state=checked]:bg-yellow-600 data-[state=checked]:border-yellow-600"
        />
      </td>
      <td>
        <Checkbox
          onCheckedChange={() => setReview(!review)}
          checked={review}
          disabled={!disabledtopic}
          className="size-5 bg-gray-700 border-gray-400 data-[state=checked]:bg-yellow-600 data-[state=checked]:border-yellow-600"
        />
      </td>
      <td>
        <Checkbox
          onCheckedChange={() => setLawStudy(!lawStudy)}
          checked={lawStudy}
          disabled={!disabledtopic}
          className="size-5 bg-gray-700 border-gray-400 data-[state=checked]:bg-yellow-600 data-[state=checked]:border-yellow-600"
        />
      </td>
      <td className="flex gap-2">
        <button
          onClick={() =>
            onUpdate({ ...postTopic, id: postTopic.id || '' }, true)
          }
          className="text-red-500 hover:text-red-700"
        >
          <Trash2 className="size-6" />
        </button>
      </td>
    </tr>
  )
}
