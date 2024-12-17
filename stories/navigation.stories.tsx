import { Navigation } from '@/components/navigation'

export default {
  title: 'Components/Navigation',
  component: Navigation,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
}

// Default button story
export const Default = {
  args: {
    menus: ['Home', 'About', 'Contact'],
  },
}
