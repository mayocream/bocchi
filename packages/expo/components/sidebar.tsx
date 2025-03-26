import { Bell, Home, Search, Settings, User } from '@tamagui/lucide-icons'
import { Image } from 'expo-image'
import { Pressable } from 'react-native'
import { XStack, YStack, Text, Avatar, Button } from 'tamagui'

export const Sidebar = () => {
  const items = [
    { icon: Home, label: 'ホーム', route: 'home' },
    { icon: Search, label: '検索', route: 'search' },
    { icon: Bell, label: '通知', route: 'notifications' },
    { icon: User, label: 'プロフィール', route: 'profile' },
    { icon: Settings, label: '設定', route: 'settings' },
  ]

  return (
    <YStack
      width={250}
      height='100vh'
      backgroundColor='$background'
      borderRightWidth={1}
      borderRightColor='$borderColor'
      padding={16}
    >
      {/* App logo */}
      <XStack marginBottom={24}>
        <Image
          source={require('@/assets/images/favicon.png')}
          style={{
            width: 40,
            height: 50,
          }}
        />
      </XStack>

      {/* Navigation items */}
      <YStack gap={8} flex={1}>
        {items.map((item) => (
          <Pressable key={item.route}>
            <XStack
              alignItems='center'
              gap={16}
              paddingVertical={12}
              paddingHorizontal={16}
              borderRadius={50}
            >
              <item.icon size={24} />
              <Text fontSize={18}>{item.label}</Text>
            </XStack>
          </Pressable>
        ))}

        {/* Tweet button */}
        <Button
          marginTop={16}
          backgroundColor='#1DA1F2'
          color='white'
          borderRadius={50}
          height={52}
          fontWeight='600'
          fontSize={17}
          pressStyle={{ backgroundColor: '#0c86d0' }}
        >
          Tweet
        </Button>
      </YStack>

      {/* User profile */}
      <XStack
        marginTop={16}
        alignItems='center'
        gap={12}
        paddingVertical={12}
        paddingHorizontal={16}
        borderRadius={50}
        hoverStyle={{ backgroundColor: '$backgroundHover' }}
      >
        <Avatar size='$3' circular>
          <Avatar.Image
            source={{ uri: 'https://via.placeholder.com/100x100' }}
          />
          <Avatar.Fallback />
        </Avatar>
        <YStack>
          <Text fontWeight='600' fontSize={15}>
            John Doe
          </Text>
          <Text fontSize={14}>@johndoe</Text>
        </YStack>
      </XStack>
    </YStack>
  )
}
