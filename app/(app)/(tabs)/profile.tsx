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
} from 'tamagui'
import { Counter } from '@/components/counter'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import Loading from '@/components/loading'
import { useUserStore } from '@/lib/state'
import * as ImagePicker from 'expo-image-picker'
import { Pressable } from 'react-native'

export default function Profile() {
  const { user } = useUserStore()
  const [open, setOpen] = useState(false)
  const [profile, setProfile] = useState<any | null>(null)

  // Edit form state
  const [avatar, setAvatar] = useState<string | null>(null)
  const [banner, setBanner] = useState<string | null>(null)
  const [name, setName] = useState('')
  const [bio, setBio] = useState('')

  const loadProfile = async () => {
    const { data, error } = await supabase
      .from('profiles')
      .select()
      .eq('user_id', user?.id)
      .single()
    if (error) {
      console.info('Failed to load profile:', error)
    }

    setProfile(data)
  }

  // Initialize edit form when profile loads or sheet opens
  useEffect(() => {
    if (profile && open) {
      setAvatar(profile?.avatar_url || null)
      setBanner(profile?.banner_url || null)
      setName(profile?.name || '')
      setBio(profile?.bio || '')
    }
  }, [profile, open])

  useEffect(() => {
    loadProfile()
  }, [])

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
    const blob = await fetch(uri).then((r) => r.blob())
    const { error } = await supabase.storage.from('static').upload(path, blob, {
      cacheControl: '3600',
      upsert: true,
      contentType: 'image/jpeg',
    })

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
        `${profile?.user_id}/avatar+${Date.now()}`
      )
    }

    if (banner && profile?.banner_url !== banner) {
      bannerUrl = await uploadImage(
        banner,
        `${profile?.user_id}/banner+${Date.now()}`
      )
    }

    const { error } = await supabase
      .from('profiles')
      .update({
        name,
        bio,
        avatar_url: avatarUrl,
        banner_url: bannerUrl,
      })
      .eq('user_id', profile?.user_id)

    if (error) {
      console.error('Failed to save profile:', error)
    }

    setOpen(false)
    loadProfile()
  }

  if (!profile) {
    return <Loading />
  }

  return (
    <ScrollView
      backgroundColor='$background'
      showsVerticalScrollIndicator={false}
    >
      <Image
        source={{ uri: profile.banner_url || undefined }}
        width='100%'
        height='$15'
        backgroundColor='#E6E6E6'
      />

      <YStack>
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
      </YStack>

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

        {/* #71767B */}
      </XStack>

      <Sheet
        animation='medium'
        open={open}
        onOpenChange={setOpen}
        snapPoints={[95]}
        dismissOnSnapToBottom
      >
        <Sheet.Overlay
          opacity={0.7}
          animation='lazy'
          backgroundColor='$shadow6'
          enterStyle={{ opacity: 0 }}
          exitStyle={{ opacity: 0 }}
        />
        <Sheet.Handle />
        <Sheet.Frame flex={1} minHeight={600}>
          <XStack
            padding='$4'
            alignItems='center'
            borderBottomWidth={1}
            borderBottomColor='#EFEFEF'
          >
            <XStack flex={1} justifyContent='flex-start'>
              <Pressable onPress={() => setOpen(false)}>
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
        </Sheet.Frame>
      </Sheet>
    </ScrollView>
  )
}
