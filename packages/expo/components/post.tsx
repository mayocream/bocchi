import { Avatar, XStack, YStack, Text, SizableText } from 'tamagui'
import { Heart, MessageCircle, Repeat, Share } from '@tamagui/lucide-icons'
import { Time } from './time'
import { useState } from 'react'
import { Counter } from './counter'
import { Pressable } from 'react-native'
import * as Sharing from 'expo-sharing'

type TweetProps = {
  id: number
  user: {
    name: string
    username: string
    avatar_url: string
  }
  content: string
  created_at: Date
  likes: number
  liked: boolean
  retweets: number
  retweeted: boolean
  replies: number
}

export const Post = ({ tweet }: { tweet: TweetProps }) => {
  const [liked, setLiked] = useState(tweet.liked)
  const [retweeted, setRetweeted] = useState(tweet.retweeted)

  return (
    <XStack
      padding='$4'
      backgroundColor='$background'
      width={600}
      gap='$3'
      alignItems='flex-start'
      borderBottomWidth='$0.25'
      borderBottomColor='#E6E6E6'
    >
      <Avatar marginTop='$1.5' circular size='$5'>
        <Avatar.Image src={tweet.user.avatar_url} />
        <Avatar.Fallback />
      </Avatar>
      <YStack flex={1}>
        <XStack gap='$1.5' alignItems='center'>
          <Text fontWeight='bold'>{tweet.user.name}</Text>
          <Text>@{tweet.user.username}</Text>
          <Text>·</Text>
          <Time date={new Date(tweet?.created_at)} />
        </XStack>
        <SizableText fontSize='$5' fontWeight={400}>
          {tweet.content}
        </SizableText>
        <XStack marginTop='$2' justifyContent='space-between' userSelect='none'>
          <XStack alignItems='center' gap='$1'>
            <MessageCircle size='$1' />
            <Counter count={tweet?.replies || 0} />
          </XStack>
          <XStack alignItems='center' gap='$1'>
            <Repeat size='$1' />
            <Counter count={tweet?.retweets || 0} />
          </XStack>
          <XStack alignItems='center' gap='$1'>
            <Heart size='$1' />
            <Counter count={tweet?.likes || 0} />
          </XStack>
          <XStack alignItems='center'>
            <Pressable onPress={() => Sharing.shareAsync(tweet.content)}>
              <Share size='$1' />
            </Pressable>
          </XStack>
        </XStack>
      </YStack>
    </XStack>
  )
}
