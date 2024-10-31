'use client'

import { Box, Button, Flex, IconButton, Text } from '@radix-ui/themes'
import { useEffect, useRef, useState } from 'react'
import { Avatar } from './widgets'
import { ImageIcon } from '@radix-ui/react-icons'
import { useFormState } from 'react-dom'

export const TweetTextarea = () => {
  const sendTweet = () => {}
  const [tweet, action, pending] = useFormState(sendTweet, null)
  const [text, setText] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const MAX_CHARS = 160

  const adjustHeight = () => {
    const textarea = textareaRef.current
    if (textarea) {
      textarea.style.height = 'auto'
      textarea.style.height = `${textarea.scrollHeight}px`
    }
  }

  useEffect(() => {
    adjustHeight()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value)
    adjustHeight()
  }

  const handleSubmit = async (formData: FormData) => {
    await action(formData)
    setText('')
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }
  }

  const remainingChars = MAX_CHARS - text.length
  const isNearLimit = remainingChars <= 20
  const isOverLimit = remainingChars < 0
  const isDisabled = text.length === 0 || isOverLimit

  return (
    <Box className='bg-gray-50 rounded-xl'>
      <Box p='4'>
        <Flex gap='3'>
          <Avatar src='/api/placeholder/48/48' className='w-12 h-12' />
          <Box className='flex-1'>
            <form action={handleSubmit}>
              <textarea
                ref={textareaRef}
                name='content'
                value={text}
                onChange={handleChange}
                placeholder='いまどうしてる？'
                className='w-full bg-transparent border-none focus:outline-none text-lg break-words resize-none overflow-hidden min-h-[24px]'
                rows={1}
              />
              <Flex mt='4' justify='between' align='center'>
                <Flex align='center' gap='3'>
                  {/* <IconButton
                    variant='ghost'
                    color='blue'
                    radius='full'
                    aria-label='Add image'
                  >
                    <ImageIcon className='w-5 h-5' />
                  </IconButton> */}
                  <Text
                    size='2'
                    weight={isOverLimit ? 'medium' : 'regular'}
                    color={isOverLimit ? 'red' : isNearLimit ? 'amber' : 'gray'}
                  >
                    {remainingChars}
                  </Text>
                </Flex>
                <Button
                  type='submit'
                  size='2'
                  radius='full'
                  disabled={isDisabled ?? pending}
                  className={`px-4 ${
                    isDisabled
                      ? 'bg-blue-300 cursor-not-allowed'
                      : 'bg-blue-500 hover:bg-blue-600'
                  }`}
                >
                  ツイートする
                </Button>
              </Flex>
            </form>
          </Box>
        </Flex>
      </Box>
    </Box>
  )
}
