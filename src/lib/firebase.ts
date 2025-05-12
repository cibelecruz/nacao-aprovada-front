import { initializeApp } from 'firebase/app'
import {
  browserSessionPersistence,
  getAuth,
  setPersistence,
} from 'firebase/auth'
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

export const app = initializeApp(firebaseConfig)

export const storage = getStorage(app)

export const auth = getAuth(app)

setPersistence(auth, browserSessionPersistence).catch((error) => {
  console.error('Erro ao configurar persistência:', error)
})

export const FIREBASE_ERRORS = {
  'auth/wrong-password': 'Dados de Login inválidos',
  'auth/user-not-found': 'Dados de Login inválidos',
  'auth/invalid-email': 'Dados de Login inválidos',
  'auth/internal-error': 'Dados de Login inválidos',
  'auth/weak-password': 'Dados de Login inválidos',
  'auth/invalid-credential': 'Dados de Login inválidos',
  'auth/too-many-requests':
    'Muitas tentativas erradas! Aguarde alguns minutos e tente novamente.',
}
