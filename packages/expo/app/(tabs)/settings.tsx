import {
  YStack,
  Text,
  YGroup,
  ListItem,
  Separator,
  Button,
  Theme,
} from 'tamagui'
import {
  CircleUserRound,
  Settings2,
  Bell,
  Shield,
  HelpCircle,
  LogOut,
  ChevronRight,
} from '@tamagui/lucide-icons'
import { router } from 'expo-router'
import { useAuthStore } from '@/lib/state'

export default function Settings() {
  const authStore = useAuthStore()
  return (
    <YStack padding='$4' gap='$4' backgroundColor='$background' fullscreen>
      {/* Main Settings */}
      <YStack gap='$4'>
        {/* Logout Button */}
        <Button
          marginTop='$4'
          icon={LogOut}
          theme='red'
          onPress={() => {
            authStore.clearAccessToken()
            router.replace('/sign-in')
          }}
        >
          Sign Out
        </Button>
      </YStack>
    </YStack>
  )
}
