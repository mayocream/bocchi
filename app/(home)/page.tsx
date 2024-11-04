import Editor from '@/components/editor'
import { DeveloperCard, ProfileCard } from '@/components/widgets'
import { auth } from '@/lib/auth'

export default async function Page() {
  const user = await auth()

  return (
    <>
      {/* Main Content */}
      <div className='pt-14'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex gap-4 relative'>
            {/* Left Sidebar */}
            <div className='w-72 py-3 hidden md:block'>
              <div className='sticky top-16'>
                {user && <ProfileCard user={user} />}
              </div>
            </div>

            {/* Main Timeline */}
            <div className='flex-1 bg-white border-x min-h-screen'>
              {user && (
                <div className='border-b p-4'>
                  <Editor />
                </div>
              )}
            </div>

            {/* Right Sidebar */}
            <div className='w-72 py-3 hidden md:block'>
              <div className='sticky top-16'>
                {/* <RecommendCard /> */}
                <DeveloperCard />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
