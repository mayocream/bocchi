import type { NextRequest } from 'next/server'
import { getCloudflareContext } from '@opennextjs/cloudflare'
import { nanoid } from 'nanoid'
import { getSession } from '@/app/lib/auth'

export const POST = async (request: NextRequest) => {
  const session = await getSession()
  if (!session) {
    return new Response('Unauthorized', { status: 401 })
  }

  const contentType = request.headers.get('content-type')
  if (!contentType?.startsWith('image/')) {
    return new Response('Invalid content type', { status: 400 })
  }

  if (!request.headers.has('content-length')) {
    return new Response('Missing content length', { status: 400 })
  }

  const { env } = await getCloudflareContext()
  const id = nanoid()
  const imageUrl = `${process.env.NEXT_PUBLIC_IMAGE_URL}/${session.id}/${id}`
  await env.IMAGES.put(id, request.body, {
    httpMetadata: {
      contentType,
      cacheControl: 'public, max-age=31536000',
    },
  })

  return new Response(imageUrl, { status: 201 })
}
