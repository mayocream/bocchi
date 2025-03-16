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
    <Theme name='light'>
      <YStack
        padding='$4'
        gap='$4'
        maxWidth={500}
        width='100%'
        alignSelf='center'
      >
        {/* Main Settings */}
        <YStack gap='$4'>
          <Text fontWeight='bold' opacity={0.6} paddingLeft='$2'>
            ACCOUNT
          </Text>
          <YGroup bordered borderRadius='$4'>
            <YGroup.Item>
              <ListItem
                hoverTheme
                pressTheme
                title='Profile Settings'
                subTitle='Update your personal details'
                icon={CircleUserRound}
                iconAfter={ChevronRight}
                onPress={() => console.log('Profile Settings')}
              />
            </YGroup.Item>
            <Separator />
            <YGroup.Item>
              <ListItem
                hoverTheme
                pressTheme
                title='Preferences'
                subTitle='Customize your experience'
                icon={Settings2}
                iconAfter={ChevronRight}
                onPress={() => console.log('Preferences')}
              />
            </YGroup.Item>
            <Separator />
            <YGroup.Item>
              <ListItem
                hoverTheme
                pressTheme
                title='Notifications'
                subTitle='Manage alerts and notifications'
                icon={Bell}
                iconAfter={ChevronRight}
                onPress={() => console.log('Notifications')}
              />
            </YGroup.Item>
          </YGroup>

          <Text fontWeight='bold' opacity={0.6} paddingLeft='$2' marginTop='$2'>
            PRIVACY & SAFETY
          </Text>
          <YGroup bordered borderRadius='$4'>
            <YGroup.Item>
              <ListItem
                hoverTheme
                pressTheme
                title='Security'
                subTitle='Protect your account'
                icon={Shield}
                iconAfter={ChevronRight}
                onPress={() => console.log('Security')}
              />
            </YGroup.Item>
            <Separator />
            <YGroup.Item>
              <ListItem
                hoverTheme
                pressTheme
                title='Help & Support'
                subTitle='Get assistance or report an issue'
                icon={HelpCircle}
                iconAfter={ChevronRight}
                onPress={() => console.log('Help & Support')}
              />
            </YGroup.Item>
          </YGroup>

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
    </Theme>
  )
}
