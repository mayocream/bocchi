import type { Meta, StoryObj } from '@storybook/react'
import { Button } from '@radix-ui/themes'
import { ChevronRight, Download, Plus } from 'lucide-react'

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['1', '2', '3', '4'],
      defaultValue: '2',
    },
    variant: {
      control: 'select',
      options: ['classic', 'solid', 'soft', 'surface', 'outline', 'ghost'],
      defaultValue: 'solid',
    },
    color: {
      control: 'select',
      options: ['indigo', 'cyan', 'green', 'orange', 'crimson'],
      defaultValue: 'indigo',
    },
    radius: {
      control: 'select',
      options: ['none', 'small', 'medium', 'large', 'full'],
      defaultValue: 'medium',
    },
    disabled: {
      control: 'boolean',
      defaultValue: false,
    },
  },
}

export default meta

// Basic button variants
export const Default = {
  args: {
    children: 'Button',
  },
}

export const WithIcon = {
  args: {
    children: (
      <>
        Next <ChevronRight size={16} />
      </>
    ),
  },
}

export const IconOnly = {
  args: {
    children: <Plus size={16} />,
    variant: 'soft',
    radius: 'full',
  },
}

// Size variations
export const Sizes = {
  render: () => (
    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
      <Button size='1'>Small</Button>
      <Button size='2'>Medium</Button>
      <Button size='3'>Large</Button>
      <Button size='4'>XLarge</Button>
    </div>
  ),
}

// Color variations
export const Colors = {
  render: () => (
    <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
      <Button color='indigo'>Indigo</Button>
      <Button color='cyan'>Cyan</Button>
      <Button color='green'>Green</Button>
      <Button color='orange'>Orange</Button>
      <Button color='crimson'>Crimson</Button>
    </div>
  ),
}

// Variant showcase
export const Variants = {
  render: () => (
    <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
      <Button variant='classic'>Classic</Button>
      <Button variant='solid'>Solid</Button>
      <Button variant='soft'>Soft</Button>
      <Button variant='surface'>Surface</Button>
      <Button variant='outline'>Outline</Button>
      <Button variant='ghost'>Ghost</Button>
    </div>
  ),
}

// Loading state
export const Loading = {
  args: {
    disabled: true,
    children: (
      <>
        <span className='animate-pulse'>Downloading...</span>
        <Download size={16} />
      </>
    ),
  },
}

// High emphasis action
export const HighEmphasis = {
  args: {
    size: '3',
    variant: 'solid',
    color: 'crimson',
    children: 'Delete Account',
  },
}
