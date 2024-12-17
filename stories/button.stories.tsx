import { Button } from '@/components/button'

export default {
  title: 'Components/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
}

// Default button story
export const Default = {
  args: {
    children: 'Click me',
  },
}
