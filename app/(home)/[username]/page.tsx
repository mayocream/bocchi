import { Avatar, DeveloperCard, ProfileCard } from '@/components/widgets'
import { Button, Tabs } from '@radix-ui/themes'
import { fetchApiEndpoint } from '@/lib/api'

const ProfileLayout = async ({
  params,
}: {
  params: Promise<{ username: string }>
}) => {
  const { username } = await params
  const account = await fetchApiEndpoint(`/accounts/${username}`)

  return (
    <div className='pt-14'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex gap-4 relative'>
          {/* Left Sidebar */}
          <div className='w-72 py-3 hidden md:block'>
            <div className='sticky top-16'>
              {account && <ProfileCard user={account} />}
            </div>
          </div>

          {/* Main Profile Content */}
          <div className='flex-1 bg-white border-x min-h-screen'>
            {/* Profile Header */}
            <div className='relative'>
              {/* Cover Photo */}
              <div className='h-48 bg-blue-500'>
                {account?.bannar && (
                  <img
                    src={account.bannar}
                    alt='Cover'
                    className='w-full h-full object-cover'
                  />
                )}
              </div>

              {/* Profile Picture */}
              <div className='absolute -bottom-16 left-4'>
                <div className='w-32 h-32 rounded-full border-4 border-white bg-gray-200 overflow-hidden'>
                  <Avatar src={account?.avatar} className='w-32 h-32' />
                </div>
              </div>

              {/* Edit Profile Button */}
              <div className='absolute right-4 bottom-4'>
                <Button variant='surface'>編集</Button>
              </div>
            </div>

            {/* Profile Info */}
            <div className='mt-20 px-4'>
              <div className='space-y-1'>
                <h1 className='text-xl font-bold'>{account?.name}</h1>
                <p className='text-gray-500'>@{account?.username}</p>
              </div>

              <p className='mt-3 text-gray-800'>{account?.bio}</p>

              <div className='flex gap-4 mt-3'>
                <Button variant='ghost' className='gap-1'>
                  <span className='font-semibold'>
                    {account?._count?.following}
                  </span>
                  <span className='text-gray-500'>Following</span>
                </Button>
                <Button variant='ghost' className='gap-1'>
                  <span className='font-semibold'>
                    {account?._count?.followers}
                  </span>
                  <span className='text-gray-500'>Followers</span>
                </Button>
              </div>
            </div>

            {/* Profile Tabs */}
            <Tabs.Root defaultValue='posts' className='mt-4'>
              <Tabs.List
                className='flex border-b'
                aria-label='Profile sections'
              >
                <Tabs.Trigger
                  value='tweets'
                  className='flex-1 px-4 py-2 border-b-2 border-transparent data-[state=active]:border-blue-500 data-[state=active]:text-blue-500'
                >
                  Tweets
                </Tabs.Trigger>
                <Tabs.Trigger
                  value='replies'
                  className='flex-1 px-4 py-2 border-b-2 border-transparent data-[state=active]:border-blue-500 data-[state=active]:text-blue-500'
                >
                  Replies
                </Tabs.Trigger>
                <Tabs.Trigger
                  value='media'
                  className='flex-1 px-4 py-2 border-b-2 border-transparent data-[state=active]:border-blue-500 data-[state=active]:text-blue-500'
                >
                  Media
                </Tabs.Trigger>
                <Tabs.Trigger
                  value='likes'
                  className='flex-1 px-4 py-2 border-b-2 border-transparent data-[state=active]:border-blue-500 data-[state=active]:text-blue-500'
                >
                  Likes
                </Tabs.Trigger>
              </Tabs.List>

              <Tabs.Content value='tweets' className='p-4'>
                <div className='text-gray-500 text-center py-8'>
                  No tweets yet
                </div>
              </Tabs.Content>

              <Tabs.Content value='replies' className='p-4'>
                <div className='text-gray-500 text-center py-8'>
                  No replies yet
                </div>
              </Tabs.Content>

              <Tabs.Content value='media' className='p-4'>
                <div className='text-gray-500 text-center py-8'>
                  No media yet
                </div>
              </Tabs.Content>

              <Tabs.Content value='likes' className='p-4'>
                <div className='text-gray-500 text-center py-8'>
                  No likes yet
                </div>
              </Tabs.Content>
            </Tabs.Root>
          </div>

          {/* Right Sidebar */}
          <div className='w-72 py-3 hidden md:block'>
            <div className='sticky top-16'>
              <DeveloperCard />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfileLayout
