'use client'

import React, { useRef, ChangeEvent } from 'react'
import { Avatar, Button, Dialog, IconButton, TextArea } from '@radix-ui/themes'
import { Image, Pen, PenSquare, X } from 'lucide-react'
import { useUser } from '@/providers/user'
import toast from 'react-hot-toast'

export const TweetDialog = () => {
  const user = useUser()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [tweetText, setTweetText] = React.useState<string>('')
  const [tweetImages, setTweetImages] = React.useState<File[]>([])
  const [previews, setPreviews] = React.useState<string[]>([])

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    const fileArray = Array.from(files)
    if (fileArray.length + tweetImages.length > 4) {
      toast.error('最大4枚まで画像を添付できます')
      return
    }

    // Create preview URLs and store files
    const newPreviews = fileArray.map((file) => URL.createObjectURL(file))
    setPreviews((prev) => [...prev, ...newPreviews])
    setTweetImages((prev) => [...prev, ...fileArray])
  }

  const removeImage = (index: number): void => {
    URL.revokeObjectURL(previews[index]) // Clean up URL object
    setPreviews((prev) => prev.filter((_, i) => i !== index))
    setTweetImages((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (): Promise<void> => {
    // Here you would typically handle the tweet submission
    // with both text and images using FormData
    const formData = new FormData()
    formData.append('text', tweetText)
    tweetImages.forEach((image) => {
      formData.append('images', image)
    })

    setTweetText('')
    setTweetImages([])
    setPreviews([])
  }

  const handleTextAreaChange = (e: ChangeEvent<HTMLTextAreaElement>): void => {
    setTweetText(e.target.value)
    e.target.style.height = 'auto'
    e.target.style.height = `${e.target.scrollHeight}px`
  }

  return (
    <Dialog.Root>
      <Dialog.Trigger>
        <Button size='3'>
          <PenSquare size='20' />
          新しいツイート
        </Button>
      </Dialog.Trigger>

      <Dialog.Content>
        <Dialog.Title>新しいツイート</Dialog.Title>

        <div className='flex gap-3'>
          <Avatar
            src={user.avatar}
            alt={user.name}
            size='3'
            fallback={user.username.charAt(0)}
          />

          <div className='flex-1'>
            <TextArea
              className='shadow-none'
              size='3'
              placeholder='いまどうしてる？'
              value={tweetText}
              onChange={handleTextAreaChange}
            />

            {previews.length > 0 && (
              <div className='grid gap-2 mt-3 grid-cols-2'>
                {previews.map((preview, index) => (
                  <div key={preview} className='relative group'>
                    <img
                      src={preview}
                      className='w-full h-40 object-cover rounded-xl'
                    />
                    <IconButton
                      color='gray'
                      onClick={() => removeImage(index)}
                      className='absolute top-2 right-2 p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity'
                    >
                      <X size={16} />
                    </IconButton>
                  </div>
                ))}
              </div>
            )}

            <div className='border-t border-gray-100 pt-3 mt-3'>
              <div className='flex justify-between items-center'>
                <div className='flex gap-2 text-blue-500'>
                  <IconButton
                    variant='ghost'
                    className='p-2'
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <input
                      ref={fileInputRef}
                      type='file'
                      accept='image/*'
                      hidden
                      multiple
                      onChange={handleImageUpload}
                    />
                    <Image size={20} />
                  </IconButton>
                  <span className='text-sm text-gray-500 self-center'>
                    {tweetImages.length > 0 && `${tweetImages.length}/4`}
                  </span>
                </div>

                <div className='flex items-center gap-4'>
                  <span className='text-sm text-gray-500'>
                    {`${tweetText.length} / ${300}`}
                  </span>
                  <Dialog.Close>
                    <Button
                      onClick={handleSubmit}
                      disabled={
                        tweetText.length === 0 && tweetImages.length === 0
                      }
                    >
                      ツイートする
                    </Button>
                  </Dialog.Close>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Dialog.Content>
    </Dialog.Root>
  )
}
