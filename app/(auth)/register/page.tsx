'use client'

import { Button, TextField, Text } from '@radix-ui/themes'
import { Turnstile } from '@marsidev/react-turnstile'
import { signup } from '@/app/actionts'
import { useState } from 'react'
import toast from 'react-hot-toast'

export default function Page() {
  const [pending, setPending] = useState(false)
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const form = event.currentTarget as HTMLFormElement
    const data = new FormData(form)

    setPending(true)
    const state = await signup(data)
    if (state.message) {
      toast.error(state.message)
    }
    setPending(false)
  }

  return (
    <>
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
