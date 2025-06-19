import { Tabs } from 'expo-router'
import { Home, Search, Settings, User } from '@tamagui/lucide-icons'
import { YStack } from 'tamagui'
import { Platform } from 'react-native'

// Blue colors
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
    <YStack backgroundColor='$background' flex={1}>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: '#1E88E5',
          tabBarStyle: {
            height: 54,
            display: Platform.OS === 'web' ? 'none' : undefined,
          },
          headerShown: false,
        }}
      >
        <Tabs.Screen
          name='index'
          options={{
            headerShown: false,
            tabBarLabel: 'ホーム',
            tabBarIcon: ({ size, color }) => <Home size={size} color={color} />,
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
        <Tabs.Screen
          name='profile'
          options={{
            title: 'プロフィール',
            tabBarLabel: 'プロフィール',
            tabBarIcon: ({ size, color }) => <User size={size} color={color} />,
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
  )
}
