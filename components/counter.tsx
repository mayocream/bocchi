import { VisuallyHidden, Text, TextProps } from 'tamagui'

export const Counter = ({ count, ...props }: { count: number } & TextProps) => {
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

  return (
    <Text userSelect='none' {...props}>
      {formatCount(count)}
    </Text>
  )
}
