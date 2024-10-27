import { Container, Flex, Text, Avatar, Button } from '@radix-ui/themes'
import Image from 'next/image'
import Logo from '@/app/icon.svg'
import {
  BellIcon,
  EnvelopeClosedIcon,
  MagnifyingGlassIcon,
  HomeIcon,
} from '@radix-ui/react-icons'
import { BoltIcon } from '@/app/components/icons'
import Link from 'next/link'

export const TopNavigation = ({ user }) => {
  return (
    <header className='fixed top-0 w-full bg-white border-b z-50'>
      <Container>
        <Flex justify='between' align='center' className='h-14'>
          <Flex gap='6' align='center'>
            <Image
              src={Logo}
              alt='Twitter Logo'
              className='w-6 h-6 md:flex hidden'
            />
            <Flex gap='8'>
              <Flex align='center' gap='2' className='text-blue-500'>
                <HomeIcon className='w-5 h-5' />
                <Text size='2' weight='bold' className='md:flex hidden'>
                  ホーム
                </Text>
              </Flex>
              <Flex align='center' gap='2'>
                <BoltIcon />
                <Text size='2' className='md:flex hidden'>
                  モーメント
                </Text>
              </Flex>
              <Flex align='center' gap='2'>
                <BellIcon className='w-5 h-5' />
                <Text size='2' className='md:flex hidden'>
                  通知
                </Text>
              </Flex>
              <Flex align='center' gap='2'>
                <EnvelopeClosedIcon className='w-5 h-5' />
                <Text size='2' className='md:flex hidden'>
                  メッセージ
                </Text>
              </Flex>
            </Flex>
          </Flex>

          <Flex gap='4' align='center'>
            <div className='relative'>
              <input
                type='text'
                placeholder='キーワード検索'
                className='pl-8 pr-4 py-1.5 rounded-full border bg-gray-50 focus:outline-none focus:border-blue-500 w-64'
              />
              <MagnifyingGlassIcon className='absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400' />
            </div>

            {user ? (
              <Button className='md:flex hidden bg-blue-500 text-white rounded-full px-4 hover:bg-blue-600'>
                ツイート
              </Button>
            ) : (
              <Button
                asChild
                className='md:flex hidden bg-blue-500 text-white rounded-full px-4 hover:bg-blue-600'
              >
                <Link href='/login'>ログイン</Link>
              </Button>
            )}
          </Flex>
        </Flex>
      </Container>
    </header>
  )
}
