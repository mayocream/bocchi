import { Image, ScrollView, Separator, View, XStack, YStack } from 'tamagui'
import { Tweet } from '@/components/tweet'
import { Redirect } from 'expo-router'
import { useUserStore } from '@/lib/state'

export default function Index() {
  const { user } = useUserStore()
  if (!user) return <Redirect href='/sign-in' />

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
    </XStack>
  )
}
