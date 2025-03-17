import { collection, doc, getDoc, getFirestore } from 'firebase/firestore'
import { app } from './app'

export type Profile = {
  name: string
  username: string
  bio: string
}

export const db = getFirestore(app)

export const profileRef = (uid: string) => doc(collection(db, 'users'), uid)

export const getProfile = async (uid: string): Promise<Profile | null> => {
  const docSnap = await getDoc(profileRef(uid))
  if (!docSnap.exists()) return null
  return docSnap.data() as Profile
}
