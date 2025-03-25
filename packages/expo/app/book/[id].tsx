import Loading from '@/components/loading'
import { googleBooks } from '@/lib/google-books'
import { Stack, useLocalSearchParams } from 'expo-router'
import { useEffect, useState } from 'react'
import { YStack, XStack, Separator, Image, SizableText } from 'tamagui'

export default function Tv() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const [googleBooksData, setGoogleBooksData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    googleBooks(`/volumes/${id}`)
      .then(setGoogleBooksData)
      .then(() => setLoading(false))
  }, [id])

  if (loading) {
    return <Loading />
  }

  return (
    <YStack fullscreen backgroundColor='$background'>
      <Stack.Screen
        options={{
          title: googleBooksData?.volumeInfo?.title,
        }}
      />

      <XStack padding='$4' gap='$4'>
        <Image
          source={{ uri: googleBooksData?.volumeInfo?.imageLinks?.thumbnail }}
          style={{ width: 160, height: (160 * 3) / 2, borderRadius: 4 }}
        />
        <YStack gap='$2'>
          <SizableText size='$5' fontWeight='bold' width={160}>
            {googleBooksData?.volumeInfo?.title} (
            {googleBooksData?.volumeInfo?.publisher})
          </SizableText>
          <SizableText width={160}>
            {googleBooksData?.volumeInfo?.authors?.join(', ')}
          </SizableText>

          <XStack gap='$2' justifyContent='space-between'>
            {googleBooksData?.volumeInfo?.publishedDate && (
              <YStack gap='$1'>
                <SizableText>発売日</SizableText>
                <SizableText>
                  {googleBooksData?.volumeInfo?.publishedDate}
                </SizableText>
              </YStack>
            )}

            {googleBooksData?.volumeInfo?.pageCount && (
              <YStack gap='$1'>
                <SizableText>ページ数</SizableText>
                <SizableText>
                  {googleBooksData?.volumeInfo?.pageCount}
                </SizableText>
              </YStack>
            )}
          </XStack>
        </YStack>
      </XStack>

      <Separator />
    </YStack>
  )
}
