'use client'

import Landing from '@/app/components/landing'
import { Button, TextField, Text } from '@radix-ui/themes'
import { Turnstile } from '@marsidev/react-turnstile'
import { useFormState } from 'react-dom'
import { createAccount } from '@/app/actions'

export default function Page() {
  const [message, action, pending] = useFormState(createAccount, null)

  return (
    <Landing>
      <Text size='2' className='text-red-500'>
        {message}
      </Text>
      <form action={action} className='space-y-6 text-white'>
        <div className='space-y-2'>
          <Text as='label' size='2'>
            ユーザー名
          </Text>
          <TextField.Root
            name='username'
            type='text'
            required
            pattern='[a-zA-Z0-9]+'
            placeholder='ユニークなユーザー名を入力してください'
          />
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
    </Landing>
  )
}
