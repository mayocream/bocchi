import { Heart } from '@tamagui/lucide-icons'
import { XStack } from 'tamagui'
import { Counter } from './counter'

export const Like = ({ liked, count }: { liked: boolean; count: number }) => {
  return (
    <XStack alignItems='center' gap={2}>
      <Heart size={18} color={liked ? '$red' : '$color'} />
      <Counter count={count} />
    </XStack>
  )
}
