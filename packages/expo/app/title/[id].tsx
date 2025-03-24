import Loading from '@/components/loading'
import { bangumi } from '@/lib/bangumi'
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
} from 'tamagui'

export default function Title() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    bangumi(`/v0/subjects/${id}`).then((response) => {
      setData(response)
      setLoading(false)
      console.log(response)
    })
  }, [id])

  if (loading) {
    return <Loading />
  }

  return (
    <YStack fullscreen backgroundColor='$background'>
      <Stack.Screen
        options={{
          title: 'Title',
        }}
      />

      {/* Basic Info */}
      <XStack padding='$4' gap='$4'>
        <Image
          source={{ uri: data?.images?.large }}
          style={{ width: 200, height: (200 * 3) / 2, borderRadius: 4 }}
        />
      </XStack>

      <Separator />
    </YStack>
  )
}
