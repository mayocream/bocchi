import { useUserStore } from '@/lib/state'
import { router } from 'expo-router'
import { Button, Text, XStack, YStack } from 'tamagui'

export const LoginWidget = () => {
  const { user } = useUserStore()
  if (user) {
    return null
  }

  return (
    <YStack
      width={250}
      borderRadius={6}
      borderWidth={1}
      borderColor='#e1e8ed'
      padding={15}
      backgroundColor='#fff'
      shadowColor='#000'
      shadowOffset={{ width: 0, height: 1 }}
      shadowOpacity={0.05}
      shadowRadius={3}
    >
      <Text color='#66757f' fontSize={14} marginBottom={15}>
        Bocchi にログインして会話に参加しましょう。
      </Text>

      <Button
        onPress={() => router.push('/sign-up')}
        backgroundColor='#1da1f2'
        color='#fff'
        fontWeight={600}
        fontSize={14}
        borderRadius={100}
        height={36}
        marginBottom={10}
        hoverStyle={{ backgroundColor: '#0c85d0' }}
      >
        アカウントを作成
      </Button>

      <XStack
        justifyContent='space-between'
        alignItems='center'
        marginBottom={10}
      >
        <YStack height={1} backgroundColor='#e1e8ed' flex={1} />
        <Text color='#657786' fontSize={12} paddingHorizontal={10}>
          または
        </Text>
        <YStack height={1} backgroundColor='#e1e8ed' flex={1} />
      </XStack>

      <Button
        onPress={() => router.push('/sign-in')}
        backgroundColor='#fff'
        color='#1da1f2'
        borderWidth={1}
        borderColor='#1da1f2'
        fontWeight={600}
        fontSize={14}
        borderRadius={100}
        height={36}
        hoverStyle={{ backgroundColor: '#e8f5fe' }}
      >
        ログイン
      </Button>
    </YStack>
  )
}
