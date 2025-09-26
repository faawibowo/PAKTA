"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

type UserRole = "Law" | "Management" | "Internal" | "Guest"

interface User {
  id: string
  username: string
  role: UserRole
}

interface UserRoleContextType {
  userRole: UserRole
  user: User | null
  isLoggedIn: boolean
  setUserRole: (role: UserRole) => void
  setUser: (user: User | null) => void
  logout: () => void
}

const UserRoleContext = createContext<UserRoleContextType | undefined>(undefined)

export function UserRoleProvider({ children }: { children: ReactNode }) {
  const [userRole, setUserRole] = useState<UserRole>("Management")
  const [user, setUser] = useState<User | null>(null)
  const isLoggedIn = user !== null

  const logout = () => {
    setUser(null)
    setUserRole("Management")
  }

  return (
    <UserRoleContext.Provider value={{ userRole, user, isLoggedIn, setUserRole, setUser, logout }}>
      {children}
    </UserRoleContext.Provider>
  )
}

export function useUserRole() {
  const context = useContext(UserRoleContext)
  if (context === undefined) {
    throw new Error("useUserRole must be used within a UserRoleProvider")
  }
  return context
}
