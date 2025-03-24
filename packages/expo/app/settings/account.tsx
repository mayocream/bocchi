import { YStack, XStack, Text, Separator, Button, SizableText } from 'tamagui'
import { LogOut, CheckCircle, AlertCircle, Mail } from '@tamagui/lucide-icons'
import { supabase } from '@/lib/supabase'
import { useUserStore } from '@/lib/state'
import { alert } from '@/lib/alert'
import { Stack } from 'expo-router'

export default function Account() {
  const { user } = useUserStore()

  const sendVerificationEmail = async () => {
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email: user?.email!,
    })
    if (error) {
      alert(error.message)
      return
    }

    alert('認証メールを再送信しました')
  }

  return (
    <YStack fullscreen backgroundColor='$background' padding='$4' gap='$4'>
      <Stack.Screen
        options={{
          title: 'アカウント',
        }}
      />
      <YStack gap='$2' padding='$3' borderRadius='$2'>
        <SizableText fontWeight='bold'>メールアドレス</SizableText>
        <XStack gap='$2' alignItems='center'>
          <Text flex={1}>{user?.email}</Text>
          {user?.email_confirmed_at ? (
            <XStack gap='$1' alignItems='center'>
              <CheckCircle size={16} color='$green10' />
              <Text color='$green10' fontSize='$2'>
                認証済み
              </Text>
            </XStack>
          ) : (
            <XStack gap='$1' alignItems='center'>
              <AlertCircle size={16} />
              <Text fontSize='$2'>未認証</Text>
            </XStack>
          )}
        </XStack>
      </YStack>
      <YStack gap='$2' padding='$3' borderRadius='$2'>
        <SizableText fontWeight='bold'>ユーザー名</SizableText>
        <Text>{user?.user_metadata?.username}</Text>
      </YStack>

      {!user?.email_confirmed_at && (
        <Button
          marginTop='$2'
          icon={Mail}
          theme='blue'
          onPress={sendVerificationEmail}
          borderRadius='$4'
        >
          認証メールを再送信
        </Button>
      )}

      <Separator marginVertical='$4' />
      <Button
        icon={LogOut}
        theme='red'
        onPress={() => supabase.auth.signOut()}
        borderRadius='$full'
      >
        ログアウト
      </Button>
    </YStack>
  )
}
