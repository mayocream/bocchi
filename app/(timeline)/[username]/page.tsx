import {
  Container,
  Avatar,
  Text,
  Flex,
  Button,
  Tabs,
  Box,
  Card,
  ScrollArea,
} from '@radix-ui/themes'
import { MoreHorizontal, Heart, MessageCircle, Repeat } from 'lucide-react'
import { fetchApiEndpoint } from '@/lib/api'
import { ProfileEditor } from '@/components/profile'

export default async function Page({
  params,
}: {
  params: Promise<{ username: string }>
}) {
  const { username } = await params

  // Early return if username is not available
  if (!username) {
    return (
      <Container>
        <Text color='gray'>Profile not found</Text>
      </Container>
    )
  }

  const profile = await fetchApiEndpoint(`/accounts/${username}`)

  // Handle case where profile fetch fails or returns null
  if (!profile) {
    return (
      <Container>
        <Text color='gray'>Could not load profile</Text>
      </Container>
    )
  }

  return (
    <Container>
      {/* Header Banner */}
      <div className='h-[200px] bg-gray-100 rounded-t-lg mb-16 relative'>
        {/* Profile Avatar */}
        <Avatar
          size='6'
          className='absolute -bottom-8 left-4 border-4 border-white'
          src={profile.avatar}
          fallback={profile.username?.charAt(0) || '?'}
        />
      </div>

      {/* Profile Info */}
      <Box className='px-4'>
        <Flex justify='between' align='center'>
          <Box>
            <Text size='5' weight='bold'>
              {profile.name}
            </Text>
            <Text size='2' color='gray'>
              @{profile.username}
            </Text>
          </Box>
          <Flex gap='2'>
            {/* Only render ProfileDialog if we have valid profile data */}
            <ProfileEditor />
            <Button variant='ghost'>
              <MoreHorizontal className='h-4 w-4' />
            </Button>
          </Flex>
        </Flex>

        <Text className='mt-4'>{profile.bio}</Text>

        {/* Stats */}
        <Flex gap='4' className='mt-4'>
          <Text size='2'>
            <span className='font-bold'>{profile._count?.following || 0}</span>{' '}
            フォロー中
          </Text>
          <Text size='2'>
            <span className='font-bold'>{profile._count?.followers || 0}</span>{' '}
            フォロワー
          </Text>
          <Text size='2'>
            <span className='font-bold'>{profile._count?.tweets || 0}</span>{' '}
            投稿
          </Text>
        </Flex>
      </Box>

      {/* Rest of the component remains the same */}
      <Tabs.Root defaultValue='posts' className='mt-6'>
        <Tabs.List>
          <Tabs.Trigger value='posts'>投稿</Tabs.Trigger>
          <Tabs.Trigger value='replies'>返信</Tabs.Trigger>
          <Tabs.Trigger value='media'>メディア</Tabs.Trigger>
          <Tabs.Trigger value='likes'>いいね</Tabs.Trigger>
        </Tabs.List>

        <ScrollArea>
          <Box pt='4'>
            <Tabs.Content value='posts'>
              <Card size='2' className='mb-4'>
                <Flex gap='3' align='center' className='mb-4'>
                  <Avatar
                    size='2'
                    src='/api/placeholder/40/40'
                    fallback='U'
                    radius='full'
                  />
                  <Box>
                    <Text as='div' size='2' weight='bold'>
                      さきいか
                    </Text>
                    <Text as='div' size='1' color='gray'>
                      9ヶ月前
                    </Text>
                  </Box>
                </Flex>
                <Text as='p' size='2' className='mb-4'>
                  ようこそ
                </Text>
                <Flex gap='4'>
                  <Button variant='ghost' size='1'>
                    <Heart className='h-4 w-4 mr-1' />0
                  </Button>
                  <Button variant='ghost' size='1'>
                    <MessageCircle className='h-4 w-4 mr-1' />0
                  </Button>
                  <Button variant='ghost' size='1'>
                    <Repeat className='h-4 w-4 mr-1' />0
                  </Button>
                </Flex>
              </Card>
            </Tabs.Content>

            <Tabs.Content value='replies'>
              <Text color='gray' size='2'>
                返信はありません
              </Text>
            </Tabs.Content>

            <Tabs.Content value='media'>
              <Text color='gray' size='2'>
                メディアはありません
              </Text>
            </Tabs.Content>

            <Tabs.Content value='likes'>
              <Text color='gray' size='2'>
                いいねはありません
              </Text>
            </Tabs.Content>
          </Box>
        </ScrollArea>
      </Tabs.Root>
    </Container>
  )
}
