import { Container, Flex } from '@radix-ui/themes'
import { TopNavigation } from '@/app/components/navigation'
import { Tweet } from '@/app/components/timeline'
import {
  DeveloperCard,
  ProfileCard,
  RecommendCard,
  TrendCard,
} from '@/app/components/widgets'
import { getSession } from '@/app/lib/auth'
import { UserProvider } from '@/app/providers/user'
import { TweetTextarea } from './components/textarea'

export default async function Timeline({ tweets }) {
  // initialize user
  let user = await getSession()
  if (user) {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/accounts/${user.id}`
    )
    user = await response.json()
  }

  return (
    <UserProvider user={user}>
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
                  <TweetTextarea />
                </div>

                {/* Timeline */}
                <div>
                  {tweets.map((tweet) => (
                    <Tweet key={tweet.id} tweet={tweet} />
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
    </UserProvider>
  )
}
