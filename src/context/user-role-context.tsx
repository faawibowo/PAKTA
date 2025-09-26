"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

type UserRole = "Law" | "Management" | "Internal" | "Guest"

// Database role mapping
type DatabaseRole = "LAW" | "MANAGEMENT" | "INTERNAL"

interface User {
  id: string
  username: string
  role: UserRole
  email?: string
}

// Helper function to convert database role to frontend role
function mapDatabaseRoleToFrontend(dbRole: DatabaseRole | string): UserRole {
  switch (dbRole) {
    case 'MANAGEMENT':
      return 'Management'
    case 'LAW':
      return 'Law'
    case 'INTERNAL':
      return 'Internal'
    default:
      return 'Internal'
  }
}

// Helper function to convert frontend role to database role
function mapFrontendRoleToDatabase(role: UserRole): DatabaseRole {
  switch (role) {
    case 'Management':
      return 'MANAGEMENT'
    case 'Law':
      return 'LAW'
    case 'Internal':
      return 'INTERNAL'
    default:
      return 'INTERNAL'
  }
}

interface UserRoleContextType {
  userRole: UserRole
  user: User | null
  isLoggedIn: boolean
  setUserRole: (role: UserRole) => void
  setUser: (user: User | null) => void
  logout: () => void
  login: (user: User) => void
}

const UserRoleContext = createContext<UserRoleContextType | undefined>(undefined)

// Helper functions to manage cookies
function setCookie(name: string, value: string, days: number = 30) {
  const expires = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toUTCString()
  document.cookie = `${name}=${value}; expires=${expires}; path=/; SameSite=Lax`
}

function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null
  
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) {
    const cookieValue = parts.pop()?.split(';').shift()
    return cookieValue || null
  }
  return null
}

function deleteCookie(name: string) {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`
}

// Fetch user data from database by ID
async function fetchUserFromDatabase(userId: string): Promise<User | null> {
  try {
    const response = await fetch(`/api/users/${userId}`)
    if (!response.ok) return null
    
    const userData = await response.json()
    if (!userData || !userData.id) return null
    
    return {
      id: userData.id.toString(),
      username: userData.username,
      email: userData.email,
      role: mapDatabaseRoleToFrontend(userData.role)
    }
  } catch (error) {
    console.error('Failed to fetch user data:', error)
    return null
  }
}

export function UserRoleProvider({ children }: { children: ReactNode }) {
  const [userRole, setUserRole] = useState<UserRole>("Guest")
  const [user, setUser] = useState<User | null>(null)
  const isLoggedIn = user !== null

  // Load user data from cookies on mount and fetch fresh data from database
  useEffect(() => {
    const savedUserId = getCookie('userId')
    const savedUserRole = getCookie('userRole')
    const savedUsername = getCookie('username')
    
    if (savedUserId && savedUserRole && savedUsername) {
      // Set initial data from cookies for immediate UI update
      const initialUserData: User = {
        id: savedUserId,
        username: savedUsername,
        role: savedUserRole as UserRole
      }
      setUser(initialUserData)
      setUserRole(savedUserRole as UserRole)
      
      // Fetch fresh data from database to ensure consistency
      fetchUserFromDatabase(savedUserId).then((freshUserData) => {
        if (freshUserData) {
          setUser(freshUserData)
          setUserRole(freshUserData.role)
          
          // Update cookies with fresh data
          setCookie('userId', freshUserData.id)
          setCookie('userRole', freshUserData.role)
          setCookie('username', freshUserData.username)
        }
      }).catch(console.error)
    }
  }, [])

  const login = (userData: User) => {
    setUser(userData)
    setUserRole(userData.role)
    
    // Save to cookies
    setCookie('userId', userData.id)
    setCookie('userRole', userData.role)
    setCookie('username', userData.username)
  }

  const logout = () => {
    setUser(null)
    setUserRole("Guest")
    
    // Clear cookies
    deleteCookie('userId')
    deleteCookie('userRole')
    deleteCookie('username')
  }

  const updateUserRole = (role: UserRole) => {
    setUserRole(role)
    if (user) {
      const updatedUser = { ...user, role }
      setUser(updatedUser)
      setCookie('userRole', role)
    }
  }

  return (
    <UserRoleContext.Provider value={{ 
      userRole, 
      user, 
      isLoggedIn, 
      setUserRole: updateUserRole, 
      setUser, 
      logout,
      login 
    }}>
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
