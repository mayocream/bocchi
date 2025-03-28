import { router } from 'expo-router'
import { Pressable } from 'react-native'
import { Paragraph, Text, XStack, YStack } from 'tamagui'

export const AboutWidget = () => {
  return (
    <YStack
      maxWidth={275}
      borderColor='#e1e8ed'
      padding={15}
      marginBottom={12}
      flex={1}
    >
      <Paragraph color='#66757f' fontSize={14} lineHeight={18}>
        信じる心があなたの魔法
      </Paragraph>

      <XStack height={1} backgroundColor='#e1e8ed' marginVertical={10} />
      <XStack justifyContent='space-between' marginTop={4}>
        <Text color='#657786' fontSize={12}>
          © 2025 Mayo
        </Text>
        <Pressable onPress={() => router.push('/tos')}>
          <Text color='#1da1f2' fontSize={12}>
            利用規約
          </Text>
        </Pressable>
      </XStack>
    </YStack>
  )
}
