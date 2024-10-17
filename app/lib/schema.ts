import { z } from 'zod'

export const UserSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  name: z.string(),
  avatar: z.string().url(),
  role: z.enum(['user', 'admin']),
})

export type User = z.infer<typeof UserSchema>

export const SiteSchema = z.object({
  id: z.string(),
  name: z.string(),
  domain: z.string(),
  owner: z.string(),
})

export type Site = z.infer<typeof SiteSchema>
