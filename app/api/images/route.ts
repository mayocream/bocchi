import { NextRequest } from 'next/server'
import { getCloudflareContext } from '@opennextjs/cloudflare'
import { nanoid } from 'nanoid'
import { withAuth } from '@/app/lib/auth'

export const POST = withAuth(async (request: NextRequest) => {
  const contentType = request.headers.get('content-type')
  if (!contentType?.startsWith('image/')) {
    return new Response('Invalid content type', { status: 400 })
  }

  if (!request.headers.has('content-length')) {
    return new Response('Missing content length', { status: 400 })
  }

  const { env } = await getCloudflareContext()
  const id = nanoid()
  await env.R2.put(id, request.body, {
    httpMetadata: {
      contentType,
      cacheControl: 'public, max-age=31536000',
    },
  })

  return new Response(id, { status: 201 })
})
