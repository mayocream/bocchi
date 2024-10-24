'use client'

import { useForm } from 'react-hook-form'
import Landing from '@/app/components/landing'
import { Button, TextField, Text } from '@radix-ui/themes'
import { Turnstile } from '@marsidev/react-turnstile'

type FormData = {
  username: string
  email: string
  password: string
  token: string
}

const Page = () => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormData>()

  const onSubmit = async (data: FormData) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL!}/auth/register`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        }
      )

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      console.log('Success:', result)
    } catch (error) {
      console.error('Error:', error)
    }
  }

  return (
    <Landing>
      <form onSubmit={handleSubmit(onSubmit)} className='space-y-6 text-white'>
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
                  '3文字以上の半角英数字とアンダースコアのみ使用可能です',
              },
            })}
            placeholder='ユニークなユーザー名を入力してください'
          />
          {errors.username && (
            <Text color='red' size='2'>
              {errors.username.message}
            </Text>
          )}
        </div>

        <div className='space-y-2'>
          <Text as='label' size='2' className='text-white'>
            メールアドレス
          </Text>
          <TextField.Root
            {...register('email', {
              required: 'メールアドレスは必須です',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: '有効なメールアドレスを入力してください',
              },
            })}
            type='email'
            placeholder='メールアドレスを入力してください'
          />
          {errors.email && (
            <Text color='red' size='2'>
              {errors.email.message}
            </Text>
          )}
        </div>

        <div className='space-y-2'>
          <Text as='label' size='2' className='text-white'>
            パスワード
          </Text>
          <TextField.Root
            {...register('password', {
              required: 'パスワードは必須です',
              minLength: {
                value: 6,
                message: 'パスワードは6文字以上で入力してください',
              },
            })}
            type='password'
            placeholder='お好きなパスワードを入力してください'
          />
          {errors.password && (
            <Text color='red' size='2'>
              {errors.password.message}
            </Text>
          )}
        </div>

        <Turnstile
          siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!}
          onSuccess={(token) => setValue('token', token)}
        />

        <Button type='submit' disabled={isSubmitting}>
          {isSubmitting ? '送信中...' : 'アカウントを作成'}
        </Button>
      </form>
    </Landing>
  )
}

export default Page
