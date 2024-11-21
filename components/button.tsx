import { Button } from 'react-aria-components'

export default function ({ children, ...props }) {
  return (
    <Button
      {...props}
      className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full'
    >
      {children}
    </Button>
  )
}
