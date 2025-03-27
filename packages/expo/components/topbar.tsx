import React from 'react'
import { Home, User, Bell, Search, Settings } from '@tamagui/lucide-icons'
import { Pressable } from 'react-native'
import { XStack, YStack, Text, Input } from 'tamagui'
import { TweetDialog } from './tweet'
import { router, usePathname } from 'expo-router'
import { Image } from 'expo-image'

export const Topbar = () => {
  const pathname = usePathname()

  const navItems = [
    { icon: Home, label: 'ホーム', path: '/' },
    { icon: Bell, label: '通知', path: '/notifications' },
    { icon: User, label: 'プロフィール', path: '/profile' },
  ]

  return (
    <YStack
      width={1200}
      backgroundColor='white'
      borderBottomWidth={1}
      borderBottomColor='#E1E8ED'
    >
      <XStack
        flex={1}
        justifyContent='space-between'
        height={50}
        alignItems='center'
        paddingHorizontal={16}
      >
        {/* Left side - nav items */}
        <XStack flex={1} alignItems='center' gap={8}>
          {navItems.map((item, index) => (
            <Pressable
              key={index}
              onPress={() => router.push(item.path as any)}
            >
              <XStack
                alignItems='center'
                justifyContent='center'
                paddingHorizontal={12}
                paddingVertical={12}
                borderBottomWidth={item.path === pathname ? 2 : 0}
                borderBottomColor={
                  item.path === pathname ? '#1DA1F2' : 'transparent'
                }
              >
                <item.icon
                  size={20}
                  color={item.path === pathname ? '#1DA1F2' : '#657786'}
                />
                <Text
                  fontSize={14}
                  fontWeight='500'
                  color={item.path === pathname ? '#1DA1F2' : '#657786'}
                  marginLeft={4}
                >
                  {item.label}
                </Text>
              </XStack>
            </Pressable>
          ))}
        </XStack>

        {/* Center - Twitter bird logo */}
        <XStack
          position='absolute'
          left={0}
          right={0}
          justifyContent='center'
          pointerEvents='none'
        >
          <Image
            source={require('@/assets/images/favicon.png')}
            style={{
              height: 32,
              width: 32,
              opacity: 0.76,
            }}
          />
        </XStack>

        {/* Right side - search bar and tweet button */}
        <XStack flex={1} alignItems='center' gap={16} justifyContent='flex-end'>
          {/* Search bar */}
          <XStack
            height={36}
            backgroundColor='#F5F8FA'
            borderRadius={18}
            paddingHorizontal={12}
            alignItems='center'
            width={180}
            overflow='visible'
            onPress={() => router.push('/search')}
          >
            <Search size={20} color='#657786' />
            <Input
              placeholder='検索'
              fontSize={14}
              backgroundColor='transparent'
              borderWidth={0}
              color='#14171A'
              outlineWidth={0}
              focusStyle={{
                outlineWidth: 0,
                shadowOpacity: 0,
              }}
            />
          </XStack>

          <Pressable onPress={() => router.push('/settings')}>
            <Settings size={20} color='#657786' />
          </Pressable>
          <TweetDialog />
        </XStack>
      </XStack>
    </YStack>
  )
}
