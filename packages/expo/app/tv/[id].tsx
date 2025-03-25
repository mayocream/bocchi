import { tmdb } from '@/lib/tmdb'
import { Stack, useLocalSearchParams } from 'expo-router'
import { useEffect, useState } from 'react'
import { YStack, XStack, Separator, SizableText } from 'tamagui'
import { ImageViewer } from '@/components/image-viewer'
import { Dimensions } from 'react-native'

export default function Tv() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const [data, setData] = useState<any>(null)

  useEffect(() => {
    tmdb(`/tv/${id}`, { language: 'ja-JP' }).then(setData)
  }, [id])

  const screenWidth = Dimensions.get('screen').width
  const imageWidth = screenWidth * 0.45

  return (
    <YStack fullscreen backgroundColor='$background'>
      <Stack.Screen
        options={{
          title: data?.name,
        }}
      />

      <XStack padding='$4' gap='$4'>
        <ImageViewer
          source={{ uri: `https://tmdb.org/t/p/w780${data?.poster_path}` }}
          style={{ width: imageWidth, height: imageWidth * 1.5 }}
        />

        <YStack gap='$2'>
          <SizableText
            size='$5'
            fontWeight='bold'
            width={160}
            userSelect='auto'
          >
            {data?.name}
          </SizableText>
          <SizableText width={160}>{data?.tagline}</SizableText>

          <XStack gap='$2' justifyContent='space-between'>
            {data?.first_air_date && (
              <YStack gap='$1'>
                <SizableText>放送日</SizableText>
                <SizableText>{data?.first_air_date}</SizableText>
              </YStack>
            )}

            {data?.number_of_episodes && (
              <YStack gap='$1'>
                <SizableText>エピソード数</SizableText>
                <XStack gap='$1' alignItems='center' justifyContent='center'>
                  <SizableText>{data?.number_of_episodes}</SizableText>
                </XStack>
              </YStack>
            )}
          </XStack>
        </YStack>
      </XStack>

      {data?.overview && (
        <YStack gap='$2' padding='$4'>
          <SizableText size='$4' fontWeight='bold'>
            概要
          </SizableText>
          <SizableText userSelect='auto'>{data.overview}</SizableText>
        </YStack>
      )}

      <Separator />
    </YStack>
  )
}
