import { Text } from 'tamagui'
import { FieldErrors } from 'react-hook-form'

export const ErrorMessage = ({
  name,
  errors,
}: {
  name: string
  errors: FieldErrors
}) => {
  if (errors[name]) {
    return <Text color='#FF5252'>{errors[name]?.message}</Text>
  }
  return null
}
