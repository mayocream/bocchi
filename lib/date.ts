import { formatDistance } from 'date-fns'
import { ja } from 'date-fns/locale'

export const formatDistanceFromNow = (date: any) => {
  return formatDistance(date, new Date(), { addSuffix: true, locale: ja })
}
