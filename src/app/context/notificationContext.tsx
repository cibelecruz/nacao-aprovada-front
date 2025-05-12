'use client'

import { api } from '@/lib/axios'
import { createContext, useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'

interface NotificationProps {
  active: boolean
  courseId: string
  date: string
  description: string
  id: string
  target: 'all' | 'one'
  title: string
  userId: string
  status: 'read' | 'unread'
}

interface NotificationContextProps {
  notifications: NotificationProps[]
  setNotifications: (notifications: NotificationProps[]) => void
  updateNotification: (id: string, updates: Partial<NotificationProps>) => void
  markAsRead: (id: string) => void
}

export const NotificationContext = createContext<NotificationContextProps>(
  {} as NotificationContextProps,
)

export function NotificationProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [notifications, setNotifications] = useState<NotificationProps[]>([])
  const pathname = usePathname()
  function updateNotification(id: string, updates: Partial<NotificationProps>) {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === id ? { ...notification, ...updates } : notification,
      ),
    )
  }

  function markAsRead(id: string) {
    updateNotification(id, { status: 'read', active: false })
  }

  useEffect(() => {
    if (pathname !== '/') {
      api
        .get('/notifications/student')
        .then(({ data }) => {
          if (data && data.notifications) {
            const mappedNotifications = data.notifications.map(
              (notification: Omit<NotificationProps, 'status'>) => ({
                ...notification,
                status: 'unread',
              }),
            )
            setNotifications(mappedNotifications)
          }
        })
        .catch((error) => {
          console.error('Erro ao buscar notificações:', error)
        })
    }
  }, [pathname])

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        setNotifications,
        updateNotification,
        markAsRead,
      }}
    >
      {children}
    </NotificationContext.Provider>
  )
}
