import {
  XStack,
  YStack,
  Text,
  Image,
  ScrollView,
  Separator,
  Button,
  Avatar,
  Sheet,
  Stack,
} from 'tamagui'
import { Counter } from '@/components/counter'
import { useState, useEffect } from 'react'
import { ProfileEdit } from '@/components/profile-edit'
import { supabase } from '@/lib/supabase'
import Loading from '@/components/loading'
import { useUserStore } from '@/lib/state'

export default function ProfilePage() {
  const { user } = useUserStore()
  const [open, setOpen] = useState(false)
  const [profile, setProfile] = useState<any | null>(null)

  const loadProfile = async () => {
    // The user should have the profile data already
    const { data, error } = await supabase
      .from('users')
      .select()
      .eq('uid', user?.id)
      .single()
    if (error) {
      console.info('Failed to load profile:', error)
    }

    setProfile(data)
  }

  useEffect(() => {
    loadProfile()
  }, [])

  if (!profile) {
    return <Loading />
  }

  return (
    <Stack flex={1} backgroundColor='$background'>
      <ScrollView>
        <YStack>
          <Image
            source={{ uri: profile.banner_url || undefined }}
            width='100%'
            height='$15'
            backgroundColor='#E6E6E6'
          />

          <Stack>
            <Avatar
              size='$10'
              position='absolute'
              top='$-10'
              left='$4'
              borderWidth='$0.5'
              borderColor='white'
              circular
            >
              <Avatar.Image
                src={profile.avatar_url || undefined}
                backgroundColor='#A0D7FF'
              />
              <Avatar.Fallback backgroundColor='#A0D7FF' />
            </Avatar>
          </Stack>

          <YStack padding='$4'>
            <XStack justifyContent='flex-end' alignItems='center'>
              <Button
                backgroundColor='$background'
                color='$color'
                borderWidth='$0.5'
                borderColor='#CCCCCC'
                fontWeight='bold'
                borderRadius='$10'
                onPress={() => setOpen(true)}
              >
                編集
              </Button>
            </XStack>

            <YStack gap='$1' marginTop='$2'>
              <Text fontSize='$5' fontWeight='bold'>
                {profile.name}
              </Text>
              <Text fontSize='$3' color='#71767B'>
                @{profile.username}
              </Text>

              <Text fontSize='$3' marginTop='$2'>
                {profile.bio}
              </Text>

              <XStack gap='$4' marginTop='$3'>
                <XStack gap='$1'>
                  <Counter count={0} fontWeight='bold' />
                  <Text color='#71767B'>Following</Text>
                </XStack>

                <XStack gap='$1'>
                  <Counter count={0} fontWeight='bold' />
                  <Text color='#71767B'>Followers</Text>
                </XStack>
              </XStack>
            </YStack>
          </YStack>

          <XStack borderBottomWidth='$0.25' borderBottomColor='#E6E6E6'>
            <YStack flex={1} alignItems='center' padding='$3'>
              <Text fontWeight='bold'>Tweets</Text>
              <Separator
                backgroundColor='#1D9BF0'
                width='$5'
                height='$0.5'
                marginTop='$2'
              />
            </YStack>

            <YStack flex={1} alignItems='center' padding='$3'>
              <Text color='#71767B'>Replies</Text>
            </YStack>

            <YStack flex={1} alignItems='center' padding='$3'>
              <Text color='#71767B'>Media</Text>
            </YStack>

            <YStack flex={1} alignItems='center' padding='$3'>
              <Text color='#71767B'>Likes</Text>
            </YStack>
          </XStack>
        </YStack>

        <Sheet
          modal
          open={open}
          onOpenChange={setOpen}
          snapPoints={[95]}
          dismissOnSnapToBottom
        >
          <Sheet.Overlay opacity={0.7} />
          <Sheet.Handle />
          <Sheet.Frame>
            <ProfileEdit
              profile={profile}
              close={() => {
                setOpen(false)
                // Reload profile data after editing
                loadProfile()
              }}
            />
          </Sheet.Frame>
        </Sheet>
      </ScrollView>
    </Stack>
  )
}
