import { createTamagui, TamaguiProvider, Theme } from 'tamagui'
import { defaultConfig, fonts } from '@tamagui/config/v4'
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
        <Stack.Screen name='(app)' options={{ headerShown: false }} />
      </Stack>
    </HelmetProvider>
  )
}

export default function RootLayout() {
  let tamaguiConfig = defaultConfig
  if (Platform.OS === 'web') {
    tamaguiConfig = {
      ...defaultConfig,
      fonts: {
        ...defaultConfig.fonts,
        body: {
          ...defaultConfig.fonts.body,
          family: 'NotoSansCJK',
        },
        heading: {
          ...defaultConfig.fonts.heading,
          family: 'NotoSansCJK',
        },
      },
    }
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
