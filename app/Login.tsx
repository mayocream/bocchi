import { Container, Flex, Button, Text, TextField } from '@radix-ui/themes'
import { MagnifyingGlassIcon, PlusIcon, CheckIcon } from '@radix-ui/react-icons'
import { Turnstile } from '@marsidev/react-turnstile'
import Image from 'next/image'
import Logo from '@/app/icon.svg'

const LoginPage = () => {
  return (
    <div className='min-h-screen bg-gradient-to-r from-blue-400 to-blue-500 relative'>
      <Container className='p-0'>
        <Flex className='min-h-screen relative'>
          {/* Left Section */}
          <div className='hidden lg:flex lg:w-1/2 items-center justify-center relative'>
            {/* Large Background Logo */}
            <div className='fixed inset-0 w-1/2'>
              <div className='relative w-[200%] h-[120%] -left-1/2 -top-1/4 opacity-20'>
                <Image
                  src={Logo}
                  alt='Background Logo'
                  fill
                  className='object-contain brightness-200 saturate-200 mix-blend-soft-light'
                  priority
                />
              </div>
            </div>

            {/* Content */}
            <div className='space-y-8 text-white relative z-10 p-12'>
              <div className='space-y-6'>
                <div className='flex items-center space-x-4'>
                  <MagnifyingGlassIcon className='w-8 h-8 text-white' />
                  <Text size='5' className='text-white font-medium'>
                    トレンドを見つけよう
                  </Text>
                </div>
                <div className='flex items-center space-x-4'>
                  <PlusIcon className='w-8 h-8 text-white' />
                  <Text size='5' className='text-white font-medium'>
                    会話に参加しましょう
                  </Text>
                </div>
                <div className='flex items-center space-x-4'>
                  <CheckIcon className='w-8 h-8 text-white' />
                  <Text size='5' className='text-white font-medium'>
                    つながりを保ちましょう
                  </Text>
                </div>
              </div>
            </div>
          </div>

          {/* Right Section */}
          <div className='w-full lg:w-1/2 flex items-center justify-center p-8 bg-black/80 relative z-20'>
            <div className='w-full max-w-md space-y-8'>
              <div className='text-center mb-8'>
                <div className='relative w-12 h-12 mx-auto mb-6'>
                  <Image
                    src={Logo}
                    alt='Logo'
                    fill
                    className='object-contain'
                    priority
                  />
                </div>
                <Text size='8' className='text-white font-bold'>
                  「いま」起きていることを見つけよう
                </Text>
              </div>

              <form className='space-y-6 text-white'>
                <TextField.Root
                  type='email'
                  placeholder='ユーザー名'
                  className='bg-black border border-gray-700 rounded-lg'
                />

                <TextField.Root
                  type='password'
                  placeholder='パスワード'
                  className='bg-black border border-gray-700 rounded-lg'
                />

                <Turnstile
                  siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!}
                />

                <div className='space-y-4 pt-4'>
                  <Button className='w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-lg'>
                    ログイン
                  </Button>

                  <div className='relative'>
                    <div className='absolute inset-0 flex items-center'>
                      <div className='w-full border-t border-gray-700'></div>
                    </div>
                    <div className='relative flex justify-center text-sm'>
                      <span className='px-2 text-gray-500 bg-black'>
                        または
                      </span>
                    </div>
                  </div>

                  <Button
                    className='w-full bg-transparent border-2 border-blue-500 text-blue-500 font-bold py-3 px-4 rounded-lg'
                    variant='outline'
                  >
                    アカウント作成
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </Flex>
      </Container>
    </div>
  )
}

export default LoginPage
