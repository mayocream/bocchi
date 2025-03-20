import { UserClient } from './BocchiServiceClientPb'

export const userService = new UserClient(
  process.env.EXPO_PUBLIC_API_URL!
)
