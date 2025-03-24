import { XStack, YStack, Text, Image, Avatar, Input, TextArea } from 'tamagui'
import { useState } from 'react'
import { Pressable } from 'react-native'
import * as ImagePicker from 'expo-image-picker'
import { supabase } from '@/lib/supabase'

export const ProfileEdit = ({
  profile,
  close,
}: {
  profile: any | null
  close: () => void
}) => {
  const [avatar, setAvatar] = useState<string | null>(
    profile?.avatar_url || null
  )
  const [banner, setBanner] = useState<string | null>(
    profile?.banner_url || null
  )
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

  const uploadImage = async (uri: string, path: string) => {
    const { error } = await supabase.storage.from('static').upload(
      path,
      {
        uri,
        name: path,
        type: 'image/jpeg',
      } as any,
      {
        cacheControl: '3600',
        upsert: true,
        contentType: 'image/jpeg',
      }
    )

    if (error) {
      console.error('Failed to upload image:', error)
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from('static').getPublicUrl(path)

    return publicUrl
  }

  const onSave = async () => {
    let bannerUrl = profile?.banner_url
    let avatarUrl = profile?.avatar_url
    if (avatar && profile?.avatar_url !== avatar) {
      avatarUrl = await uploadImage(
        avatar,
        `${profile?.uid}/avatar+${Date.now()}`
      )
    }

    if (banner && profile?.banner_url !== banner) {
      bannerUrl = await uploadImage(
        banner,
        `${profile?.uid}/banner+${Date.now()}`
      )
    }

    const { error } = await supabase
      .from('users')
      .update({
        name,
        bio,
        avatar_url: avatarUrl,
        banner_url: bannerUrl,
      })
      .eq('uid', profile?.uid)

    if (error) {
      console.error('Failed to save profile:', error)
    }

    close()
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
