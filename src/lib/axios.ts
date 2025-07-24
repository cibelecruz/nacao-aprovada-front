import Axios from 'axios'
import { onAuthStateChanged } from 'firebase/auth'

import { auth } from './firebase'

export const api = Axios.create({
  baseURL: '/coach_api', // <<< ESTA É A MUDANÇA CRÍTICA!
//  baseURL: process.env.NEXT_PUBLIC_API_URL,
// baseURL: process.env.API_URL,

})

async function getTokenFromSession() {
  return new Promise((resolve, reject) => {
    onAuthStateChanged(auth, async (user) => {
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
        window.location.href = '/'
        resolve(null)
      }
    })
  })
}

api.interceptors.request.use(
  async (config) => {
    try {
      const token = await getTokenFromSession()
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
    } catch (error) {
      console.error('Erro ao configurar o cabeçalho Authorization:', error)
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)
