import React, { useState } from 'react'
import { Dialog, YStack, XStack, Button, Text, TextArea } from 'tamagui'
import { Feather } from '@expo/vector-icons'

export const TweetDialog = () => {
  const [open, setOpen] = useState(false)
  const [text, setText] = useState('')

  const characterLimit = 280
  const remaining = characterLimit - text.length

  const handleTweet = () => {
    console.log('Tweeted:', text)
    setOpen(false)
    setText('')
  }

  return (
    <>
      <Button
        theme='blue'
        backgroundColor='#1DA1F2'
        color='white'
        borderRadius={999}
        height={36}
        paddingHorizontal={20}
        fontWeight='700'
        fontSize={14}
        icon={<Feather name='feather' size={16} color='white' />}
        onPress={() => setOpen(true)}
      >
        Tweet
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <Dialog.Portal>
          <Dialog.Overlay
            exitStyle={{ opacity: 0 }}
            enterStyle={{ opacity: 0 }}
            animation='medium'
            backgroundColor='rgba(0,0,0,0.3)'
          />
          <Dialog.Content
            bordered
            elevate
            width={600}
            borderRadius={16}
            padding='$4'
          >
            <YStack gap='$4'>
              <Text fontWeight='700' fontSize='$6'>
                ツイートする
              </Text>

              <TextArea
                theme='blue'
                placeholder='いま何してる？'
                fontSize={16}
                value={text}
                onChangeText={setText}
                maxLength={characterLimit}
              />

              <XStack justifyContent='space-between' alignItems='center'>
                <Text color={remaining < 0 ? 'red' : '$color'} fontSize={14}>
                  {remaining} 文字
                </Text>

                <XStack gap='$2'>
                  <Button
                    theme='blue'
                    color='#1DA1F2'
                    fontWeight={700}
                    borderRadius={999}
                    borderColor='#1DA1F2'
                    variant='outlined'
                    onPress={() => setOpen(false)}
                  >
                    キャンセル
                  </Button>
                  <Button
                    backgroundColor='#1DA1F2'
                    color='white'
                    fontWeight='700'
                    borderRadius={999}
                    pressStyle={{ backgroundColor: '#1991da' }}
                    disabled={text.length === 0 || remaining < 0}
                    opacity={text.length === 0 || remaining < 0 ? 0.6 : 1}
                    onPress={handleTweet}
                  >
                    ツイート
                  </Button>
                </XStack>
              </XStack>
            </YStack>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog>
    </>
  )
}
