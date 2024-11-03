import Image from 'next/image'
import Logo from '@/app/icon.svg'
import { Button } from '@radix-ui/themes'
import {
  BellIcon,
  EnvelopeClosedIcon,
  MagnifyingGlassIcon,
  HomeIcon,
} from '@radix-ui/react-icons'
import { BoltIcon } from '@/components/icons'
import Link from 'next/link'

export const TopNavigation = ({ user }) => {
  return (
    <header className='fixed top-0 w-full bg-white border-b z-50'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex justify-between items-center h-14'>
          <div className='flex items-center gap-6'>
            <Image
              src={Logo}
              alt='Twitter Logo'
              className='w-6 h-6 hidden md:block'
            />
            <nav className='flex gap-8'>
              <div className='flex items-center gap-2 text-blue-500'>
                <HomeIcon className='w-5 h-5' />
                <span className='hidden md:block font-bold text-sm'>
                  ホーム
                </span>
              </div>
              <div className='flex items-center gap-2'>
                <BoltIcon />
                <span className='hidden md:block text-sm'>モーメント</span>
              </div>
              <div className='flex items-center gap-2'>
                <BellIcon className='w-5 h-5' />
                <span className='hidden md:block text-sm'>通知</span>
              </div>
              <div className='flex items-center gap-2'>
                <EnvelopeClosedIcon className='w-5 h-5' />
                <span className='hidden md:block text-sm'>メッセージ</span>
              </div>
            </nav>
          </div>

          <div className='flex items-center gap-4'>
            <div className='relative'>
              <input
                type='text'
                placeholder='キーワード検索'
                className='pl-8 pr-4 py-1.5 rounded-full border bg-gray-50 focus:outline-none focus:border-blue-500 w-64'
              />
              <MagnifyingGlassIcon className='absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400' />
            </div>

            {user ? (
              <Button>ツイート</Button>
            ) : (
              <Button asChild>
                <Link href='/login'>ログイン</Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
