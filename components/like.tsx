import { Pressable } from 'react-native'
import { Heart } from '@tamagui/lucide-icons'
import { useState } from 'react'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  interpolate,
  Easing,
  runOnJS,
} from 'react-native-reanimated'

export const AnimatedLike = ({ size = 20 }) => {
  // Calculate proportional dimensions based on the size prop
  const heartSize = size
  const ringSize = size
  const ringBorderWidth = size * 0.09 // ~1.5px when size is 16
  const particlesContainerSize = size * 1 // 24px when size is 16

  const [liked, setLiked] = useState(false)
  const [showRing, setShowRing] = useState(false)
  const [showHeart, setShowHeart] = useState(true) // Control heart visibility
  const animation = useSharedValue(0)

  // Animation to control ring appearance
  const ringAnimation = useSharedValue(0)

  // Animation to control particles
  const particleAnimation = useSharedValue(0)

  // Heart transformation animation
  const heartTransform = useSharedValue(0)

  const handlePress = () => {
    const newLikedState = !liked
    setLiked(newLikedState)

    if (newLikedState) {
      // Reset animations
      animation.value = 0
      ringAnimation.value = 0
      particleAnimation.value = 0
      heartTransform.value = 0

      // Heart to ring transformation sequence
      heartTransform.value = withSequence(
        // 1. Heart shrinks initially
        withTiming(0.3, {
          duration: 150,
          easing: Easing.bezierFn(0.2, 0, 0.3, 1),
        }),
        // 2. Heart morphs into ring (shrink further and fade out heart)
        withTiming(
          1,
          {
            duration: 200,
            easing: Easing.bezierFn(0.2, 0, 0.3, 1),
          },
          () => {
            // Once heart has morphed to ring, show ring
            runOnJS(setShowRing)(true)
            runOnJS(setShowHeart)(false) // Hide heart during ring animation

            // Start ring animation after heart disappears
            ringAnimation.value = withTiming(
              1,
              {
                duration: 300,
                easing: Easing.bezierFn(0.2, 1, 0.3, 1),
              },
              () => {
                // After ring animation completes, show heart again and particles
                runOnJS(setShowHeart)(true)

                // Trigger particle animation
                particleAnimation.value = withTiming(1, {
                  duration: 450,
                  easing: Easing.bezierFn(0.1, 0.8, 0.2, 1),
                })

                // Scale heart back in
                animation.value = withTiming(1, {
                  duration: 300,
                  easing: Easing.bezierFn(0.2, 1, 0.3, 1),
                })
              }
            )
          }
        )
      )
    } else {
      // Reset everything on unlike
      setShowRing(false)
      setShowHeart(true)
      animation.value = withTiming(0, { duration: 200 })
      ringAnimation.value = 0
      particleAnimation.value = 0
      heartTransform.value = 0
    }
  }

  // Heart animation style for re-appearance
  const heartStyle = useAnimatedStyle(() => ({
    transform: [
      {
        scale: liked
          ? animation.value === 0
            ? interpolate(heartTransform.value, [0, 0.5, 1], [1, 0.5, 0.1])
            : interpolate(animation.value, [0, 0.5, 0.8, 1], [0.5, 0.9, 1.2, 1])
          : 1,
      },
    ],
  }))

  // Ring animation style
  const ringStyle = useAnimatedStyle(() => ({
    opacity: interpolate(ringAnimation.value, [0, 0.2, 0.8, 1], [1, 1, 1, 0]),
    transform: [
      {
        scale: interpolate(ringAnimation.value, [0, 1], [0.8, 1.5]),
      },
    ],
  }))

  // Particles container style
  const particlesContainerStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      particleAnimation.value,
      [0, 0.1, 0.7, 1],
      [0, 1, 0.6, 0]
    ),
    transform: [
      {
        scale: interpolate(
          particleAnimation.value,
          [0, 0.4, 1],
          [0.5, 1.1, 1.3]
        ),
      },
    ],
  }))

  return (
    <Pressable
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        width: particlesContainerSize,
        height: particlesContainerSize,
      }}
      onPress={handlePress}
    >
      {/* Ring that appears when liked */}
      {showRing && (
        <Animated.View
          style={[
            {
              position: 'absolute',
              width: ringSize,
              height: ringSize,
              borderRadius: ringSize / 2,
              borderWidth: ringBorderWidth,
              borderColor: '#E0245E',
              backgroundColor: 'transparent',
            },
            ringStyle,
          ]}
        />
      )}

      {/* Heart */}
      {showHeart && (
        <Animated.View style={heartStyle}>
          <Heart
            size={heartSize}
            fill={liked ? '#E0245E' : 'none'}
            color={liked ? '#E0245E' : '#536471'}
          />
        </Animated.View>
      )}

      {/* Particles */}
      {liked && (
        <Animated.View
          style={[
            {
              position: 'absolute',
              width: particlesContainerSize,
              height: particlesContainerSize,
            },
            particlesContainerStyle,
          ]}
        >
          <LikeParticles size={size} />
        </Animated.View>
      )}
    </Pressable>
  )
}

