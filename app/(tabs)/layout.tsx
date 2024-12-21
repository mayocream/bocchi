import { Navigation } from '@/components/navigation'
import Image from 'next/image'
import Logo from '@/app/icon.svg'

export default function Layout({ children }) {
  return (
    <div className='container mx-auto flex justify-center min-h-screen bg-white'>
      {/* Left Sidebar */}
      <div className='sticky top-0 h-screen w-80 px-4 py-6 overflow-y-auto'>
        {/* Logo or Brand */}
        <Navigation />
      </div>

      {/* Main Content Area */}
      <div className='flex-1 max-w-[600px]'>
        <div className='border-x border-gray-200 min-h-screen'>
          <header className='sticky top-0 z-10 p-2 bg-white border-b border-gray-200 w-full'>
            <Image src={Logo} alt='Logo' className='h-6 mx-auto' />
          </header>
          {children}
        </div>
      </div>

      {/* Right Sidebar */}
      <div className='hidden md:block w-80 px-4 py-6'></div>
    </div>
  )
}
