import Axios from 'axios'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from './firebase'

export const api = Axios.create({
  // baseURL: process.env.API_URL ? '/coach_api' : 'http://localhost:3000',
  // baseURL: '/coach_api', // <<< ESTA É A MUDANÇA CRÍTICA!
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  // baseURL: process.env.API_URL,
})

async function getTokenFromSession() {
  return new Promise((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(
      auth,
      async (user) => {
        unsubscribe() // Evita memory leak e múltiplas execuções
        if (user) {
          try {
            const token = await user.getIdToken()
            resolve(token)
          } catch (error) {
            console.error('Erro ao obter o token:', error)
            reject(error)
          }
        } else {
          console.log('Nenhum usuário logado. Redirecionando para login...')
          // Apenas redireciona no lado do cliente
          if (typeof window !== 'undefined') {
            window.location.href = '/'
          }
          resolve(null)
        }
      },
      (error) => {
        // Lida com erros do onAuthStateChanged
        unsubscribe()
        reject(error)
      },
    )
  })
}

api.interceptors.request.use(
  async (config) => {
    // Evita rodar a lógica de pegar token no lado do servidor (SSR/SSG)
    if (typeof window === 'undefined') {
      return config
    }

    try {
      const token = await getTokenFromSession()
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
    } catch (error) {
      console.error('Erro ao configurar o cabeçalho Authorization:', error)
      // Opcional: decidir o que fazer se a obtenção do token falhar.
      // Por exemplo, cancelar a requisição.
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)
