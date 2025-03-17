import { createTamagui, TamaguiProvider, Theme } from 'tamagui'
import { defaultConfig } from '@tamagui/config/v4'
import { Stack } from 'expo-router'
import { AuthProvider, useAuthContext } from '@/lib/context'
import * as SplashScreen from 'expo-splash-screen'
import { useEffect } from 'react'

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync()
SplashScreen.setOptions({
  duration: 1000,
  fade: true,
})

const config = createTamagui(defaultConfig)

const AppContent = () => {
  const { loading } = useAuthContext()
  useEffect(() => {
    if (!loading) {
      SplashScreen.hideAsync()
    }
  }, [loading])

  if (loading) {
    return null
  }

  return (
    <Stack>
      <Stack.Screen name='(tabs)' options={{ headerShown: false }} />
    </Stack>
  )
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <TamaguiProvider config={config}>
        <Theme name='light'>
          <AppContent />
        </Theme>
      </TamaguiProvider>
    </AuthProvider>
  )
}
