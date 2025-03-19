import { MMKV } from 'react-native-mmkv'
import { getDownloadURL, getStorage, ref } from 'firebase/storage'
import { app } from './app'

export const storage = new MMKV()
export const cloud = getStorage(app)

export const getImageUrl = async (imageRef: string) => {
  return await getDownloadURL(ref(cloud, imageRef))
}
