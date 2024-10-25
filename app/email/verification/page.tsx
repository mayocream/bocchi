import { Card, Text, Container, Heading } from '@radix-ui/themes'
import { CheckCircledIcon, CrossCircledIcon } from '@radix-ui/react-icons'

export default async function Page({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const token = searchParams.token

  if (!token) {
    return (
      <VerificationMessage
        status='error'
        title='トークンエラー'
        message='トークンが見つかりません'
      />
    )
  }

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL!}/auth/email/verification`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    }
  )

  if (response.ok) {
    return (
      <VerificationMessage
        status='success'
        title='認証完了'
        message='メールアドレスが認証されました'
      />
    )
  }

  return (
    <VerificationMessage
      status='error'
      title='認証エラー'
      message='トークンが無効です'
    />
  )
}

const VerificationMessage = ({
  status,
  title,
  message,
}: {
  status: 'success' | 'error'
  title: string
  message: string
}) => (
  <div className='min-h-screen bg-slate-50 flex items-center justify-center p-4'>
    <Container size='1'>
      <Card className='p-6'>
        <div className='flex flex-col items-center text-center space-y-4'>
          {status === 'success' ? (
            <CheckCircledIcon className='w-8 h-8 text-green-500' />
          ) : (
            <CrossCircledIcon className='w-8 h-8 text-red-500' />
          )}

          <Heading
            size='4'
            className={status === 'success' ? 'text-green-700' : 'text-red-700'}
          >
            {title}
          </Heading>

          <Text size='2' className='text-slate-600'>
            {message}
          </Text>
        </div>
      </Card>
    </Container>
  </div>
)
