'use client'

import { SegmentedControl } from '@radix-ui/themes'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'

export default function SettingsPage() {
  const { theme, setTheme } = useTheme()

  return (
    <div className='flex flex-col max-w-2xl mx-auto p-6 space-y-8'>
      <form className='space-y-6'>
        {/* Navigation Section */}
        <div className='space-y-2'>
          <label className='text-md font-medium block'>テーマ</label>
          <SegmentedControl.Root
            defaultValue={theme}
            onValueChange={(value) => setTheme(value)}
            className='w-full'
          >
            <SegmentedControl.Item value='system'>
              システム
            </SegmentedControl.Item>
            <SegmentedControl.Item value='light'>
              <Sun className='w-4 h-4' />
            </SegmentedControl.Item>
            <SegmentedControl.Item value='dark'>
              <Moon className='w-4 h-4' />
            </SegmentedControl.Item>
          </SegmentedControl.Root>
        </div>
      </form>
    </div>
  )
}
