'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Bell, Home, Search, Settings, User } from 'lucide-react'

const NavItem = ({ Icon, label, link }) => {
  const pathname = usePathname()
  const active = pathname === link
  return (
    <Link href={link}>
      <button
        className={`flex items-center space-x-3 px-4 py-3 w-full rounded-full transition-colors ${
          active ? 'font-bold' : 'hover:bg-gray-100'
        }`}
      >
        <Icon className='w-5 h-5' fill={active ? 'currentColor' : 'none'} />
        <span className='text-xl'>{label}</span>
      </button>
    </Link>
  )
}

export const Navigation = ({ user }) => {
  return (
    <nav className='space-y-2'>
      <NavItem Icon={Home} label='ホーム' link='/' />
      <NavItem Icon={Search} label='検索' link='/search' />
      <NavItem Icon={Bell} label='通知' link='/notifications' />
      <NavItem Icon={User} label='プロフィール' link={`/${user?.username}`} />
      <NavItem Icon={Settings} label='設定' link='/settings' />
    </nav>
  )
}
