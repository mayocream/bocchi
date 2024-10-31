import { prisma } from '@/app/lib/storage'
import { cookies } from 'next/headers'
import { jwtVerify, SignJWT } from 'jose'
import { User } from '@prisma/client'

const jwtKey = new TextEncoder().encode(process.env.AUTH_SECRET!)

export const auth = async () => {
  const jwt = (await cookies()).get('auth')
  if (!jwt) return null

  try {
    const { payload } = await jwtVerify(jwt.value, jwtKey)
    return await prisma.user.findUnique({
      where: { username: payload.sub },
    })
  } catch {
    return null
  }
}

export const createSession = async (user: User) => {
  const token = await new SignJWT({
    sub: user.username,
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('30d')
    .sign(jwtKey)

  ;(await cookies()).set('auth', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 * 30,
  })
}
