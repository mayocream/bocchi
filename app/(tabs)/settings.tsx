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
import { auth } from '@/lib/auth'
import { router } from 'expo-router'

export default function Settings() {
  return (
    <YStack
      padding='$4'
      gap='$4'
      maxWidth={500}
      width='100%'
      alignSelf='center'
      backgroundColor='$background'
    >
      {/* Main Settings */}
      <YStack gap='$4'>
        {/* Logout Button */}
        <Button
          marginTop='$4'
          icon={LogOut}
          theme='red'
          onPress={() => {
            auth.signOut()
            router.replace('/sign-in')
          }}
        >
          Sign Out
        </Button>
      </YStack>
    </YStack>
  )
}
