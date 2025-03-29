import { YStack, Text, Separator, YGroup, ListItem } from 'tamagui'
import {
  Bug,
  Bell,
  Shield,
  User,
  Database,
  ChevronRight,
} from '@tamagui/lucide-icons'
import * as Linking from 'expo-linking'
import Constants from 'expo-constants'
import { router } from 'expo-router'
import * as WebBrowser from 'expo-web-browser'
import { Platform } from 'react-native'

export default function Settings() {
  const settingsItems = [
    {
      icon: User,
      title: 'アカウント',
      description: 'ユーザー名、メールアドレスなどを変更',
      action: () => router.push('/settings/account'),
    },
    {
      icon: Shield,
      title: 'プライバシーとセキュリティ',
      description: 'パスワード、セキュリティ設定を管理',
      action: Platform.OS !== 'web' ? Linking.openSettings : () => {},
    },
    {
      icon: Bell,
      title: '通知',
      description: '通知の設定を変更',
      action: Platform.OS !== 'web' ? Linking.openSettings : () => {},
    },
    {
      icon: Database,
      title: 'データとストレージ',
      description: 'データ使用量、キャッシュを管理',
      action: Platform.OS !== 'web' ? Linking.openSettings : () => {},
    },
    {
      icon: Bug,
      title: 'バグを報告',
      description: '問題を報告する',
      action: () =>
        WebBrowser.openBrowserAsync('https://forms.gle/6EHsmT6D1pXsYkzd7'),
    },
  ]

  return (
    <YStack padding='$4' backgroundColor='$background' >
      <YGroup bordered>
        {settingsItems.map((item, index) => (
          <YGroup.Item key={index}>
            <ListItem
              hoverTheme
              pressTheme
              icon={<item.icon color='$color' />}
              title={item.title}
              subTitle={item.description}
              iconAfter={<ChevronRight color='$colorFocus' />}
              onPress={item.action}
              paddingVertical='$3'
            />
            {index < settingsItems.length - 1 && <Separator />}
          </YGroup.Item>
        ))}
      </YGroup>

      <Separator marginVertical='$6' />

      <Text fontSize='$2' color='$colorFocus' textAlign='center'>
        アプリバージョン {Constants.expoConfig?.version}
      </Text>
    </YStack>
  )
}
