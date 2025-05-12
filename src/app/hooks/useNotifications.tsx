import { useContext } from 'react'
import { NotificationContext } from '../context/notificationContext'

export function useNotifications() {
  return useContext(NotificationContext)
}
