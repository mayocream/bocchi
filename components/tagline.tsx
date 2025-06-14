import React from 'react'
import { Text, YStack, XStack, View } from 'tamagui'
import { Search, Users, MessageCircle, TrendingUp } from '@tamagui/lucide-icons'
import Svg, { Path } from 'react-native-svg'

export const Tagline = () => {
  const features = [
    {
      icon: <Search size={20} color='#1DA1F2' />,
      text: '話題を検索しよう',
    },
    {
      icon: <Users size={20} color='#1DA1F2' />,
      text: '友達とつながりましょう',
    },
    {
      icon: <MessageCircle size={20} color='#1DA1F2' />,
      text: '会話に参加しよう',
    },
    {
      icon: <TrendingUp size={20} color='#1DA1F2' />,
      text: 'トレンドを探索',
    },
  ]

  return (
    <YStack
      flex={1}
      backgroundColor='#1DA1F2'
      height='100vh'
      position='relative'
      paddingHorizontal={40}
      paddingVertical={60}
      justifyContent='center'
      overflow='hidden'
    >
      {/* Main Tagline */}
      <Text color='#fff' fontSize={30} fontWeight='bold' marginBottom={30}>
        今、起きていることを見つけよう
      </Text>

      {/* Feature List */}
      <YStack gap={20} marginBottom={40}>
        {features.map((feature, index) => (
          <XStack key={index} alignItems='center' gap={15}>
            <View
              backgroundColor='#fff'
              borderRadius={50}
              width={40}
              height={40}
              alignItems='center'
              justifyContent='center'
            >
              {feature.icon}
            </View>
            <Text color='#fff' fontSize={20} fontWeight='500'>
              {feature.text}
            </Text>
          </XStack>
        ))}
      </YStack>

      {/* Background graphic - larger Twitter bird */}
      <View
        position='absolute'
        bottom={-100}
        right={-150}
        width={1000}
        height={1000}
        opacity={0.1}
      >
        <Svg width={1000} height={1000} viewBox='0 0 24 24' fill='none'>
          <Path
            d='M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z'
            fill='#fff'
            stroke='#fff'
            strokeWidth={0.5}
            strokeLinecap='round'
            strokeLinejoin='round'
          />
        </Svg>
      </View>
    </YStack>
  )
}

export default Tagline
