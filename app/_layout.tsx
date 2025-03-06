import { createTamagui, TamaguiProvider, Theme, View } from 'tamagui'
import { defaultConfig } from '@tamagui/config/v4'
import { Stack } from 'expo-router'

const config = createTamagui(defaultConfig)

export default function RootLayout() {
  return (
    <TamaguiProvider config={config}>
      <Theme name='light'>
        <Stack
          screenOptions={{
            headerShown: false,
          }}
        />
      </Theme>
    </TamaguiProvider>
  )
}
