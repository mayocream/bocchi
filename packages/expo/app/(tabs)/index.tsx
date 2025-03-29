import { Stack, XStack, YStack } from 'tamagui'
import { Post } from '@/components/post'
import { useEffect, useState } from 'react'
import { alert } from '@/lib/alert'
import { supabase } from '@/lib/supabase'
import { FlatList } from 'react-native'

export default function Index() {
  const [tweets, setTweets] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const loadProfile = async (id: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select()
      .eq('user_id', id)
      .single()

    if (error) {
      alert(error.message)
      return
    }

    return data
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
      const user = await loadProfile(tweet.user_id)
      tweet.user = user
    }

    setLoading(false)
    setTweets(data)
  }

  const listenChanges = async () => {
    await supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'posts',
        },
        (payload) => {
          loadProfile(payload.new.user_id).then((user) => {
            payload.new.user = user
            setTweets((prev) => [payload.new, ...prev])
          })
        }
      )
      .subscribe()
  }

  useEffect(() => {
    loadTweets()
    listenChanges()
  }, [])

  return (
    <Stack flex={1} backgroundColor='$background'>
      <FlatList
        data={tweets}
        renderItem={({ item }) => <Post tweet={item} />}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
      />
    </Stack>
  )
}
