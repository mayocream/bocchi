import React, { useState } from 'react'
import { Dialog, YStack, XStack, Button, Text, TextArea } from 'tamagui'
import { Feather } from '@expo/vector-icons'
import { useUserStore } from '@/lib/state'
import { supabase } from '@/lib/supabase'
import { alert } from '@/lib/alert'

export const TweetDialog = () => {
  const { user } = useUserStore()
  const [open, setOpen] = useState(false)
  const [text, setText] = useState('')

  const characterLimit = 140
  const remaining = characterLimit - text.trim().length

  if (!user) return null

  const handleTweet = async () => {
    const { error } = await supabase.from('posts').insert({
      user_id: user.id,
      content: text,
    })

    if (error) {
      alert(error.message)
      return
    }

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
        height={40}
        paddingHorizontal={20}
        fontWeight='700'
        fontSize={14}
        icon={<Feather name='feather' size={16} color='white' />}
        onPress={() => setOpen(true)}
      >
        ツイート
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <Dialog.Portal>
          <Dialog.Overlay
            key='overlay'
            animation='quick'
            opacity={0.5}
            enterStyle={{
              opacity: 0,
            }}
            exitStyle={{
              opacity: 0,
            }}
            backgroundColor='rgba(0,0,0,0.5)'
          />
          <Dialog.Content
            bordered
            elevate
            width={600}
            borderRadius={16}
            padding='$4'
            animation={{
              type: 'spring',
              damping: 18,
              stiffness: 250,
              mass: 1,
              restSpeed: 0.001,
            }}
            enterStyle={{
              opacity: 0,
              scale: 0.96,
              y: 15,
            }}
            exitStyle={{
              opacity: 0,
              scale: 0.95,
              y: 10,
            }}
            scale={1}
            y={0}
            opacity={1}
          >
            <YStack gap='$4'>
              <Text fontWeight='700' fontSize='$6'>
                ツイートする
              </Text>

              <TextArea
                fontWeight={400}
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
                    disabled={text.trim().length === 0 || remaining < 0}
                    opacity={
                      text.trim().length === 0 || remaining < 0 ? 0.6 : 1
                    }
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
