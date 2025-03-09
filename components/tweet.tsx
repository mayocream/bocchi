import { Avatar, XStack, YStack } from 'tamagui'
import { Text } from './text'
import { formatDistance } from '@/lib/date'
import { Heart, MessageCircle, Share } from '@tamagui/lucide-icons'

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
  retweets: number
  replies: number
}

export const Tweet = ({ tweet }: { tweet: TweetProps }) => {
  return (
    <XStack
      borderRadius='$4'
      padding='$4'
      marginBottom='$4'
      backgroundColor='$background'
      maxWidth={600}
      gap={10}
    >
      <Avatar circular size='$4'>
        <Avatar.Image src={tweet.user.avatar_url} />
        <Avatar.Fallback />
      </Avatar>
      <YStack flex={1}>
        <XStack gap={4} alignItems='center'>
          <Text fontWeight={600}>{tweet.user.name}</Text>
          <Text fontSize={14}>@{tweet.user.username}</Text>
          <Text>·</Text>
          <Text>{formatDistance(tweet.created_at)}</Text>
        </XStack>
        <Text>{tweet.content}</Text>
        <XStack marginTop={10} justifyContent='space-between'>
          <XStack alignItems='center' gap={2}>
            <MessageCircle size={18} />
            <Text>{tweet.replies}</Text>
          </XStack>
          <XStack alignItems='center' gap={2}>
            <Heart size={18} />
            <Text>{tweet.likes}</Text>
          </XStack>
          <XStack alignItems='center' gap={2}>
            <MessageCircle size={18} />
            <Text>{tweet.retweets}</Text>
          </XStack>
          <XStack alignItems='center'>
            <Share size={18} />
          </XStack>
        </XStack>
      </YStack>
    </XStack>
  )
}
