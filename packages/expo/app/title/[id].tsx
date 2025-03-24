import Loading from '@/components/loading'
import { bangumi } from '@/lib/bangumi'
import { googleBooks } from '@/lib/google-books'
import { Stack, useLocalSearchParams } from 'expo-router'
import { useEffect, useState } from 'react'
import {
  Text,
  YStack,
  XStack,
  ScrollView,
  H1,
  View,
  Separator,
  Paragraph,
  Image,
  SizableText,
} from 'tamagui'

export default function Title() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const [bangumiData, setBangumiData] = useState<any>(null)
  const [googleBooksData, setGoogleBooksData] = useState<any>(null)

  const getBangumiData = async () => {
    const response = await bangumi(`/v0/subjects/${id}`)
    setBangumiData(response)

    console.log(response)

    const type = response?.type
    const isbn = response?.infobox?.filter((item: any) =>
      item.key.startsWith('ISBN')
    )?.[0]?.value
    if (type === 1 && isbn) {
      const googleBooksResponse = await googleBooks(isbn)
      setGoogleBooksData(googleBooksResponse)

      console.log(googleBooksResponse?.items[0])
    }
  }

  useEffect(() => {
    getBangumiData()
  }, [id])

  return (
    <YStack fullscreen backgroundColor='$background'>
      <Stack.Screen
        options={{
          title: bangumiData?.name,
        }}
      />

      <XStack padding='$4' gap='$4'>
        <Image
          source={{ uri: bangumiData?.images?.large }}
          style={{ width: 160, height: (160 * 3) / 2, borderRadius: 4 }}
        />
        <YStack gap='$2'>
          <SizableText size='$5' fontWeight='bold' width={160}>
            {bangumiData?.name}
          </SizableText>
          <SizableText>
            {googleBooksData?.items?.[0]?.volumeInfo?.authors?.[0]}
          </SizableText>

          <XStack gap='$2' justifyContent='space-between'>
            {googleBooksData?.items?.[0]?.volumeInfo?.publishedDate && (
              <YStack gap='$1'>
                <SizableText>発売日</SizableText>
                <SizableText>
                  {googleBooksData?.items?.[0]?.volumeInfo?.publishedDate}
                </SizableText>
              </YStack>
            )}

            {googleBooksData?.items?.[0]?.volumeInfo?.pageCount && (
              <YStack gap='$1'>
                <SizableText>ページ数</SizableText>
                <SizableText>
                  {googleBooksData?.items?.[0]?.volumeInfo?.pageCount}
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
