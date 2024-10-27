'use client'

import React, { createContext, useContext } from 'react'

const UserContext = createContext<any | undefined>(undefined)

// Custom hook to use the User
export const useUser = (): any => {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context
}

// Props for the UserProvider component
interface UserProviderProps {
  user: any
  children: React.ReactNode
}

// UserProvider component
export const UserProvider: React.FC<UserProviderProps> = ({
  user,
  children,
}) => {
  return (
    <UserContext.Provider value={user}>
      {children}
    </UserContext.Provider>
  )
}
