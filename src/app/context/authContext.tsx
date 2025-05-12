'use client'

import {
  getIdToken,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  User,
} from 'firebase/auth'
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'

import { auth } from '@/lib/firebase'
import { api } from '@/lib/axios'

interface StudyAvailability {
  monday: number
  tuesday: number
  wednesday: number
  thursday: number
  friday: number
  saturday: number
  sunday: number
}

interface AuthContextProps {
  isAuthenticated: boolean
  isLoadingAuth: boolean
  currentUser: User | null
  studyAvailability: StudyAvailability | null
  email: string
  role: string
  preferedStartDate: string
  onboardingIsCompleted: boolean
  imageUrl: string
  setImageUrl: (imageUrl: string) => void
  setOnboardingIsCompleted: (data: boolean) => void
  setRole: (role: string) => void
  setStudyAvailability: (studyAvailability: StudyAvailability) => void
  loginWithEmailAndPassword: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  getUserToken: () => Promise<string>
  handleRecoverPassword: (email: string) => Promise<void>
}

export const AuthContext = createContext<AuthContextProps>(
  {} as AuthContextProps,
)

export const useAuth = () => useContext(AuthContext)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [studyAvailability, setStudyAvailability] =
    useState<StudyAvailability | null>(null)
  const [email, setEmail] = useState<string>('')
  const [role, setRole] = useState<string>('')
  const [onboardingIsCompleted, setOnboardingIsCompleted] =
    useState<boolean>(true)
  const [preferedStartDate, setPreferedStartDate] = useState('')
  const [isLoadingAuth, setIsLoadingAuth] = useState(true)
  const [imageUrl, setImageUrl] = useState('')

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setIsLoadingAuth(false)
      if (user) {
        api.get('/users/current-user').then(async (response) => {
          const role = response.data.role
          const onboardingIsCompleted = response.data.onboardingComplete
          const dateValue = response.data.preferedStartDate._value
          const studyAvailability = response.data.studyAvailability
          const imageUrl = response.data.imageUrl

          setImageUrl(imageUrl)
          setRole(role)
          setOnboardingIsCompleted(onboardingIsCompleted)
          setPreferedStartDate(dateValue)
          setStudyAvailability(studyAvailability)
        })

        user.getIdTokenResult().then((response) => {
          const role = response.claims.role as string
          setRole(role)
        })
        setCurrentUser(user)
        setEmail(user.email ?? '')
      } else {
        setCurrentUser(null)
        setEmail('')
      }
    })

    return unsubscribe
  }, [])

  const loginWithEmailAndPassword = useCallback(
    async (email: string, password: string) => {
      await signInWithEmailAndPassword(auth, email, password)
    },
    [],
  )

  // Função de logout
  const signOutFn = useCallback(async () => {
    await signOut(auth)
    window.localStorage.clear()
    window.sessionStorage.clear()
    setCurrentUser(null)
    window.location.href = '/'
  }, [])

  // Função para recuperação de senha
  const handleRecoverPassword = useCallback(async (email: string) => {
    await sendPasswordResetEmail(auth, email)
  }, [])

  const getUserToken = useCallback(async () => {
    if (auth.currentUser) {
      return await getIdToken(auth.currentUser)
    }
    return ''
  }, [])

  const isAuthenticated = useMemo(() => !!currentUser, [currentUser])

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isLoadingAuth,
        email,
        currentUser,
        loginWithEmailAndPassword,
        signOut: signOutFn,
        getUserToken,
        handleRecoverPassword,
        role,
        setRole,
        preferedStartDate,
        setStudyAvailability,
        studyAvailability,
        onboardingIsCompleted,
        setOnboardingIsCompleted,
        imageUrl,
        setImageUrl,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
