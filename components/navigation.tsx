'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export const NavItem = ({ icon, label, link }) => {
  const pathname = usePathname()
  const active = pathname === link
  return (
    <Link href={link}>
      <button
        className={`flex items-center space-x-3 px-4 py-3 w-full rounded-full transition-colors ${
          active ? 'font-bold' : 'hover:bg-gray-100'
        }`}
      >
        {icon}
        <span className='text-xl'>{label}</span>
      </button>
    </Link>
  )
}
