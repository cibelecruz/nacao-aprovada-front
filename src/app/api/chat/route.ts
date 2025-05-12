import { openai } from '@ai-sdk/openai'
import { streamText } from 'ai'

interface HelpContent {
  id: string
  title: string
  content: string
  videoUrl?: string | null
  createdAt: string
  updatedAt: string
  userId: string
  iaAccess: boolean
}

export const maxDuration = 30

export async function POST(req: Request) {
  const { messages } = await req.json()

  const response = await fetch(
    process.env.NEXT_PUBLIC_API_URL + '/help-content/ia',
    {
      cache: 'force-cache',
      next: {
        revalidate: 5 * 60, // 5 minutes
      },
    },
  )

  const { helpContent } = (await response.json()) as {
    helpContent: HelpContent[]
  }

  const markdownContents = helpContent
    .map((item) => `### ${item.title}\n\n${item.content}`)
    .join('\n\n---\n\n')

  const systemMessage = {
    role: 'system',
    content: `Você é um assistente virtual que se chama "xuxu", treinado para ajudar os usuários de uma plataforma educacional. 
  A plataforma contém materiais de ajuda organizados em tópicos. Estes materiais incluem:
  - Instruções sobre funcionalidades da plataforma.
  - Vídeos explicativos (quando disponíveis).
  - Respostas para perguntas frequentes.
  
  Você recebeu os seguintes conteúdos de ajuda em Markdown, que podem ser usados para responder às perguntas dos usuários:
  
  ${markdownContents}

  Caso exista perguntas sobre as matérias, ajude o aluno a encontrar a resposta correta mas evitando dar a resposta direta, explique como chegar no resultado e no final da o resultado.
  
  Por favor, use essas informações para responder de forma precisa e clara. Se não encontrar informações suficientes nos conteúdos, avise educadamente o usuário.`,
  }

  const result = streamText({
    model: openai('gpt-4o'),
    messages: [systemMessage, ...messages],
  })

  return result.toDataStreamResponse()
}
