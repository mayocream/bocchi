import React, { useState } from 'react'
import { Image } from 'expo-image'
import { Modal, TouchableOpacity } from 'react-native'

export const ImageViewer: React.FC<{ source: any }> = ({ source }) => {
  const [visible, setVisible] = useState(true)
  return (
    <>
      <TouchableOpacity onPress={() => setVisible(true)}>
        <Image source={source} />
      </TouchableOpacity>
      <Modal visible={visible} transparent={true}>
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
