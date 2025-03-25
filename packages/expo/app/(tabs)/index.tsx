import { Image, ScrollView, View, XStack, YStack } from 'tamagui'
import { Tweet } from '@/components/tweet'
import { Redirect } from 'expo-router'
import { useUserStore } from '@/lib/state'
import { Button, Sheet, Input, Text, Avatar } from 'tamagui'
import { useEffect, useState } from 'react'
import { Plus, X } from '@tamagui/lucide-icons'
import { alert } from '@/lib/alert'
import { supabase } from '@/lib/supabase'

export default function Index() {
  const { user } = useUserStore()
  const [profile, setProfile] = useState<any>(null)
  const [open, setOpen] = useState(false)
  const [tweetContent, setTweetContent] = useState('')
  const [position, setPosition] = useState(0)

  const getProfile = async () => {
    const { data, error } = await supabase
      .from('profiles')
      .select()
      .eq('user_id', user?.id)
      .single()

    if (error) {
      alert(error.message)
      return
    }

    setProfile(data)
  }

  useEffect(() => {
    getProfile()
  }, [user])

  const handleCreateTweet = () => {
    // Handle tweet creation logic here
    console.log('Creating tweet:', tweetContent)
    setTweetContent('')
    setOpen(false)
  }

  return (
    <XStack fullscreen>
      <ScrollView>
        {Array(30)
          .fill(0)
          .map((_, i) => (
            <Tweet
              key={i}
              tweet={{
                id: 1,
                user: {
                  name: 'Mayo',
                  username: 'mayo',
                  avatar_url: 'https://github.com/mayocream.png',
                },
                content: 'Hello, world!',
                created_at: new Date(Date.now() - 1000 * 60 * 60 * i),
                likes: i,
                liked: false,
                retweets: 0,
                retweeted: false,
                replies: 0,
              }}
            />
          ))}
      </ScrollView>

      {/* Floating action button for opening the tweet modal */}
      <Button
        position='absolute'
        bottom={20}
        right={20}
        size='$5'
        circular
        icon={<Plus size={24} color='white' />}
        backgroundColor='$blue10'
        onPress={() => setOpen(true)}
        pressStyle={{ backgroundColor: '$blue8' }}
        elevation={4}
        shadowColor='$shadowColor'
        shadowOffset={{ width: 0, height: 2 }}
        shadowOpacity={0.25}
        shadowRadius={3.84}
      />

      {/* Tweet composition modal */}
      <Sheet
        modal
        open={open}
        onOpenChange={setOpen}
        snapPoints={[80]}
        position={position}
        onPositionChange={setPosition}
        dismissOnSnapToBottom
      >
        <Sheet.Overlay opacity={0.7} />
        <Sheet.Frame>
          <Sheet.Handle />

          <YStack padding='$4' gap='$4'>
            <XStack justifyContent='space-between' alignItems='center'>
              <Button
                size='$3'
                circular
                icon={<X size={18} />}
                chromeless
                onPress={() => setOpen(false)}
              />
              <Button
                size='$3'
                backgroundColor='$blue10'
                color='white'
                onPress={handleCreateTweet}
                disabled={!tweetContent.trim()}
                opacity={!tweetContent.trim() ? 0.5 : 1}
              >
                ポスト
              </Button>
            </XStack>

            <XStack gap='$3' alignItems='flex-start'>
              <Avatar circular size='$4'>
                <Avatar.Image src={profile?.avatar_url} />
                <Avatar.Fallback />
              </Avatar>

              <Input
                multiline
                numberOfLines={5}
                placeholder='いまどうしてる？'
                defaultValue={tweetContent}
                onChangeText={setTweetContent}
                autoFocus
                flex={1}
                borderWidth={0}
                fontSize='$5'
                height={120}
                verticalAlign='top'
              />
            </XStack>
          </YStack>
        </Sheet.Frame>
      </Sheet>
    </XStack>
  )
}
