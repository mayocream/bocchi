import { Spinner, XStack } from 'tamagui'

export default function Loading() {
  return (
    <XStack
      fullscreen
      justifyContent='center'
      alignItems='center'
      backgroundColor='$background'
    >
      <Spinner size='large' />
    </XStack>
  )
}
