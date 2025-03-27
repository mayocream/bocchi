import { Pressable, View } from 'react-native'
import { Heart } from '@tamagui/lucide-icons'
import { useRef, useState } from 'react'
import LottieView from 'lottie-react-native'
import { Stack } from 'tamagui'

export const AnimatedLike = () => {
  const animationRef = useRef<LottieView>(null)
  const [liked, setLiked] = useState(false)

  const handlePress = () => {
    setLiked(!liked)

    animationRef.current?.reset()
    animationRef.current?.play()
  }

  return (
    <Pressable onPress={handlePress} style={{ width: 40, height: 40 }}>
      <LottieView
        containerProps={{
          style: {
            position: 'absolute',
            width: 40,
            height: 40,
          },
        }}
        ref={animationRef}
        source={require('@/assets/animations/like.json')}
        resizeMode='cover'
      />
    </Pressable>
  )
}
