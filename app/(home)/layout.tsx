import { Container, Flex } from '@radix-ui/themes'
import { TopNavigation } from '@/components/navigation'
import { Tweet } from '@/components/timeline'
import {
  DeveloperCard,
  ProfileCard,
  RecommendCard,
  TrendCard,
} from '@/components/widgets'
import { auth } from '@/lib/auth'
import { UserProvider } from '@/providers/user'
import { TweetTextarea } from '@/components/textarea'

export default async function Layout({ children }) {
  const user = await auth()

  return (
    <UserProvider user={user}>
      <div className='min-h-screen bg-zinc-50'>
        {/* Top Navigation */}
        <TopNavigation user={user} />

        {/* Main Content */}
        <div className='pt-14'>
          <Container>
            <Flex gap='4' className='relative'>
              {/* Left Sidebar */}
              <div className='w-72 py-3 md:flex hidden'>
                <div className='sticky top-16'>
                  <ProfileCard user={user} />
                  {/* <TrendCard /> */}
                </div>
              </div>

              {/* Main Timeline */}
              <div className='flex-1 bg-white border-x min-h-screen'>
                {/* Tweet Input */}

                {user && (
                  <div className='border-b p-4'>
                    <TweetTextarea />
                  </div>
                )}

                {/* Timeline */}
                <div>{children}</div>
              </div>

              {/* Right Sidebar */}
              <div className='w-72 py-3 md:flex hidden'>
                <div className='sticky top-16'>
                  {/* <RecommendCard /> */}

                  <DeveloperCard />
                </div>
              </div>
            </Flex>
          </Container>
        </div>
      </div>
    </UserProvider>
  )
}
