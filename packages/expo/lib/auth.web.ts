import { initializeAuth, browserLocalPersistence } from 'firebase/auth'
import { app } from './app'

export const auth = initializeAuth(app, {
  persistence: browserLocalPersistence,
})
