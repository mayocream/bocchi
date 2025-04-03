import React, { useEffect } from 'react'
import { Home, User, Bell, Search, Settings } from '@tamagui/lucide-icons'
import { Pressable } from 'react-native'
import { XStack, YStack, Text } from 'tamagui'
import { TweetDialog } from './tweet'
import { router, usePathname } from 'expo-router'
import { Image } from 'expo-image'
import { useUserStore } from '@/lib/state'

export const Sidebar = () => {
  const pathname = usePathname()
  const { user } = useUserStore()

  const navItems = [
    { icon: Home, label: 'ホーム', path: '/', disabled: false },
    { icon: Bell, label: '通知', path: '/notifications', disabled: !user },
    { icon: User, label: 'プロフィール', path: '/profile', disabled: !user },
    { icon: Search, label: '検索', path: '/search', disabled: false },
    { icon: Settings, label: '設定', path: '/settings', disabled: !user },
  ]

  return (
    <YStack width={275} height='100%' padding={16}>
      {/* App logo at the top */}
      <XStack marginBottom={24}>
        <Image
          source={require('@/assets/images/favicon.png')}
          style={{
            height: 32,
            width: 32,
            opacity: 0.9,
          }}
        />
      </XStack>

      {/* Navigation items */}
      <YStack gap={8} flex={1}>
        {navItems
          .filter((item) => !item.disabled)
          .map((item, index) => (
            <Pressable
              key={index}
              onPress={() => router.push(item.path as any)}
            >
              <XStack
                alignItems='center'
                paddingHorizontal={16}
                paddingVertical={12}
                borderRadius={8}
                backgroundColor={
                  item.path === pathname ? '#E8F5FD' : 'transparent'
                }
              >
                <item.icon
                  size={22}
                  color={item.path === pathname ? '#1DA1F2' : '#657786'}
                />
                <Text
                  fontSize={16}
                  fontWeight='500'
                  color={item.path === pathname ? '#1DA1F2' : '#657786'}
                  marginLeft={12}
                >
                  {item.label}
                </Text>
              </XStack>
            </Pressable>
          ))}

        {/* Tweet button */}
        <YStack marginTop={16}>
          <TweetDialog />
        </YStack>
      </YStack>
    </YStack>
  )
}
