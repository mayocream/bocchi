import { XStack, YStack, Text, Image, Avatar, Input, TextArea } from 'tamagui'
import { useState } from 'react'
import { Pressable } from 'react-native'
import * as ImagePicker from 'expo-image-picker'
import { GetProfileResponse, UpdateProfileRequest } from '@/lib/bocchi_pb'
import { useAuthStore } from '@/lib/state'
import { useGrpcAuth, userService } from '@/lib/api'
import { useImageUpload } from '@/lib/image'

export const ProfileEdit = ({
  profile,
  close,
}: {
  profile: GetProfileResponse.AsObject | null
  close: () => void
}) => {
  const authStore = useAuthStore()
  const { getAuthMetadata } = useGrpcAuth(authStore.accessToken!)
  const { uploadImage } = useImageUpload()

  const [avatar, setAvatar] = useState<string | null>(
    profile?.avatarUrl || null
  )
  const [banner, setBanner] = useState<string | null>(profile?.coverUrl || null)
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
      const request = new UpdateProfileRequest()
      request.setName(name)
      request.setBio(bio)
      request.setAvatarUrl(avatar || '')
      request.setCoverUrl(banner || '')

      // Upload images if they are changed
      if (avatar && avatar !== profile?.avatarUrl) {
        const url = await uploadImage(avatar!)
        request.setAvatarUrl(url)
      }

      if (banner && banner !== profile?.coverUrl) {
        const url = await uploadImage(banner!)
        request.setCoverUrl(url)
      }

      await userService.updateProfile(request, getAuthMetadata())
    } catch (error) {
      console.error('Failed to save profile:', error)
    } finally {
      close()
    }
  }

  return (
    <>
      <XStack
        padding='$4'
        alignItems='center'
        borderBottomWidth={1}
        borderBottomColor='#EFEFEF'
      >
        <XStack flex={1} justifyContent='flex-start'>
          <Pressable onPress={close}>
            <Text color='#000'>キャンセル</Text>
          </Pressable>
        </XStack>

        <XStack flex={2} justifyContent='center'>
          <Text fontSize='$4' fontWeight='bold'>
            編集
          </Text>
        </XStack>

        <XStack flex={1} justifyContent='flex-end'>
          <Pressable onPress={onSave}>
            <Text color='#1D9BF0'>保存</Text>
          </Pressable>
        </XStack>
      </XStack>
      <Pressable onPress={() => pickImage('banner')}>
        <Image
          source={{ uri: banner || undefined }}
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
          backgroundColor='#A0D7FF'
          circular
        >
          <Avatar.Image src={avatar || undefined} />
          <Avatar.Fallback backgroundColor='#A0D7FF' />
        </Avatar>
      </Pressable>

      <YStack padding='$4' gap='$4' marginTop='$10'>
        <XStack gap='$4' alignItems='center'>
          <Text width={80}>名前</Text>
          <Input
            flex={1}
            placeholder='吾輩は猫である'
            defaultValue={name}
            onChangeText={setName}
          />
        </XStack>
        <XStack gap='$4' alignItems='center'>
          <Text width={80}>自己紹介</Text>
          <TextArea
            minHeight={90}
            flex={1}
            placeholder='自己紹介'
            defaultValue={bio}
            onChangeText={setBio}
          />
        </XStack>
      </YStack>
    </>
  )
}
