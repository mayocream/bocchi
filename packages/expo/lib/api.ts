import { UserServiceClient } from './BocchiServiceClientPb'

export const userService = new UserServiceClient(
  process.env.EXPO_PUBLIC_API_URL!
)
