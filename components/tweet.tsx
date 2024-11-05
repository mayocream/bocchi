'use client'

import React from 'react'
import { Button, Dialog } from '@radix-ui/themes'
import { Image, Film, Smile, PenSquare } from 'lucide-react'

export const TweetDialog = () => {
  const [tweetText, setTweetText] = React.useState('')
  const maxLength = 300

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
        <div className='flex justify-between items-center mb-4'>
          <button
            className={`px-4 py-1.5 rounded-full font-bold text-white ${
              tweetText.length === 0
                ? 'bg-blue-300 cursor-not-allowed'
                : 'bg-blue-500 hover:bg-blue-600'
            }`}
            disabled={tweetText.length === 0}
          >
            投稿
          </button>
        </div>

        <div className='flex gap-3'>
          <div className='w-12 h-12 rounded-full bg-gray-200 shrink-0' />

          <div className='flex-1'>
            <textarea
              placeholder='最近どう？'
              value={tweetText}
              onChange={(e) => setTweetText(e.target.value)}
              className='w-full min-h-[150px] resize-none text-xl placeholder:text-gray-500 focus:outline-none'
              maxLength={maxLength}
            />

            <div className='border-t border-gray-100 pt-3 mt-3'>
              <div className='flex justify-between items-center'>
                <div className='flex gap-2 text-blue-500'>
                  <button className='p-2 hover:bg-blue-50 rounded-full'>
                    <Image size={20} />
                  </button>
                  <button className='p-2 hover:bg-blue-50 rounded-full'>
                    <Film size={20} />
                  </button>
                  <button className='p-2 hover:bg-blue-50 rounded-full'>
                    <Smile size={20} />
                  </button>
                </div>

                <div className='flex items-center gap-4'>
                  <span className='text-sm text-gray-500'>
                    {`${tweetText.length} / ${maxLength}`}
                  </span>
                  <span className='text-sm'>Japanese</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Dialog.Content>
    </Dialog.Root>
  )
}
