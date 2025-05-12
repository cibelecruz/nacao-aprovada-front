import { AccordionContent } from '@/app/_components/ui/accordion'
import { Checkbox } from '@/app/_components/ui/checkbox'
import { Switch } from '@/app/_components/ui/switch'
import type { Topic } from 'schedule-course'

interface StudyScheduleManagerProps {
  topics: Topic[]
  onTopicChange: (updatedTopic: Topic) => void
}

export function StudyScheduleManager({
  topics,
  onTopicChange,
}: StudyScheduleManagerProps) {
  function handleCheckboxChange(topic: Topic, field: keyof Topic) {
    onTopicChange({ ...topic, [field]: !topic[field] })
  }

  function handleSwitchChange(topic: Topic, value: boolean) {
    onTopicChange({ ...topic, enabled: value })
  }

  return (
    <AccordionContent className="bg-blue-900 p-4 rounded-b-2xl">
      <table className="w-full">
        <thead className="text-left">
          <tr>
            <th className="w-3/5">Tópicos</th>
            <th className="w-1/12">Teoria</th>
            <th className="w-1/12">Questões</th>
            <th className="w-1/12">Revisões</th>
            <th className="w-1/12">Letra da Lei</th>
            <th className="w-1/12 sr-only">Ativo</th>
          </tr>
        </thead>

        <tbody>
          {topics.map((topic) => (
            <tr key={topic.id}>
              <td className="p-2">{topic.name}</td>
              <td className="p-2">
                <Checkbox
                  disabled={!topic.enabled}
                  checked={topic.study}
                  onCheckedChange={() => handleCheckboxChange(topic, 'study')}
                  className="border-yellow-600 size-5"
                />
              </td>
              <td className="p-2">
                <Checkbox
                  disabled={!topic.enabled}
                  checked={topic.exercise}
                  onCheckedChange={() =>
                    handleCheckboxChange(topic, 'exercise')
                  }
                  className="border-yellow-600 size-5"
                />
              </td>
              <td className="p-2">
                <Checkbox
                  disabled={!topic.enabled}
                  checked={topic.review}
                  onCheckedChange={() => handleCheckboxChange(topic, 'review')}
                  className="border-yellow-600 size-5"
                />
              </td>
              <td className="p-2">
                <Checkbox
                  disabled={!topic.enabled}
                  checked={topic.law_letter}
                  onCheckedChange={() =>
                    handleCheckboxChange(topic, 'law_letter')
                  }
                  className="border-yellow-600 size-5"
                />
              </td>
              <td className="p-2">
                <Switch
                  defaultChecked={topic.enabled}
                  onCheckedChange={(value: boolean) =>
                    handleSwitchChange(topic, value)
                  }
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </AccordionContent>
  )
}
