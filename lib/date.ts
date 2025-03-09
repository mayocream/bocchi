import { formatDistanceToNow } from 'date-fns'
import { ja } from 'date-fns/locale'

export const formatDistance = (date: Date): string => {
  return formatDistanceToNow(date, { locale: ja })
}
