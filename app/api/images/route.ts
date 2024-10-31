import { NextRequest, NextResponse } from 'next/server'
import { nanoid } from 'nanoid'
import { s3 } from '@/app/lib/storage'
import { auth } from '@/app/lib/auth'
import { PutObjectCommand } from '@aws-sdk/client-s3'

export const POST = async (request: NextRequest) => {
  const user = await auth()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const contentType = request.headers.get('content-type')
  if (!contentType || contentType !== 'image/webp') {
    return NextResponse.json(
      { error: 'Content-Type must be an webp' },
      { status: 400 }
    )
  }

  const contentLength = request.headers.get('content-length')
  if (!contentLength || parseInt(contentLength) > 5 * 1024 * 1024) {
    return NextResponse.json(
      { error: 'Image size should be less than 5MB' },
      { status: 400 }
    )
  }

  const id = nanoid()
  await s3.send(
    new PutObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME!,
      Key: id,
      Body: request.body!,
      ContentType: 'image/webp',
      Metadata: {
        owner: String(user.id),
      },
    })
  )

  return NextResponse.json({ id })
}
