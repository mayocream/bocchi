'use client'

import {
  Flex,
  Avatar as RadixAvatar,
  Text,
  Box,
  Button,
} from '@radix-ui/themes'
import { GitHubLogoIcon } from '@radix-ui/react-icons'
import Link from 'next/link'
import { useUser } from '@/app/providers/user'
import Image from 'next/image'
import Akkarin from '@/app/assets/transparent_akkarin.jpg'

export const Avatar = ({ src, className }) => {
  return (
    <RadixAvatar
      src={src}
      fallback={<Image src={Akkarin} alt='akkarin' className='rounded-full' />}
      className={className}
      radius='full'
    />
  )
}

export const ProfileCard = () => {
  const user = useUser()

  return (
    <Box className='rounded-xl bg-white p-4 shadow-sm'>
      <Flex direction='column' gap='3'>
        <Avatar src={user?.avatar} className='w-12 h-12' />
        <div>
          <Flex align='center' gap='1'>
            <Text size='3' weight='bold'>
              {user?.name ?? '吾輩は猫である'}
            </Text>
          </Flex>
          <Text size='2' color='gray'>
            @{user?.username}
          </Text>
        </div>
        <Flex gap='4' className='mt-2'>
          <div>
            <Text weight='bold'>25,921</Text>
            <Text size='1' color='gray'>
              ツイート
            </Text>
          </div>
          <div>
            <Text weight='bold'>1,654</Text>
            <Text size='1' color='gray'>
              フォロー
            </Text>
          </div>
          <div>
            <Text weight='bold'>27,079</Text>
            <Text size='1' color='gray'>
              フォロワー
            </Text>
          </div>
        </Flex>
      </Flex>
    </Box>
  )
}

export const TrendCard = () => {
  return (
    <Box className='mt-4 rounded-xl bg-white p-4 shadow-sm'>
      <Text size='3' weight='bold' className='mb-2'>
        日本のトレンド
      </Text>
      <Flex direction='column' gap='3'>
        {[
          { text: '#上司を選べるRPG', tweets: '2,158件のツイート' },
          {
            text: '#あなたが止められないもの',
            tweets: '2,158件のツイート',
          },
          { text: '平成最後の水曜日', tweets: '2,158件のツイート' },
          { text: 'ヤンセン', tweets: '2,158件のツイート' },
          { text: 'エリクセン', tweets: '2,158件のツイート' },
        ].map((trend) => (
          <div
            key={trend.text}
            className='hover:bg-gray-50 -mx-2 px-2 py-1 rounded cursor-pointer'
          >
            <Text weight='bold'>{trend.text}</Text>
            <Text size='1' color='gray'>
              {trend.tweets}
            </Text>
          </div>
        ))}
      </Flex>
    </Box>
  )
}

export const RecommendCard = () => {
  return (
    <Box className='rounded-xl bg-white p-4 shadow-sm'>
      <Flex justify='between' align='center' className='mb-4'>
        <Text size='3' weight='bold'>
          おすすめユーザー
        </Text>
        <Text
          size='2'
          className='text-orange-500 cursor-pointer hover:underline'
        >
          すべて見る
        </Text>
      </Flex>
      <Flex direction='column' gap='4'>
        {Array.from({ length: 3 }).map((_, i) => (
          <Flex key={i} justify='between' align='center'>
            <Flex gap='2' align='center'>
              <Avatar src='/api/placeholder/32/32' className='w-8 h-8' />
              <div>
                <Text size='2' weight='bold'>
                  真夜
                </Text>
                <Text size='1' color='gray'>
                  @mayo
                </Text>
              </div>
            </Flex>
            <Button variant='soft' size='1' className='rounded-full'>
              フォローする
            </Button>
          </Flex>
        ))}
      </Flex>
    </Box>
  )
}

export const DeveloperCard = () => {
  return (
    <Box className='mt-4 rounded-xl bg-white p-4 shadow-sm'>
      <Flex direction='column' gap='4'>
        <div>
          <Text size='3' weight='bold' className='mb-2'>
            開発
          </Text>
          <Text size='2' color='gray' className='mb-4'>
            オープンソースプロジェクト
          </Text>
        </div>

        {/* GitHub Stats */}
        <div className='bg-gray-50 p-3 rounded-lg'>
          <Flex justify='between' align='center' className='mb-3'>
            <Text size='2' weight='bold'>
              GitHub Stats
            </Text>
            <Button
              asChild
              variant='soft'
              className='rounded-full flex items-center gap-1'
              size='1'
            >
              <Link href='https://github.com/mayocream/twitter'>
                <GitHubLogoIcon />
                Follow
              </Link>
            </Button>
          </Flex>

          <Flex direction='column' gap='2'>
            {/* Progress Bar */}
            <div className='mt-2'>
              <Flex justify='between' className='mb-1'>
                <Text size='1' color='gray'>
                  Progress to v1.0
                </Text>
                <Text size='1' weight='bold'>
                  10%
                </Text>
              </Flex>
              <div className='w-full bg-gray-200 rounded-full h-2'>
                <div
                  className='bg-blue-500 h-2 rounded-full'
                  style={{ width: '10%' }}
                />
              </div>
            </div>
          </Flex>
        </div>
      </Flex>
    </Box>
  )
}
