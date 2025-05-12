import { NextResponse } from 'next/server'

export function middleware() {
  const response = NextResponse.next()
  response.headers.set('Content-Language', 'pt-BR')
  return response
}
