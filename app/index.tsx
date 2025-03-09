import { Image, ScrollView, Separator, View, XStack, YStack } from 'tamagui'
import { Home, Bell, User, Settings } from '@tamagui/lucide-icons'
import { Menus } from '@/components/menu'
import { Tweet } from '@/components/tweet'

export default function Index() {
  return (
    <XStack fullscreen>
      <Menus />
      <ScrollView>
        <Tweet
          tweet={{
            id: 1,
            user: {
              name: 'Mayo',
              username: 'mayo',
              avatar_url: 'https://github.com/mayocream.png',
            },
            content: 'Hello, world!',
            created_at: new Date(),
            likes: 0,
            retweets: 0,
            replies: 0,
          }}
        />
      </ScrollView>
    </XStack>
  )
}
