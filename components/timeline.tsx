import { Flex, Text } from '@radix-ui/themes'
import { LikeIcon, ReplyIcon, RetweetIcon, ShareIcon } from './icons'
import { Avatar } from './widgets'
import { formatDistanceFromNow } from '@/lib/date'

export const TweetInteractionButton = ({ icon: Icon, count, color }) => (
  <Flex
    gap='2'
    align='center'
    className={`text-gray-500 hover:text-${color} group cursor-pointer`}
  >
    <div className={`p-2 rounded-full group-hover:bg-${color}/10 -m-2`}>
      <Icon />
    </div>
    {count && <Text className={`group-hover:text-${color}`}>{count}</Text>}
  </Flex>
)

export const TweetInteraction = ({ replyCount, retweetCount, likeCount }) => (
  <Flex gap='6'>
    <TweetInteractionButton
      icon={ReplyIcon}
      count={replyCount}
      color='blue-500'
    />
    <TweetInteractionButton
      icon={RetweetIcon}
      count={retweetCount}
      color='green-500'
    />
    <TweetInteractionButton
      icon={LikeIcon}
      count={likeCount}
      color='pink-500'
    />
    <TweetInteractionButton icon={ShareIcon} count={null} color='blue-500' />
  </Flex>
)

export const Tweet = async ({ tweet }) => {
  const interactions = {} as any

  return (
    <div className='border-b p-4 hover:bg-gray-50 transition-colors'>
      <Flex gap='3'>
        <div className='w-12'>
          <Avatar src='/api/placeholder/48/48' className='w-12 h-12' />
        </div>
        <div className='flex-1 min-w-0'>
          <Flex gap='2' align='center'>
            <Flex align='center' gap='1'>
              <Text weight='bold'>{tweet?.edges?.author?.name}</Text>
            </Flex>
            <Text className='text-gray-500'>
              @{tweet?.edges?.author?.username}・
              {formatDistanceFromNow(tweet.created_at)}
            </Text>
          </Flex>
          <Text className='mt-1'>{tweet.content}</Text>
          <TweetInteraction
            replyCount={interactions?.replies}
            retweetCount={interactions?.retweets}
            likeCount={interactions?.likes}
          />
        </div>
      </Flex>
    </div>
  )
}
