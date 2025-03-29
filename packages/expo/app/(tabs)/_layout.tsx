import { Tabs } from 'expo-router'
import { Bell, Home, Search, Settings, User } from '@tamagui/lucide-icons'
import { Platform } from 'react-native'
import { Topbar } from '@/components/topbar'
import { XStack, YStack } from 'tamagui'
import { LoginWidget } from '@/components/login-widget'
import { AboutWidget } from '@/components/about-widget'

// Blue 50 #E3F2FD
// 100 #BBDEFB
// 200 #90CAF9
// 300 #64B5F6
// 400 #42A5F5
// 500 #2196F3
// 600 #1E88E5
// 700 #1976D2
// 800 #1565C0
// 900 #0D47A1
// A100 #82B1FF
// A200 #448AFF
// A400 #2979FF
// A700 #2962FF

export default function TabLayout() {
  return (
    <YStack backgroundColor='$background' height='100vh'>
      {Platform.OS === 'web' && (
        <XStack width='100%' justifyContent='center'>
          <Topbar />
        </XStack>
      )}
      <XStack flex={1} justifyContent='center' gap='$2'>
        <YStack
          width={300}
          alignItems='center'
          marginVertical={10}
          $platform-web={{
            position: 'sticky',
          }}
        >
          <LoginWidget />
        </YStack>
        <XStack
          flex={1}
          $platform-web={{
            maxWidth: 600,
            borderRightWidth: 1,
            borderLeftWidth: 1,
            borderColor: '#E1E8ED',
          }}
        >
          <Tabs
            screenOptions={{
              tabBarActiveTintColor: '#1E88E5',
              tabBarStyle: {
                height: 54,
                display: Platform.OS === 'web' ? 'none' : undefined,
              },
            }}
          >
            <Tabs.Screen
              name='index'
              options={{
                headerShown: false,
                tabBarLabel: 'ホーム',
                tabBarIcon: ({ size, color }) => (
                  <Home size={size} color={color} />
                ),
              }}
            />
            <Tabs.Screen
              name='search'
              options={{
                title: '検索',
                tabBarLabel: '検索',
                headerShown: Platform.OS !== 'web',
                tabBarIcon: ({ size, color }) => (
                  <Search size={size} color={color} />
                ),
              }}
            />
            {/* <Tabs.Screen
        name='community'
        options={{
          title: 'コミュニティ',
          tabBarLabel: 'コミュニティ',
          tabBarIcon: ({ size, color }) => <Users2 size={size} color={color} />,
        }}
      /> */}
            <Tabs.Screen
              name='profile'
              options={{
                title: 'プロフィール',
                tabBarLabel: 'プロフィール',
                headerShown: Platform.OS !== 'web',
                tabBarIcon: ({ size, color }) => (
                  <User size={size} color={color} />
                ),
              }}
            />
            <Tabs.Screen
              name='notifications'
              options={{
                title: '通知',
                tabBarLabel: '通知',
                headerShown: Platform.OS !== 'web',
                tabBarIcon: ({ size, color }) => (
                  <Bell size={size} color={color} />
                ),
              }}
            />
            <Tabs.Screen
              name='settings'
              options={{
                title: '設定',
                tabBarLabel: '設定',
                tabBarIcon: ({ size, color }) => (
                  <Settings size={size} color={color} />
                ),
              }}
            />
          </Tabs>
        </XStack>
        <YStack
          width={300}
          marginVertical={10}
          $platform-web={{
            position: 'sticky',
          }}
        >
          <AboutWidget />
        </YStack>
      </XStack>
    </YStack>
  )
}
