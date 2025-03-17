import { Avatar, XStack, YStack, Text } from 'tamagui'
import { Heart, MessageCircle, Repeat, Share } from '@tamagui/lucide-icons'
import { Time } from './time'
import { useState } from 'react'
import { Counter } from './counter'

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
          <Time date={tweet.created_at} />
        </XStack>
        <Text fontSize='$5'>{tweet.content}</Text>
        <XStack marginTop='$2' justifyContent='space-between' userSelect='none'>
          <XStack alignItems='center' gap='$1'>
            <MessageCircle size='$1' />
            <Counter count={tweet.replies} />
          </XStack>
          <XStack alignItems='center' gap='$1'>
            <Repeat size='$1' />
            <Counter count={tweet.retweets} />
          </XStack>
          <XStack alignItems='center' gap='$1'>
            <Heart size='$1' />
            <Counter count={tweet.likes} />
          </XStack>
          <XStack alignItems='center'>
            <Share size='$1' />
          </XStack>
        </XStack>
      </YStack>
    </XStack>
  )
}
