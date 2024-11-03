import { LikeIcon, ReplyIcon, RetweetIcon, ShareIcon } from './icons'
import { Avatar } from './widgets'
import { formatDistanceFromNow } from '@/lib/date'

export const TweetInteractionButton = ({ icon: Icon, count, color }) => (
  <div
    className={`flex items-center gap-2 text-gray-500 hover:text-${color} group cursor-pointer`}
  >
    <div className={`p-2 rounded-full group-hover:bg-${color}/10 -m-2`}>
      <Icon />
    </div>
    {count && (
      <span className={`text-sm group-hover:text-${color}`}>{count}</span>
    )}
  </div>
)

export const TweetInteraction = ({ replyCount, retweetCount, likeCount }) => (
  <div className='flex gap-6'>
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
  </div>
)

export const Tweet = async ({ tweet }) => {
  const interactions = {} as any

  return (
    <div className='border-b p-4 hover:bg-gray-50 transition-colors'>
      <div className='flex gap-3'>
        <div className='w-12'>
          <Avatar src='/api/placeholder/48/48' className='w-12 h-12' />
        </div>
        <div className='flex-1 min-w-0'>
          <div className='flex gap-2 items-center'>
            <div className='flex items-center gap-1'>
              <span className='font-bold'>{tweet?.edges?.author?.name}</span>
            </div>
            <span className='text-gray-500'>
              @{tweet?.edges?.author?.username}・
              {formatDistanceFromNow(tweet.created_at)}
            </span>
          </div>
          <p className='mt-1'>{tweet.content}</p>
          <div className='mt-3'>
            <TweetInteraction
              replyCount={interactions?.replies}
              retweetCount={interactions?.retweets}
              likeCount={interactions?.likes}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
