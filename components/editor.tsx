'use client'

import { useState } from 'react'
import { Avatar } from './widgets'
import { ImageIcon, Cross2Icon } from '@radix-ui/react-icons'
import { Button } from '@radix-ui/themes'
import { type ChangeEvent, type FormEvent, type KeyboardEvent } from 'react'

interface TweetTextareaProps {
  maxChars?: number
  placeholder?: string
  onTweetSubmit?: (text: string, images: File[]) => Promise<void>
  avatarUrl?: string
  maxImages?: number
}

const useTweetText = (maxChars: number) => {
  const [text, setText] = useState('')

  const charCount = Array.from(text).length
  const remainingChars = maxChars - charCount
  const isNearLimit = remainingChars <= 20
  const isOverLimit = remainingChars < 0
  const isDisabled = charCount === 0 || isOverLimit

  const getCharCountStyles = () => {
    if (isOverLimit) return 'text-red-500 font-medium'
    if (isNearLimit) return 'text-amber-500'
    return 'text-gray-500'
  }

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value)
  }

  return {
    text,
    setText,
    handleChange,
    remainingChars,
    isDisabled,
    getCharCountStyles,
  }
}

const CharacterCount = ({
  count,
  className,
}: {
  count: number
  className: string
}) => <span className={`text-sm ${className}`}>{count}</span>

const MediaUpload = ({
  onImageSelect,
  selectedImages,
  onRemoveImage,
  maxImages = 4,
}: {
  onImageSelect: (files: File[]) => void
  selectedImages: File[]
  onRemoveImage: (index: number) => void
  maxImages: number
}) => {
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    const remainingSlots = maxImages - selectedImages.length
    const newFiles = files.slice(0, remainingSlots)
    if (newFiles.length > 0) {
      onImageSelect(newFiles)
    }
  }

  const canAddMoreImages = selectedImages.length < maxImages

  return (
    <div className='relative'>
      <input
        type='file'
        id='image-upload'
        className='hidden'
        accept='image/*'
        onChange={handleImageChange}
        multiple
      />
      <Button
        onClick={() => {
          const input = document.getElementById('image-upload')
          if (input) {
            input.click()
          }
        }}
        variant='ghost'
        type='button'
        className='cursor-pointer'
        disabled={!canAddMoreImages}
      >
        <ImageIcon className='w-5 h-5' />
        {selectedImages.length > 0 && (
          <span className='ml-1 text-sm'>
            {selectedImages.length}/{maxImages}
          </span>
        )}
      </Button>
    </div>
  )
}

const ImagePreview = ({
  selectedImages,
  onRemoveImage,
}: {
  selectedImages: File[]
  onRemoveImage: (index: number) => void
}) => {
  if (selectedImages.length === 0) return null

  return (
    <div className='mt-3 grid grid-cols-2 gap-2'>
      {selectedImages.map((image, index) => (
        <div key={index} className='relative group'>
          <img
            src={URL.createObjectURL(image)}
            alt={`Preview ${index + 1}`}
            className='rounded-lg w-full h-40 object-cover'
          />
          <button
            onClick={() => onRemoveImage(index)}
            className='absolute top-2 right-2 p-1 bg-gray-900 bg-opacity-50 rounded-full hover:bg-opacity-70 transition-opacity'
            type='button'
          >
            <Cross2Icon className='w-4 h-4 text-white' />
          </button>
        </div>
      ))}
    </div>
  )
}

const AutoResizeTextarea = ({
  value,
  onChange,
  onKeyDown,
  placeholder,
}: {
  value: string
  onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void
  onKeyDown: (e: KeyboardEvent<HTMLTextAreaElement>) => void
  placeholder: string
}) => {
  return (
    <textarea
      value={value}
      onChange={onChange}
      onKeyDown={onKeyDown}
      placeholder={placeholder}
      rows={1}
      className='w-full bg-transparent border-none focus:outline-none text-lg break-words min-h-[24px] resize-none overflow-hidden'
      style={{
        height: 'auto',
        minHeight: '24px',
      }}
      onInput={(e) => {
        const target = e.target as HTMLTextAreaElement
        target.style.height = 'auto'
        target.style.height = `${target.scrollHeight}px`
      }}
    />
  )
}

const Editor = ({
  maxChars = 160,
  placeholder = 'いまどうしてる？',
  onTweetSubmit = async () => {},
  avatarUrl = '/api/placeholder/48/48',
  maxImages = 4,
}: TweetTextareaProps) => {
  const {
    text,
    setText,
    handleChange,
    remainingChars,
    isDisabled,
    getCharCountStyles,
  } = useTweetText(maxChars)
  const [selectedImages, setSelectedImages] = useState<File[]>([])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    await onTweetSubmit(text, selectedImages)
    setText('')
    setSelectedImages([])
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      if (!isDisabled) {
        handleSubmit(e)
      }
    }
  }

  const handleImageSelect = (newFiles: File[]) => {
    setSelectedImages((prev) => [...prev, ...newFiles])
  }

  const handleRemoveImage = (index: number) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index))
  }

  return (
    <div className='bg-gray-50 rounded-xl'>
      <div className='p-4'>
        <div className='flex gap-3'>
          <Avatar src={avatarUrl} className='w-12 h-12' />
          <div className='flex-1'>
            <form onSubmit={handleSubmit}>
              <AutoResizeTextarea
                value={text}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
              />

              <ImagePreview
                selectedImages={selectedImages}
                onRemoveImage={handleRemoveImage}
              />

              <div className='mt-4 flex justify-between items-center'>
                <div className='flex items-center gap-3'>
                  <MediaUpload
                    onImageSelect={handleImageSelect}
                    selectedImages={selectedImages}
                    onRemoveImage={handleRemoveImage}
                    maxImages={maxImages}
                  />
                  <CharacterCount
                    count={remainingChars}
                    className={getCharCountStyles()}
                  />
                </div>
                <Button type='submit' disabled={isDisabled}>
                  ツイートする
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Editor
