import Editor from '@/components/editor'

const meta = {
  title: 'Components/Editor',
  component: Editor,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
}

export default meta

export const Default = {
  args: {
    avatarUrl: '/api/placeholder/32/32',
    placeholder: 'What\'s happening?',
    maxImages: 4,
  },
}
