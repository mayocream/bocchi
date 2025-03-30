import { createTamagui, TamaguiProvider, Theme, XStack, YStack } from 'tamagui'
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
import { Topbar } from '@/components/topbar'
import { LoginWidget } from '@/components/login-widget'
import { AboutWidget } from '@/components/about-widget'

if (Platform.OS === 'android') {
  NavigationBar.setBackgroundColorAsync('#fff')
}

if (Platform.OS === 'web') {
  Font.loadAsync({
    NotoSansCJK: require('@/assets/fonts/NotoSansCJK.otf'),
  })
}

const WebLayout = ({ children }) => {
  if (Platform.OS !== 'web') {
    return <>{children}</>
  }

  return (
    <YStack backgroundColor='$background' minHeight='100vh' flex={1}>
      <XStack
        width='100%'
        height={50}
        justifyContent='center'
        position='fixed'
        top={0}
        left={0}
        right={0}
        zIndex={9}
        backgroundColor='$background'
      >
        <Topbar />
      </XStack>

      <XStack flex={1} justifyContent='center' marginTop={50}>
        <YStack
          width={300}
          position='fixed'
          transform='translateX(calc(-50% - 300px))'
          marginTop={10}
          alignItems='center'
        >
          <LoginWidget />
        </YStack>

        {/* Main content - scrollable */}
        <YStack flex={1} maxWidth={600}>
          {children}
        </YStack>

        {/* Right sidebar - fixed position */}
        <YStack
          width={300}
          position='fixed'
          transform='translateX(calc(50% + 300px))'
          marginTop={10}
          alignItems='center'
        >
          <AboutWidget />
        </YStack>
      </XStack>
    </YStack>
  )
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
      <WebLayout>
        <Stack>
          <Stack.Screen name='(tabs)' options={{ headerShown: false }} />
        </Stack>
      </WebLayout>
    </HelmetProvider>
  )
}

export default function RootLayout() {
  const tamaguiConfig = {
    ...defaultConfig,
  }
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
