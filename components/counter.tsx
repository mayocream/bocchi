import { VisuallyHidden, Text } from 'tamagui'

export const Counter = ({ count }: { count: number }) => {
  const formatCount = (count: number) => {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(0)}k`
    }
    return count.toString()
  }

  if (count === 0) {
    return (
      <VisuallyHidden preserveDimensions>
        <Text userSelect='none'>0</Text>
      </VisuallyHidden>
    )
  }

  return <Text userSelect='none'>{formatCount(count)}</Text>
}
