import { useState } from 'react'
import { mediaService, useGrpcAuth } from './api'
import { UploadImageRequest } from './bocchi_pb'
import { useAuthStore } from './state'

export const useImageUpload = () => {
  const authStore = useAuthStore()
  const { getAuthMetadata } = useGrpcAuth(authStore.accessToken!)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [imageUrl, setImageUrl] = useState<string | null>(null)

  const uploadImage = async (src: string) => {
    try {
      setIsLoading(true)
      setError(null)

      const blob = await fetch(src).then((res) => res.blob())
      const buffer = await new Response(blob).arrayBuffer()
      const bytes = new Uint8Array(buffer)

      const request = new UploadImageRequest()
      request.setImage(bytes)

      const response = await mediaService.uploadImage(
        request,
        getAuthMetadata()
      )

      const url = response.getUrl()
      setImageUrl(url)
      return url
    } catch (err: any) {
      console.error('Failed to upload image:', err)
      setError(err)
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  return { uploadImage, isLoading, error, imageUrl }
}
