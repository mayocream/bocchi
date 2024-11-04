import { X, Mail, Lock, AtSign } from 'lucide-react'
import Link from 'next/link'
import { IconButton, Button, Text, TextField } from '@radix-ui/themes'
import { Turnstile } from '@marsidev/react-turnstile'

export default function Page() {
  return (
    <div className='min-h-screen flex'>
      {/* Left Panel */}
      <div className='hidden sm:w-1/2 bg-gray-50 p-12 sm:flex flex-col justify-center'>
        <h1 className='text-5xl font-bold text-blue-500 mb-4'>ログイン</h1>
        <p className='text-gray-600 text-lg'>
          ユーザー名とパスワードを入力してください
        </p>
      </div>

      {/* Right Panel */}
      <div className='sm:w-1/2 w-full flex items-center justify-center relative'>
        {/* Close button */}
        <div className='fixed top-6 right-6'>
          <IconButton asChild variant='ghost' color='gray'>
            <Link href='/auth'>
              <X size={24} className='text-gray-600' />
            </Link>
          </IconButton>
        </div>

        <div className='w-full max-w-md px-12'>
          <div className='mb-8'>
            <form className='space-y-6'>
              {/* Username */}
              <div>
                <label className='block text-sm mb-2'>ユーザーハンドル</label>
                <TextField.Root
                  size='3'
                  type='text'
                  name='username'
                  variant='soft'
                  color='gray'
                  radius='large'
                  className='w-full h-12'
                  placeholder='ユーザーハンドルを入力'
                  required
                >
                  <TextField.Slot>
                    <AtSign size={20} className='ml-2' />
                  </TextField.Slot>
                  <TextField.Slot side='right'>
                    <Text size='3' className='mr-2'>
                      .twitter.co.jp
                    </Text>
                  </TextField.Slot>
                </TextField.Root>
              </div>

              {/* Password */}
              <div>
                <label className='block text-sm mb-2'>パスワード</label>
                <TextField.Root
                  size='3'
                  variant='soft'
                  color='gray'
                  radius='large'
                  name='password'
                  type='password'
                  className='w-full h-12'
                  placeholder='パスワードを入力'
                  required
                >
                  <TextField.Slot>
                    <Lock size={20} className='ml-2' />
                  </TextField.Slot>
                </TextField.Root>
              </div>

              <Turnstile
                siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!}
              />

              {/* Buttons */}
              <Button className='w-full h-12 font-bold'>ログイン</Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
