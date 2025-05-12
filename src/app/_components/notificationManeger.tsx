'use client'

import { useEffect, useState } from 'react'
import { useNotifications } from '../hooks/useNotifications'
import { showToast } from './showNotificationToast'

export default function NotificationManager() {
  const { notifications, markAsRead } = useNotifications()
  const [displayedNotifications, setDisplayedNotifications] = useState<
    string[]
  >([])

  useEffect(() => {
    if (notifications && notifications.length > 0) {
      notifications.forEach((notification) => {
        if (!displayedNotifications.includes(notification.id)) {
          showToast({
            message: notification.title,
            description: notification.description,
            duration: 2000,
          })

          setDisplayedNotifications((prev) => [...prev, notification.id])
        }
      })
    }
  }, [notifications, displayedNotifications, markAsRead])

  return null // Este componente só gerencia notificações
}
