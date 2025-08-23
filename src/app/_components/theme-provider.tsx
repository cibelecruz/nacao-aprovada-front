<<<<<<< HEAD
'use client'

import * as React from 'react'
import { ThemeProvider as NextThemesProvider } from 'next-themes'
=======
"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
>>>>>>> 76d27db67be57b96513a92ac4cb4b0d29bca574c

export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
<<<<<<< HEAD
}
=======
}
>>>>>>> 76d27db67be57b96513a92ac4cb4b0d29bca574c
