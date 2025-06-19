import { createTamagui, TamaguiProvider, Theme } from 'tamagui'
import { defaultConfig } from '@tamagui/config/v4'
import { Stack } from 'expo-router'
import { Helmet, HelmetProvider } from 'react-helmet-async'
import { useUserStore } from '@/lib/state'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Loading from '@/components/loading'
import { Platform } from 'react-native'
import * as Font from 'expo-font'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'
import * as Sentry from '@sentry/react-native'
import { isRunningInExpoGo } from 'expo'
import { useNavigationContainerRef } from 'expo-router'

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
  }, [setUser])

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

// Sentry
const navigationIntegration = Sentry.reactNavigationIntegration({
  enableTimeToInitialDisplay: !isRunningInExpoGo(),
})

Sentry.init({
  enabled: !__DEV__,
  dsn: 'https://cb5e67d2708933e8a4e8eba3bc5b4d4b@o4509083941797888.ingest.us.sentry.io/4509083954970624',
  debug: false, // If `true`, Sentry will try to print out useful debugging information if something goes wrong with sending the event. Set it to `false` in production
  tracesSampleRate: 1.0, // Set tracesSampleRate to 1.0 to capture 100% of transactions for tracing. Adjusting this value in production.
  integrations: [navigationIntegration],
  enableNativeFramesTracking: !isRunningInExpoGo(), // Tracks slow and frozen frames in the application
})

function RootLayout() {
  // Capture the NavigationContainer ref and register it with the integration.
  const ref = useNavigationContainerRef()

  useEffect(() => {
    if (ref?.current) {
      navigationIntegration.registerNavigationContainer(ref)
    }
  }, [ref])

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

// Wrap the Root Layout route component with `Sentry.wrap` to capture gesture info and profiling data.
export default Sentry.wrap(RootLayout)
