import { tmdb } from '@/lib/tmdb'
import { Stack, useLocalSearchParams } from 'expo-router'
import { useEffect, useState } from 'react'
import {
  YStack,
  XStack,
  Separator,
  SizableText,
  ToggleGroup,
  Text,
} from 'tamagui'
import { ImageViewer } from '@/components/image-viewer'
import { Dimensions } from 'react-native'
import { REVIEW_STATUS } from '@/lib/types'
import { supabase } from '@/lib/supabase'
import { useUserStore } from '@/lib/state'
import { alert } from '@/lib/alert'

export default function Tv() {
  const { user } = useUserStore()
  const { id } = useLocalSearchParams<{ id: string }>()
  const [data, setData] = useState<any>(null)
  const [reviewStatus, setReviewStatus] = useState<REVIEW_STATUS | null>(null)

  useEffect(() => {
    tmdb(`/tv/${id}`, { language: 'ja-JP' }).then(setData)
  }, [id])

  const updateReviewStatus = async () => {
    if (!reviewStatus) return

    const { data, error } = await supabase
      .from('reviews')
      .select()
      .eq('user_id', user?.id)
      .eq('tmdb_id', id)
      .single()

    if (error) {
      alert(error.message)
      return
    }

    if (data === null) {
      await supabase.from('reviews').insert({
        user_id: user?.id,
        tmdb_id: id,
        status: reviewStatus,
      })
    } else {
      await supabase
        .from('reviews')
        .update({ status: reviewStatus })
        .eq('id', data.id)
    }
  }

  useEffect(() => {
    updateReviewStatus()
  }, [reviewStatus])

  const getReviewStatus = async () => {
    if (!user) return

    const { data, error } = await supabase
      .from('reviews')
      .select()
      .eq('user_id', user.id)
      .eq('tmdb_id', id)
      .single()

    if (error) {
      alert(error.message)
      return
    }

    setReviewStatus(data?.status)
  }

  useEffect(() => {
    getReviewStatus()
  }, [user])

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

      <YStack padding='$4' paddingTop='$2'>
        <ToggleGroup
          type='single'
          orientation='horizontal'
          disableDeactivation
          backgroundColor='$background'
          borderColor='$borderColor'
          borderWidth={1}
          borderRadius='$4'
          onValueChange={(value) => setReviewStatus(value as REVIEW_STATUS)}
        >
          {[REVIEW_STATUS.TODO, REVIEW_STATUS.READING, REVIEW_STATUS.READ].map(
            (type) => (
              <ToggleGroup.Item
                key={type}
                value={type}
                backgroundColor={
                  type === reviewStatus ? '$color5' : 'transparent'
                }
                flex={1}
                paddingVertical='$2'
                borderRadius='$3'
              >
                <Text
                  textAlign='center'
                  color={type === reviewStatus ? '$color12' : '$color11'}
                  fontWeight={type === reviewStatus ? 'bold' : 'normal'}
                >
                  {type === REVIEW_STATUS.TODO && '見たい'}
                  {type === REVIEW_STATUS.READING && '見てる'}
                  {type === REVIEW_STATUS.READ && '見た'}
                </Text>
              </ToggleGroup.Item>
            )
          )}
        </ToggleGroup>
      </YStack>

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
