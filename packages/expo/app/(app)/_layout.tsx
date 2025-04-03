import { AboutWidget } from '@/components/about-widget'
import { LoginWidget } from '@/components/login-widget'
import { Sidebar } from '@/components/sidebar'
import { Stack } from 'expo-router'
import { Platform } from 'react-native'
import { XStack, YStack } from 'tamagui'

const WebLayout = ({ children }) => {
  if (Platform.OS !== 'web') {
    return <>{children}</>
  }

  return (
    <YStack backgroundColor='$background' minHeight='100vh' flex={1}>
      <XStack flex={1} justifyContent='center'>
        <YStack
          width={300}
          position='fixed'
          transform='translateX(calc(-50% - 300px))'
          marginTop={10}
          alignItems='center'
        >
          <Sidebar />
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

export default function AppLayout() {
  return (
    <WebLayout>
      <Stack>
        <Stack.Screen
          name='(tabs)'
          options={{
            headerShown: false,
          }}
        />
      </Stack>
    </WebLayout>
  )
}
