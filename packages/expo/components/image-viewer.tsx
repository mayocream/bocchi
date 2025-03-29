import React, { useState } from 'react'
import { Image, ImageStyle } from 'expo-image'
import { Modal, StyleProp, TouchableOpacity } from 'react-native'

export const ImageViewer: React.FC<{
  source: any
  style: StyleProp<ImageStyle>
}> = ({ source, style }) => {
  const [visible, setVisible] = useState(false)
  return (
    <>
      <TouchableOpacity onPress={() => setVisible(true)}>
        <Image source={source} style={style} />
      </TouchableOpacity>
      <Modal visible={visible} transparent animationType='fade'>
        <TouchableOpacity
          onPress={() => setVisible(false)}
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.9)',
          }}
        >
          <Image
            source={source}
            style={{
              width: '100%',
              height: '100%',
              resizeMode: 'contain',
            }}
          />
        </TouchableOpacity>
      </Modal>
    </>
  )
}
