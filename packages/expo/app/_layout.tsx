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
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'

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
    <>
      <SafeAreaView
        edges={['top']}
        style={{
          flex: 0,
          backgroundColor: '#fff',
        }}
      />
      <HelmetProvider>
        <Helmet>
          <title>Bocchi</title>
        </Helmet>
        <Stack>
          <Stack.Screen name='(app)' options={{ headerShown: false }} />
        </Stack>
      </HelmetProvider>
      <SafeAreaView
        edges={['bottom']}
        style={{
          backgroundColor: '#fff',
          flex: 0,
        }}
      />
    </>
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
    <SafeAreaProvider>
      <TamaguiProvider config={config}>
        <Theme name='light'>
          <AppContent />
        </Theme>
      </TamaguiProvider>
    </SafeAreaProvider>
  )
}
