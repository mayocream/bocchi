import {
  XStack,
  YStack,
  Text,
  Image,
  Button,
  Avatar,
  Input,
  TextArea,
  Stack,
} from 'tamagui'
import { useState } from 'react'
import { Pressable } from 'react-native'
import * as ImagePicker from 'expo-image-picker'
import { cloud } from '@/lib/storage'
import { ref, uploadBytes } from 'firebase/storage'
import { useAuthContext } from '@/lib/context'
import { db, Profile, profileRef } from '@/lib/db'
import { collection, deleteDoc, doc, setDoc } from 'firebase/firestore'

export const ProfileEdit = ({
  profile,
  avatarUrl,
  bannerUrl,
  close,
}: {
  profile: Profile | null
  close: () => void
  avatarUrl: string | null
  bannerUrl: string | null
}) => {
  const { currentUser } = useAuthContext()

  if (!currentUser) return null

  const [avatar, setAvatar] = useState<string | null>(avatarUrl || null)
  const [banner, setBanner] = useState<string | null>(bannerUrl || null)
  const [name, setName] = useState(profile?.name || '')
  const [bio, setBio] = useState(profile?.bio || '')
  const [username, setUsername] = useState(profile?.username || '')

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

      if (username !== profile?.username) {
        console.log('Updating username', { username })
        await deleteDoc(doc(collection(db, 'usernames'), profile?.username))
        await setDoc(doc(collection(db, 'usernames'), username), {
          uid: currentUser.uid,
        })
      }

      console.log('Updating profile', { name, bio })
      await setDoc(
        profileRef(currentUser.uid),
        { name, bio, username },
        { merge: true }
      )
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
          backgroundColor='#A0D7FF'
          circular
        >
          <Avatar.Image src={avatar ?? undefined} />
          <Avatar.Fallback backgroundColor='#A0D7FF' />
        </Avatar>
      </Pressable>

      <YStack padding='$4' gap='$4' marginTop='$10'>
        <XStack gap='$4' alignItems='center'>
          <Text width={80}>ユーザー名</Text>
          <Input
            flex={1}
            placeholder='アルファベットと数字のみ'
            value={username}
            onChangeText={setUsername}
          />
        </XStack>
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
