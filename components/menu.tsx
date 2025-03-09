import { Bell, Home, Settings, User } from '@tamagui/lucide-icons'
import { XStack, YStack } from 'tamagui'
import { Text } from '@/components/text'
import { Link, usePathname, Href } from 'expo-router'

const menus: {
  icon: React.ComponentType<any>
  text: string
  path: Href
}[] = [
  { icon: Home, text: 'ホーム', path: '/' },
  { icon: Bell, text: '通知', path: '/notifications' },
  { icon: User, text: 'プロフィール', path: '/profile' },
  { icon: Settings, text: '設定', path: '/settings' },
]

export const Menus = () => {
  const pathname = usePathname()

  return (
    <YStack padding='$4' gap='$4'>
      {menus.map((menu, index) => (
        <Link href={menu.path}>
          <XStack gap='$2' key={index}>
            <menu.icon size='$1.5' />
            <Text
              fontSize={16}
              fontWeight={pathname === menu.path ? 'bold' : 'normal'}
            >
              {menu.text}
            </Text>
          </XStack>
        </Link>
      ))}
    </YStack>
  )
}
