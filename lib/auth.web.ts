import { initializeAuth } from 'firebase/auth'
import { app } from './app'

export const auth = initializeAuth(app)
