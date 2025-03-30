import { Stack } from 'tamagui'
import { Post } from '@/components/post'
import { useEffect, useState } from 'react'
import { alert } from '@/lib/alert'
import { supabase } from '@/lib/supabase'
import { FlatList } from 'react-native'
import Loading from '@/components/loading'
import { getProfile } from '@/lib/cache'

export default function Index() {
  const [tweets, setTweets] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

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
      const user = await getProfile(tweet.user_id)
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
          getProfile(payload.new.user_id).then((user) => {
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

  if (loading) {
    return <Loading />
  }

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
