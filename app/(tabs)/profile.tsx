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
  Input,
  TextArea,
  Stack,
  Spinner,
} from 'tamagui'
import { Counter } from '@/components/counter'
import { useState, useEffect } from 'react'
import { Pressable } from 'react-native'
import * as ImagePicker from 'expo-image-picker'
import { cloud, getImageUrl } from '@/lib/storage'
import { ref, uploadBytes } from 'firebase/storage'
import { useAuthContext } from '@/lib/context'
import { getProfile, Profile, profileRef } from '@/lib/db'
import { setDoc } from 'firebase/firestore'

const ProfileEdit = ({
  profile,
  avatar_url,
  banner_url,
  close,
}: {
  profile: Profile | null
  close: () => void
  avatar_url: string | null
  banner_url: string | null
}) => {
  const { currentUser } = useAuthContext()

  if (!currentUser) return null

  const [avatar, setAvatar] = useState<string | null>(avatar_url || null)
  const [banner, setBanner] = useState<string | null>(banner_url || null)
  const [name, setName] = useState(profile?.name || '')
  const [bio, setBio] = useState(profile?.bio || '')

  const pickImage = async (type: 'avatar' | 'banner') => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: 'images',
      allowsEditing: true,
      aspect: type === 'avatar' ? [1, 1] : [16, 9],
      quality: 1,
    })

    if (result.canceled) {
      return
    }

    if (type === 'avatar') {
      setAvatar(result.assets[0].uri)
    } else {
      setBanner(result.assets[0].uri)
    }
  }

  const onSave = async () => {
    try {
      if (avatar) {
        console.log('Uploading avatar', avatar)
        const avatarRef = ref(cloud, `images/${currentUser.uid}/avatar`)
        const blob = await fetch(avatar).then((res) => res.blob())
        await uploadBytes(avatarRef, blob)
      }
      if (banner) {
        console.log('Uploading banner', banner)
        const bannerRef = ref(cloud, `images/${currentUser.uid}/banner`)
        const blob = await fetch(banner).then((res) => res.blob())
        await uploadBytes(bannerRef, blob)
      }

      console.log('Updating profile', { name, bio })
      await setDoc(profileRef(currentUser.uid), { name, bio }, { merge: true })
    } catch (error) {
      console.error('Failed to upload image', error)
    } finally {
      close()
    }
  }

  return (
    <>
      <XStack
        padding='$4'
        height='$6'
        alignItems='center'
        paddingHorizontal='$4'
        borderBottomWidth={1}
        borderBottomColor='#EFEFEF'
      >
        <Stack position='absolute' left='$4'>
          <Button onPress={close} chromeless>
            <Text color='#000'>キャンセル</Text>
          </Button>
        </Stack>

        <Text flex={1} textAlign='center' fontSize='$4' fontWeight='bold'>
          編集
        </Text>

        <Stack position='absolute' right='$4'>
          <Button onPress={onSave} chromeless>
            <Text color='#1D9BF0'>保存</Text>
          </Button>
        </Stack>
      </XStack>
      <Pressable onPress={() => pickImage('banner')}>
        <Image
          source={{ uri: banner ?? undefined }}
          width='100%'
          height='$15'
          backgroundColor='#E6E6E6'
        />
      </Pressable>
      <Pressable onPress={() => pickImage('avatar')}>
        <Avatar
          size='$10'
          position='absolute'
          top='$-10'
          left='$4'
          borderWidth='$0.5'
          borderColor='white'
          circular
        >
          <Avatar.Image src={avatar ?? undefined} />
          <Avatar.Fallback backgroundColor='#A0D7FF' />
        </Avatar>
      </Pressable>
      <YStack padding='$4' gap='$4' marginTop='$10'>
        <XStack gap='$4' alignItems='center'>
          <Text width={80}>名前</Text>
          <Input
            flex={1}
            placeholder='吾輩は猫である'
            value={name}
            onChangeText={setName}
          />
        </XStack>
        <XStack gap='$4' alignItems='center'>
          <Text width={80}>自己紹介</Text>
          <TextArea
            minHeight={90}
            flex={1}
            placeholder='自己紹介'
            value={bio}
            onChangeText={setBio}
          />
        </XStack>
      </YStack>
    </>
  )
}

export default function ProfilePage() {
  const { currentUser } = useAuthContext()
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [profileData, setProfileData] = useState<Profile | null>(null)
  const [avatar, setAvatar] = useState<string | null>(null)
  const [banner, setBanner] = useState<string | null>(null)

  const fetchData = async () => {
    if (currentUser) {
      setIsLoading(true)
      try {
        // Fetch profile data
        const profile = await getProfile(currentUser.uid)
        setProfileData(profile)

        // Fetch images
        const avatarUrl = await getImageUrl(`images/${currentUser.uid}/avatar`)
        setAvatar(avatarUrl)

        const bannerUrl = await getImageUrl(`images/${currentUser.uid}/banner`)
        setBanner(bannerUrl)
      } catch (error) {
        console.error('Error fetching profile data:', error)
      } finally {
        setIsLoading(false)
      }
    }
  }

  useEffect(() => {
    fetchData()
  }, [currentUser])

  if (!currentUser) return null

  // Show loading state while data is being fetched
  if (isLoading) {
    return (
      <YStack flex={1} justifyContent='center' alignItems='center' padding='$4'>
        <Spinner size='large' color='#1D9BF0' />
        <Text marginTop='$4'>Loading profile...</Text>
      </YStack>
    )
  }

  return (
    <Stack flex={1} backgroundColor='$background'>
      <ScrollView>
        <YStack>
          <Image
            source={{ uri: banner ?? undefined }}
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
                src={avatar ?? undefined}
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
                Edit Profile
              </Button>
            </XStack>

            <YStack gap='$1' marginTop='$2'>
              <Text fontSize='$5' fontWeight='bold'>
                {profileData?.name}
              </Text>
              <Text fontSize='$3' color='#71767B'>
                {profileData?.username}
              </Text>

              <Text fontSize='$3' marginTop='$2'>
                {profileData?.bio}
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
          <Sheet.Overlay animation='lazy' opacity={0.7} />
          <Sheet.Handle />
          <Sheet.Frame>
            <ProfileEdit
              avatar_url={avatar}
              banner_url={banner}
              profile={profileData}
              close={() => {
                setOpen(false)
                // Reload profile data after editing
                fetchData()
              }}
            />
          </Sheet.Frame>
        </Sheet>
      </ScrollView>
    </Stack>
  )
}
