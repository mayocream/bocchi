import { ScrollView, XStack, YStack } from 'tamagui'
import { Tweet } from '@/components/tweet'
import { useUserStore } from '@/lib/state'
import { Button, Sheet, Input, Avatar } from 'tamagui'
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
  const [tweets, setTweets] = useState<any[]>([])

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
    if (user) {
      getProfile()
    }
  }, [user])

  const handleCreateTweet = async () => {
    const { error } = await supabase.from('posts').insert({
      user_id: user?.id,
      content: tweetContent,
    })

    if (error) {
      alert(error.message)
      return
    }

    setTweetContent('')
    setOpen(false)
  }

  const loadTweets = async () => {
    const { data, error } = await supabase
      .from('posts')
      .select()
      .order('created_at', { ascending: false })

    if (error) {
      alert(error.message)
      return
    }

    for (const tweet of data) {
      const { data: user, error } = await supabase
        .from('profiles')
        .select()
        .eq('user_id', tweet.user_id)
        .single()

      if (error) {
        alert(error.message)
        return
      }

      tweet.user = user
    }

    setTweets(data)
  }

  useEffect(() => {
    loadTweets()
  }, [])

  return (
    <XStack fullscreen>
      <ScrollView>
        {tweets.map((tweet) => (
          <Tweet key={tweet.id} tweet={tweet} />
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
