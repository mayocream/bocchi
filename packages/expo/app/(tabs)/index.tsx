import { ScrollView, XStack } from 'tamagui'
import { Post } from '@/components/post'
import { useEffect, useState } from 'react'
import { alert } from '@/lib/alert'
import { supabase } from '@/lib/supabase'

export default function Index() {
  const [tweets, setTweets] = useState<any[]>([])

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
    <XStack fullscreen backgroundColor='$background'>
      <ScrollView $platform-web={{ alignItems: 'center' }}>
        {tweets.map((tweet) => (
          <Post key={tweet.id} tweet={tweet} />
        ))}
      </ScrollView>
    </XStack>
  )
}
