import { Button } from '@radix-ui/themes'
import {
  Bell,
  Home,
  Search,
  MessageCircle,
  List,
  Settings,
  User,
  PenSquare,
} from 'lucide-react'
import Image from 'next/image'

export default function Page({ children }: { children: React.ReactNode }) {
  return (
    <div className='flex h-screen bg-gray-50'>
      {/* Left Sidebar */}
      <div className='w-64 border-r border-gray-200 p-4 space-y-6'>
        <div className='flex items-center space-x-3 mb-8'>
          <div className='w-10 h-10 rounded-full bg-blue-500' />
        </div>

        <nav className='space-y-2'>
          <NavItem icon={<Home className='w-5 h-5' />} label='ホーム' active />
          <NavItem icon={<Search className='w-5 h-5' />} label='検索' />
          <NavItem icon={<Bell className='w-5 h-5' />} label='通知' />
          <NavItem
            icon={<MessageCircle className='w-5 h-5' />}
            label='チャット'
          />
          <NavItem icon={<List className='w-5 h-5' />} label='リスト' />
          <NavItem icon={<User className='w-5 h-5' />} label='プロフィール' />
          <NavItem icon={<Settings className='w-5 h-5' />} label='設定' />
        </nav>

        <Button className='w-full h-12 font-bold'>
          <PenSquare className='w-5 h-5' />
          <span>新しい投稿</span>
        </Button>
      </div>

      {/* Main Content */}
      <div className='flex-1'>
        <div className='border-b border-gray-200'>
          <Image
            src='/icon.svg'
            alt='Logo'
            width={64}
            height={64}
            className='mx-auto p-4'
          />
        </div>

        <div className='max-w-2xl mx-auto p-4'>
          {/* Feed content would go here */}
          {children}
        </div>
      </div>

      {/* Right Sidebar */}
      <div className='w-80 border-l border-gray-200 p-4'>
        <div className='sticky top-4'>
          <div className='bg-gray-100 rounded-full px-4 py-2 mb-6'>
            <Search className='w-5 h-5 text-gray-500' />
          </div>

          <div className='space-y-4'>
            <h2 className='font-semibold text-xl'>Following</h2>
            <h2 className='font-semibold text-xl'>Discover</h2>
            <h2 className='font-semibold text-xl'>For You</h2>
          </div>
        </div>
      </div>
    </div>
  )
}

const NavItem = ({ icon, label, active = false }) => (
  <button
    className={`flex items-center space-x-3 px-3 py-2 w-full rounded-lg transition-colors ${
      active ? 'bg-gray-100' : 'hover:bg-gray-50'
    }`}
  >
    {icon}
    <span className='font-medium'>{label}</span>
  </button>
)
