import { auth } from '@/lib/auth'
import { User } from '@/lib/scehma'
import { prisma } from '@/lib/storage'
import { NextRequest, NextResponse } from 'next/server'

export const GET = async (
  request: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) => {
  const { username } = await params

  const user = await prisma.user.findUnique({
    where: { username },
    select: {
      id: true,
      email: true,
      name: true,
      username: true,
      bio: true,
      avatar: true,
      banner: true,
      _count: {
        select: {
          followers: true,
          following: true,
          tweets: true,
          likes: true,
        },
      },
    },
  })

  if (!user) {
    return new NextResponse(null, { status: 404 })
  }

  return NextResponse.json(user)
}

export const PUT = async (
  request: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) => {
  const { username } = await params
  const session = await auth()

  if (!session || session.username != username) {
    return new NextResponse(null, { status: 401 })
  }

  const data = await request.json()

  const validated = User.pick({
    email: true,
    name: true,
    username: true,
    bio: true,
    avatar: true,
    banner: true,
  }).safeParse(data)

  if (!validated.success) {
    return NextResponse.json(validated.error, { status: 400 })
  }

  const user = await prisma.user.update({
    where: { username },
    data: validated.data,
    select: {
      id: true,
      email: true,
      name: true,
      username: true,
      bio: true,
      avatar: true,
      banner: true,
    },
  })

  return NextResponse.json(user)
}
