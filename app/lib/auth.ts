import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { type User } from './schema'

const MAX_AGE = 30 * 24 * 60 * 60 // 30 days
const TOKEN_NAME = 'jwt'
const JWT_PUBLIC_KEY = await crypto.subtle.importKey(
  'spki',
  Buffer.from(process.env.NEXT_PUBLIC_JWT_PUBLIC_KEY!, 'base64'),
  { name: 'Ed25519' },
  false,
  ['verify']
)

export async function decode(token: string): Promise<any> {
  const [header, payload, signature] = token.split('.')
  const data = `${header}.${payload}`
  const isValid = await crypto.subtle.verify(
    { name: 'Ed25519' },
    JWT_PUBLIC_KEY,
    new Uint8Array(Buffer.from(signature, 'base64')),
    new Uint8Array(Buffer.from(data))
  )
  if (!isValid) throw new Error('Invalid token')
  return JSON.parse(atob(payload))
}

export async function getSession(): Promise<User | null> {
  const token = cookies().get(TOKEN_NAME)?.value
  if (!token) return null
  try {
    const payload = await decode(token)
    return payload as User
  } catch (error) {
    console.error(error)
    return null
  }
}

export function withAuth(handler: Function) {
  return async (request: NextRequest, ...args: any[]) => {
    const session = await getSession()
    return session
      ? handler(request, ...args)
      : NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
}

export const setUserCookie = (token: string) =>
  cookies().set({
    name: TOKEN_NAME,
    value: token,
    httpOnly: true,
    path: '/',
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: MAX_AGE,
  })

export const removeUserCookie = () => cookies().delete(TOKEN_NAME)

export const endSession = removeUserCookie
