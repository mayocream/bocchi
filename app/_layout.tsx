import { createTamagui, TamaguiProvider, Theme } from 'tamagui'
import { defaultConfig } from '@tamagui/config/v4'
import { Stack } from 'expo-router'
import { useEffect } from 'react'
import { healthService } from '@/lib/api'
import { Empty } from 'google-protobuf/google/protobuf/empty_pb'

const config = createTamagui(defaultConfig)

export default function RootLayout() {
  useEffect(() => {
    healthService.check(new Empty(), {}, (err, res) => {
      if (err) {
        console.error(`Server health check failed: ${err}`)
      } else {
        console.info(`Server health check successful`)
      }
    })
  }, [])

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
