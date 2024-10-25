import React from 'react'
import { Container, Flex, Box, Text, Button, Avatar } from '@radix-ui/themes'
import {
  HomeIcon,
  BellIcon,
  EnvelopeClosedIcon,
  MagnifyingGlassIcon,
  ImageIcon,
  FileIcon,
  FaceIcon,
  GlobeIcon,
} from '@radix-ui/react-icons'
import Image from 'next/image'
import Logo from '@/app/icon.svg'
import {
  BoltIcon,
  ReplyIcon,
  RetweetIcon,
  LikeIcon,
  ShareIcon,
} from '@/app/components/icons'

const TweetInteractionButton = ({ icon: Icon, count, color }) => (
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

const Layout = () => {
  return (
    <div className='min-h-screen bg-zinc-50'>
      {/* Top Navigation */}
      <header className='fixed top-0 w-full bg-white border-b z-50'>
        <Container>
          <Flex justify='between' align='center' className='h-14'>
            <Flex gap='6' align='center'>
              <Image src={Logo} alt='Twitter Logo' className='w-6 h-6' />
              <Flex gap='8'>
                <Flex align='center' gap='2' className='text-orange-500'>
                  <HomeIcon className='w-5 h-5' />
                  <Text size='2' weight='bold'>
                    ホーム
                  </Text>
                </Flex>
                <Flex align='center' gap='2'>
                  <BoltIcon />
                  <Text size='2'>モーメント</Text>
                </Flex>
                <Flex align='center' gap='2'>
                  <BellIcon className='w-5 h-5' />
                  <Text size='2'>通知</Text>
                </Flex>
                <Flex align='center' gap='2'>
                  <EnvelopeClosedIcon className='w-5 h-5' />
                  <Text size='2'>メッセージ</Text>
                </Flex>
              </Flex>
            </Flex>

            <Flex gap='4' align='center'>
              <div className='relative'>
                <input
                  type='text'
                  placeholder='キーワード検索'
                  className='pl-8 pr-4 py-1.5 rounded-full border bg-gray-50 focus:outline-none focus:border-orange-500 w-64'
                />
                <MagnifyingGlassIcon className='absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400' />
              </div>
              <Avatar
                src='/api/placeholder/32/32'
                fallback='U'
                className='w-8 h-8'
                radius='full'
              />
              <Button className='bg-orange-500 text-white rounded-full px-4 hover:bg-orange-600'>
                ツイート
              </Button>
            </Flex>
          </Flex>
        </Container>
      </header>

      {/* Main Content */}
      <div className='pt-14'>
        <Container>
          <Flex gap='4' className='relative'>
            {/* Left Sidebar */}
            <div className='w-72 py-3'>
              <div className='sticky top-16'>
                <div className='rounded-xl bg-white p-4 shadow-sm'>
                  <Flex direction='column' gap='3'>
                    <Avatar
                      src='/api/placeholder/48/48'
                      fallback='Y'
                      className='w-12 h-12'
                      radius='full'
                    />
                    <div>
                      <Flex align='center' gap='1'>
                        <Text size='3' weight='bold'>
                          我輩は猫である
                        </Text>
                      </Flex>
                      <Text size='2' color='gray'>
                        @cat
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
                </div>

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
              </div>
            </div>

            {/* Main Timeline */}
            <div className='flex-1 bg-white border-x min-h-screen'>
              {/* Tweet Input */}
              <div className='border-b p-4'>
                <Box className='bg-gray-50 rounded-xl p-4'>
                  <Flex gap='3'>
                    <Avatar
                      src='/api/placeholder/48/48'
                      fallback='Y'
                      className='w-10 h-10'
                      radius='full'
                    />
                    <div className='flex-1'>
                      <input
                        type='text'
                        placeholder='いまどうしてる？'
                        className='w-full bg-transparent border-none focus:outline-none text-lg'
                      />
                      <Flex gap='3' className='mt-4'>
                        <ImageIcon className='w-5 h-5 text-blue-400' />
                        <FileIcon className='w-5 h-5 text-blue-400' />
                        <FaceIcon className='w-5 h-5 text-blue-400' />
                        <GlobeIcon className='w-5 h-5 text-blue-400' />
                      </Flex>
                    </div>
                  </Flex>
                </Box>
              </div>

              {/* Timeline */}
              <div>
                {Array.from({ length: 3 }).map((_, i) => (
                  <div
                    key={i}
                    className='border-b p-4 hover:bg-gray-50 transition-colors'
                  >
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
                          <Text className='text-gray-500'>
                            @mayo・12秒
                          </Text>
                        </Flex>
                        <Text className='mt-1'>
                        ヤーヤーヤーヤーヤー　唱タイム
                        天辺の御成り　ほらおいで
                        宵をコンプリート　オーライ Hell yeah yeah yeah
                        だんだんノリノリで超簡単 Brah brah brah！！！ Pow
                        えも言われない Ain't nobody stop
                        </Text>
                        <Flex gap='6' className='mt-2'>
                          <TweetInteractionButton
                            icon={ReplyIcon}
                            count='1'
                            color='blue-500'
                          />
                          <TweetInteractionButton
                            icon={RetweetIcon}
                            count='7'
                            color='green-500'
                          />
                          <TweetInteractionButton
                            icon={LikeIcon}
                            count='18'
                            color='pink-500'
                          />
                          <TweetInteractionButton
                            icon={ShareIcon}
                            color='blue-500'
                            count={null}
                          />
                        </Flex>
                      </div>
                    </Flex>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Sidebar */}
            <div className='w-72 py-3'>
              <div className='sticky top-16'>
                <div className='rounded-xl bg-white p-4 shadow-sm'>
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
                          <Avatar
                            src='/api/placeholder/32/32'
                            fallback='R'
                            className='w-8 h-8'
                            radius='full'
                          />
                          <div>
                            <Text size='2' weight='bold'>
                              真夜
                            </Text>
                            <Text size='1' color='gray'>
                              @mayo
                            </Text>
                          </div>
                        </Flex>
                        <Button
                          variant='soft'
                          size='1'
                          className='rounded-full'
                        >
                          フォローする
                        </Button>
                      </Flex>
                    ))}
                  </Flex>
                </div>
              </div>
            </div>
          </Flex>
        </Container>
      </div>
    </div>
  )
}

export default Layout
