import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/storage'
import { auth } from '@/lib/auth'

export const GET = async (
  request: NextRequest,
  segmentData
) => {
  const { cursor, limit = 10 } = await segmentData.searchParams

  const user = await auth()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Get tweets from users the current user follows, plus their own tweets
  const tweets = await prisma.tweet.findMany({
    take: parseInt(limit as string),
    skip: cursor ? 1 : 0,
    cursor: cursor
      ? {
          id: parseInt(cursor as string),
        }
      : undefined,
    where: {
      OR: [
        // Tweets from users the current user follows
        {
          author: {
            followers: {
              some: {
                followerId: user.id,
              },
            },
          },
        },
        // Include the user's own tweets
        {
          authorId: user.id,
        },
      ],
    },
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      author: {
        select: {
          username: true,
        },
      },
      _count: {
        select: {
          likes: true,
          replies: true,
          retweets: true,
        },
      },
    },
  })

  return NextResponse.json(tweets)
}

export const POST = async (request: NextRequest) => {
  const user = await auth()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { content } = await request.json()
  if (!content) {
    return NextResponse.json({ error: 'Content is required' }, { status: 400 })
  }

  const tweet = await prisma.tweet.create({
    data: {
      content,
      authorId: user.id,
    },
  })

  return NextResponse.json(tweet)
}