// Particles component
const LikeParticles = ({ size = 16 }) => {
  // Scale factor based on size (when size is 16, scale is 1)
  const scale = size / 16

  // Create an explosion effect with colorful particles close to the ring
  const particles = [
    // Inner ring of small particles
    {
      type: 'circle',
      angle: 0,
      size: 1.5 * scale,
      distance: 9 * scale,
      color: '#FFC107',
    }, // Amber
    {
      type: 'circle',
      angle: 45,
      size: 1 * scale,
      distance: 8 * scale,
      color: '#FF6B8B',
    }, // Pink
    {
      type: 'circle',
      angle: 90,
      size: 1.5 * scale,
      distance: 9 * scale,
      color: '#E0245E',
    }, // Red
    {
      type: 'circle',
      angle: 135,
      size: 1 * scale,
      distance: 8 * scale,
      color: '#9C27B0',
    }, // Purple
    {
      type: 'circle',
      angle: 180,
      size: 1.5 * scale,
      distance: 9 * scale,
      color: '#FFC107',
    }, // Amber
    {
      type: 'circle',
      angle: 225,
      size: 1 * scale,
      distance: 8 * scale,
      color: '#FF6B8B',
    }, // Pink
    {
      type: 'circle',
      angle: 270,
      size: 1.5 * scale,
      distance: 9 * scale,
      color: '#E0245E',
    }, // Red
    {
      type: 'circle',
      angle: 315,
      size: 1 * scale,
      distance: 8 * scale,
      color: '#9C27B0',
    }, // Purple

    // Outer ring of particles (still close to the heart)
    {
      type: 'circle',
      angle: 22.5,
      size: 1.5 * scale,
      distance: 11 * scale,
      color: '#FF9800',
    }, // Orange
    {
      type: 'circle',
      angle: 67.5,
      size: 1.5 * scale,
      distance: 10 * scale,
      color: '#E0245E',
    }, // Red
    {
      type: 'circle',
      angle: 112.5,
      size: 1.5 * scale,
      distance: 11 * scale,
      color: '#9C27B0',
    }, // Purple
    {
      type: 'circle',
      angle: 157.5,
      size: 1.5 * scale,
      distance: 10 * scale,
      color: '#FF6B8B',
    }, // Pink
    {
      type: 'circle',
      angle: 202.5,
      size: 1.5 * scale,
      distance: 11 * scale,
      color: '#FF9800',
    }, // Orange
    {
      type: 'circle',
      angle: 247.5,
      size: 1.5 * scale,
      distance: 10 * scale,
      color: '#E0245E',
    }, // Red
    {
      type: 'circle',
      angle: 292.5,
      size: 1.5 * scale,
      distance: 11 * scale,
      color: '#9C27B0',
    }, // Purple
    {
      type: 'circle',
      angle: 337.5,
      size: 1.5 * scale,
      distance: 10 * scale,
      color: '#FF6B8B',
    }, // Pink

    // A few slightly further particles for depth
    {
      type: 'dot',
      angle: 30,
      size: 1 * scale,
      distance: 12 * scale,
      color: '#FFD54F',
    }, // Amber light
    {
      type: 'dot',
      angle: 150,
      size: 1 * scale,
      distance: 12 * scale,
      color: '#FF8A80',
    }, // Red light
    {
      type: 'dot',
      angle: 210,
      size: 1 * scale,
      distance: 12 * scale,
      color: '#CE93D8',
    }, // Purple light
    {
      type: 'dot',
      angle: 330,
      size: 1 * scale,
      distance: 12 * scale,
      color: '#FFAB91',
    }, // Orange light
  ]

  return (
    <>
      {particles.map((particle, index) => {
        const angleRad = particle.angle * (Math.PI / 180)
        const x = Math.cos(angleRad) * particle.distance
        const y = Math.sin(angleRad) * particle.distance

        return (
          <Animated.View
            key={index}
            style={{
              position: 'absolute',
              width: particle.size,
              height: particle.size,
              borderRadius: particle.size / 2,
              backgroundColor: particle.color,
              top: '50%',
              left: '50%',
              marginLeft: -particle.size / 2,
              marginTop: -particle.size / 2,
              transform: [{ translateX: x }, { translateY: y }],
            }}
          />
        )
      })}
    </>
  )
}
