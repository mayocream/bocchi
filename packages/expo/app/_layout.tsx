import { createTamagui, Spinner, TamaguiProvider, Theme, YStack } from 'tamagui'
import { defaultConfig } from '@tamagui/config/v4'
import { router, Stack } from 'expo-router'
import { Helmet, HelmetProvider } from 'react-helmet-async'
import * as NavigationBar from 'expo-navigation-bar'
import { useUserStore } from '@/lib/state'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

// only for Android
NavigationBar.setVisibilityAsync('hidden')
NavigationBar.setBackgroundColorAsync('#fff')

const config = createTamagui(defaultConfig)

const AppContent = () => {
  const { setUser } = useUserStore()
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setLoading(false)
      setUser(session?.user ?? null)

      if (!session?.user) {
        router.replace('/sign-in')
      }
    })

    return subscription.unsubscribe
  }, [])

  if (loading) {
    return (
      <YStack fullscreen alignContent='center' justifyContent='center'>
        <Spinner size='large' />
      </YStack>
    )
  }

  return (
    <HelmetProvider>
      <Helmet>
        <title>Eki</title>
      </Helmet>
      <Stack>
        <Stack.Screen name='(tabs)' options={{ headerShown: false }} />
      </Stack>
    </HelmetProvider>
  )
}

export default function RootLayout() {
  return (
    <TamaguiProvider config={config}>
      <Theme name='light'>
        <AppContent />
      </Theme>
    </TamaguiProvider>
  )
}
