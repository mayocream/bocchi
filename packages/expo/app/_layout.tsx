import { createTamagui, TamaguiProvider, Theme } from 'tamagui'
import { defaultConfig } from '@tamagui/config/v4'
import { Stack } from 'expo-router'

const config = createTamagui(defaultConfig)

const AppContent = () => {
  return (
    <Stack>
      <Stack.Screen name='(tabs)' options={{ headerShown: false }} />
    </Stack>
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
