'use client'

import Landing from '@/app/components/landing'
import { Text, Button, TextField } from '@radix-ui/themes'
import { Turnstile } from '@marsidev/react-turnstile'
import Link from 'next/link'
import GoogleIcon from '@/app/assets/svg/google.svg'
import { DiscordLogoIcon } from '@radix-ui/react-icons'
import Image from 'next/image'
import { useForm } from 'react-hook-form'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

const LoginPage = () => {
  const router = useRouter()
  const [error, setError] = useState('')
  const [turnstileToken, setTurnstileToken] = useState('')
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      username: '',
      password: '',
    },
  })

  const onSubmit = async (data) => {
    try {
      if (!turnstileToken) {
        setError('Please complete the captcha')
        return
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/login`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...data,
            token: turnstileToken,
          }),
        }
      )

      if (!response.ok) {
        const error = await response.json()
        throw new Error('ログインに失敗しました')
      }

      router.push('/') // Redirect after successful login
    } catch (err) {
      setError(String(err))
    }
  }

  return (
    <Landing>
      <form onSubmit={handleSubmit(onSubmit)} className='space-y-6 text-white'>
        {error && <Text className='text-red-500 text-sm'>{error}</Text>}

        <div className='space-y-2'>
          <Text as='label' size='2' className='text-white'>
            ユーザー名
          </Text>
          <TextField.Root
            {...register('username', {
              required: 'ユーザー名は必須です',
              pattern: {
                value: /^[a-zA-Z0-9_]{3,}$/,
                message:
                  'ユーザー名は3文字以上の英数字とアンダースコアのみ使用可能です',
              },
            })}
            placeholder='ユーザー名を入力してください'
          />
          {errors.username && (
            <Text className='text-red-500 text-sm'>
              {errors.username.message}
            </Text>
          )}
        </div>

        <div className='space-y-2'>
          <Text as='label' size='2' className='text-white'>
            パスワード
          </Text>
          <TextField.Root
            type='password'
            {...register('password', {
              required: 'パスワードは必須です',
              minLength: {
                value: 6,
                message: 'パスワードは6文字以上である必要があります',
              },
            })}
            placeholder='パスワードを入力してください'
          />
          {errors.password && (
            <Text className='text-red-500 text-sm'>
              {errors.password.message}
            </Text>
          )}
        </div>

        <Turnstile
          siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!}
          onSuccess={setTurnstileToken}
        />

        <div className='space-y-4 pt-4'>
          <Button
            type='submit'
            disabled={isSubmitting}
            className='w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-lg'
          >
            {isSubmitting ? 'ログイン中...' : 'ログイン'}
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
      </form>
    </Landing>
  )
}

export default LoginPage
