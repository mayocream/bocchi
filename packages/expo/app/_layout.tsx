import { createTamagui, TamaguiProvider, Theme } from 'tamagui'
import { defaultConfig } from '@tamagui/config/v4'
import { Stack } from 'expo-router'
import { Helmet, HelmetProvider } from 'react-helmet-async'
import * as NavigationBar from 'expo-navigation-bar'
import { useUserStore } from '@/lib/state'
import { useEffect } from 'react'
import { supabase } from '@/lib/supabase'

// only for Android
NavigationBar.setVisibilityAsync('hidden')
NavigationBar.setBackgroundColorAsync('#fff')

const config = createTamagui(defaultConfig)

const AppContent = () => {
  const { setUser } = useUserStore()
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
    })

    supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null)
    })
  }, [])

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
