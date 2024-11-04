import { TopNavigation } from '@/components/navigation'
import { auth } from '@/lib/auth'
import { UserProvider } from '@/providers/user'

export default async function Layout({ children }) {
  const user = await auth()

  return (
    <UserProvider user={user}>
      <div className='min-h-screen bg-zinc-50'>
        {/* Top Navigation */}
        <TopNavigation user={user} />
        {children}
      </div>
    </UserProvider>
  )
}
