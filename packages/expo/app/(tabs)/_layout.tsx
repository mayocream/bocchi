import { Tabs } from 'expo-router'
import {
  Bell,
  Home,
  Search,
  Settings,
  User,
  Users2,
} from '@tamagui/lucide-icons'
import { Platform } from 'react-native'
import { Sidebar } from '@/components/sidebar'
import { XStack, YStack } from 'tamagui'

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
    <XStack fullscreen backgroundColor='$background'>
      {Platform.OS === 'web' && (
        <YStack>
          <Sidebar />
        </YStack>
      )}
      <YStack flex={1} maxWidth={600}>
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
      </YStack>
    </XStack>
  )
}
