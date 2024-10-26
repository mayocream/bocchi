import { Container, Flex, Box, Avatar } from '@radix-ui/themes'
import { ImageIcon, FileIcon, FaceIcon, GlobeIcon } from '@radix-ui/react-icons'
import { TopNavigation } from '@/app/components/navigation'
import { Tweet } from '@/app/components/timeline'
import {
  DeveloperCard,
  ProfileCard,
  RecommendCard,
  TrendCard,
} from '@/app/components/widgets'
import { getSession } from './lib/auth'
import { redirect } from 'next/navigation'

const Layout = async () => {
  const session = await getSession()
  if (!session) {
    redirect('/login')
  }
  return (
    <div className='min-h-screen bg-zinc-50'>
      {/* Top Navigation */}
      <TopNavigation />

      {/* Main Content */}
      <div className='pt-14'>
        <Container>
          <Flex gap='4' className='relative'>
            {/* Left Sidebar */}
            <div className='w-72 py-3 md:flex hidden'>
              <div className='sticky top-16'>
                <ProfileCard />
                <TrendCard />
              </div>
            </div>

            {/* Main Timeline */}
            <div className='flex-1 bg-white border-x min-h-screen'>
              {/* Tweet Input */}
              <div className='border-b p-4'>
                <Box className='bg-gray-50 rounded-xl p-4'>
                  <Flex gap='3'>
                    <Avatar
                      src='/api/placeholder/48/48'
                      fallback='Y'
                      className='w-10 h-10'
                      radius='full'
                    />
                    <div className='flex-1'>
                      <input
                        type='text'
                        placeholder='いまどうしてる？'
                        className='w-full bg-transparent border-none focus:outline-none text-lg'
                      />
                      <Flex gap='3' className='mt-4'>
                        <ImageIcon className='w-5 h-5 text-blue-400' />
                        <FileIcon className='w-5 h-5 text-blue-400' />
                        <FaceIcon className='w-5 h-5 text-blue-400' />
                        <GlobeIcon className='w-5 h-5 text-blue-400' />
                      </Flex>
                    </div>
                  </Flex>
                </Box>
              </div>

              {/* Timeline */}
              <div>
                {Array.from({ length: 3 }).map((_, i) => (
                  <Tweet key={i} />
                ))}
              </div>
            </div>

            {/* Right Sidebar */}
            <div className='w-72 py-3 md:flex hidden'>
              <div className='sticky top-16'>
                <RecommendCard />

                <DeveloperCard />
              </div>
            </div>
          </Flex>
        </Container>
      </div>
    </div>
  )
}

export default Layout
