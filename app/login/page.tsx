'use client'

import Landing from '@/app/components/landing'
import { Text, Button, TextField } from '@radix-ui/themes'
import { Turnstile } from '@marsidev/react-turnstile'
import Link from 'next/link'
import { useActionState } from 'react'
import { login } from '@/app/actionts'

const Page = () => {
  const [state, action, pending] = useActionState(login, null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    await action(new FormData(e.currentTarget))
  }

  return (
    <Landing>
      <Text size='2' className='text-red-500'>
        {state?.message}
      </Text>
      <form onSubmit={handleSubmit} className='space-y-6 text-white'>
        <div className='space-y-2'>
          <Text as='label' size='2'>
            ユーザー名
          </Text>
          <TextField.Root
            name='username'
            type='text'
            pattern='[a-zA-Z0-9_]+'
            required
            placeholder='ユーザー名を入力してください'
          >
            <TextField.Slot side='right'>
              <Text size='2'>@twitter.co.jp</Text>
            </TextField.Slot>
          </TextField.Root>
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
              <span className='px-2 text-gray-500 bg-blue-900'>または</span>
            </div>
          </div>

          <div className='flex flex-col space-y-4'>
            <Button
              asChild
              className='w-full bg-transparent border-2 border-blue-500 text-blue-500 font-bold py-3 px-4 rounded-lg'
            >
              <Link href='/signup'>Password でアカウントを作成</Link>
            </Button>
          </div>
        </div>
      </form>
    </Landing>
  )
}

export default Page
