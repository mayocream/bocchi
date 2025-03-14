import { XStack, YStack, Text } from 'tamagui'
import { Menus } from '@/components/menu'
import Constants from 'expo-constants'

export default function Settings() {
  return (
    <XStack fullscreen>
      <Menus />
      <YStack
        flex={1}
        padding='$4'
        gap={10}
        backgroundColor='$background'
        maxWidth={600}
      >
        <Text>
          {Constants.expoConfig?.name}@{Constants.expoConfig?.version}
        </Text>
      </YStack>
    </XStack>
  )
}
