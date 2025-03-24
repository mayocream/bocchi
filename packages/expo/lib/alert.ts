import { Alert, Platform } from 'react-native'

export const alert = (message: string) => {
  if (Platform.OS === 'web') {
    // TODO: better alert style
    window.alert(message)
  } else {
    Alert.alert(message)
  }
}
