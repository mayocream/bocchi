import { Navigation } from '@/components/navigation'

export default function Layout({ children }) {
  return (
    <div className='container mx-auto flex justify-center min-h-screen bg-white'>
      {/* Left Sidebar */}
      <div className='hidden md:block w-80 px-4 py-6'>
        {/* Logo or Brand */}
        <Navigation />
      </div>

      {/* Main Content Area */}
      <div className='flex-1 max-w-[600px]'>
        <div className='border-x border-gray-200 min-h-screen'>{children}</div>
      </div>

      {/* Right Sidebar */}
      <div className='hidden md:block w-80 px-4 py-6'></div>
    </div>
  )
}
