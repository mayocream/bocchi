import { Pressable } from 'react-native'
import { Paragraph, SizableStack, YStack } from 'tamagui'

export const About = () => {
  return (
    <YStack padding='$4'>
      <Paragraph>信じる心があなたの魔法</Paragraph>
      <Pressable>
        <SizableStack>Mayo</SizableStack>
      </Pressable>
    </YStack>
  )
}
