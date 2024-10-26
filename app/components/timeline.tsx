import { Flex, Text, Avatar } from '@radix-ui/themes'
import { LikeIcon, ReplyIcon, RetweetIcon, ShareIcon } from './icons'

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

export const Tweet = ({ key }) => {
  return (
    <div key={key} className='border-b p-4 hover:bg-gray-50 transition-colors'>
      <Flex gap='3'>
        <div className='w-12'>
          <Avatar
            src='/api/placeholder/48/48'
            fallback='N'
            className='w-12 h-12'
            radius='full'
          />
        </div>
        <div className='flex-1 min-w-0'>
          <Flex gap='2' align='center'>
            <Flex align='center' gap='1'>
              <Text weight='bold'>Mayo</Text>
            </Flex>
            <Text className='text-gray-500'>@mayo・12秒</Text>
          </Flex>
          <Text className='mt-1'>
            ヤーヤーヤーヤーヤー　唱タイム 天辺の御成り　ほらおいで
            宵をコンプリート　オーライ Hell yeah yeah yeah
            だんだんノリノリで超簡単 Brah brah brah！！！ Pow えも言われない
            Ain't nobody stop
          </Text>
          <TweetInteraction replyCount={12} retweetCount={34} likeCount={56} />
        </div>
      </Flex>
    </div>
  )
}
