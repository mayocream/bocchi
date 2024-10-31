import { User as IUser } from '@/app/lib/schema'

declare module 'next-auth' {
  interface Session {
    user: IUser
  }
}
