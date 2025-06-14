import React, { useState } from 'react'
import { Image, ImageStyle } from 'expo-image'
import { Modal, StyleProp, TouchableOpacity, Dimensions } from 'react-native'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  runOnJS,
  Easing,
} from 'react-native-reanimated'

export const ImageViewer: React.FC<{
  source: any
  style: StyleProp<ImageStyle>
}> = ({ source, style }) => {
  const [visible, setVisible] = useState(false)

  const opacity = useSharedValue(0)
  const scale = useSharedValue(0.9)

  const backgroundStyle = useAnimatedStyle(() => {
    return {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: `rgba(0, 0, 0, ${opacity.value * 0.9})`,
    }
  })

  const imageContainerStyle = useAnimatedStyle(() => {
    return {
      width: '100%',
      height: '100%',
      opacity: opacity.value,
      transform: [{ scale: scale.value }],
    }
  })

  const openModal = () => {
    setVisible(true)
    opacity.value = withTiming(1, {
      duration: 300,
      easing: Easing.bezier(0.33, 0.01, 0, 1),
    })
    scale.value = withTiming(1, {
      duration: 300,
      easing: Easing.bezier(0.33, 0.01, 0, 1),
    })
  }

  const closeModal = () => {
    const closeAnimation = () => {
      opacity.value = withTiming(0, {
        duration: 250,
        easing: Easing.bezier(0.5, 0, 0.75, 0),
      })
      scale.value = withTiming(
        0.9,
        {
          duration: 250,
          easing: Easing.bezier(0.5, 0, 0.75, 0),
        },
        (finished) => {
          if (finished) {
            runOnJS(setVisible)(false)
          }
        }
      )
    }
    closeAnimation()
  }

  return (
    <>
      <TouchableOpacity onPress={openModal}>
        <Image source={source} style={style} contentFit='contain' />
      </TouchableOpacity>
      <Modal
        visible={visible}
        transparent
        animationType='none'
        onRequestClose={closeModal}
      >
        <Animated.View style={backgroundStyle}>
          <TouchableOpacity
            activeOpacity={1}
            onPress={closeModal}
            style={{
              width: '100%',
              height: '100%',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Animated.View style={imageContainerStyle}>
              <Image
                source={source}
                style={{
                  width: '100%',
                  height: '100%',
                }}
                contentFit='contain'
              />
            </Animated.View>
          </TouchableOpacity>
        </Animated.View>
      </Modal>
    </>
  )
}
