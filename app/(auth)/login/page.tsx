'use client'

import { Text, Button, TextField } from '@radix-ui/themes'
import { Turnstile } from '@marsidev/react-turnstile'
import Link from 'next/link'
import { useActionState } from 'react'
import { login } from '@/app/actionts'

const Page = () => {
  const [state, action, pending] = useActionState(login, null)

  return (
    <>
      <Text size='2' className='text-red-500'>
        {state?.message}
      </Text>
      <form action={action} className='space-y-6 text-white'>
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
          <Button disabled={pending} className='w-full' type='submit'>
            ログイン
          </Button>

          <div className='relative'>
            <div className='absolute inset-0 flex items-center'>
              <div className='w-full border-t border-gray-700'></div>
            </div>
            <div className='relative flex justify-center text-sm'>
              <span className='px-2 text-gray-500 bg-blue-500'>または</span>
            </div>
          </div>

          <div className='flex flex-col space-y-4'>
            <Button asChild>
              <Link href='/register'>Password でアカウントを作成</Link>
            </Button>
          </div>
        </div>
      </form>
    </>
  )
}

export default Page
