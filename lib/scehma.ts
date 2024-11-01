import { Prisma } from '@prisma/client'
import { z } from 'zod'

export const User = z.object({
  email: z.string().email(),
  name: z.string().max(50),
  username: z.string().max(30),
  password: z.string(),
  bio: z.string().optional(),
  avatar: z.string().url().optional(),
  banner: z.string().url().optional(),
}) satisfies z.ZodType<Prisma.UserCreateInput>
