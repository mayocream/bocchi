import { useEffect, useState } from 'react'
import { format, formatDistanceToNow } from 'date-fns'
import { ja } from 'date-fns/locale'
import { Text } from 'tamagui'

const formatDistance = (date: Date): string => {
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const oneDay = 24 * 60 * 60 * 1000

  if (diff < oneDay) {
    return formatDistanceToNow(date, { locale: ja }).replace('約', '')
  } else {
    return format(date, 'PPP', { locale: ja })
  }
}

export const Time = ({ date }: { date: Date }) => {
  const [time, setTime] = useState(formatDistance(date))
  useEffect(() => {
    const interval = setInterval(() => {
      setTime(formatDistance(date))
    }, 1000)

    return () => clearInterval(interval)
  }, [date])

  return <Text>{time}</Text>
}
