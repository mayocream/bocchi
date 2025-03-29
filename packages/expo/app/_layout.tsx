import { createTamagui, TamaguiProvider, Theme } from 'tamagui'
import { defaultConfig } from '@tamagui/config/v4'
import { Stack } from 'expo-router'
import { Helmet, HelmetProvider } from 'react-helmet-async'
import * as NavigationBar from 'expo-navigation-bar'
import { useUserStore } from '@/lib/state'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Loading from '@/components/loading'
import { Platform } from 'react-native'
import * as Font from 'expo-font'

if (Platform.OS === 'android') {
  NavigationBar.setVisibilityAsync('hidden')
  NavigationBar.setBackgroundColorAsync('#fff')
}

if (Platform.OS === 'web') {
  Font.loadAsync({
    NotoSansCJK: require('@/assets/fonts/NotoSansCJK.otf'),
  })
}

const AppContent = () => {
  const { setUser } = useUserStore()
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setLoading(false)
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [loading])

  if (loading) {
    return <Loading />
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
  const tamaguiConfig = defaultConfig
  if (Platform.OS === 'web') {
    tamaguiConfig.fonts.body.family = 'NotoSansCJK'
    tamaguiConfig.fonts.heading.family = 'NotoSansCJK'
  }

  const config = createTamagui(tamaguiConfig)

  return (
    <TamaguiProvider config={config}>
      <Theme name='light'>
        <AppContent />
      </Theme>
    </TamaguiProvider>
  )
}
