import { Stack } from 'expo-router'
import React from 'react'
import { ScrollView, StatusBar, Platform } from 'react-native'
import {
  Button,
  H1,
  H3,
  Paragraph,
  Text,
  XStack,
  YStack,
  Separator,
  Theme,
  Image,
} from 'tamagui'

export default function ToS() {
  return (
    <ScrollView>
      <Stack.Screen
        options={{
          headerTitle: '利用規約',
        }}
      />
      {/* Main Content */}
      <YStack
        backgroundColor='#f5f8fa'
        paddingHorizontal={15}
        paddingVertical={20}
        minHeight='100%'
      >
        <YStack
          width='100%'
          maxWidth={640}
          marginHorizontal='auto'
          backgroundColor='#fff'
          borderRadius={6}
          borderWidth={1}
          borderColor='#e1e8ed'
          shadowColor='#000'
          shadowOffset={{ width: 0, height: 1 }}
          shadowOpacity={0.05}
          shadowRadius={3}
          overflow='hidden'
          marginBottom={30}
        >
          {/* TOS Header */}
          <YStack padding={20}>
            <H1
              color='#292f33'
              fontWeight='bold'
              fontSize={22}
              marginBottom={5}
            >
              利用規約
            </H1>
            <Text color='#657786' fontSize={14}>
              最終更新日: 2025年3月27日
            </Text>
          </YStack>

          <Separator />

          <YStack padding={20} gap={20}>
            <Paragraph color='#66757f' fontSize={15} lineHeight={22}>
              Eki（以下「当サービス」）をご利用いただきありがとうございます。以下の利用規約をよくお読みください。
              当サービスを利用することにより、以下の条件に同意したものとみなされます。
            </Paragraph>

            {/* Section 1 */}
            <YStack gap={10}>
              <H3 color='#292f33' fontWeight='bold' fontSize={17}>
                1. 利用規約の適用
              </H3>
              <Paragraph color='#66757f' fontSize={15} lineHeight={22}>
                本規約は、当サービスの提供するすべてのサービスの利用に関し、当サービスと利用者との間の権利義務関係を定めるものです。利用者は本規約に同意の上、当サービスを利用するものとします。
              </Paragraph>
            </YStack>

            {/* Section 2 */}
            <YStack gap={10}>
              <H3 color='#292f33' fontWeight='bold' fontSize={17}>
                2. アカウント登録
              </H3>
              <Paragraph color='#66757f' fontSize={15} lineHeight={22}>
                当サービスの利用にはアカウント登録が必要です。利用者は正確かつ完全な情報を提供し、常に最新の状態に保つ責任があります。
              </Paragraph>
              <Paragraph color='#66757f' fontSize={15} lineHeight={22}>
                利用者は自己のアカウントの管理について責任を負うものとし、パスワードの管理不十分、使用上の過誤、第三者の使用等による損害の責任は利用者が負うものとします。
              </Paragraph>
              <YStack
                backgroundColor='#f5f8fa'
                borderRadius={4}
                padding={15}
                borderLeftWidth={4}
                borderLeftColor='#1da1f2'
                marginTop={5}
              >
                <Text color='#66757f' fontSize={14} fontWeight='500'>
                  セキュリティのため、定期的にパスワードを変更することをお勧めします。
                </Text>
              </YStack>
            </YStack>

            {/* Section 3 */}
            <YStack gap={10}>
              <H3 color='#292f33' fontWeight='bold' fontSize={17}>
                3. 禁止事項
              </H3>
              <YStack paddingLeft={15} gap={8}>
                <XStack alignItems='center'>
                  <Text color='#1da1f2' marginRight={10} fontSize={18}>
                    •
                  </Text>
                  <Paragraph color='#66757f' fontSize={15} lineHeight={22}>
                    法令または公序良俗に違反する行為
                  </Paragraph>
                </XStack>
                <XStack alignItems='center'>
                  <Text color='#1da1f2' marginRight={10} fontSize={18}>
                    •
                  </Text>
                  <Paragraph color='#66757f' fontSize={15} lineHeight={22}>
                    犯罪行為に関連する行為
                  </Paragraph>
                </XStack>
                <XStack alignItems='center'>
                  <Text color='#1da1f2' marginRight={10} fontSize={18}>
                    •
                  </Text>
                  <Paragraph color='#66757f' fontSize={15} lineHeight={22}>
                    当サービスのサーバーまたはネットワークの機能を破壊したり、妨害したりする行為
                  </Paragraph>
                </XStack>
                <XStack alignItems='center'>
                  <Text color='#1da1f2' marginRight={10} fontSize={18}>
                    •
                  </Text>
                  <Paragraph color='#66757f' fontSize={15} lineHeight={22}>
                    他のユーザーに対する嫌がらせや誹謗中傷を行う行為
                  </Paragraph>
                </XStack>
                <XStack alignItems='center'>
                  <Text color='#1da1f2' marginRight={10} fontSize={18}>
                    •
                  </Text>
                  <Paragraph color='#66757f' fontSize={15} lineHeight={22}>
                    不正アクセスやなりすまし行為
                  </Paragraph>
                </XStack>
              </YStack>
            </YStack>

            {/* Section 4 */}
            <YStack gap={10}>
              <H3 color='#292f33' fontWeight='bold' fontSize={17}>
                4. サービスの変更・停止
              </H3>
              <Paragraph color='#66757f' fontSize={15} lineHeight={22}>
                当サービスは、事前の告知なく、サービスの内容を変更したり、提供を停止または中止することができるものとします。これによって利用者に生じた損害について、当サービスは一切の責任を負いません。
              </Paragraph>
            </YStack>

            {/* Section 5 */}
            <YStack gap={10}>
              <H3 color='#292f33' fontWeight='bold' fontSize={17}>
                5. 免責事項
              </H3>
              <Paragraph color='#66757f' fontSize={15} lineHeight={22}>
                当サービスは、利用者が当サービスを利用することによって生じた損害について、一切の責任を負わないものとします。また、利用者間のトラブルについても、当サービスは関与しません。
              </Paragraph>
            </YStack>

            {/* Section 6 */}
            <YStack gap={10}>
              <H3 color='#292f33' fontWeight='bold' fontSize={17}>
                6. プライバシー
              </H3>
              <Paragraph color='#66757f' fontSize={15} lineHeight={22}>
                当サービスのプライバシーポリシーは、本利用規約の一部を構成します。個人情報の取り扱いについては、プライバシーポリシーをご参照ください。
              </Paragraph>
            </YStack>

            {/* Section 7 */}
            <YStack gap={10}>
              <H3 color='#292f33' fontWeight='bold' fontSize={17}>
                7. 利用規約の変更
              </H3>
              <Paragraph color='#66757f' fontSize={15} lineHeight={22}>
                当サービスは、必要と判断した場合には、利用者に通知することなく本規約を変更することができるものとします。変更後の利用規約は、当サービス上に表示した時点で効力を生じるものとします。
              </Paragraph>
            </YStack>

            {/* Contact Info */}
            <YStack
              backgroundColor='#f5f8fa'
              borderRadius={4}
              padding={15}
              marginTop={10}
            >
              <H3
                color='#292f33'
                fontWeight='bold'
                fontSize={16}
                marginBottom={10}
              >
                お問い合わせ
              </H3>
              <Paragraph color='#66757f' fontSize={15} lineHeight={22}>
                本規約に関するお問い合わせは、下記の連絡先までお願いいたします。
              </Paragraph>
              <Text color='#1da1f2' fontSize={15} marginTop={10}>
                mayo@linux.com
              </Text>
            </YStack>
          </YStack>
        </YStack>
      </YStack>
    </ScrollView>
  )
}
