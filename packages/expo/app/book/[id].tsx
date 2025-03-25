import Loading from '@/components/loading'
import { googleBooks } from '@/lib/google-books'
import { Stack, useLocalSearchParams } from 'expo-router'
import { useEffect, useState } from 'react'
import { YStack, XStack, Separator, Image, SizableText } from 'tamagui'

export default function Tv() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    googleBooks(`/volumes/${id}`)
      .then(setData)
      .then(() => setLoading(false))
  }, [id])

  if (loading) {
    return <Loading />
  }

  return (
    <YStack fullscreen backgroundColor='$background'>
      <Stack.Screen
        options={{
          title: data?.volumeInfo?.title,
        }}
      />

      <XStack padding='$4' gap='$4'>
        <Image
          source={{ uri: data?.volumeInfo?.imageLinks?.thumbnail }}
          style={{ width: 160, height: (160 * 3) / 2, borderRadius: 4 }}
        />
        <YStack gap='$2'>
          <SizableText size='$5' fontWeight='bold' width={160}>
            {data?.volumeInfo?.title} ({data?.volumeInfo?.publisher})
          </SizableText>
          <SizableText width={160}>
            {data?.volumeInfo?.authors?.join(', ')}
          </SizableText>

          <XStack gap='$2' justifyContent='space-between'>
            {data?.volumeInfo?.publishedDate && (
              <YStack gap='$1'>
                <SizableText>発売日</SizableText>
                <SizableText>{data?.volumeInfo?.publishedDate}</SizableText>
              </YStack>
            )}

            {data?.volumeInfo?.pageCount && (
              <YStack gap='$1'>
                <SizableText>ページ数</SizableText>
                <SizableText>{data?.volumeInfo?.pageCount}</SizableText>
              </YStack>
            )}
          </XStack>
        </YStack>
      </XStack>

      {data?.volumeInfo?.description && (
        <YStack gap='$2' padding='$4'>
          <SizableText size='$4' fontWeight='bold'>
            概要
          </SizableText>
          <SizableText>
            {data?.volumeInfo?.description?.replace(/<[^>]*>?/gm, '')}
          </SizableText>
        </YStack>
      )}

      <Separator />
    </YStack>
  )
}
