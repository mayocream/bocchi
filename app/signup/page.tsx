'use client'

import Landing from '@/app/components/landing'
import { Button, TextField, Text } from '@radix-ui/themes'
import { Turnstile } from '@marsidev/react-turnstile'

const LoginPage = () => {
  return (
    <Landing>
      <form method='POST' className='space-y-6 text-white'>
        <div className='space-y-2'>
          <Text as='label' size='2' className='text-white'>
            ユーザー名
          </Text>
          <TextField.Root
            name='username'
            type='text'
            placeholder='ユニークなユーザー名を入力してください'
            pattern='[a-zA-Z0-9_]{3,}'
          />
        </div>

        <div className='space-y-2'>
          <Text as='label' size='2' className='text-white'>
            メールアドレス
          </Text>
          <TextField.Root
            name='email'
            type='email'
            placeholder='メールアドレスを入力してください'
          />
        </div>

        <div className='space-y-2'>
          <Text as='label' size='2' className='text-white'>
            パスワード
          </Text>
          <TextField.Root
            name='password'
            type='password'
            placeholder='お好きなパスワードを入力してください'
            pattern='.{6,}'
          />
        </div>

        <Turnstile siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!} />

        <Button type='submit'>アカウントを作成</Button>
      </form>
    </Landing>
  )
}

export default LoginPage
