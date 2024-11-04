import { TopNavigation } from '@/components/navigation'

const meta = {
  title: 'Components/TopNavigation',
  component: TopNavigation,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
}

export default meta

// Default story - Logged out state
export const LoggedOut = {
  args: {
    user: null,
  },
}

// Logged in state
export const LoggedIn = {
  args: {
    user: {
      id: 1,
      name: 'John Doe',
      username: '@johndoe',
      avatar: '/api/placeholder/32/32',
    },
  },
}
