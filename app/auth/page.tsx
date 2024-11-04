import { X } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { IconButton, Button } from '@radix-ui/themes'

export default function Page() {
  return (
    <div className='relative min-h-screen flex flex-col bg-white'>
      {/* Close button - fixed to top right */}
      <div className='fixed top-6 right-6'>
        <IconButton variant='ghost' color='gray'>
          <X size={24} className='text-gray-600' />
        </IconButton>
      </div>

      {/* Main content */}
      <main className='flex-1 flex items-center justify-center px-4 mb-[5rem]'>
        <div className='w-full max-w-sm flex flex-col items-center'>
          {/* Logo */}
          <div className='flex flex-col items-center mb-8'>
            <Image
              className='mb-5 w-24 h-24'
              width={96}
              height={96}
              src='/icon.svg'
              alt='Logo'
            />
            <h1 className='text-5xl font-bold mb-2'>Twitter</h1>
            <p className='text-gray-600 font-bold'>最近どう？</p>
          </div>

          {/* Buttons */}
          <div className='w-80 space-y-4'>
            <Button asChild className='w-full h-12 font-bold'>
              <Link href='/auth/signup'>アカウントを作成</Link>
            </Button>
            <Button asChild className='w-full h-12 font-bold' variant='soft'>
              <Link href='/auth/login'>ログイン</Link>
            </Button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className='fixed bottom-0 left-0 right-0 bg-white py-4'>
        <div className='mx-auto max-w-screen-lg px-4 border-t'>
          <div className='flex justify-center space-x-6 text-sm text-gray-500 py-4'>
            <Link
              href='https://github.com/mayocream/twitter'
              className='text-blue-500 hover:underline'
            >
              GitHub
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
