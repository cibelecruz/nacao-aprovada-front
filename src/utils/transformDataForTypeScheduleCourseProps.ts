import type { ScheduleCourseProps, Course } from 'schedule-course' // Certifique-se do caminho correto

export function transformDataForTypeScheduleCourseProps(
  data: ScheduleCourseProps,
): ScheduleCourseProps {
  const courses = Object.entries(data.courses).map(
    ([courseName, courseData]) => ({
      id: courseData.id,
      name: courseName,
      enabled: courseData.enabled ?? true,
      subjects: Object.entries(courseData)
        .filter(([key]) => key !== 'id' && key !== 'enabled')
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .map(([subjectName, subjectData]: [string, any]) => ({
          id: subjectData.id,
          name: subjectName,
          enabled: subjectData.enabled,
          topics: Object.entries(subjectData.topics || {}).map(
            ([topicName, topicData]) => {
              // Fazendo type assertion explícito para topicData
              const typedTopicData = topicData as {
                id: string
                enabled: boolean
                study: boolean
                exercise: boolean
                review: boolean
                law_letter: boolean
              }

              return {
                id: typedTopicData.id,
                name: topicName,
                enabled: typedTopicData.enabled,
                study: typedTopicData.study,
                exercise: typedTopicData.exercise,
                review: typedTopicData.review,
                law_letter: typedTopicData.law_letter,
              }
            },
          ),
        })),
    }),
  )

  return {
    name: data.name,
    email: data.email,
    phone: data.phone,
    courses: courses as unknown as Course[],
  }
}
