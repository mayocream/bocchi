import { prisma } from '@/app/lib/storage'
import { NextRequest, NextResponse } from 'next/server'

export const GET = async (
  request: NextRequest,
  {
    params,
    searchParams,
  }: {
    params: Promise<{ username: string }>
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
  }
) => {
  const { username } = await params
  const user = await prisma.user.findUnique({
    where: { username },
  })

  if (!user) {
    return new NextResponse(null, { status: 404 })
  }

  const { cursor, limit = 10 } = await searchParams

  const tweets = await prisma.tweet.findMany({
    take: parseInt(limit as string),
    cursor: {
      id: parseInt(cursor as string) || undefined,
    },
    where: { authorId: user.id },
    orderBy: { id: 'desc' },
  })

  return NextResponse.json(tweets)
}
