import { Text, TextProps } from 'tamagui'

export const Counter = ({ count, ...props }: { count: number } & TextProps) => {
  const formatCount = (count: number) => {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(0)}k`
    }
    return count.toString()
  }

  return (
    <Text userSelect='none' {...props}>
      {formatCount(count)}
    </Text>
  )
}
