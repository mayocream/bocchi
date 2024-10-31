import { PrismaClient } from '@prisma/client'
import { S3Client } from '@aws-sdk/client-s3'

export const prisma = new PrismaClient()
export const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY_ID!,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
  },
})
