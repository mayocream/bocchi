'use client'

import React, { useState, useCallback } from 'react'
import {
  Avatar,
  Dialog,
  Text,
  Flex,
  Button,
  Box,
  TextField,
  TextArea,
} from '@radix-ui/themes'
import { ImagePlus } from 'lucide-react'

export const ProfileDialog = ({ profile }: { profile: any }) => {
  const [bannerPreview, setBannerPreview] = useState<string | null>(null)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)

  const handleImageUpload = useCallback(
    (
      e: React.ChangeEvent<HTMLInputElement>,
      setPreview: (url: string | null) => void
    ) => {
      const file = e.target.files?.[0]
      if (file) {
        const reader = new FileReader()
        reader.onloadend = () => {
          setPreview(reader.result as string)
        }
        reader.readAsDataURL(file)
      }
    },
    []
  )

  return (
    <Dialog.Root>
      <Dialog.Trigger>
        <Button variant='outline'>プロフィールを編集</Button>
      </Dialog.Trigger>

      <Dialog.Content>
        <Dialog.Title>プロフィールを編集</Dialog.Title>

        <form className='space-y-6'>
          {/* Banner and Avatar Section */}
          <div className='relative'>
            <div
              className='h-[200px] rounded-lg mb-16 relative bg-cover bg-center'
              style={{
                backgroundImage: `url(${bannerPreview || profile?.banner})`,
                backgroundColor:
                  !bannerPreview && !profile?.banner
                    ? 'rgb(243 244 246)'
                    : undefined,
              }}
            >
              <label>
                <input
                  type='file'
                  className='hidden'
                  accept='image/*'
                  onChange={(e) => handleImageUpload(e, setBannerPreview)}
                />
                <Button
                  variant='solid'
                  size='1'
                  className='absolute right-4 top-4'
                  asChild
                >
                  <span>
                    <ImagePlus className='h-4 w-4 mr-1' />
                    背景を変更
                  </span>
                </Button>
              </label>
            </div>
            <div className='absolute -bottom-8 left-4'>
              <div className='relative'>
                <Avatar
                  size='6'
                  className='border-4 border-white'
                  src={avatarPreview || profile?.avatar}
                  fallback={profile?.username?.charAt(0)}
                  radius='full'
                />
                <label>
                  <input
                    type='file'
                    className='hidden'
                    accept='image/*'
                    onChange={(e) => handleImageUpload(e, setAvatarPreview)}
                  />
                  <Button
                    variant='solid'
                    size='1'
                    className='absolute -right-4 bottom-0'
                    asChild
                  >
                    <span>
                      <ImagePlus className='h-4 w-4' />
                    </span>
                  </Button>
                </label>
              </div>
            </div>
          </div>

          <Box mt='6'>
            <Text as='label' size='2' mb='1' weight='bold'>
              表示名
            </Text>
            <TextField.Root
              defaultValue={profile.name}
              placeholder='表示名を入力'
            />
          </Box>

          <Box>
            <Text as='label' size='2' mb='1' weight='bold'>
              説明
            </Text>
            <TextArea
              defaultValue={profile.bio}
              placeholder='自己紹介を入力'
              className='min-h-[100px]'
            />
          </Box>

          <Flex gap='3' mt='4' justify='end'>
            <Dialog.Close>
              <Button variant='soft' color='gray'>
                キャンセル
              </Button>
            </Dialog.Close>
            <Button>変更を保存</Button>
          </Flex>
        </form>
      </Dialog.Content>
    </Dialog.Root>
  )
}
