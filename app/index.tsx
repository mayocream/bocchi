import { Image, ScrollView, Separator, View, XStack, YStack } from 'tamagui'
import { Menus } from '@/components/menu'
import { Tweet } from '@/components/tweet'

export default function Index() {
  return (
    <XStack fullscreen>
      <Menus />
      <ScrollView>
        {Array(30)
          .fill(0)
          .map((_, i) => (
            <Tweet
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
