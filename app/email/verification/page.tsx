'use client'

import Landing from '@/app/components/landing'
import { Text } from '@radix-ui/themes'
import { useSearchParams } from 'next/navigation'

const EmailVerificationPage = async () => {
  const token = useSearchParams().get('token')

  if (!token) {
    return <Message text='トークンが見つかりません' />
  }

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL!}/auth/email/verification`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    }
  )

  const message = response.ok
    ? 'メールアドレスが認証されました'
    : 'トークンが無効です'

  return <Message text={message} />
}

// Reusable message component
const Message = ({ text }) => (
  <Landing>
    <div className='space-y-6 text-white'>
      <Text as='label' size='2' className='text-white'>
        {text}
      </Text>
    </div>
  </Landing>
)

export default EmailVerificationPage
