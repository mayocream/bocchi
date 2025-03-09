import { createTamagui, TamaguiProvider, Theme } from 'tamagui'
import { defaultConfig } from '@tamagui/config/v4'
import { Stack } from 'expo-router'

const config = createTamagui(defaultConfig)

export default function RootLayout() {
  return (
    <TamaguiProvider config={config}>
      <Theme name='light'>
        <Stack>
          <Stack.Screen name='(tabs)' options={{ headerShown: false }} />
        </Stack>
      </Theme>
    </TamaguiProvider>
  )
}
