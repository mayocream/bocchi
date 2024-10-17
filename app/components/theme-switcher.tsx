'use client'

import { SunIcon, MoonIcon } from '@radix-ui/react-icons'
import { useTheme } from 'next-themes'
import { IconButton } from '@radix-ui/themes'

export const ThemeSwitcher = () => {
  const { theme, setTheme } = useTheme()

  return (
    <IconButton
      variant='ghost'
      onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
      className='p-2 rounded-full bg-gray-200 dark:bg-gray-800'
    >
      {theme === 'light' ? <MoonIcon /> : <SunIcon />}
    </IconButton>
  )
}
