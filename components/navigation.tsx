import React from 'react'
import { motion } from 'framer-motion'
import {
  HomeIcon,
  MagnifyingGlassIcon,
  BellIcon,
  UserCircleIcon,
  Cog6ToothIcon,
} from '@heroicons/react/24/outline'
import {
  HomeIcon as HouseSolidIcon,
  MagnifyingGlassIcon as SearchSolidIcon,
  BellIcon as BellSolidIcon,
  UserCircleIcon as UserSolidIcon,
  Cog6ToothIcon as CogSolidIcon,
} from '@heroicons/react/24/solid'
import Link from 'next/link'

const menus = [
  { name: 'ホーム', path: '/', icon: HomeIcon, activeIcon: HouseSolidIcon },
  {
    name: '検索',
    path: '/search',
    icon: MagnifyingGlassIcon,
    activeIcon: SearchSolidIcon,
  },
  {
    name: '通知',
    path: '/notifications',
    icon: BellIcon,
    activeIcon: BellSolidIcon,
  },
  {
    name: 'プロフィール',
    path: '/profile',
    icon: UserCircleIcon,
    activeIcon: UserSolidIcon,
  },
  {
    name: '設定',
    path: '/settings',
    icon: Cog6ToothIcon,
    activeIcon: CogSolidIcon,
  },
]

export const Navigation = () => {
  return (
    <motion.nav className='w-64 p-4'>
      <motion.ul className='flex flex-col space-y-6'>
        {menus.map((menu) => (
          <motion.li
            key={menu.path}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link
              className='flex items-center space-x-4 text-xl rounded-lg p-2'
              href={menu.path}
            >
              <menu.icon className='w-7 h-7' />
              <span>{menu.name}</span>
            </Link>
          </motion.li>
        ))}
      </motion.ul>
    </motion.nav>
  )
}
