import { GitHubLogoIcon } from '@radix-ui/react-icons'
import Link from 'next/link'
import Image from 'next/image'
import Akkarin from '@/app/assets/transparent_akkarin.jpg'

export const Avatar = ({ src, className }) => {
  return (
    <div className={`rounded-full overflow-hidden ${className}`}>
      {src ? (
        <img src={src} alt='avatar' className='w-full h-full object-cover' />
      ) : (
        <Image
          src={Akkarin}
          alt='akkarin'
          className='w-full h-full rounded-full'
        />
      )}
    </div>
  )
}

export const ProfileCard = async ({ user }) => {
  return (
    <div className='rounded-xl bg-white p-4 shadow-sm'>
      <div className='flex flex-col gap-3'>
        <Avatar src={user?.avatar} className='w-12 h-12' />
        <div>
          <div className='flex items-center gap-1'>
            <span className='text-lg font-bold'>
              {user?.name ?? '吾輩は猫である'}
            </span>
          </div>
          <span className='text-sm text-gray-500'>@{user?.username}</span>
        </div>
        <div className='flex gap-4 mt-2'>
          <div>
            <span className='font-bold'>{user?._count?.tweets}</span>
            <span className='text-xs text-gray-500 block'>ツイート</span>
          </div>
          <div>
            <span className='font-bold'>{user?._count?.following}</span>
            <span className='text-xs text-gray-500 block'>フォロー</span>
          </div>
          <div>
            <span className='font-bold'>{user?._count?.followers}</span>
            <span className='text-xs text-gray-500 block'>フォロワー</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export const TrendCard = () => {
  return (
    <div className='mt-4 rounded-xl bg-white p-4 shadow-sm'>
      <h2 className='text-lg font-bold mb-2'>日本のトレンド</h2>
      <div className='flex flex-col gap-3'>
        {[
          { text: '#上司を選べるRPG', tweets: '2,158件のツイート' },
          { text: '#あなたが止められないもの', tweets: '2,158件のツイート' },
          { text: '平成最後の水曜日', tweets: '2,158件のツイート' },
          { text: 'ヤンセン', tweets: '2,158件のツイート' },
          { text: 'エリクセン', tweets: '2,158件のツイート' },
        ].map((trend) => (
          <div
            key={trend.text}
            className='hover:bg-gray-50 -mx-2 px-2 py-1 rounded cursor-pointer'
          >
            <p className='font-bold'>{trend.text}</p>
            <p className='text-xs text-gray-500'>{trend.tweets}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export const RecommendCard = () => {
  return (
    <div className='rounded-xl bg-white p-4 shadow-sm'>
      <div className='flex justify-between items-center mb-4'>
        <span className='text-lg font-bold'>おすすめユーザー</span>
        <span className='text-sm text-orange-500 cursor-pointer hover:underline'>
          すべて見る
        </span>
      </div>
      <div className='flex flex-col gap-4'>
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className='flex justify-between items-center'>
            <div className='flex gap-2 items-center'>
              <Avatar src='/api/placeholder/32/32' className='w-8 h-8' />
              <div>
                <p className='text-sm font-bold'>真夜</p>
                <p className='text-xs text-gray-500'>@mayo</p>
              </div>
            </div>
            <button className='px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-full transition-colors'>
              フォローする
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export const DeveloperCard = () => {
  return (
    <div className='rounded-xl bg-white p-4 shadow-sm'>
      <div className='flex flex-col gap-4'>
        <div>
          <h2 className='text-lg font-bold mb-2'>開発</h2>
          <p className='text-sm text-gray-500 mb-4'>
            オープンソースプロジェクト
          </p>
        </div>

        <div className='bg-gray-50 p-3 rounded-lg'>
          <div className='flex justify-between items-center mb-3'>
            <span className='text-sm font-bold'>GitHub Stats</span>
            <Link
              href='https://github.com/mayocream/twitter'
              className='px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-full transition-colors flex items-center gap-1'
            >
              <GitHubLogoIcon />
              Follow
            </Link>
          </div>

          <div className='flex flex-col gap-2'>
            <div className='mt-2'>
              <div className='flex justify-between mb-1'>
                <span className='text-xs text-gray-500'>Progress to v1.0</span>
                <span className='text-xs font-bold'>10%</span>
              </div>
              <div className='w-full bg-gray-200 rounded-full h-2'>
                <div
                  className='bg-blue-500 h-2 rounded-full'
                  style={{ width: '10%' }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
