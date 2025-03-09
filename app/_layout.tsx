import { createTamagui, TamaguiProvider, Theme, createFont } from 'tamagui'
import { defaultConfig } from '@tamagui/config/v4'
import { Stack } from 'expo-router'
import {
  useFonts,
  NotoSansJP_400Regular,
  NotoSansJP_700Bold,
} from '@expo-google-fonts/noto-sans-jp'

const config = createTamagui(defaultConfig)

export default function RootLayout() {
  let [fontsLoaded] = useFonts({
    NotoSansJP_400Regular,
    NotoSansJP_700Bold,
  })

  if (!fontsLoaded) {
    return null
  }

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
