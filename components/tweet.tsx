import { Avatar, XStack, YStack, Text } from 'tamagui'
import { Heart, MessageCircle, Repeat, Share } from '@tamagui/lucide-icons'
import { Time } from './time'
import { useState } from 'react'
import { Counter } from './counter'
import { Like } from './like'

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

export const Tweet = ({ tweet }: { tweet: TweetProps }) => {
  const [liked, setLiked] = useState(tweet.liked)
  const [retweeted, setRetweeted] = useState(tweet.retweeted)

  return (
    <XStack
      padding='$4'
      backgroundColor='$background'
      maxWidth={600}
      gap={10}
      alignItems='flex-start'
    >
      <Avatar marginTop={4} circular size='$3'>
        <Avatar.Image src={tweet.user.avatar_url} />
        <Avatar.Fallback />
      </Avatar>
      <YStack flex={1}>
        <XStack gap={4} alignItems='center'>
          <Text fontWeight={600}>{tweet.user.name}</Text>
          <Text fontSize={14}>@{tweet.user.username}</Text>
          <Text>·</Text>
          <Time date={tweet.created_at} />
        </XStack>
        <Text>{tweet.content}</Text>
        <XStack marginTop={10} justifyContent='space-between' userSelect='none'>
          <XStack alignItems='center' gap={2}>
            <MessageCircle size={18} />
            <Counter count={tweet.replies} />
          </XStack>
          <XStack alignItems='center' gap={2}>
            <Repeat size={18} />
            <Counter count={tweet.retweets} />
          </XStack>
          <Like liked={liked} count={tweet.likes} />
          <XStack alignItems='center'>
            <Share size={18} />
          </XStack>
        </XStack>
      </YStack>
    </XStack>
  )
}
