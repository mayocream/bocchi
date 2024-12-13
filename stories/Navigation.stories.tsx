import type { Meta, StoryObj } from '@storybook/react'

import { Navigation } from '@/components/navigation'

const meta = {
  title: 'Components/Navigation',
  component: Navigation,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Navigation>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    user: {},
  },
}
