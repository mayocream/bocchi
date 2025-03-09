import { create } from 'zustand'
import { persist, createJSONStorage, StateStorage } from 'zustand/middleware'
import { storage } from './storage'

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

interface UserStore {
  accessToken: string
  setAccessToken: (accessToken: string) => void
  isAuthenticated: () => boolean
}

export const useUserStore = create<UserStore>()(
  persist(
    (set, get) => ({
      accessToken: '',
      isAuthenticated: () => !!get().accessToken,
      setAccessToken: (accessToken) => set({ accessToken }),
    }),
    {
      name: 'user-storage',
      storage: createJSONStorage(() => zustandStorage),
    },
  ),
)
