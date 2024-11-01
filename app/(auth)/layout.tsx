import { Container, Flex, Text } from '@radix-ui/themes'
import { MagnifyingGlassIcon, Pencil1Icon } from '@radix-ui/react-icons'
import Image from 'next/image'
import Logo from '@/app/icon.svg'

export default function Layout({ children }) {
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
                  <Text size='6' className='text-white font-medium'>
                    トレンドを見つけよう
                  </Text>
                </div>
                <div className='flex items-center space-x-4'>
                  <svg
                    className='w-8 h-8 text-white'
                    fill='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path d='M21 7.337h-3.93l.372-4.272a.751.751 0 0 0-.682-.812.752.752 0 0 0-.812.683l-.383 4.4h-6.32l.37-4.27a.75.75 0 0 0-.68-.813.751.751 0 0 0-.813.683l-.382 4.4H3.782a.75.75 0 0 0 0 1.5h3.787l-.57 6.5H3.062a.75.75 0 0 0 0 1.5h3.782l-.37 4.27a.75.75 0 0 0 .682.812l.066.003a.75.75 0 0 0 .746-.686l.383-4.4h6.32l-.37 4.27a.75.75 0 0 0 .682.812l.066.003a.75.75 0 0 0 .746-.686l.382-4.4h3.957c.413 0 .75-.337.75-.75s-.337-.75-.75-.75H16.39l.57-6.5h3.957a.75.75 0 0 0 0-1.5zm-6.35 8h-6.32l.57-6.5h6.32l-.57 6.5z' />
                  </svg>
                  <Text size='6' className='text-white font-medium'>
                    会話に参加しましょう
                  </Text>
                </div>
                <div className='flex items-center space-x-4'>
                  <Pencil1Icon className='w-8 h-8 text-white' />
                  <Text size='6' className='text-white font-medium'>
                    表現の自由を楽しもう
                  </Text>
                </div>
              </div>
            </div>
          </div>

          {/* Right Section */}
          <div className='w-full lg:w-1/2 flex items-center justify-center p-8 bg-black/20 relative z-20'>
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
              {children}
            </div>
          </div>
        </Flex>
      </Container>
    </div>
  )
}
