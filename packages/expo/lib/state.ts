import { create } from 'zustand'
import { createJSONStorage, persist, StateStorage } from 'zustand/middleware'
import { storage } from './storage'

export type AuthState = {
  accessToken: string | null
  getUserId: () => number | null
  isAuthenticated: () => boolean
  setAccessToken: (accessToken: string) => void
  clearAccessToken: () => void
}

// refer: https://github.com/mrousavy/react-native-mmkv/blob/main/docs/WRAPPER_ZUSTAND_PERSIST_MIDDLEWARE.md
const zustandStorage: StateStorage = {
  setItem: (name, value) => {
    return storage.set(name, value)
  },
  getItem: (name) => {
    const value = storage.getString(name)
    return value ?? null
  },
  removeItem: (name) => {
    return storage.delete(name)
  },
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      accessToken: null,
      getUserId: () => {
        if (!get().accessToken) return null
        return JSON.parse(atob(get().accessToken!.split('.')[1]))
          .user_id as number
      },
      isAuthenticated: () => !!get().accessToken,
      setAccessToken: (accessToken) => set({ accessToken }),
      clearAccessToken: () => set({ accessToken: null }),
    }),
    {
      name: 'auth',
      storage: createJSONStorage(() => zustandStorage),
    }
  )
)
