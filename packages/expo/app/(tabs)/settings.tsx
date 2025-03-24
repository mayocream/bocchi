import { YStack, Button } from 'tamagui'
import { LogOut } from '@tamagui/lucide-icons'
import { supabase } from '@/lib/supabase'

export default function Settings() {
  return (
    <YStack padding='$4' gap='$4' backgroundColor='$background' fullscreen>
      <YStack gap='$4'>
        <Button
          marginTop='$4'
          icon={LogOut}
          theme='red'
          onPress={() => supabase.auth.signOut()}
        >
          ログアウト
        </Button>
      </YStack>
    </YStack>
  )
}
