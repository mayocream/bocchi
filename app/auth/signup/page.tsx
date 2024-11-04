import { X, Mail, Lock, AtSign } from 'lucide-react'
import Link from 'next/link'
import { IconButton, Button, Text, TextField } from '@radix-ui/themes'
import { Turnstile } from '@marsidev/react-turnstile'

export default function Page() {
  return (
    <div className='min-h-screen flex'>
      {/* Left Panel */}
      <div className='hidden sm:w-1/2 bg-gray-50 p-12 sm:flex flex-col justify-center'>
        <h1 className='text-5xl font-bold text-blue-500 mb-4'>
          アカウントを作成
        </h1>
        <p className='text-gray-600 text-lg'>
          私たちはあなたが参加してくれることをとても楽しみにしています！
        </p>
      </div>

      {/* Right Panel */}
      <div className='sm:w-1/2 p-12 relative flex items-center justify-center w-full'>
        {/* Close button */}
        <div className='fixed top-6 right-6'>
          <IconButton asChild variant='ghost' color='gray'>
            <Link href='/auth'>
              <X size={24} className='text-gray-600' />
            </Link>
          </IconButton>
        </div>

        <div className='max-w-md mx-auto mt-8'>
          <div className='mb-8'>
            <h2 className='text-2xl font-bold mb-8'>あなたのアカウント</h2>

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

              {/* Email */}
              <div>
                <label className='block text-sm mb-2'>メールアドレス</label>
                <TextField.Root
                  size='3'
                  type='email'
                  name='email'
                  variant='soft'
                  color='gray'
                  radius='large'
                  className='w-full h-12'
                  placeholder='メールアドレスを入力'
                  required
                >
                  <TextField.Slot>
                    <Mail size={20} className='ml-2' />
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

              {/* Terms */}
              <p className='text-sm text-gray-600'>
                アカウントを作成することで、
                <Link href='#' className='text-blue-500'>
                  利用規約
                </Link>
                と
                <Link href='#' className='text-blue-500'>
                  プライバシーポリシー
                </Link>
                に同意したものとみなされます。
              </p>

              <Turnstile
                siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!}
              />

              {/* Buttons */}
              <Button className='w-full h-12 font-bold'>
                アカウントを作成
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
