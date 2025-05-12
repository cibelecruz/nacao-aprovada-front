'use client'

import { toast } from 'sonner'
import { CheckCircle, AlertCircle, Info, XCircle } from 'lucide-react'

interface ToastProps {
  message: string
  description: string
  type?: 'success' | 'error' | 'info' | 'warning'
  duration?: number
}

const icons = {
  success: <CheckCircle className="h-5 w-5 text-[#F5B042]" />,
  error: <XCircle className="h-5 w-5 text-red-500" />,
  info: <Info className="h-5 w-5 text-[#F5B042]" />,
  warning: <AlertCircle className="h-5 w-5 text-[#F5B042]" />,
}

export function showToast({
  message,
  type = 'info',
  duration = 3000,
  description,
}: ToastProps) {
  toast(message, {
    duration,
    description,
    icon: icons[type],
    className: 'bg-[#1E2A47] text-white border border-[#3A4B6D] shadow-lg',
    style: {
      boxShadow: '0 0 10px rgba(245, 176, 66, 0.3)', // Subtle gold glow
    },
    position: 'top-right',
  })
}
