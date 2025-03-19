import { onAuthStateChanged, type User } from 'firebase/auth'
import React, { createContext, useContext, useEffect, useState } from 'react'
import { auth } from './auth'

type AuthContextProps = {
  currentUser: User | null
  loading: boolean
}

const AuthContext = createContext<AuthContextProps>({
  currentUser: null,
  loading: true,
})

export const useAuthContext = () => useContext(AuthContext)
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user)
      setLoading(false)
    })
    return unsubscribe
  }, [])

  return (
    <AuthContext.Provider value={{ currentUser, loading }}>
      {children}
    </AuthContext.Provider>
  )
}
