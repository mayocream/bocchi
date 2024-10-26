'use client'

import Landing from '@/app/components/landing'
import { Text, Button, TextField } from '@radix-ui/themes'
import { Turnstile } from '@marsidev/react-turnstile'
import Link from 'next/link'
import GoogleIcon from '@/app/assets/svg/google.svg'
import { DiscordLogoIcon } from '@radix-ui/react-icons'
import Image from 'next/image'
import { useFormState } from 'react-dom'
import { createSession } from '@/app/actions'

const Page = () => {
  const [message, action, pending] = useFormState(createSession, null)

  return (
    <Landing>
      <Text size='2' className='text-red-500'>
        {message as string}
      </Text>
      <form action={action} className='space-y-6 text-white'>
        <div className='space-y-2'>
          <Text as='label' size='2' className='text-white'>
            ユーザー名
          </Text>
          <TextField.Root
            name='username'
            type='text'
            required
            placeholder='ユーザー名を入力してください'
          />
        </div>

        <div className='space-y-2'>
          <Text as='label' size='2' className='text-white'>
            パスワード
          </Text>
          <TextField.Root
            name='password'
            required
            type='password'
            placeholder='パスワードを入力してください'
          />
        </div>

        <Turnstile siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!} />

        <div className='space-y-4 pt-4'>
          <Button
            disabled={pending}
            type='submit'
            className='w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-lg'
          >
            ログイン
          </Button>

          <div className='relative'>
            <div className='absolute inset-0 flex items-center'>
              <div className='w-full border-t border-gray-700'></div>
            </div>
            <div className='relative flex justify-center text-sm'>
              <span className='px-2 text-gray-500 bg-black'>または</span>
            </div>
          </div>

          <div className='flex flex-col space-y-4'>
            <Button
              asChild
              className='w-full bg-transparent border-2 border-blue-500 text-blue-500 font-bold py-3 px-4 rounded-lg'
            >
              <Link href='/signup'>Password でアカウントを作成</Link>
            </Button>

            <div className='hidden'>
              <Button>
                <Image src={GoogleIcon} alt='google' className='w-5 h-5 mr-2' />
                Google でログイン
              </Button>

              <Button>
                <DiscordLogoIcon className='w-5 h-5 mr-2' />
                Discord でログイン
              </Button>
            </div>
          </div>
        </div>
      </form>
    </Landing>
  )
}

export default Page
