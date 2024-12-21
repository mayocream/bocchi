'use client'

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
import { usePathname } from 'next/navigation'

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
    <nav className='w-64 p-4'>
      <ul className='flex flex-col space-y-6'>
        {menus.map((menu) => (
          <li key={menu.path}>
            <Link
              className='flex items-center space-x-4 text-xl rounded-lg p-2'
              href={menu.path}
            >
              {usePathname() === menu.path ? (
                <menu.activeIcon className='w-7 h-7' />
              ) : (
                <menu.icon className='w-7 h-7' />
              )}
              <span
                className={`${usePathname() === menu.path ? 'font-bold' : ''}`}
              >
                {menu.name}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}
