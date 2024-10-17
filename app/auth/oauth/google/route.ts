import { setUserCookie } from '@/app/lib/auth'
import { NextRequest, NextResponse } from 'next/server'

export const GET = async (request: NextRequest) => {
  const code = request.nextUrl.searchParams.get('code')
  if (!code) {
    return fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/oauth/google`, {
      redirect: 'manual',
    })
  }

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/oauth/google?code=${code}`,
    { method: 'POST' }
  )

  if (!response.ok) {
    return NextResponse.json(
      { error: 'Failed to authenticate' },
      { status: 401 }
    )
  }

  const token = await response.json<string>()
  setUserCookie(token)

  return new NextResponse(null, {
    headers: {
      // https://en.wikipedia.org/wiki/Meta_refresh#Alternatives
      Refresh: `0;url=/dashboard`,
    },
  })
}
