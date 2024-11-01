import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/app/lib/storage'
import { auth } from '@/app/lib/auth'

export const GET = async (
  request: NextRequest,
  { params }: { params: Promise<{ id: number }> }
) => {
  const { id } = await params

  const tweet = await prisma.tweet.findUnique({
    where: { id },
  })

  if (!tweet) {
    return new NextResponse(null, { status: 404 })
  }

  return NextResponse.json(tweet, {
    headers: {
      'Cache-Control': 'public, max-age=86400',
    },
  })
}

export const DELETE = async (
  request: NextRequest,
  { params }: { params: Promise<{ id: number }> }
) => {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  const tweet = await prisma.tweet.findUnique({
    where: { id },
    select: { authorId: true },
  })

  if (!tweet) {
    return new NextResponse(null, { status: 404 })
  }

  if (tweet.authorId !== session.id) {
    return new NextResponse(null, { status: 403 })
  }

  await prisma.tweet.delete({ where: { id } })
  return new NextResponse(null, { status: 204 })
}
