'use client'

import { Button, TextField, Text } from '@radix-ui/themes'
import { Turnstile } from '@marsidev/react-turnstile'
import { useActionState } from 'react'
import { signup } from '@/app/actionts'

export default function Page() {
  const [state, action, pending] = useActionState(signup, null)

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
          <Text as='label' size='2'>
            メールアドレス
          </Text>
          <TextField.Root
            name='email'
            type='email'
            required
            placeholder='メールアドレスを入力してください'
          />
        </div>

        <div className='space-y-2'>
          <Text as='label' size='2'>
            パスワード
          </Text>
          <TextField.Root
            name='password'
            type='password'
            required
            placeholder='お好きなパスワードを入力してください'
          />
        </div>

        <Turnstile siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!} />

        <Button disabled={pending} type='submit' className='w-full'>
          アカウントを作成
        </Button>
      </form>
    </>
  )
}
