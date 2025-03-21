import { useCallback } from 'react'
import { MediaClient, UserClient } from './BocchiServiceClientPb'
import { Metadata } from 'grpc-web'

export const userService = new UserClient(process.env.EXPO_PUBLIC_API_URL!)
export const mediaService = new MediaClient(process.env.EXPO_PUBLIC_API_URL!)

export const useGrpcAuth = (token: string) => {
  const getAuthMetadata = useCallback((): Metadata => {
    return { Authorization: `Bearer ${token}` }
  }, [token])

  return { getAuthMetadata }
}
